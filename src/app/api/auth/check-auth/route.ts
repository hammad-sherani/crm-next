// app/api/auth/check-auth/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "No token found" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    return NextResponse.json({ success: true, user: decoded }, { status: 200 });
  } catch (error) {
    console.error("Auth check failed:", error);
    return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
  }
}
