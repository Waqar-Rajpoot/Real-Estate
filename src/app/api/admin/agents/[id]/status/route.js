// app/api/admin/agents/[id]/status/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Agent from "@/models/Agent.model";
import { isAdmin, adminErrorResponse } from "@/lib/auth-utils";

export async function PATCH(req, { params }) {
  if (!(await isAdmin())) return adminErrorResponse;

  await dbConnect();
  const { isActive, suspensionReason } = await req.json();

  try {
    const agent = await Agent.findByIdAndUpdate(
      params.id, 
      { 
        isActive, 
        suspensionReason: isActive ? null : suspensionReason 
      }, 
      { new: true }
    );

    return NextResponse.json({ 
      message: isActive ? "Agent Restored" : "Agent Suspended by Admin", 
      agent 
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Operation failed" }, { status: 500 });
  }
}