import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Agency from "@/models/Agency.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET() {
  try {
    await dbConnect();

    // 1. Get the current session
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch the agency profile
    const agency = await Agency.findOne({ 
      owner: session.user._id,
      deletedAt: null 
    }).populate("owner", "name email phoneNumber");

    if (!agency) {
      return NextResponse.json(
        { message: "Agency profile not found." },
        { status: 404 }
      );
    }

    agency.lastActiveAt = new Date();
    await agency.save();

    // 4. Return the data
    return NextResponse.json({
      success: true,
      data: agency,
      canList: agency.canListProperty(),
      isFeatured: agency.isFeatured(),
      agentLimitReached: agency.hasReachedAgentLimit(),
      listingLimitReached: agency.hasReachedListingLimit(),
    });

  } catch (error) {
    console.error("Fetch Agency Error:", error);
    return NextResponse.json(
      { message: "Error fetching agency details." },
      { status: 500 }
    );
  }
}