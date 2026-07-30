import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { BoardView } from "@/components/board/board-view";
import { slugify } from "@/lib/utils";

export default async function BoardPage({
  params,
}: {
  params: Promise<{ id: string; slug?: string[] }>;
}) {
  const { id, slug } = await params;
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) notFound();

  const board = await prisma.board.findUnique({
    where: { id },
    include: {
      members: { include: { user: true } },
      lists: { include: { cards: true }, orderBy: { position: "asc" } },
    },
  });

  if (!board) notFound();
  if (!board.members.some((m) => m.userId === userId)) notFound();

  // The id is the real lookup key above — this only keeps the URL's slug
  // segment honest (canonical, or filled in on old id-only bookmarks).
  const canonicalSlug = slugify(board.title);
  if (slug?.[0] !== canonicalSlug) {
    redirect(`/boards/${id}/${canonicalSlug}`);
  }

  const members = board.members.map((m) => ({
    id: m.user.id,
    name: m.user.name,
    email: m.user.email,
  }));

  const lists = board.lists.map((list) => ({
    id: list.id,
    title: list.title,
    position: list.position,
    cards: list.cards.map((card) => ({
      id: card.id,
      title: card.title,
      description: card.description,
      position: card.position,
      listId: card.listId,
      assigneeId: card.assigneeId,
      dueDate: card.dueDate ? card.dueDate.toISOString() : null,
      completed: card.completed,
      completedAt: card.completedAt ? card.completedAt.toISOString() : null,
    })),
  }));

  return (
    <BoardView boardId={board.id} boardTitle={board.title} lists={lists} members={members} />
  );
}
