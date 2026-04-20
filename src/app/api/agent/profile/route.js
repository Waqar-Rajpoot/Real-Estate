import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Agent from "@/models/Agent.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "Agent") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Find the agent profile linked to the user account
    const agent = await Agent.findOne({ user: session.user._id });

    if (!agent) {
      return NextResponse.json({ message: "Agent profile not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, agent });
  } catch (error) {
    console.error("Error fetching agent profile:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}