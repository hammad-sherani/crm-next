// app/api/auth/register/route.ts

import { NextResponse } from "next/server";
import User from "@/models/user.model";
import { createJwt } from "@/helper/createJwt";
import { cookies } from "next/headers";
import { connectDB } from "@/config/db";
import { handleApiError } from "@/helper/handleError";
import { generateOtp } from "@/helper/function";
import { sendOtpEmail } from "@/helper/otpEmail";
import bcrypt from "bcrypt";

export const POST = async (req: Request) => {
    try {
        await connectDB();

        const { email, password, username, role } = await req.json();

        if (!email || !password || !username) {
            return NextResponse.json(
                { success: false, message: "All fields are required" },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ email, username });
        if (existingUser) {
            return NextResponse.json(
                { success: false, message: "User already exists" },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const otp = generateOtp();
        const hashedOtp = await bcrypt.hash(otp, 10);

        

        const newUser = new User({
            email,
            password: hashedPassword,
            username,
            role,
            otp: hashedOtp,
            otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
        });
        await newUser.save();

        await sendOtpEmail(email, otp);

        const token = await createJwt(newUser);

        const cookieStore = cookies();
        (await cookieStore).set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60,
            path: "/",
        });

        return NextResponse.json(
            {
                success: true,
                message: "User created successfully. OTP sent to email.",
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
