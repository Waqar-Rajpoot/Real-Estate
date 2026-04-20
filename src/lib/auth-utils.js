import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options"; // Adjust path as needed
import { NextResponse } from "next/server";

export async function isAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "Admin") {
    return false;
  }
  return true;
}

export const adminErrorResponse = NextResponse.json(
  { error: "Unauthorized. Admin access required." },
  { status: 403 }
);