import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Lead from "@/models/Lead.model";
import { isAdmin, adminErrorResponse } from "@/lib/auth-utils";

export async function PUT(request, { params }) {
  try {
    // Verify admin JWT from cookie
    if (!(await isAdmin())) return adminErrorResponse;

    const { leadId } = params;
    const body = await request.json();
    const { note } = body;

    await dbConnect();

    const lead = await Lead.findByIdAndUpdate(
      leadId,
      {
        status: "Forwarded",
        forwardedToAgentAt: new Date(),
        adminNote: note || null,
      },
      { new: true },
    ).populate("propertyId agentId agencyId");

    if (!lead) {
      return NextResponse.json(
        { success: false, message: "Lead not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error("Forward lead error:", error.message);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
