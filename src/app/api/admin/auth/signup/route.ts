import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, country, phoneNumber } = await req.json();

    // Required field validation
    const missingFields = [name, email, password, country, phoneNumber].some(
      (field) => !field
    );
    if (missingFields) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    // Check if email or phone number already exists
    const existingAdmin = await prisma.admin.findFirst({
      where: {
        OR: [{ email }, { phoneNumber }],
      },
    });

    if (existingAdmin) {
      const conflictField =
        existingAdmin.email === email ? "Email" : "Phone number";
      return NextResponse.json(
        { message: `${conflictField} is already in use.` },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const newAdmin = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
        country,
        phoneNumber,
      },
    });

    return NextResponse.json(
      {
        message: "User created successfully.",
        user: {
          id: newAdmin.id,
          name: newAdmin.name,
          email: newAdmin.email,
          country: newAdmin.country,
          phoneNumber: newAdmin.phoneNumber,
        },
      },
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
