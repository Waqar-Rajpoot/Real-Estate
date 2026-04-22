import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Property from "@/models/Property.model";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import User from "../../../../../models/User.model";

// ─── POST: Create New Property Listing ────────────────────────────────────────
export async function POST(req) {
  try {
    await dbConnect();

    // ── 1. Authentication & Authorization ──────────────────────────────────
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }
    if (!["Agent", "Admin"].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Forbidden. Only agents can post property listings." },
        { status: 403 }
      );
    }

    // ── 2. Parse Body ───────────────────────────────────────────────────────
    const body = await req.json();

    // ── 3. Destructure All Fields From Frontend Form ───────────────────────
    const {
      // Core Listing
      purpose,
      category,
      propertyType,
      title,
      description,
      facing,
      priceLabel,
      completionStatus,
      furnishingStatus,
      occupancyStatus,
      condition,
      age,

      // Area
      area,
      areaUnit,
      marlaSize,

      // Rooms (sent as flat fields from frontend)
      bedrooms,
      bathrooms,
      kitchens,
      servantRooms,
      storeRooms,
      drawingRooms,
      diningRooms,
      floors,
      floorNumber,
      parkingSpaces,

      // Pricing
      price,
      currency,
      isNegotiable,
      rentFrequency,
      boostLevel,
      expiresAt,

      // Payment Status (flat from frontend, nested for schema)
      isOnInstalments,
      possessionPaid,
      downPayment,
      instalmentPeriodMonths,
      monthlyInstalment,
      membershipFee,

      // Location (flat from frontend, nested for schema)
      city,
      community,
      area_loc,
      subCommunity,
      phase,
      block,
      building,
      address,
      nearbyLandmarks,
      latitude,
      longitude,
      mapEmbedUrl,

      // Features (flat booleans from frontend)
      hasSwimmingPool,
      hasGym,
      hasCentralAC,
      hasBalcony,
      hasMaidRoom,
      hasStudyRoom,
      hasCoveredParking,
      hasBuiltInWardrobes,
      hasCCTV,
      hasMosque,
      gasAvailable,
      isCorner,
      hasElectricityBackup,
      hasWasteDisposal,
      hasBroadbandInternet,
      isWaterFront,
      isBoundaryWall,

      // Commercial Details
      isRunningBusiness,
      hasBasement,
      hasLift,

      // Media
      images,
      videoUrl,
      virtualTourUrl,
      floorPlan,
      floorPlanInteractiveUrl,
      documentUrls,

      // Legal & Compliance
      ownerName,
      ownerCNIC,
      ownerEmail,
      ownerPhone,
      marketingContract,
      titleDeedUrl,
      nocUrl,
      possessionLetterUrl,
      allottmentLetterUrl,

      // Off-Plan Details
      developerName,
      projectName,
      expectedHandoverDate,
      constructionProgress,
      projectStatus,
      downPaymentPercentage,
      isPostHandoverAvailable,
      brochureUrl,
      siteMapUrl,

      // Lead Flow
      centralDeskWhatsapp,
      callTrackingNumber,
      contactHoursFrom,
      contactHoursTo,

      // SEO
      metaTitle,
      metaDescription,
      canonicalUrl,
    } = body;

    // ── 4. Field-Level Validations ──────────────────────────────────────────

    // Required core fields
    if (!purpose || !["For Sale", "For Rent"].includes(purpose)) {
      return NextResponse.json({ error: "Valid purpose (For Sale / For Rent) is required." }, { status: 400 });
    }
    if (!category || !["Residential", "Commercial", "Plots"].includes(category)) {
      return NextResponse.json({ error: "Valid category is required." }, { status: 400 });
    }
    if (!propertyType) {
      return NextResponse.json({ error: "Property type is required." }, { status: 400 });
    }
    if (!title || title.trim().length < 10) {
      return NextResponse.json({ error: "Title must be at least 10 characters." }, { status: 400 });
    }
    if (!description || description.trim().length < 30) {
      return NextResponse.json({ error: "Description must be at least 30 characters." }, { status: 400 });
    }
    if (!completionStatus || !["Off-plan", "Ready"].includes(completionStatus)) {
      return NextResponse.json({ error: "Completion status (Off-plan / Ready) is required." }, { status: 400 });
    }
    if (!area || isNaN(area) || Number(area) <= 0) {
      return NextResponse.json({ error: "A valid area value is required." }, { status: 400 });
    }
    if (!price || isNaN(price) || Number(price) <= 0) {
      return NextResponse.json({ error: "A valid price is required." }, { status: 400 });
    }
    if (!city || !community) {
      return NextResponse.json({ error: "City and community/society are required." }, { status: 400 });
    }
    if (purpose === "For Rent" && !rentFrequency) {
      return NextResponse.json({ error: "Rent frequency is required for rental listings." }, { status: 400 });
    }

    // Legal required fields
    if (!ownerCNIC) {
      return NextResponse.json({ error: "Owner CNIC is required." }, { status: 400 });
    }
    if (!ownerEmail) {
      return NextResponse.json({ error: "Owner email is required." }, { status: 400 });
    }
    if (!marketingContract) {
      return NextResponse.json({ error: "Marketing contract is required." }, { status: 400 });
    }

    // Image validation
    if (!images || !Array.isArray(images) || images.length < 8) {
      return NextResponse.json(
        { error: "Minimum 8 property images are required." },
        { status: 400 }
      );
    }
    if (images.length > 16) {
      return NextResponse.json(
        { error: "Maximum 16 property images are allowed." },
        { status: 400 }
      );
    }

    // Normalise images array: accept both plain strings and { originalUrl } objects
    const normalizedImages = images.map((img) =>
      typeof img === "string" ? { originalUrl: img } : img
    );

const userId = session.user._id || session.user.id;

// Future logic for fetching IDs
const user = await User.findById(userId).select("agentProfile belongsToAgency");

const agentId = user.agentProfile;   // The Agent ID
const agencyId = user.belongsToAgency; // The Agency ID

    // ── 5. Build Nested Property Data ──────────────────────────────────────
    const propertyData = {
      // ── System (always set from session, never from body) ─────────────
      agency: agencyId, // Use agency from session if available, else from agent record
      agent:  agentId,
      status: "Pending",

      // ── Core Listing ──────────────────────────────────────────────────
      purpose,
      category,
      propertyType,
      title:       title.trim(),
      description: description.trim(),
      ...(facing              && { facing }),
      ...(priceLabel          && { priceLabel }),
      completionStatus,
      ...(furnishingStatus    && { furnishingStatus }),
      ...(occupancyStatus     && { occupancyStatus }),
      ...(condition           && { condition }),
      ...(age !== undefined   && { age: Number(age) }),

      // ── Area ──────────────────────────────────────────────────────────
      area:     Number(area),
      areaUnit: areaUnit || "Sqft",
      ...(marlaSize && { marlaSize: Number(marlaSize) }),

      // ── Rooms ─────────────────────────────────────────────────────────
      bedrooms:     Number(bedrooms)     || 0,
      bathrooms:    Number(bathrooms)    || 0,
      parkingSpaces:Number(parkingSpaces)|| 0,
      ...(floors       !== undefined && { floors:       Number(floors) }),
      ...(floorNumber  !== undefined && { floorNumber:  Number(floorNumber) }),
      // Extra room fields stored in amenities array for schema compatibility
      // (schema doesn't have kitchens/servantRooms as top-level fields)
      // If you add them to schema later, move here. For now push to amenities.

      // ── Pricing ───────────────────────────────────────────────────────
      price:           Number(price),
      currency:        currency        || "PKR",
      priceLabel:      priceLabel      || "Fixed",
      isNegotiable:    Boolean(isNegotiable),
      ...(rentFrequency && { rentFrequency }),
      boostLevel:      boostLevel      || "None",
      ...(expiresAt    && { expiresAt: new Date(expiresAt) }),

      // ── Payment Status (nested) ───────────────────────────────────────
      paymentStatus: {
        isOnInstalments:       Boolean(isOnInstalments),
        possessionPaid:        Boolean(possessionPaid),
        ...(downPayment            && { downPayment:            Number(downPayment) }),
        ...(instalmentPeriodMonths && { instalmentPeriodMonths: Number(instalmentPeriodMonths) }),
        ...(monthlyInstalment      && { monthlyInstalment:      Number(monthlyInstalment) }),
        ...(membershipFee          && { membershipFee:          Number(membershipFee) }),
      },

      // ── Location (nested) ─────────────────────────────────────────────
      location: {
        country:   "Pakistan",
        city:      city.trim(),
        community: community.trim(),
        ...(area_loc      && { area:         area_loc.trim() }),
        ...(subCommunity  && { subCommunity: subCommunity.trim() }),
        ...(phase         && { phase:        phase.trim() }),
        ...(block         && { block:        block.trim() }),
        ...(building      && { building:     building.trim() }),
        ...(address       && { address:      address.trim() }),
        nearbyLandmarks: nearbyLandmarks
          ? (Array.isArray(nearbyLandmarks) ? nearbyLandmarks : [nearbyLandmarks])
          : [],
        ...(latitude && longitude && {
          coordinates: {
            type:        "Point",
            coordinates: [Number(longitude), Number(latitude)], // GeoJSON: [lng, lat]
          },
        }),
        ...(mapEmbedUrl && { mapEmbedUrl }),
      },

      // ── Features (nested) ─────────────────────────────────────────────
      features: {
        hasSwimmingPool:     Boolean(hasSwimmingPool),
        hasGym:              Boolean(hasGym),
        hasCentralAC:        Boolean(hasCentralAC),
        hasBalcony:          Boolean(hasBalcony),
        hasMaidRoom:         Boolean(hasMaidRoom),
        hasStudyRoom:        Boolean(hasStudyRoom),
        hasCoveredParking:   Boolean(hasCoveredParking),
        hasBuiltInWardrobes: Boolean(hasBuiltInWardrobes),
        hasCCTV:             Boolean(hasCCTV),
        hasMosque:           Boolean(hasMosque),
        gasAvailable:        Boolean(gasAvailable),
        isCorner:            Boolean(isCorner),
        hasElectricityBackup:Boolean(hasElectricityBackup),
        hasWasteDisposal:    Boolean(hasWasteDisposal),
        hasBroadbandInternet:Boolean(hasBroadbandInternet),
        isWaterFront:        Boolean(isWaterFront),
        isBoundaryWall:      Boolean(isBoundaryWall),
      },

      // ── Commercial Details (nested) ───────────────────────────────────
      commercialDetails: {
        isRunningBusiness: Boolean(isRunningBusiness),
        hasBasement:       Boolean(hasBasement),
        hasLift:           Boolean(hasLift),
      },

      // ── Extra Room Counts → amenities array ───────────────────────────
      // Stored as descriptive strings since schema uses amenities: [String]
      amenities: [
        kitchens      > 0 ? `Kitchens: ${kitchens}`        : null,
        servantRooms  > 0 ? `Servant Rooms: ${servantRooms}`: null,
        storeRooms    > 0 ? `Store Rooms: ${storeRooms}`    : null,
        drawingRooms  > 0 ? `Drawing Rooms: ${drawingRooms}`: null,
        diningRooms   > 0 ? `Dining Rooms: ${diningRooms}`  : null,
      ].filter(Boolean),

      // ── Media ─────────────────────────────────────────────────────────
      images: normalizedImages,
      ...(videoUrl               && { videoUrl }),
      ...(virtualTourUrl         && { virtualTourUrl }),
      ...(floorPlan              && { floorPlan }),
      ...(floorPlanInteractiveUrl&& { floorPlanInteractiveUrl }),
      ...(documentUrls && Array.isArray(documentUrls) && documentUrls.length > 0
        && { documentUrls }),

      // ── Legal & Compliance (nested) ───────────────────────────────────
      legal: {
        ownerCNIC:          ownerCNIC.replace(/[-\s]/g, ""), // strip dashes
        ownerEmail:         ownerEmail.toLowerCase().trim(),
        ...(ownerName       && { ownerName: ownerName.trim() }),
        ...(ownerPhone      && { ownerPhone }),
        marketingContract,
        ...(titleDeedUrl    && { titleDeedUrl }),
        ...(nocUrl          && { nocUrl }),
        ...(possessionLetterUrl && { possessionLetterUrl }),
        ...(allottmentLetterUrl && { allottmentLetterUrl }),
      },

      // ── Off-Plan Details (nested, only if Off-plan) ───────────────────
      ...(completionStatus === "Off-plan" && {
        offPlanDetails: {
          ...(developerName        && { developerName }),
          ...(projectName          && { projectName }),
          ...(expectedHandoverDate && { expectedHandoverDate: new Date(expectedHandoverDate) }),
          ...(constructionProgress !== undefined && {
            constructionProgress: Math.min(100, Math.max(0, Number(constructionProgress))),
          }),
          ...(projectStatus && { projectStatus }),
          paymentPlan: {
            ...(downPaymentPercentage !== undefined && {
              downPaymentPercentage: Number(downPaymentPercentage),
            }),
            isPostHandoverAvailable: Boolean(isPostHandoverAvailable),
          },
          ...(brochureUrl  && { brochureUrl }),
          ...(siteMapUrl   && { siteMapUrl }),
        },
      }),

      // ── Lead Flow (nested) ────────────────────────────────────────────
      leadFlow: {
        centralDeskWhatsapp: centralDeskWhatsapp || process.env.ADMIN_WHATSAPP_NUMBER || "",
        routingLogic: "Admin -> Agent Redirection",
        ...(callTrackingNumber && { callTrackingNumber }),
        contactHours: {
          from: contactHoursFrom || "09:00",
          to:   contactHoursTo   || "21:00",
        },
      },

      // ── SEO (nested) ──────────────────────────────────────────────────
      seo: {
        ...(metaTitle       && { metaTitle:       metaTitle.slice(0, 70) }),
        ...(metaDescription && { metaDescription: metaDescription.slice(0, 160) }),
        ...(canonicalUrl    && { canonicalUrl }),
      },

      // ── Defaults (schema handles these but being explicit) ────────────
      metrics: {
        viewCount:          0,
        uniqueViewCount:    0,
        whatsappInquiryCount: 0,
        callInquiryCount:   0,
        emailInquiryCount:  0,
        saveCount:          0,
        shareCount:         0,
      },
      verification: {
        isTruCheck: false,
      },
      qualityScore: 0,
      isFeatured:   false,
      boostLevel:   boostLevel || "None",
    };

    // ── 6. Create Property in DB ────────────────────────────────────────────
    // Pre-save hooks will handle: slug, referenceNumber, areaInMarla, pricePerSqFt
    const newProperty = await Property.create(propertyData);

    console.log(`[Property Created] ID: ${newProperty._id} | Ref: ${newProperty.referenceNumber} | Agent: ${session.user._id}`);

    // ── 7. Success Response ─────────────────────────────────────────────────
    return NextResponse.json(
      {
        success:         true,
        message:         "Property submitted successfully and is pending admin approval.",
        propertyId:      newProperty._id,
        referenceNumber: newProperty.referenceNumber,
        status:          newProperty.status,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("[Property Registration Error]", error);

    // Mongoose Validation Error
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return NextResponse.json(
        { error: "Validation failed.", details: messages },
        { status: 400 }
      );
    }

    // Duplicate Key (slug or referenceNumber collision)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || "field";
      return NextResponse.json(
        { error: `Duplicate value: a property with this ${field} already exists.` },
        { status: 409 }
      );
    }

    // Cast Error (e.g. invalid ObjectId)
    if (error.name === "CastError") {
      return NextResponse.json(
        { error: `Invalid value for field: ${error.path}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error. Please try again." },
      { status: 500 }
    );
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