import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect"; // Your DB connection utility
import Agency from "@/models/Agency.model"; // Your Mongoose model for Agency
import User from "@/models/User.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(req) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Fetch the full user object from DB to get the official data
    const currentUser = await User.findById(session.user._id);
    if (!currentUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const {
      companyName,
      licenseNumber,
      city,
      officeAddress,
      companyLogo,
      yearEstablished,
      companyBio,
      ownerName,
      ownerCNIC,
      ownerCNICFrontUrl,
      ownerCNICBackUrl,
      whatsappNumber,
      utilityBillUrl,
      registrationCertificateUrl,
    } = body;

    // Use email and phone from the User object as "Official"
    const officialEmail = currentUser.email;
    const officialNumber = currentUser.phoneNumber;

    // 1. Validation Logic
    const existingAgency = await Agency.findOne({
      $or: [
        { officialEmail },
        { officialNumber },
        { whatsappNumber },
        { ownerCNIC },
        { companyName },
        { licenseNumber },
      ],
    });

    if (existingAgency) {
      const conflictMap = {
        officialEmail: "Email is already registered.",
        officialNumber: "Official phone number is already in use.",
        whatsappNumber: "WhatsApp number is already in use.",
        ownerCNIC: "This CNIC is already registered.",
        companyName: "Company name is already taken.",
        licenseNumber: "License number is already registered.",
      };

      for (let key in conflictMap) {
        if (existingAgency[key] === body[key] || existingAgency[key] === currentUser[key]) {
          return NextResponse.json({ message: conflictMap[key] }, { status: 400 });
        }
      }
    }

    if (!registrationCertificateUrl) {
      return NextResponse.json({ message: "Registration certificate is required." }, { status: 400 });
    }

    // 2. Create Agency
    // Note: passwordHash removed as authentication is handled via the User account
    const newAgency = new Agency({
      companyName,
      officialEmail,
      officialNumber,
      licenseNumber,
      city,
      officeAddress,
      companyLogo,
      yearEstablished,
      companyBio,
      ownerName,
      ownerCNIC,
      ownerCNICFrontUrl,
      ownerCNICBackUrl,
      whatsappNumber,
      utilityBillUrl,
      registrationCertificateUrl,
      verificationStatus: "Pending",
      owner: currentUser._id,
    });

    await newAgency.save();

    // 3. Update User Role and Link Profile
    const updatedUser = await User.findByIdAndUpdate(
      currentUser._id,
      {
        agencyProfile: newAgency._id,
        role: "Agency",
      },
      { new: true }
    ).select("-password");

    return NextResponse.json({
      success: true,
      message: "Agency registered successfully. Documents are under review.",
      user: updatedUser,
      agencyId: newAgency._id,
    }, { status: 201 });

  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ message: "Server error during registration." }, { status: 500 });
  }
}