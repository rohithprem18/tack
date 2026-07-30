export type MemberData = {
  id: string;
  name: string | null;
  email: string | null;
};

export type CardData = {
  id: string;
  title: string;
  description: string | null;
  position: number;
  listId: string;
  assigneeId: string | null;
  dueDate: string | null;
  completed: boolean;
  completedAt: string | null;
};

export type ListData = {
  id: string;
  title: string;
  position: number;
  cards: CardData[];
};
