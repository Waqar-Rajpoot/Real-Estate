// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/dbConnect";
// import Property from "@/models/Property.model";
// import Agency from "@/models/Agency.model"; 

// export async function GET(request) {
//   try {
//     await dbConnect();

//     // 1. Get Search Params from the URL
//     const { searchParams } = new URL(request.url);
    
//     // Pagination Params
//     const page = parseInt(searchParams.get("page")) || 1;
//     const limit = parseInt(searchParams.get("limit")) || 30;
//     const skip = (page - 1) * limit;

//     // Filter Params (Optional filters like Bayut)
//     const purpose = searchParams.get("purpose"); // e.g., 'For Sale'
//     const category = searchParams.get("category"); // e.g., 'Plots'
//     const city = searchParams.get("city");

//     // 2. Build the Query Object
//     let query = { 
//       status: "Active", // Only show active listings
//       deletedAt: null      // Safety check
//     };

//     if (purpose) query.purpose = purpose;
//     if (category) query.category = category;
//     if (city) query["location.city"] = new RegExp(city, "i"); // Case-insensitive search

//     // 3. Fetch Data with Server-Side Pagination
//     const properties = await Property.find(query)
//       .populate({
//         path: "agency",
//         select: "companyName companyLogo verificationStatus", // Required for Bayut card style
//       })
//       .select(
//         "title purpose category propertyType price currency priceLabel area areaUnit images location areaInMarla verification isFeatured metrics.viewCount"
//       )
//       .sort({ isFeatured: -1, createdAt: -1 }) // Priority to Featured, then Newest
//       .skip(skip)
//       .limit(limit)
//       .lean(); // Faster execution for read-only data

//     // 4. Get total count for the frontend pagination UI
//     const totalProperties = await Property.countDocuments(query);
//     const totalPages = Math.ceil(totalProperties / limit);

//     return NextResponse.json(
//       {
//         success: true,
//         pagination: {
//           totalProperties,
//           totalPages,
//           currentPage: page,
//           limit,
//           hasNextPage: page < totalPages,
//           hasPrevPage: page > 1,
//         },
//         data: properties,
//       },
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error("Properties API Error:", error);
//     return NextResponse.json(
//       { 
//         success: false, 
//         message: "Failed to fetch properties", 
//         error: error.message 
//       },
//       { status: 500 }
//     );
//   }
// }







import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Property from "@/models/Property.model";
import Agency from "@/models/Agency.model"; 

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    
    // Pagination Params
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 30;
    const skip = (page - 1) * limit;

    // --- 1. EXTRACT NEW FILTERS FROM PARAMS ---
    const purpose = searchParams.get("purpose");
    const category = searchParams.get("category");
    const propertyType = searchParams.get("propertyType");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const bedrooms = searchParams.get("bedrooms");
    const bathrooms = searchParams.get("bathrooms");
    const completionStatus = searchParams.get("completionStatus");
    const city = searchParams.get("city");

    // --- 2. BUILD DYNAMIC QUERY ---
    let query = { 
      status: "Active", 
      deletedAt: null      
    };

    // Text & Enum Matches
    if (purpose) query.purpose = purpose;
    if (category) query.category = category;
    if (propertyType) query.propertyType = propertyType;
    if (completionStatus) query.completionStatus = completionStatus;
    if (city) query["location.city"] = new RegExp(city, "i");

    // Price Range Logic (Handles Slider Values)
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Beds & Baths Logic (Matches the "X+" logic from your selects)
    if (bedrooms) query.bedrooms = { $gte: Number(bedrooms) };
    if (bathrooms) query.bathrooms = { $gte: Number(bathrooms) };

    // --- 3. FETCH DATA ---
    const properties = await Property.find(query)
      .populate({
        path: "agency",
        select: "companyName companyLogo verificationStatus", 
      })
      .select(
        "title purpose category propertyType price currency priceLabel area areaUnit images location areaInMarla verification isFeatured metrics.viewCount bedrooms bathrooms completionStatus"
      )
      .sort({ isFeatured: -1, createdAt: -1 }) 
      .skip(skip)
      .limit(limit)
      .lean(); 

    // 4. Get total count for pagination
    const totalProperties = await Property.countDocuments(query);
    const totalPages = Math.ceil(totalProperties / limit);

    return NextResponse.json(
      {
        success: true,
        pagination: {
          totalProperties,
          totalPages,
          currentPage: page,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        data: properties,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Properties API Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to fetch properties", 
        error: error.message 
      },
      { status: 500 }
    );
  }
}