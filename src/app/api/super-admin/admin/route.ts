import { Role } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET ALL ADMINS
export async function GET() {
  try {
    const admins = await prisma.user.findMany({
      where: { role: Role.ADMIN },
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

    return NextResponse.json(
      { success: true, admins, message: admins.length ? undefined : "No admins found." },
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
