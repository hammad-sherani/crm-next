import User from "@/models/user.model";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const userId = (await params).id
    const { status } = await req.json();
    

    if (!userId || !status) {
      return NextResponse.json(
        { success: false, message: "User ID and status are required." },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    user.status = status;
    await user.save();

    return NextResponse.json(
      { success: true, message: "Status changed successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while changing status:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
};
