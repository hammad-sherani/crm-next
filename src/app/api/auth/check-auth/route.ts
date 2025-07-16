import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { connectDB } from "@/config/db"
import User from "@/models/user.model"

interface JwtPayload {
  id: string
  iat: number
  exp: number
}

export const GET = async () => {
  try {
    const cookieStore = cookies() // ✅ Not async
    const token = (await cookieStore).get("token")?.value

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication token missing." },
        { status: 401 }
      )
    }

    await connectDB()

    let decoded: JwtPayload

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token." },
        { status: 401 }
      )
    }

    const user = await User.findById(decoded.id).select("-password")

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "Authenticated successfully.",
        user,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("❌ Auth check error:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    )
  }
}
