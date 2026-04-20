import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Agent from "@/models/Agent.model";
import User from "@/models/User.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const { id } = await params; // This gets the ID from the URL

    // 1. Authorization Check
    if (!session || session.user.role !== "Agency") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Get Agency ID
    const currentUser = await User.findById(session.user._id);
    if (!currentUser || !currentUser.agencyProfile) {
      return NextResponse.json(
        { message: "Agency not found" },
        { status: 404 },
      );
    }

    const agencyId = currentUser.agencyProfile.toString();

    // 3. Fetch Agent and Verify Ownership
    // We fetch the agent but ensure they belong to this specific agency
    const agent = await Agent.findById(id);

    if (!agent) {
      return NextResponse.json({ message: "Agent not found" }, { status: 404 });
    }

    // Security check: Does this agent belong to the logged-in agency?
    if (agent.agency.toString() !== agencyId) {
      return NextResponse.json(
        { message: "Unauthorized. You do not own this agent profile." },
        { status: 403 },
      );
    }

    return NextResponse.json({ success: true, agent }, { status: 200 });
  } catch (error) {
    console.error("Fetch Single Agent Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
