import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import User from "@/models/user.model";
import { resetMail } from "@/helper/resetMail";
import { createJwt } from "@/helper/createJwt";

// Helper for uniform error response
const errorResponse = (message: string, status: number) =>
  NextResponse.json({ success: false, message }, { status });

export const POST = async (req: Request) => {
  try {
    const { email } = await req.json();

    if (!email?.trim()) {
      return errorResponse("Email is required.", 400);
    }

    const normalizedEmail = email.trim().toLowerCase();

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
    if (!isValidEmail) {
      return errorResponse("Invalid email format.", 400);
    }

    // Only connect to DB if input is valid
    await connectDB();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      // Security tip: Don't reveal if email exists in prod
      return errorResponse("If this email exists, a reset link will be sent.", 200);
    }

    // Create reset token and expiry
    const token = await createJwt(user); // Ensure it's awaited
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.passwordResetToken = token;
    user.passwordResetExpires = expiresAt;
    await user.save();

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${encodeURIComponent(token || "")}`;

    if (process.env.NODE_ENV === "development") {
      console.log("🔗 Reset Password Link:", resetLink);
    }

    await resetMail(normalizedEmail, resetLink);

    return NextResponse.json(
      {
        success: true,
        message: "If this email exists, a reset link has been sent. It will expire in 10 minutes.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Forgot password error:", error);
    return errorResponse("Something went wrong. Please try again later.", 500);
  }
};
