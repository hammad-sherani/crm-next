import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({ message: "Logout successful" });

    // ✅ Securely remove the token
    response.cookies.delete("token");

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "Failed to logout" },
      { status: 500 }
    );
  }
}
