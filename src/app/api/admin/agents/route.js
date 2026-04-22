import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Agent from "@/models/Agent.model";
import { isAdmin, adminErrorResponse } from "@/lib/auth-utils";

export async function GET() {
  try {
    // 1. Authorization check
    if (!(await isAdmin())) return adminErrorResponse;

    // 2. Database connection
    await dbConnect();

    // 3. Fetch agents with populated agency
    const agents = await Agent.find({})
      .populate(
        "agency",
        "companyName companyLogo licenseNumber verificationStatus",
      )
      .sort({ createdAt: -1 })
      .select("+cnic +cnicFrontUrl +cnicBackUrl");

    return NextResponse.json(agents, { status: 200 });
  } catch (error) {
    console.error("ADMIN_AGENTS_GET_ALL_ERROR:", error);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 },
    );
  }
}
