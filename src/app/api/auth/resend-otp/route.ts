import { generateOtp } from "@/helper/function";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { sendOtpEmail } from "@/helper/otpEmail";
import User from "@/models/user.model";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const type = searchParams.get("type");

    if (!email || !type) {
      return NextResponse.json(
        { success: false, message: "Email and type are required." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    const emailSent = await sendOtpEmail(email, otp);
    if (!emailSent) {
      return NextResponse.json(
        { success: false, message: "Failed to send OTP email." },
        { status: 500 }
      );
    }

    user.otp = hashedOtp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    await user.save();

    return NextResponse.json(
      { success: true, message: "OTP has been sent successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resending OTP:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error. Please try again later.",
      },
      { status: 500 }
    );
  }
};
