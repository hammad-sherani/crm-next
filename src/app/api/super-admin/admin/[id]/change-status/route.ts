import { prisma } from "@/lib/prisma";

export const PATCH = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params;
    const { statusName } = await req.json();

    const updatedAdmin = await prisma.admin.update({
      where: { id },
      data: { status: statusName },
      select: { id: true, status: true },
    });

    return new Response(JSON.stringify(updatedAdmin), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to update status" }), { status: 500 });
  }
};
