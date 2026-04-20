// app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model"; // Assuming common User model or base model
import { isAdmin, adminErrorResponse } from "@/lib/auth-utils";

export async function GET(req) {
  if (!(await isAdmin())) return adminErrorResponse;

  await dbConnect();
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const role = searchParams.get("role"); // Admin, Agency, Agent, Buyer
  const status = searchParams.get("status"); // Active, Suspended, pending
  const skip = (page - 1) * limit;

  try {
    let filter = {};
    if (role) filter.role = role;
    if (status) filter.status = status;

    const users = await UserModel.find(filter)
      .select("-verifyCode -verifyCodeExpire") // Hide security codes
      .populate("agencyProfile", "companyName companyLogo")
      .populate("agentProfile", "fullName profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await UserModel.countDocuments(filter);

    return NextResponse.json({
      users,
      pagination: { total, page, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}
