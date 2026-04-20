import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Agent from "@/models/Agent.model";
import { isAdmin, adminErrorResponse } from "@/lib/auth-utils";

export async function GET() {
  try {
    // 1. Role-based authorization check
    if (!(await isAdmin())) {
      return adminErrorResponse;
    }

    // 2. Database connection
    await dbConnect();

    // 3. Fetch agent with populated agency and sensitive fields
    const agent = await Agent.find({})
      .populate(
        "agency",
        "companyName companyLogo licenseNumber verificationStatus",
      )
      .sort({ createdAt: -1 })
      .select("+cnic +cnicFrontUrl +cnicBackUrl +passwordHash");

    // 4. Handle 404
    if (!agent) {
      return NextResponse.json(
        { error: "Agent not found in the system." },
        { status: 404 },
      );
    }

    // 5. Check if agent is soft-deleted (Plan B Requirement)
    if (agent.deletedAt) {
      return NextResponse.json(
        {
          message: "Warning: This agent profile is archived/deleted.",
          agent,
        },
        { status: 200 },
      );
    }

    return NextResponse.json(agent);
  } catch (error) {
    console.error("ADMIN_AGENT_GET_ERROR:", error);
    return NextResponse.json(
      {
        error:
          "An internal server error occurred while fetching agent details.",
      },
      { status: 500 },
    );
  }
}
