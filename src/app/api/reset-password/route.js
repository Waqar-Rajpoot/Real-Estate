import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect"; 
import UserModel from "@/models/User.model"; 
import { hash } from "bcryptjs";


export async function POST(request) {
  await connectDB(); 

  try {
    const { username, code, newPassword } = await request.json();

    console.log("username, code, newPassword", username, code, newPassword);

    // 1. Find the user based on username and verification code
    const user = await UserModel.findOne({
      username,
    });

    console.log("user found for password reset", user);

    // 2. Validate the user and code
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid username or verification code.",
        },
        { status: 400 }
      );
    }


    // 5. Update the user's password and clear the verification code fields
    user.password = newPassword;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;
    await user.save();

    // 6. Return a success response
    return NextResponse.json(
      {
        success: true,
        message: "Password has been successfully reset.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred. Please try again later.",
      },
      { status: 500 }
    );
  }
}
