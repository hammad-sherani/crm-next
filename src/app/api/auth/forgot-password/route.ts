import { generateOtp } from "@/helper/function";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "@/models/user.model";
import { sendOtpEmail } from "@/helper/otpEmail";
import { connectDB } from "@/config/db";

export const POST = async (req: Request) => {
  try {
    await connectDB();

    const { email } = await req.json();
    const trimmedEmail = email?.trim().toLowerCase();

    if (!trimmedEmail) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: trimmedEmail });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }


    // ✅ Generate and hash OTP
    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    // ✅ Send raw OTP to email (not hashed)
    await sendOtpEmail(trimmedEmail, otp);

    // ✅ Update user with hashed OTP and expiry
    user.otp = hashedOtp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "OTP sent to your email. It will expire in 10 minutes.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in forgot-password route:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while sending the OTP.",
      },
      { status: 500 }
    );
  }
};
