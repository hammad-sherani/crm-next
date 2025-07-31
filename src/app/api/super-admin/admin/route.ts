import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET ALL ADMINS
export async function GET() {
  try {
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        country: true,
        phoneNumber: true,
        createdAt: true,
        status: true,
        
      },
      orderBy: { createdAt: "desc" },
    });

    // ✅ Early return if no admins found
    if (admins.length === 0) {
      return NextResponse.json(
        { success: true, message: "No admins found.", admins: [] },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: true, admins },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while fetching admins:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch admins." },
      { status: 500 }
    );
  }
}
