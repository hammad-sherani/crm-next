
import { NextResponse } from "next/server";
import User from "@/models/user.model";
import { handleApiError } from "@/helper/handleError";
import { createJwt } from "@/helper/createJwt";
import { cookies } from "next/headers";
import { connectDB } from "@/config/db";
import bcrypt from "bcrypt"; 

export const POST = async (req: Request) => {
  try {
    await connectDB();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials." },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials." },
        { status: 401 }
      );
    }

    const token = await createJwt(user);

    (await cookies()).set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Login successful.",
        user: {
          _id: user._id,
          email: user.email,
          username: user.username,
          role: user.role,
          isVerified: user.isVerified,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
};
