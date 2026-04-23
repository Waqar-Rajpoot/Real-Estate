import dbConnect from "@/lib/dbConnect";
import Agent from "@/models/Agent.model";
import Property from "@/models/Property.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    // 1. Guard: Authentication & Role Check
    if (!session || session.user.role !== "Agent") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Find the Agent Profile using the User ID from the session
    const agent = await Agent.findOne({ user: session.user._id })
      .select("_id")
      .lean();

    if (!agent) {
      return NextResponse.json(
        { message: "Agent profile not found" },
        { status: 404 },
      );
    }

    // 3. Fetch all properties belonging to this agent profile
    const properties = await Property.find({ agent: agent._id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: properties,
    });
  } catch (error) {
    console.error("Fetch Agent Properties Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch listings" },
      { status: 500 },
    );
  }
}
