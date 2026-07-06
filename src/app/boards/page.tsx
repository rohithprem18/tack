import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Logo } from "@/components/logo";
import { Avatar } from "@/components/avatar";
import { Button } from "@/components/button";
import { NewBoardForm } from "@/components/new-board-form";
import { BoardCard } from "@/components/board-card";

export default async function BoardsPage() {
  const session = await auth();
  const userId = session!.user!.id;

  const boards = await prisma.board.findMany({
    where: { members: { some: { userId } } },
    include: { _count: { select: { lists: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-rule px-6 py-4 md:px-10">
        <Logo />
        <div className="flex items-center gap-4">
          <Avatar name={session?.user?.name} />
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <Button variant="quiet" type="submit">
              Log out
            </Button>
          </form>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[960px] flex-1 px-6 py-10 md:px-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-[20px] font-medium">Your boards</h1>
        </div>

        <NewBoardForm />

        {boards.length === 0 ? (
          <p className="mt-6 text-sm text-muted">
            No boards yet. Create one above to start.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {boards.map((board) => (
              <BoardCard
                key={board.id}
                id={board.id}
                title={board.title}
                listCount={board._count.lists}
                isOwner={board.ownerId === userId}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
