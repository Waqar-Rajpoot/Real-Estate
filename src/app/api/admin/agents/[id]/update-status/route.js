import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Agent from "@/models/Agent.model";
import { isAdmin, adminErrorResponse } from "@/lib/auth-utils";

export async function PATCH(req, { params }) {
  try {
    if (!(await isAdmin())) return adminErrorResponse;

    const { id } = await params;
    const body = await req.json();

    await dbConnect();

    // Prepare update object
    const updateData = {};
    if (typeof body.isFeatured === "boolean")
      updateData.isFeatured = body.isFeatured;
    if (typeof body.isActive === "boolean") updateData.isActive = body.isActive;
    if (typeof body.isPubliclyVisible === "boolean")
      updateData.isPubliclyVisible = body.isPubliclyVisible;

    // Handle Featured Expiry Logic
    if (body.isFeatured && body.days) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + parseInt(body.days));
      updateData.featuredUntil = expiryDate;
    } else if (body.isFeatured === false) {
      updateData.featuredUntil = null;
    }

    const updatedAgent = await Agent.findByIdAndUpdate(
      id,
      { $set: updateData },
      { returnDocument: 'after' },
    );

    if (!updatedAgent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Agent status updated successfully",
      agent: updatedAgent,
    });
  } catch (error) {
    console.error("ADMIN_AGENT_UPDATE_ERROR:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
