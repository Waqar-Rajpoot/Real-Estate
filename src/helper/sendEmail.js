import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import VerificationEmail from "../../EmailTemplates/VerificationEmail.jsx";
import  UserModel   from "../models/User.model.js";
import React from "react";

export const sendVerificationEmail = async ({
  email,
  emailType,
  username,
  verifyCode,
}) => {

  try {
    const expiryDate = new Date(Date.now() + 5 * 60000); 
    let updateField = {};

    if (emailType === "VERIFY") {
      updateField = { verifyCode, verifyCodeExpire: expiryDate };
    } else if (emailType === "2FA") {
      updateField = { twoFACode: verifyCode, twoFACodeExpire: expiryDate };
    } else if (emailType === "RESET") {
      updateField = { forgotPasswordToken: verifyCode, forgotPasswordTokenExpiry: expiryDate };
    }

    await UserModel.findOneAndUpdate({ email }, updateField);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
      },
    });

    const emailHtml = await render(
      React.createElement(VerificationEmail, {
        username,
        otp: verifyCode,
        emailType,
      })
    );

    const subjects = {
      VERIFY: "Verify Your Real Estate Account",
      "2FA": "Your 2FA Login Code",
      RESET: "Reset Your Password",
    };
    const subject = subjects[emailType] || "Security Code";

    const mailOptions = {
      from: `"Real Estate Portal" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
    
  } catch (error) {
    console.error("CRITICAL EMAIL ERROR:", error);
    return { success: false, message: error.message };
  }
};