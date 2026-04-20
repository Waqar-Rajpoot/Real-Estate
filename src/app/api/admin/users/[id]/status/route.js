// app/api/admin/users/[id]/status/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model"; // Assuming common User model or base model
import { isAdmin, adminErrorResponse } from "@/lib/auth-utils";

export async function PATCH(req, { params }) {
  if (!(await isAdmin())) return adminErrorResponse;

  await dbConnect();
  const { status, isVerified, twoFactorEnabled } = await req.json();

  try {
    const user = await UserModel.findByIdAndUpdate(
      params.id,
      { 
        status,           // "Active", "Suspended", "pending"
        isVerified,       // Manual verification by admin
        twoFactorEnabled  // Admin can force-disable 2FA if user is locked out
      },
      { new: true }
    ).select("-password");

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ 
      message: `User ${user.username} updated to ${status}`, 
      user 
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}