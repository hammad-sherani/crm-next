// app/api/auth/verify-otp/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "Email and OTP are required." },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedOtp = otp.trim();

    const user = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    if (!user.expireVerifyOtp || new Date() > user.expireVerifyOtp) {
      return NextResponse.json(
        { success: false, message: "OTP has expired." },
        { status: 410 }
      );
    }

    if (trimmedOtp !== user.verifyOtp) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP." },
        { status: 401 }
      );
    }

    await prisma.user.update({
      where: { email: trimmedEmail },
      data: {
        isVerified: true,
        verifyOtp: null,
        expireVerifyOtp: null,
      },
    });

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
}
