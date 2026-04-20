// import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/models/User.model";
// import bcrypt from "bcryptjs";
// // import { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";

// export const authOptions = {
//     providers: [
//         CredentialsProvider({
//             id: "credentials",
//             name: "Credentials",
//             credentials: {
//                 identifier: { label: "Username or Email", type: "text" },
//                 password: { label: "Password", type: "password" },
//                 code: { label: "2FA Code", type: "text" },
//             },
//             async authorize(credentials) {
//                 await dbConnect();

//                 try {
//                     const user = await UserModel.findOne({
//                         $or: [{ username: credentials.identifier }, { email: credentials.identifier }]
//                     });

//                     if (!user) throw new Error("User not found.");
//                     if (!user.isVerified) throw new Error("Please verify your account before login.");

//                     const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
//                     if (!isPasswordValid) throw new Error("Invalid password.");

//                     if (user.twoFactorEnabled) {
//                         if (!credentials.code) {
//                             throw new Error("2FA_REQUIRED");
//                         }

//                         const isOtpValid = user.verifyCode === credentials.code && 
//                                         new Date(user.verifyCodeExpire) > new Date();

//                         if (!isOtpValid) {
//                             throw new Error("Invalid or expired 2FA code.");
//                         }
//                     }

//                     return user;
//                 } catch (error) {
//                     throw new Error(error.message);
//                 }
//             },
//         }),
//     ],
//     callbacks: {
//         async jwt({ token, user, trigger, session }) {
//             if (user) {
//                 token._id = user._id?.toString();
//                 token.isVerified = user.isVerified;
//                 token.username = user.username;
//                 token.role = user.role;
//                 token.twoFactorEnabled = user.twoFactorEnabled; 
//             }

//             if (trigger === "update" && session?.user) {
//                 token.twoFactorEnabled = session.user.twoFactorEnabled;
//                 token.username = session.user.username;
//                 token.name = session.user.name;
//             }
            
//             return token;
//         },
//         async session({ session, token }) {
//             if (token) {
//                 session.user._id = token._id;
//                 session.user.role = token.role;
//                 session.user.isVerified = token.isVerified;
//                 session.user.username = token.username;
//                 session.user.twoFactorEnabled = token.twoFactorEnabled; 
//             }
//             return session;
//         },
//     },
//     pages: {
//         signIn: "/sign-in",
//     },
//     session: {
//         strategy: "jwt",
//     },
//     secret: process.env.NEXTAUTH_SECRET
// };






import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                identifier: { label: "Username or Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
async authorize(credentials) {
    if (!credentials?.identifier || !credentials?.password) {
        throw new Error("Missing credentials");
    }

    await dbConnect();
    console.log("Auth Trace: DB Connected");

    try {
        const user = await UserModel.findOne({
            $or: [
                { username: credentials.identifier },
                { email: credentials.identifier }
            ]
        }).select("+password");;

        if (!user) {
            console.log("Auth Trace: User not found for", credentials.identifier);
            throw new Error("No user found with this identity.");
        }
        
        console.log("Auth Trace: User found, isVerified status:", user.isVerified);
        if (!user.isVerified) {
            throw new Error("Please verify your account before logging in.");
        }

        // Check if user.password actually exists (to prevent bcrypt errors)
        if (!user.password) {
            console.log("Auth Trace: User object has no password field!");
            throw new Error("Invalid account data.");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        console.log("Auth Trace: Password check result:", isPasswordValid);

        if (!isPasswordValid) {
            throw new Error("Invalid password.");
        }

        return user;
    } catch (error) {
        console.log("Auth Trace Error:", error.message);
        throw new Error(error.message);
    }
}
        }),
    ],
    callbacks: {
        // async jwt({ token, user, trigger, session }) {
        //     if (user) {
        //         token._id = user._id?.toString();
        //         token.isVerified = user.isVerified;
        //         token.username = user.username;
        //         token.role = user.role;
        //         token.agencyProfile = user.agencyProfile || null;
        //     }

        //     if (trigger === "update" && session?.user) {
        //         token.username = session.user.username;
        //         token.name = session.user.name;
        //     }
            
        //     return token;
        // },

        async jwt({ token, user, trigger, session }) {
    // 1. Initial login logic
    if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.username = user.username;
        token.role = user.role;
        token.agencyProfile = user.agencyProfile || null;
    }

    // 2. Handling the update trigger
    if (trigger === "update") {
        // Option A: If you pass data in update({ agencyProfile: "..." })
        if (session?.agencyProfile) {
            token.agencyProfile = session.agencyProfile;
        } 
        
        // Option B: Safety net - Fetch from DB to ensure sync
        else {
            await dbConnect();
            const dbUser = await UserModel.findById(token._id).select("agencyProfile username name");
            if (dbUser) {
                token.agencyProfile = dbUser.agencyProfile || null;
                token.username = dbUser.username;
                token.name = dbUser.name;
            }
        }
    }
    
    return token;
},
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.role = token.role;
                session.user.isVerified = token.isVerified;
                session.user.username = token.username;
                session.user.agencyProfile = token.agencyProfile || null;
            }
            return session;
        },
    },
    pages: {
        signIn: "/sign-in",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET
};