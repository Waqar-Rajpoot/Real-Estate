
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Property from "@/models/Property.model";
import Agent from "@/models/Agent.model";
import Agency from "@/models/Agency.model";

export async function GET(request, { params }) {
  try {
    await dbConnect();

    // In Next.js 15, params must be awaited
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Property ID is required" },
        { status: 400 }
      );
    }

    // 1. Find property and populate 'agent' and 'agency' details
    const property = await Property.findById(id)
      .populate({
        path: "agent",
        select: "fullName profilePicture phoneNumber whatsappNumber email isVerified agentRank",
      })
      .populate({
        path: "agency",
        select: "companyName companyLogo officeAddress whatsappNumber verificationStatus",
      });

    if (!property) {
      return NextResponse.json(
        { success: false, message: "Property not found" },
        { status: 404 }
      );
    }

    // 2. Increment view count (Atomic update in the background)
    Property.findByIdAndUpdate(id, { 
      $inc: { "metrics.viewCount": 1, "metrics.uniqueViewCount": 1 } 
    }).exec();

    return NextResponse.json(
      { 
        success: true, 
        data: property 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Property Detail API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}