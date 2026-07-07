"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function createListAction(boardId: string, title: string) {
  const trimmed = title.trim();
  if (!trimmed) return;

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Not authenticated");

  const board = await prisma.board.findFirst({
    where: { id: boardId, members: { some: { userId } } },
    select: { id: true },
  });
  if (!board) throw new Error("Board not found or access denied");

  const last = await prisma.list.findFirst({
    where: { boardId },
    orderBy: { position: "desc" },
    select: { position: true },
  });

  await prisma.list.create({
    data: { title: trimmed, boardId, position: last ? last.position + 1 : 0 },
  });
  revalidatePath(`/boards/${boardId}`);
}
