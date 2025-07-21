import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import User from "@/models/user.model";

export const GET = async () => {
  try {
    await connectDB();

    const users = await User.find({ role: "user" }).select("-password -otp -otpExpiresAt").lean();

    return NextResponse.json(
      {
        success: true,
        data: users,
      },
      { status: 200 }
    );

  } catch (error) {
    console.log("Error in Fetching users:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch users",
      },
      { status: 500 }
    );
  }
};
