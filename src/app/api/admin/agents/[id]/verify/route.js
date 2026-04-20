// app/api/admin/agents/[id]/verify/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Agent from "@/models/Agent.model";
import { isAdmin, adminErrorResponse } from "@/lib/auth-utils";

export async function PATCH(req, { params }) {
  if (!(await isAdmin())) return adminErrorResponse;

  await dbConnect();
  const { 
    isVerified, 
    agentRank, 
    badges, 
    isFeatured, 
    featuredUntil, 
    maxListings 
  } = await req.json();

  try {
    const updateData = {
      isVerified,
      agentRank, // Admin can promote an agent to 'Top Performer'
      badges,    // e.g., ['Quick Responder', 'Verified Expert']
      isFeatured,
      maxListings, // Admin can override the listing limit for specific top agents
    };

    if (isVerified) {
      updateData.verifiedAt = new Date();
      // TODO: Log which admin performed this in a separate Audit log
    }

    if (isFeatured && featuredUntil) {
      updateData.featuredUntil = new Date(featuredUntil);
    }

    const agent = await Agent.findByIdAndUpdate(params.id, updateData, { new: true });

    if (!agent) return NextResponse.json({ error: "Agent not found" }, { status: 404 });

    return NextResponse.json({ message: "Agent status updated by Admin", agent });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}