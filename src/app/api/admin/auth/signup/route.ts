import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, country, phoneNumber } = await req.json();

    if (!name || !email || !password || !country || !phoneNumber) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    const existingAdmin = await prisma.admin.findFirst({
      where: {
        OR: [{ email }, { phoneNumber }],
      },
    });

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }],
      },
    });

    if (existingAdmin || existingUser) {
      const conflictField =
        existingAdmin?.email === email || existingUser?.email === email
          ? "Email"
          : "Phone number";

      return NextResponse.json(
        { message: `${conflictField} already exists.` },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
        country,
        phoneNumber,
        role: "ADMIN"
      },
      select: {
        id: true,
        name: true,
        email: true,
        country: true,
        phoneNumber: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { message: "Admin created successfully.", user: newAdmin },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error while signing up admin:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
