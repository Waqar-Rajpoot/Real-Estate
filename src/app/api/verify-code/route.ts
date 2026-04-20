// import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/models/User.model";

// export async function POST(request: Request) {
//     await dbConnect();

//     try {
//         // CHANGED: Use 'otp' to match what your frontend is sending
//         const { username, otp, emailType } = await request.json();
//         console.log("Received verification request", { username, otp, emailType });

//         // 1. Basic Validation
//         if (!username || !otp || !emailType) {
//             return Response.json(
//                 { success: false, message: "Missing required fields" },
//                 { status: 400 }
//             );
//         }

//         // Use the 'otp' variable here
//         // if (!/^[0-9]{6}$/.test(otp)) {
//         //     return Response.json(
//         //         { success: false, message: "Verification code must be 6 digits" },
//         //         { status: 400 }
//         //     );
//         // }

//         const decodedUsername = decodeURIComponent(username);
//         const user = await UserModel.findOne({ username: decodedUsername });

//         console.log("User found:", user);

//         if (!user) {
//             return Response.json({ success: false, message: "User not found" }, { status: 404 });
//         }

//         // 2. Logic for RESET Password
//         if (emailType === "VERIFY") {
//             const isMatch = user.resetPasswordToken === otp;
//             const isNotExpired = user.resetPasswordExpire && new Date(user.resetPasswordExpire) > new Date();

//             if (!isMatch || !isNotExpired) {
//                 return Response.json(
//                     { success: false, message: "Invalid or expired reset code" },
//                     { status: 400 }
//                 );
//             }
//             return Response.json({ success: true, message: "Reset code verified" }, { status: 200 });
//         } 

//         // 3. Logic for Account VERIFY
//         const isMatch = user.verifyCode === otp;
//         const isNotExpired = user.verifyCodeExpire && new Date(user.verifyCodeExpire) > new Date();

//         console.log("Verification code is valid and not expired");
//         if (!isMatch || !isNotExpired) {
//             return Response.json(
//                 { success: false, message: "Invalid or expired verification code" },
//                 { status: 400 }
//             );
//         }

//         // Only set isVerified to true if it was a registration attempt
//         if (emailType === "VERIFY" && !user.isVerified) {
//             user.isVerified = true;
//             user.verifyCode = undefined;
//             user.verifyCodeExpire = undefined;
//             await user.save();
//         }

//         return Response.json({ success: true, message: "Verification successful" }, { status: 200 });

//     } catch (error) {
//         console.error("Error verifying user", error);
//         return Response.json({ success: false, message: "Internal Server Error" }, { status: 500 });
//     }
// }





import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, otp, emailType } = await request.json();

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

        if (!user) {
            return Response.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // 2. Route Logic based on Email Type
        if (emailType === "RESET") {
            const isMatch = user.resetPasswordToken === otp;
            const isNotExpired = user.resetPasswordExpire && new Date(user.resetPasswordExpire) > new Date();

            if (!isMatch || !isNotExpired) {
                return Response.json(
                    { success: false, message: "Invalid or expired reset code" },
                    { status: 400 }
                );
            }
            // Logic for RESET: We don't change isVerified. 
            // We just return success so the frontend can show the "New Password" form.
            return Response.json({ success: true, message: "Reset code verified" }, { status: 200 });
        } 

        // 3. Handle Registration (VERIFY) and 2FA Logic
        // Both usually use 'verifyCode' and 'verifyCodeExpire' fields
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