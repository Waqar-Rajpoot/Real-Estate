import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Agency from "@/models/Agency.model";
import { isAdmin, adminErrorResponse } from "@/lib/auth-utils";

export async function GET(req) {
  if (!(await isAdmin())) return adminErrorResponse;

  await dbConnect();
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const status = searchParams.get("status");
  const plan = searchParams.get("plan"); // Filter by 'Premium', 'Enterprise' etc.
  const skip = (page - 1) * limit;

  try {
    // Build dynamic filter
    let filter = { deletedAt: null }; // Soft delete check
    if (status) filter.verificationStatus = status;
    if (plan) filter.subscriptionPlan = plan;

    const agencies = await Agency.find(filter)
      .select(
        "companyName companyLogo licenseNumber officialEmail verificationStatus totalAgents totalListings subscriptionPlan isActive createdAt",
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Agency.countDocuments(filter);

    return NextResponse.json({
      agencies,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch agencies:", error);
    return NextResponse.json(
      { error: "Failed to fetch agencies" },
      { status: 500 },
    );
  }
}
