import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User.model";
import Agent from "@/models/Agent.model";
import Agency from "@/models/Agency.model";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { sendVerificationEmail } from "@/helper/sendEmail"; // Assuming you have this helper

export async function POST(req) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    // 1. Authorization Check: Only logged-in Agency Owners can add agents
    if (!session || session.user.role !== "Agency") {
      return NextResponse.json(
        { message: "Unauthorized. Only agencies can add agents." },
        { status: 401 },
      );
    }

    const currentUser = await User.findById(session.user._id);

    if (
      !currentUser ||
      currentUser.role !== "Agency" ||
      !currentUser.agencyProfile
    ) {
      return NextResponse.json(
        {
          message: "You must have a registered Agency profile to add agents.",
        },
        { status: 403 },
      );
    }

    const agencyId = currentUser.agencyProfile;

    const body = await req.json();
    const {
      fullName,
      email,
      password,
      phoneNumber,
      whatsappNumber,
      cnic,
      cnicFrontUrl,
      cnicBackUrl,
      nationality,
      profilePicture,
      aboutAgent,
      experienceSince,
      brnNumber,
      languages,
      serviceCity,
    } = body;

    console.log("Received Agent Data:", body);

    // 2. Validation
    if (
      !fullName ||
      !email ||
      !password ||
      !whatsappNumber ||
      !cnic ||
      !profilePicture
    ) {
      return NextResponse.json(
        { message: "Missing required mandatory fields." },
        { status: 400 },
      );
    }

    // 3. Duplication Check
    const emailLower = email.toLowerCase();

    const userExists = await User.findOne({ email: emailLower });
    if (userExists) {
      return NextResponse.json(
        {
          success: false,
          message: "A user with this email already exists in the system.",
        },
        { status: 400 },
      );
    }

    const existingAgent = await Agent.findOne({
      $or: [
        { email: emailLower },
        { cnic },
        { whatsappNumber },
        ...(brnNumber ? [{ brnNumber }] : []),
      ],
    });

    if (existingAgent) {
      return NextResponse.json(
        { message: "Agent with this Email, CNIC, or WhatsApp already exists." },
        { status: 400 },
      );
    }

    // 4. Hash Password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 5. Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 6. Create User Account for the Agent
    // This allows the agent to log in separately later
    console.log("Creating user account for agent:", emailLower);
    const newUser = await User.create({
      name: fullName,
      username: email.split("@")[0] + Math.floor(Math.random() * 1000),
      email: email.toLowerCase(),
      password: password, // Will be hashed by the User model pre-save hook
      role: "Agent",
      phoneNumber,
      belongsToAgency: agencyId,
      status: "Active",
      isVerified: true,
    });

    console.log("User account created for agent:", newUser._id);
    // 7. Create Agent Profile
    const newAgent = new Agent({
      agency: agencyId, // Link to Agency model
      belongsToAgency: agencyId,
      user: newUser._id, // Link to the user object
      fullName,
      email: email.toLowerCase(),
      passwordHash,
      phoneNumber,
      whatsappNumber,
      cnic,
      cnicFrontUrl,
      cnicBackUrl,
      nationality,
      profilePicture,
      coverImageUrl: null,
      aboutAgent,
      experienceSince,
      brnNumber,
      languages: languages || [],
      serviceAreas: [],
      serviceCity,
      specialization: "Residential",
      propertyTypes: [],
      socialLinks: {},
      maxListings: 10,
      registrationToken: otp,
      registrationTokenExpiry: Date.now() + 48 * 60 * 60 * 1000,
      isActive: true,
      isVerified: true,
    });

    await newAgent.save();
    console.log("Agent profile created:", newAgent._id);

    // 8. Update Agency Stats (Increment agent count)
    await Agency.findOneAndUpdate(
      { owner: session.user._id },
      { $inc: { totalAgents: 1 } },
    );

    // 9. Send Email
    try {
      await sendVerificationEmail({
        email: newAgent.email,
        emailType: "VERIFY",
        username: newAgent.fullName,
        verifyCode: otp,
      });
    } catch (emailErr) {
      console.error("Email failed but agent created", emailErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Agent registered successfully. OTP sent to their email.",
        agentId: newAgent._id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Agent Registration Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
