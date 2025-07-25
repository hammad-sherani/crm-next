/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import User from "@/models/user.model";
import bcrypt from "bcrypt";

// GET all users
export const GET = async (req: NextRequest) => {
  try {
    await connectDB();

    // Get query parameters for filtering and pagination
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const role = searchParams.get('role') || 'user';

    // Build query
    const query: any = { role };
    
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      query.status = status;
    }

    // Execute query with pagination
    const users = await User.find(query)
      .select("-password -otp -otpExpiresAt")
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .lean();

    const total = await User.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        data: users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.log("Error in Fetching users:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch users",
      },
      { status: 500 }
    );
  }
};

// POST - Create new user
export const POST = async (req: NextRequest) => {
  try {
    await connectDB();

    const body = await req.json();
    const { username, email, password } = body;

    // Validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Username, email, and password are required" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email" },
        { status: 400 }
      );
    }

    // Password length validation
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User with this email or username already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      username: username.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    await newUser.save();

    // Remove sensitive fields from response
    const userResponse = newUser.toObject();
    delete userResponse.password;
    delete userResponse.otp;
    delete userResponse.otpExpiresAt;

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        data: userResponse
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.log("Error creating user:", error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, message: messages.join(', ') },
        { status: 400 }
      );
    }

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