// utils/sendOtpEmail.ts

import type { SendMailOptions } from "nodemailer";
import { transporter } from "./mailer";

/**
 * Sends a verification OTP to the user's email
 * @param to - Recipient email address
 * @param otp - The OTP code to send
 */
export const sendOtpEmail = async (to: string, otp: string) => {
  const mailOptions: SendMailOptions = {
    from: `"Your App" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your OTP Code",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Your OTP Code</h2>
        <p>Use the following OTP to verify your email address:</p>
        <h3 style="color: #0070f3;">${otp}</h3>
        <p>This code is valid for the next 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ OTP email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
};
