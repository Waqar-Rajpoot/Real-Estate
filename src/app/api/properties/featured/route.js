// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/dbConnect"; // Ensure you have a db connection utility
// import Property from "@/models/Property.model"; // Your Mongoose model

// export async function GET() {
//   try {
//     await dbConnect();

//     // Fetch featured properties, limit to 4 for the landing page
//     const properties = await Property.find({ isFeatured: true })
//       .sort({ createdAt: -1 })
//       .limit(4);

//     return NextResponse.json({ success: true, data: properties }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }







import { NextResponse } from "next/server";
import Property from "@/models/Property.model";
import dbConnect from "@/lib/dbConnect"; 


export async function GET() {
  try {
    await dbConnect();

    const properties = await Property.find({
      status: "Active",
      isFeatured: true,
      deletedAt: null,
      $or: [
        { featuredUntil: { $exists: false } },
        { featuredUntil: null },
        { featuredUntil: { $gte: new Date() } },
      ],
    })
      .select(
        "title purpose category propertyType price currency rentFrequency " +
        "area areaUnit bedrooms bathrooms location images isFeatured " +
        "boostLevel verification condition completionStatus priceLabel " +
        "leadFlow agent agency metrics"
      )
      .sort({ boostLevel: -1, "metrics.viewCount": -1, createdAt: -1 })
      .limit(8)
      .lean();

    return NextResponse.json({ success: true, data: properties });
  } catch (error) {
    console.error("Featured properties error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch featured properties" },
      { status: 500 }
    );
  }
}