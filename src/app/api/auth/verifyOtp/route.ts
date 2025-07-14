// app/api/auth/verify-otp/route.ts

import { NextResponse } from "next/server";
import User from "@/models/user.model";
import { connectDB } from "@/config/db";
import bcrypt from "bcrypt";

export const POST = async (req: Request) => {
  try {
    await connectDB();

    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "Email and OTP are required." },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedOtp = otp.trim();

    const user = await User.findOne({ email: trimmedEmail });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    if (user.otpExpiresAt && new Date() > user.otpExpiresAt) {
      return NextResponse.json(
        { success: false, message: "OTP has expired." },
        { status: 410 }
      );
    }

    const isOtpValid = await bcrypt.compare(trimmedOtp, user.otp || "");
    if (!isOtpValid) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP." },
        { status: 401 }
      );
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    return NextResponse.json(
      { success: true, message: "Email verified successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in verify-otp route:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while verifying OTP." },
      { status: 500 }
    );
  }
};
