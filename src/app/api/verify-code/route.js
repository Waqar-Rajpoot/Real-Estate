import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";

export async function POST(request) {
    await dbConnect();

    try {
        const { username, otp, emailType } = await request.json();
            console.log("Received verification request", { username, otp, emailType });

        // 1. Basic Validation
        if (!username || !otp || !emailType) {
            return Response.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        if (!/^[0-9]{6}$/.test(otp)) {
            return Response.json(
                { success: false, message: "Verification code must be 6 digits" },
                { status: 400 }
            );
        }

        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodedUsername });
            console.log("User found:", user);

        if (!user) {
            return Response.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // 2. Route Logic based on Email Type
        if (emailType === "RESET") {
            const isMatch = user.forgotPasswordToken === otp;
            const isNotExpired = user.forgotPasswordTokenExpiry && new Date(user.forgotPasswordTokenExpiry) > new Date();

            if (!isMatch || !isNotExpired) {
                return Response.json(
                    { success: false, message: "Invalid or expired reset code" },
                    { status: 400 }
                );
            }
            // Logic for RESET: We don't change isVerified. 
            return Response.json({ success: true, message: "Reset code verified" }, { status: 200 });
        } 

        const isMatch = user.verifyCode === otp;
        const isNotExpired = new Date(user.verifyCodeExpire) > new Date();

        if (!isMatch || !isNotExpired) {
            return Response.json(
                { success: false, message: "Invalid or expired verification code" },
                { status: 400 }
            );
        }

        // Only set isVerified to true if it was a registration attempt
        if (emailType === "VERIFY" && !user.isVerified) {
            user.isVerified = true;
            await user.save();
        }

        return Response.json({ success: true, message: "Verification successful" }, { status: 200 });

    } catch (error) {
        console.error("Error verifying user", error);
        return Response.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}