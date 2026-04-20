import dbConnect from "@/lib/dbConnect";
import User from "@/models/User.model";
import { registerZodSchema } from "@/schemas/user.schema";
import { sendVerificationEmail } from "@/helper/sendEmail"; // Adjust path as needed

export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();
    
    // 1. Validate with Zod
    const validatedData = registerZodSchema.parse(body);
    const { name, username, email, password, role, phoneNumber } = validatedData;

    // 2. Check uniqueness
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      const field = existingUser.email === email ? "Email" : "Username";
      return Response.json(
        { success: false, message: `${field} is already taken` },
        { status: 400 }
      );
    }

    // 3. Create User instance
    const newUser = new User({
      name,
      username,
      email,
      password,
      role,
      phoneNumber,
    });

    // 4. Generate and Save OTP
    const otp = newUser.generateOTP();
    await newUser.save();

    // 5. Send Verification Email
    await sendVerificationEmail({
      email: newUser.email,
      emailType: "VERIFY",
      username: newUser.username,
      verifyCode: otp,
    });

    return Response.json(
      {
        success: true,
        message: "Registered successfully. Please verify your email.",
        user: { id: newUser._id, role: newUser.role },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration Error:", error);

    if (error.name === "ZodError") {
      return Response.json(
        { success: false, errors: error.errors },
        { status: 400 }
      );
    }

    return Response.json(
      { success: false, message: "Registration failed", error: error.message },
      { status: 500 }
    );
  }
}