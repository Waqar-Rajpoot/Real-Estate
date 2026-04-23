import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Property from "@/models/Property.model";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);

    // Build Dynamic Filter
    const query = {};
    
    const purpose = searchParams.get("purpose"); // Rent/Sale
    if (purpose) query.purpose = purpose === "Rent" ? "For Rent" : "For Sale";

    const type = searchParams.get("type");
    if (type) query.propertyType = type;

    const city = searchParams.get("city");
    if (city && city !== "All Cities") query["location.city"] = city;

    const keyword = searchParams.get("keyword");
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { "location.area": { $regex: keyword, $options: "i" } }
      ];
    }

    // Only show active properties on landing
    query.status = "Active"; 

    const properties = await Property.find(query)
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(12);

    return NextResponse.json({ success: true, data: properties });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}