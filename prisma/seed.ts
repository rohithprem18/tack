import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("password123", 10);

  const owner = await prisma.user.upsert({
    where: { email: "demo@tack.app" },
    update: {},
    create: { name: "Demo owner", email: "demo@tack.app", password },
  });

  const teammate = await prisma.user.upsert({
    where: { email: "teammate@tack.app" },
    update: {},
    create: { name: "Demo teammate", email: "teammate@tack.app", password },
  });

  const existing = await prisma.board.findFirst({ where: { ownerId: owner.id } });
  if (existing) {
    console.log("Demo board already seeded.");
    return;
  }

  const board = await prisma.board.create({
    data: {
      title: "Tack launch",
      ownerId: owner.id,
      members: {
        create: [
          { userId: owner.id, role: "owner" },
          { userId: teammate.id, role: "member" },
        ],
      },
    },
  });

  const [todo, doing, done] = await Promise.all([
    prisma.list.create({ data: { title: "To do", boardId: board.id, position: 0 } }),
    prisma.list.create({ data: { title: "In progress", boardId: board.id, position: 1 } }),
    prisma.list.create({ data: { title: "Done", boardId: board.id, position: 2 } }),
  ]);

  await prisma.card.createMany({
    data: [
      { title: "Ship auth", description: "Google + email/password", listId: todo.id, position: 0, assigneeId: owner.id },
      { title: "Review Figma handoff", listId: todo.id, position: 1, assigneeId: teammate.id },
      { title: "Write onboarding copy", listId: todo.id, position: 2 },
      { title: "Drag and drop between lists", description: "dnd-kit, position float", listId: doing.id, position: 0, assigneeId: owner.id },
      { title: "Slide-over card panel", listId: doing.id, position: 1, assigneeId: teammate.id },
      { title: "Cut v0.2 tag", listId: done.id, position: 0, assigneeId: owner.id },
      { title: "Set up Prisma + SQLite", listId: done.id, position: 1, assigneeId: teammate.id },
    ],
  });

  console.log("Seeded demo board:", board.id);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
