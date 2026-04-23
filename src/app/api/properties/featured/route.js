import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect"; // Ensure you have a db connection utility
import Property from "@/models/Property.model"; // Your Mongoose model

export async function GET() {
  try {
    await dbConnect();

    // Fetch featured properties, limit to 4 for the landing page
    const properties = await Property.find({ isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(4);

    return NextResponse.json({ success: true, data: properties }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}