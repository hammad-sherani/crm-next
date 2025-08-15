/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import User from "@/models/user.model";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";


// GET all users
export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";
    const role = searchParams.get("role")?.trim() || "USER";

    // 1️⃣ Token se current user ID le lo
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const currentUserId = decoded.id;

    // 2️⃣ Prisma-friendly query
    const where: any = {
      role,
      createdById: currentUserId, // Filter by admin ID
      ...(status && { status }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    // 3️⃣ Fetch users with pagination
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
          status: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in fetching users:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch users",
      },
      { status: 500 }
    );
  }
};




export const POST = async (req: NextRequest) => {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid token", err },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, email, password, phoneNumber } = body;

    // 3. Validation
    if (!name || !email || !password || !phoneNumber) {
      return NextResponse.json(
        { success: false, message: "All Fields are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase().trim() },
          { phoneNumber }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User with this email or phone already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const userResponse = await prisma.user.create({
      data: {
        name: name.toLowerCase().trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        phoneNumber,
        isVerified: true,
        createdById: decoded.id,
        status: "ACTIVE",
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        status: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        data: userResponse
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create user" },
      { status: 500 }
    );
  }
};



export const PUT = async (req: NextRequest) => {
  try {
    await connectDB();

    const body = await req.json();
    const { userIds, updateData } = body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "User IDs array is required" },
        { status: 400 }
      );
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, message: "Update data is required" },
        { status: 400 }
      );
    }

    delete updateData.password;
    delete updateData.otp;
    delete updateData.otpExpiresAt;

    const result = await User.updateMany(
      { _id: { $in: userIds }, role: "user" },
      { $set: updateData },
      { runValidators: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: `${result.modifiedCount} users updated successfully`,
        data: {
          matchedCount: result.matchedCount,
          modifiedCount: result.modifiedCount
        }
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.log("Error in bulk update:", error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, message: messages.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to update users" },
      { status: 500 }
    );
  }
};

// export const DELETE = async (req: NextRequest) => {
//   try {
//     await connectDB();

//     const body = await req.json();
//     const { userIds } = body;

//     if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
//       return NextResponse.json(
//         { success: false, message: "User IDs array is required" },
//         { status: 400 }
//       );
//     }

//     const result = await User.deleteMany({
//       _id: { $in: userIds },
//       role: "user" 
//     });

//     if (result.deletedCount === 0) {
//       return NextResponse.json(
//         { success: false, message: "No users found to delete" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       {
//         success: true,
//         message: `${result.deletedCount} users deleted successfully`,
//         data: {
//           deletedCount: result.deletedCount
//         }
//       },
//       { status: 200 }
//     );

//   } catch (error) {
//     console.log("Error in bulk delete:", error);
//     return NextResponse.json(
//       { success: false, message: "Failed to delete users" },
//       { status: 500 }
//     );
//   }
// };

// PATCH - Update user status (for quick status changes)
export const PATCH = async (req: NextRequest) => {
  try {
    await connectDB();

    const body = await req.json();
    const { userIds, status } = body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "User IDs array is required" },
        { status: 400 }
      );
    }

    if (!status || !['active', 'inactive', 'suspended', 'pending'].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Valid status is required (active, inactive, suspended, pending)" },
        { status: 400 }
      );
    }

    const result = await User.updateMany(
      { _id: { $in: userIds }, role: "user" },
      { $set: { status } }
    );

    return NextResponse.json(
      {
        success: true,
        message: `${result.modifiedCount} users status updated to ${status}`,
        data: {
          matchedCount: result.matchedCount,
          modifiedCount: result.modifiedCount
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.log("Error updating user status:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update user status" },
      { status: 500 }
    );
  }
};