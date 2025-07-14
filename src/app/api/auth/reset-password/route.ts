import User from "@/models/user.model";
import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import bcrypt from "bcrypt";

export const POST = async (req: Request) => {
  try {
    await connectDB();

    const { email, password } = await req.json();

    const trimmedEmail = email?.trim().toLowerCase();
    const trimmedPassword = password?.trim();

    // ✅ Input validation
    if (!trimmedEmail || !trimmedPassword) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    if (trimmedPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters long." },
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

    // ✅ OTP must be set and not expired
    const now = new Date();
    if (!user.otp || !user.otpExpiresAt || now > user.otpExpiresAt) {
      return NextResponse.json(
        { success: false, message: "OTP is invalid or has expired." },
        { status: 410 }
      );
    }

    
    user.password = await bcrypt.hash(trimmedPassword, 10);
    user.otp = null;
    user.otpExpiresAt = null;

    await user.save();

    return NextResponse.json(
      { success: true, message: "Password reset successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in reset password route:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while resetting the password." },
      { status: 500 }
    );
  }
};
