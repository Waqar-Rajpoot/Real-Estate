import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Agency from "@/models/Agency.model"; // Ensure this path matches your model location

// GET: Fetch single agency details
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const agency = await Agency.findById(id);

    if (!agency) {
      return NextResponse.json(
        { success: false, message: "Agency not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, agency });
  } catch (error) {
    console.error("Error fetching agency:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PATCH: Update agency verification status
export async function PATCH(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const { status } = await req.json();

    const validStatuses = ['Pending', 'Verified', 'Suspended', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status value" },
        { status: 400 }
      );
    }

    const updatedAgency = await Agency.findByIdAndUpdate(
      id,
      { verificationStatus: status },
      { returnDocument: 'after' }
    );

    return NextResponse.json({ 
      success: true, 
      message: `Agency status updated to ${status}`,
      agency: updatedAgency 
    });
  } catch (error) {
    console.error("Error updating agency status:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update status" },
      { status: 500 }
    );
  }
}