import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { BoardView } from "@/components/board/board-view";

export default async function BoardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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
    })),
  }));

  return (
    <BoardView boardId={board.id} boardTitle={board.title} lists={lists} members={members} />
  );
}
