// app/api/admin/users/[id]/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { isAdmin, adminErrorResponse } from "@/lib/auth-utils";

export async function GET(req, { params }) {
  if (!(await isAdmin())) return adminErrorResponse;

  await dbConnect();

  try {
    const user = await UserModel.findById(params.id)
      .select("-password")
      .populate("properties", "title price location") // View their saved/listed properties
      .populate({
        path: "agentProfile",
        populate: { path: "agency", select: "companyName" },
      })
      .populate("agencyProfile");

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


// app/api/admin/users/[id]/route.ts
export async function DELETE(req, { params }) {
  if (!(await isAdmin())) return adminErrorResponse;

  await dbConnect();

  try {
    const user = await UserModel.findById(params.id);
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Prevent deleting the last Admin manually through API
    if (user.role === "Admin") {
      const adminCount = await UserModel.countDocuments({ role: "Admin" });
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: "Cannot delete the last admin" },
          { status: 400 },
        );
      }
    }

    await UserModel.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "User account deleted permanently" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Deletion failed" }, { status: 500 });
  }
}
