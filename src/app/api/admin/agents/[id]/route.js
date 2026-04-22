import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Agent from "@/models/Agent.model";
import { isAdmin, adminErrorResponse } from "@/lib/auth-utils";


export async function GET(req, { params }) {
  try {
    // 1. Role-based authorization check
    if (!(await isAdmin())) return adminErrorResponse;


    const { id } = await params;
    await dbConnect();

    // 2. Fetch single agent and populate full agency details
    const agent = await Agent.findById(id)
      .populate("agency")
      .select("+cnic +cnicFrontUrl +cnicBackUrl");

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    return NextResponse.json(agent, { status: 200 });

  } catch (error) {
    console.error("ADMIN_SINGLE_AGENT_GET_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to load agent details." },
      { status: 500 }
    );
  }
}