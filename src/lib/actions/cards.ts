"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

async function requireUserId() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Not authenticated");
  return userId;
}

// Single query joining the membership check instead of two round trips
// (fetch list/card, then fetch membership) — cuts DB latency per mutation.
async function assertListAccess(listId: string, userId: string) {
  const list = await prisma.list.findFirst({
    where: { id: listId, board: { members: { some: { userId } } } },
    select: { id: true, boardId: true },
  });
  if (!list) throw new Error("List not found or access denied");
  return list;
}

async function assertCardAccess(cardId: string, userId: string) {
  const card = await prisma.card.findFirst({
    where: { id: cardId, list: { board: { members: { some: { userId } } } } },
    select: { id: true, title: true, listId: true, list: { select: { boardId: true } } },
  });
  if (!card) throw new Error("Card not found or access denied");
  return card;
}

export async function createCardAction(listId: string, title: string) {
  const trimmed = title.trim();
  if (!trimmed) return;
  const userId = await requireUserId();
  const list = await assertListAccess(listId, userId);

  const last = await prisma.card.findFirst({
    where: { listId },
    orderBy: { position: "desc" },
    select: { position: true },
  });

  await prisma.card.create({
    data: { title: trimmed, listId, position: last ? last.position + 1 : 0 },
  });
  revalidatePath(`/boards/${list.boardId}`);
}

export async function updateCardAction(
  cardId: string,
  data: {
    title?: string;
    description?: string;
    assigneeId?: string | null;
    dueDate?: string | null;
  }
) {
  const userId = await requireUserId();
  const card = await assertCardAccess(cardId, userId);

  await prisma.card.update({
    where: { id: cardId },
    data: {
      ...(data.title !== undefined ? { title: data.title.trim() || card.title } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.assigneeId !== undefined ? { assigneeId: data.assigneeId || null } : {}),
      ...(data.dueDate !== undefined ? { dueDate: data.dueDate ? new Date(data.dueDate) : null } : {}),
    },
  });
  revalidatePath(`/boards/${card.list.boardId}`);
}

// completedAt is derived here from the server clock rather than trusted
// from the client, so "completed at what time" stays honest even if the
// caller's local clock is wrong.
export async function toggleCardCompletedAction(cardId: string, completed: boolean) {
  const userId = await requireUserId();
  const card = await assertCardAccess(cardId, userId);

  await prisma.card.update({
    where: { id: cardId },
    data: { completed, completedAt: completed ? new Date() : null },
  });
  revalidatePath(`/boards/${card.list.boardId}`);
}

export async function deleteCardAction(cardId: string) {
  const userId = await requireUserId();
  const card = await assertCardAccess(cardId, userId);

  await prisma.card.delete({ where: { id: cardId } });
  revalidatePath(`/boards/${card.list.boardId}`);
}

export async function moveCardAction(
  cardId: string,
  targetListId: string,
  position: number
) {
  const userId = await requireUserId();
  const list = await assertListAccess(targetListId, userId);

  await prisma.card.update({
    where: { id: cardId },
    data: { listId: targetListId, position },
  });
  revalidatePath(`/boards/${list.boardId}`);
}
