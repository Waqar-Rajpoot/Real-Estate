import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Property from "@/models/Property.model";

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Property ID is required" },
        { status: 400 }
      );
    }

    const property = await Property.findById(id);

    if (!property) {
      return NextResponse.json(
        { success: false, message: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: property },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}