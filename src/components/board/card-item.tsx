"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/avatar";
import type { CardData, MemberData } from "@/components/board/types";

export function CardItem({
  card,
  assignee,
  onOpen,
}: {
  card: CardData;
  assignee?: MemberData;
  onOpen: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-[var(--card-h,64px)] rounded-md border border-dashed border-pine"
      />
    );
  }

  return (
    <button
      ref={setNodeRef}
      style={style}
      type="button"
      onClick={onOpen}
      {...attributes}
      {...listeners}
      className={cn(
        "flex w-full flex-col items-start rounded-md border border-rule bg-surface p-3 text-left transition-colors duration-[120ms] ease-out hover:bg-tint"
      )}
    >
      <p className="text-sm text-ink">{card.title}</p>
      {card.description && (
        <p className="mt-1 line-clamp-1 text-[13px] text-muted">
          {card.description}
        </p>
      )}
      {assignee && (
        <div className="mt-2 flex w-full justify-end">
          <Avatar name={assignee.name ?? assignee.email} />
        </div>
      )}
    </button>
  );
}
