import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true, 
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { 
      type: String, 
      required: [true, "Password is required"],
      select: false, // Remember to use .select("+password") in NextAuth!
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["Admin", "Agency", "Agent", "Buyer"], 
      default: "Buyer",
      required: true,
      index: true,
    },
    agencyProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency",
    },
    agentProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
    },
    belongsToAgency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency",
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
    },
    status: {
      type: String,
      enum: ["Active", "Suspended", "pending"],
      default: "Active",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifyCode: {
      type: String,
    },
    verifyCodeExpire: {
      type: Date,
    },
    resendCount: { type: Number, default: 0 },
    firstResendAt: { type: Date, default: null },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    properties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
  },
  { 
    timestamps: true 
  }
);

// Password Hashing
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return; 
  }
  // Hash the password
  this.password = await bcrypt.hash(this.password, 10);
});

// Password Comparison
userSchema.methods.isPasswordCorrect = async function(password) {
  // 'this.password' will be undefined if you didn't .select("+password") in the query
  return await bcrypt.compare(password, this.password);
}

// OTP Generation
userSchema.methods.generateOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.verifyCode = otp;
  this.verifyCodeExpire = new Date(Date.now() + 10 * 60 * 1000);
  return otp;
};

// JWT Methods (Casting for TypeScript safety)
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

// Next.js Model Export Pattern
const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

export default UserModel;