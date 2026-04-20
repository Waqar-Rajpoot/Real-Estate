import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Agency from "@/models/Agency.model";
import { isAdmin, adminErrorResponse } from "@/lib/auth-utils";

export async function GET(req, { params }) {
  if (!(await isAdmin())) return adminErrorResponse;

  await dbConnect();

  try {
    const agency = await Agency.findById(params.id)
      .populate("owner", "name email image") 
      .populate("verifiedBy", "name"); 

    if (!agency)
      return NextResponse.json({ error: "Agency not found" }, { status: 404 });

    return NextResponse.json(agency);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
