"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CardItem } from "@/components/board/card-item";
import { AddInline } from "@/components/board/add-inline";
import type { ListData, MemberData } from "@/components/board/types";

export function ListColumn({
  list,
  membersById,
  matchesSearch,
  onOpenCard,
  onAddCard,
  onToggleCardCompleted,
}: {
  list: ListData;
  membersById: Map<string, MemberData>;
  matchesSearch: (card: ListData["cards"][number]) => boolean;
  onOpenCard: (cardId: string) => void;
  onAddCard: (listId: string, title: string) => void;
  onToggleCardCompleted: (cardId: string, completed: boolean) => void;
}) {
  const { setNodeRef } = useDroppable({ id: list.id });
  const cards = [...list.cards].sort((a, b) => a.position - b.position);

  return (
    <div className="flex w-[280px] shrink-0 flex-col rounded-md border border-rule bg-surface">
      <div className="p-2">
        <div className="flex items-center justify-between px-1 pt-1">
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
            {list.title}
          </span>
          <span className="font-mono text-[11px] tracking-[0.08em] text-muted">
            {cards.length}
          </span>
        </div>
        <div
          className="mt-2 h-[2px] bg-pine transition-[width] duration-[120ms] ease-out"
          style={{ width: cards.length > 0 ? "100%" : "0%" }}
        />
      </div>

      <div ref={setNodeRef} className="flex flex-1 flex-col gap-2 px-2 pb-2">
        <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              assignee={card.assigneeId ? membersById.get(card.assigneeId) : undefined}
              dimmed={!matchesSearch(card)}
              onOpen={() => onOpenCard(card.id)}
              onToggleCompleted={() => onToggleCardCompleted(card.id, !card.completed)}
            />
          ))}
        </SortableContext>

        <AddInline
          label="Add card"
          placeholder="Card title"
          onSubmit={(value) => onAddCard(list.id, value)}
        />
      </div>
    </div>
  );
}
