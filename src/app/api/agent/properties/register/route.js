import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Property from "@/models/Property.model";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import User from "@/models/User.model"; 
export async function POST(req) {
  try {
    await dbConnect();

    // ── 1. Authentication ──────────────────────────────────────────────────
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    // ── 2. Authorization ───────────────────────────────────────────────────
    if (!["Agent", "Admin"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const body = await req.json();

    const {
      purpose, category, propertyType, title, description,
      facing, priceLabel, completionStatus, furnishingStatus,
      occupancyStatus, condition, age,
      area, areaUnit, marlaSize,
      price, currency, isNegotiable, rentFrequency,
      bedrooms, bathrooms, kitchens, servantRooms, storeRooms,
      drawingRooms, diningRooms, floors, floorNumber, parkingSpaces,
      images, videoUrl, virtualTourUrl, floorPlan, documentUrls,
      boostLevel, expiresAt,
      // Nested Objects from Frontend Payload
      location,
      features,
      commercialDetails,
      paymentStatus,
      legal,
      offPlanDetails,
      seo,
      // Lead Flow data
      centralDeskWhatsapp, callTrackingNumber, contactHoursFrom, contactHoursTo
    } = body;

    // ── 3. Field-Level Validations ──────────────────────────────────────────
    
    // Core Validations
    if (!purpose || !["For Sale", "For Rent"].includes(purpose)) {
      return NextResponse.json({ error: "Valid purpose is required." }, { status: 400 });
    }
    if (!title || title.trim().length < 10) {
      return NextResponse.json({ error: "Title must be at least 10 characters." }, { status: 400 });
    }
    if (!price || isNaN(price) || Number(price) <= 0) {
      return NextResponse.json({ error: "A valid price is required." }, { status: 400 });
    }

    // Location Validation (Crucial Fix: Use NextResponse instead of res.status)
    if (!location || !location.city || !location.community) {
      return NextResponse.json({ error: "City and Community are required." }, { status: 400 });
    }

    if (!location.coordinates?.coordinates || location.coordinates.coordinates.length !== 2) {
      return NextResponse.json({ error: "Pin your location on the map." }, { status: 400 });
    }

    // Image Validation
    if (!images || !Array.isArray(images) || images.length < 8) {
      return NextResponse.json({ error: "Minimum 8 property images required." }, { status: 400 });
    }

    // ── 4. Data Preparation ────────────────────────────────────────────────
    
    // Normalize images array
    const normalizedImages = images.map((img) =>
      typeof img === "string" ? { originalUrl: img } : img
    );

    const userId = session.user._id || session.user.id;
    const user = await User.findById(userId).select("agentProfile belongsToAgency");

    if (!user) {
      return NextResponse.json({ error: "User profile not found." }, { status: 404 });
    }

    const propertyData = {
      agency: user.belongsToAgency,
      agent: user.agentProfile,
      status: "Pending",

      purpose,
      category,
      propertyType,
      title: title?.trim(),
      description: description?.trim(),
      facing,
      priceLabel: priceLabel || "Fixed",
      completionStatus,
      furnishingStatus,
      occupancyStatus,
      condition,
      age: age !== undefined ? Number(age) : undefined,

      area: Number(area),
      areaUnit: areaUnit || "Sqft",
      marlaSize: marlaSize ? Number(marlaSize) : undefined,
      price: Number(price),
      currency: currency || "PKR",
      isNegotiable: Boolean(isNegotiable),
      rentFrequency,
      boostLevel: boostLevel || "None",
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,

      bedrooms: Number(bedrooms) || 0,
      bathrooms: Number(bathrooms) || 0,
      parkingSpaces: Number(parkingSpaces) || 0,
      floors: floors !== undefined ? Number(floors) : undefined,
      floorNumber: floorNumber !== undefined ? Number(floorNumber) : undefined,

      location: {
        ...location,
        country: "Pakistan",
        city: location.city?.trim(),
        community: location.community?.trim(),
        formattedAddress: location.formattedAddress || location.address,
      },

      features: { ...features },
      commercialDetails: { ...commercialDetails },
      paymentStatus: {
        ...paymentStatus,
        isOnInstalments: Boolean(paymentStatus?.isOnInstalments),
      },

      amenities: [
        kitchens > 0 ? `Kitchens: ${kitchens}` : null,
        servantRooms > 0 ? `Servant Rooms: ${servantRooms}` : null,
        storeRooms > 0 ? `Store Rooms: ${storeRooms}` : null,
        drawingRooms > 0 ? `Drawing Rooms: ${drawingRooms}` : null,
        diningRooms > 0 ? `Dining Rooms: ${diningRooms}` : null,
      ].filter(Boolean),

      images: normalizedImages,
      videoUrl,
      virtualTourUrl,
      floorPlan,
      documentUrls: Array.isArray(documentUrls) ? documentUrls : [],

      legal: {
        ...legal,
        ownerCNIC: legal?.ownerCNIC?.replace(/[-\s]/g, ""),
        ownerEmail: legal?.ownerEmail?.toLowerCase().trim(),
      },

      ...(completionStatus === "Off-plan" && {
        offPlanDetails: {
          ...offPlanDetails,
          expectedHandoverDate: offPlanDetails?.expectedHandoverDate ? new Date(offPlanDetails.expectedHandoverDate) : undefined,
        }
      }),

      leadFlow: {
        centralDeskWhatsapp: centralDeskWhatsapp || process.env.ADMIN_WHATSAPP_NUMBER || "",
        routingLogic: "Admin -> Agent Redirection",
        callTrackingNumber,
        contactHours: {
          from: contactHoursFrom || "09:00",
          to: contactHoursTo || "21:00",
        },
      },

      seo: {
        metaTitle: seo?.metaTitle?.slice(0, 70),
        metaDescription: seo?.metaDescription?.slice(0, 160),
      },

      metrics: { viewCount: 0, saveCount: 0 },
      verification: { isTruCheck: false },
    };

    // ── 5. Save ────────────────────────────────────────────────────────────
    const newProperty = await Property.create(propertyData);

    return NextResponse.json({
      success: true,
      message: "Property submitted successfully!",
      propertyId: newProperty._id,
      referenceNumber: newProperty.referenceNumber
    }, { status: 201 });

  } catch (error) {
    console.error("[Property Registration Error]", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
// ─── GET: Fetch Listings (with filters) ───────────────────────────────────────
export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);

    const page     = Math.max(1, parseInt(searchParams.get("page")  || "1"));
    const limit    = Math.min(50, parseInt(searchParams.get("limit") || "20"));
    const skip     = (page - 1) * limit;

    // Build filter object
    const filter = { deletedAt: null };

    const purpose      = searchParams.get("purpose");
    const category     = searchParams.get("category");
    const propertyType = searchParams.get("propertyType");
    const city         = searchParams.get("city");
    const community    = searchParams.get("community");
    const status       = searchParams.get("status");
    const minPrice     = searchParams.get("minPrice");
    const maxPrice     = searchParams.get("maxPrice");
    const minArea      = searchParams.get("minArea");
    const maxArea      = searchParams.get("maxArea");
    const bedrooms     = searchParams.get("bedrooms");
    const agentId      = searchParams.get("agent");
    const agencyId     = searchParams.get("agency");

    if (purpose)      filter.purpose       = purpose;
    if (category)     filter.category      = category;
    if (propertyType) filter.propertyType  = propertyType;
    if (city)         filter["location.city"]      = { $regex: city, $options: "i" };
    if (community)    filter["location.community"] = { $regex: community, $options: "i" };
    if (status)       filter.status        = status;
    if (agentId)      filter.agent         = agentId;
    if (agencyId)     filter.agency        = agencyId;
    if (bedrooms)     filter.bedrooms      = { $gte: parseInt(bedrooms) };

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (minArea || maxArea) {
      filter.area = {};
      if (minArea) filter.area.$gte = Number(minArea);
      if (maxArea) filter.area.$lte = Number(maxArea);
    }

    const [properties, total] = await Promise.all([
      Property.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("agent",  "name email phone")
        .populate("agency", "name logo")
        .lean(),
      Property.countDocuments(filter),
    ]);

    return NextResponse.json(
      {
        success:    true,
        data:       properties,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNext:    page * limit < total,
          hasPrev:    page > 1,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("[Property GET Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}