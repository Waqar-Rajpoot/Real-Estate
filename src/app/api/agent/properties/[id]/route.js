import dbConnect from "@/lib/dbConnect";
import Agent from "@/models/Agent.model";
import Property from "@/models/Property.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { NextResponse } from "next/server";

export async function GET(
  request,
  { params } 
) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    // 1. Authentication & Role Guard
    if (!session || session.user.role !== "Agent") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // 2. Resolve Agent Profile from User Session
    // We need the Agent document ID to verify ownership
    const agent = await Agent.findOne({ user: session.user._id }).select("_id").lean();

    if (!agent) {
      return NextResponse.json({ message: "Agent profile not found" }, { status: 404 });
    }

    // 3. Fetch specific property with ownership verification
    // We query by both _id and agent ID to prevent cross-agent data access
    const property = await Property.findOne({
      _id: id,
      agent: agent._id,
    }).lean();

    if (!property) {
      return NextResponse.json(
        { message: "Property not found or unauthorized access" },
        { status: 404 }
      );
    }

    // 4. Return the complete property data
    return NextResponse.json({
      success: true,
      data: property,
    });

  } catch (error) {
    console.error("Property Detail API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}