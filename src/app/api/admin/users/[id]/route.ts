import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import User from "@/models/user.model";

// Dynamic route: /admin/users/[id]
export const DELETE = async (
  _req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    await connectDB();

    const deletedUser = await User.findByIdAndDelete(params.id);

    if (!deletedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
};
