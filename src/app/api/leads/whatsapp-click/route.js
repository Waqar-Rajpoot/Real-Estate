import { NextResponse } from "next/server";
import Lead from "@/models/Lead.model";
import dbConnect from "@/lib/dbConnect";
export async function POST(request) {
  try {
    const body = await request.json();
    const { propertyId, agentId, agencyId, source } = body;

    if (!propertyId) {
      return NextResponse.json(
        { success: false, message: "propertyId is required" },
        { status: 400 },
      );
    }

    await dbConnect();   

    const lead = await Lead.create({
      propertyId,
      agentId: agentId || null,
      agencyId: agencyId || null,
      channel: "WhatsApp",
      source: source || "PropertyDetail",
      status: "New",
    });

    return NextResponse.json(
      { success: true, leadId: lead._id },
      { status: 201 },
    );
  } catch (error) {
    console.error("WhatsApp lead log error:", error.message);
    return NextResponse.json(
      { success: false, message: "Failed to log lead" },
      { status: 500 },
    );
  }
}
