import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { sendOtpEmail } from "@/helper/otpEmail";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, country, phoneNumber } = await req.json();

    if (!name || !email || !password || !country || !phoneNumber) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phoneNumber }],
      },
    });

    if (existingUser) {
      const conflictField =
        existingUser.email === email ? "Email" : "Phone number";

      return NextResponse.json(
        { message: `${conflictField} already exists.` },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    // const expireVerifyOtp = new Date(Date.now() + 10 * 60 * 1000);

    const newAdmin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        country,
        phoneNumber,
        role: "ADMIN",
        status: "PENDING",
        otp, 
        otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000), 
      },
      select: {
        id: true,
        name: true,
        email: true,
        country: true,
        phoneNumber: true,
        createdAt: true,
        role: true
      },
    });

    await sendOtpEmail(email, otp);

    const token = jwt.sign(
      { id: newAdmin.id, email: newAdmin.email, role: "ADMIN" },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    const response = NextResponse.json(
      { message: "Verification OTP send to your email address.", user: newAdmin },
      { status: 201 }
    );

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 60 * 60 * 24, 
      path: "/",
    });

    return response; 

  } catch (error) {
    console.error("Error while signing up admin:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
