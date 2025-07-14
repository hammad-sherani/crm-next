// app/api/your-endpoint/route.ts

import { NextResponse } from "next/server";
import User from "@/models/user.model";
import { handleApiError } from "@/helper/handleError";
import { createJwt } from "@/helper/createJwt";
import { cookies } from "next/headers";

export const POST = async (req: Request) => {
  try {
    const { email, password, username, role } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 409 } 
      );
    }

    const newUser = new User({ email, password, username, role });
    await newUser.save();

    const token = await createJwt(newUser);

    cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60,
      path: "/",
    });

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        user: {
          _id: newUser._id,
          email: newUser.email,
          username: newUser.username,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
};
