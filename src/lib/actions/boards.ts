"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { boardHref } from "@/lib/utils";

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
  return session.user.id;
}

export async function createBoardAction(formData: FormData) {
  const userId = await requireUserId();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const board = await prisma.board.create({
    data: {
      title,
      ownerId: userId,
      members: { create: { userId, role: "owner" } },
    },
  });

  revalidatePath("/boards");
  redirect(boardHref(board));
}

export async function deleteBoardAction(boardId: string) {
  const userId = await requireUserId();
  const board = await prisma.board.findUnique({ where: { id: boardId } });
  if (!board || board.ownerId !== userId) return;

  await prisma.board.delete({ where: { id: boardId } });
  revalidatePath("/boards");
}
