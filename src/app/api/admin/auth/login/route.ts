// app/api/auth/login/route.ts

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOtpEmail } from "@/helper/otpEmail";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: "Email and password are required." },
                { status: 400 }
            );
        }

        // 2. Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Invalid credentials." },
                { status: 401 }
            );
        }

        // 3. Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, message: "Invalid credentials." },
                { status: 401 }
            );
        }



        // 5. Create JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "1d" }
        );

        if (!user.isVerified) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            user.otp = otp;
            user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

            await sendOtpEmail(user.email, otp);

            return NextResponse.json({
                message: "Login successful, please verify your email",
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    isVerified: false
                }
            });
        }

        // 6. Set cookie
        const response = NextResponse.json(
            {
                success: true,
                message: "Login successful.",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isVerified: user.isVerified,
                },
            },
            { status: 200 }
        );

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error." },
            { status: 500 }
        );
    }
}
