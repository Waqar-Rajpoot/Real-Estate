import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User.model"; // Ensure this matches your filename
import Agent from "@/models/Agent.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    // 1. Authorization Check
    if (!session || session.user.role !== "Agency") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Get Agency ID from User Model (Your plan)
    const currentUser = await User.findById(session.user._id);
    
    if (!currentUser || !currentUser.agencyProfile) {
      return NextResponse.json({ message: "Agency profile not found" }, { status: 404 });
    }

    const agencyId = currentUser.agencyProfile;

    // 3. Fetch all agents linked to this agency
    // We sort by newest first and exclude the passwordHash for security
    const agents = await Agent.find({ agency: agencyId, deletedAt: null })
      .select("-passwordHash")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: agents.length,
      agents
    }, { status: 200 });

  } catch (error) {
    console.error("Fetch Agents Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}