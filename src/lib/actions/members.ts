"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export type InviteState = { error?: string } | undefined;

export async function inviteMemberAction(
  boardId: string,
  _prevState: InviteState,
  formData: FormData
): Promise<InviteState> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: "Not authenticated." };

  const requester = await prisma.member.findUnique({
    where: { boardId_userId: { boardId, userId } },
  });
  if (!requester) return { error: "Not a member of this board." };

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) return { error: "Enter an email to invite." };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { error: "No account found with that email." };

  const existing = await prisma.member.findUnique({
    where: { boardId_userId: { boardId, userId: user.id } },
  });
  if (existing) return { error: "Already a member of this board." };

  await prisma.member.create({ data: { boardId, userId: user.id } });
  revalidatePath(`/boards/${boardId}`);
}
