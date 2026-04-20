import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Agency from "@/models/Agency.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options"; 
import { isAdmin, adminErrorResponse } from "@/lib/auth-utils";

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!(await isAdmin())) return adminErrorResponse;

  await dbConnect();
  
  const { 
    verificationStatus, 
    rejectionReason, 
    suspensionReason,
    subscriptionPlan,
    isActive,
    isPubliclyVisible
  } = await req.json();

  try {
    const updateData = {
      verificationStatus,
      isActive,
      isPubliclyVisible,
      subscriptionPlan,
    };

    // If verifying, record who and when
    if (verificationStatus === "Verified") {
      updateData.verifiedBy = session?.user?.id;
      updateData.verifiedAt = new Date();
      updateData.rejectionReason = null; 
    }

    if (verificationStatus === "Rejected") {
      updateData.rejectionReason = rejectionReason;
    }

    if (verificationStatus === "Suspended") {
      updateData.suspensionReason = suspensionReason;
    }

    // Adjust limits based on plan if plan changed (Optional Logic)
    if (subscriptionPlan === "Enterprise") {
        updateData.maxAgents = 100;
        updateData.maxListings = 5000;
        updateData.isPremium = true;
    }

    const agency = await Agency.findByIdAndUpdate(params.id, updateData, { new: true });

    return NextResponse.json({ message: "Agency updated successfully", agency });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}