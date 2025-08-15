import { generateOtp } from "@/helper/function";
import { NextResponse } from "next/server";
import { sendOtpEmail } from "@/helper/otpEmail";
import { prisma } from "@/lib/prisma";

export const POST = async (req: Request) => {
  const body = await req.json()
  const { email } = body
  try {
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    const otp = generateOtp();

    const emailSent = await sendOtpEmail(email, otp);
    if (!emailSent) {
      return NextResponse.json(
        { success: false, message: "Failed to send OTP email." },
        { status: 500 }
      );
    }

    const expireVerifyOtp = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update(
      {
        where: { email: email },
        data: {
          otp,
          otpExpiresAt: expireVerifyOtp
        }
      })


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
