import User from "@/models/user.model";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectDB } from "@/config/db";
import { cookies } from "next/headers";
import { verifyJwt } from "@/helper/verifyJwt";

export const POST = async (req: Request) => {
  try {
    await connectDB();

    const { oldPassword, newPassword } = await req.json();
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Token missing." },
        { status: 401 }
      );
    }

    const decoded = verifyJwt(token);
    if (!decoded || !decoded.email) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token." },
        { status: 401 }
      );
    }

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Old password is incorrect." },
        { status: 401 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "New password must be at least 6 characters." },
        { status: 400 }
      );
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return NextResponse.json(
      { success: true, message: "Password changed successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in change password route:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while changing the password." },
      { status: 500 }
    );
  }
};
