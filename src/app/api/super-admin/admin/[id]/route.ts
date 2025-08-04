import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server";

// GET USER BY ID
export const GET = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const userId = (await params).id

    try {
        const user = await prisma.user.findUnique({
            where: { id: String(userId) },
            select: {
                id: true,
                name: true,
                email: true,
                country: true,
                phoneNumber: true,
                createdAt: true,
                role: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, user },
            { status: 200 }
        );
    } catch (err) {
        console.error("Error while fetching Admin:", err);
        return NextResponse.json(
            { success: false, message: "Internal server error." },
            { status: 500 }
        );
    }
}


export const DELETE = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const userId = (await params).id

    try {
        const user = prisma.user.findUnique({ where: { id: userId } })

        if (!user) {
            console.log("User not found");
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            )
        }

        await prisma.user.delete({ where: { id: userId } });

        return NextResponse.json(
            { message: "User deleted successfully" },
            { status: 200 }
        );


    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json(
            { message: "Internal server error", error: String(error) },
            { status: 500 }
        );
    }
}