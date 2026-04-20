import { z } from "zod";

export const registerZodSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name cannot exceed 80 characters"),

  username: z
    .string({ required_error: "Username is required" })
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters")
    .toLowerCase()
    .regex(/^[a-z0-9_]+$/, "Username can only contain lowercase letters, numbers, and underscores"),
    
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Invalid email address")
    .toLowerCase(),
  
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters"), // Aligned with Model
  
  role: z.enum(["Admin", "Agency", "Agent", "Buyer"], {
    errorMap: () => ({ message: "Role must be Admin, Agency, Agent, or Buyer" }),
  }).default("Buyer"),
  
  phoneNumber: z
    .string({ required_error: "Phone number is required" })
    .trim()
    .min(10, "Phone number must be at least 10 digits"),
    
  status: z.enum(["Active", "Suspended", "pending"]).default("Active"),
  isVerified: z.boolean().default(false),
});

export const loginZodSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(3, "Identifier must be at least 3 characters")
    .lowercase()
    .refine((val) => {
      // Check if it's a valid email OR a valid username (no spaces, alphanumeric)
      const isEmail = z.string().email().safeParse(val).success;
      const isUsername = /^[a-zA-Z0-9_]+$/.test(val);
      return isEmail || isUsername;
    }, {
      message: "Please enter a valid email or username",
    }),

  password: z
    .string()
    .min(1, "Password is required"),
});

export const verifyOtpSchema = z.object({
  email: z.string().email("Invalid email"),
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

// Added for the Forgot Password flow
export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
  otp: z.string().length(6, "Code must be 6 digits"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});