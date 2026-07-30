"use client";

import { Check, Clock } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn, formatDueDate, isOverdue } from "@/lib/utils";
import { Avatar } from "@/components/avatar";
import type { CardData, MemberData } from "@/components/board/types";

function CompletionCheckbox({
  completed,
  onToggle,
}: {
  completed: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={completed ? "Mark incomplete" : "Mark complete"}
      // Card's own onClick opens the panel — this needs to toggle without
      // that firing, and pointerDown must stop too or dnd-kit's listeners
      // (attached to the card) treat it as the start of a drag.
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={cn(
        "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors duration-[120ms] ease-out",
        completed ? "border-pine bg-pine text-bone" : "border-rule hover:border-pine"
      )}
    >
      {completed && <Check size={11} strokeWidth={2.5} />}
    </button>
  );
}

export function CardItem({
  card,
  assignee,
  dimmed = false,
  onOpen,
  onToggleCompleted,
}: {
  card: CardData;
  assignee?: MemberData;
  dimmed?: boolean;
  onOpen: () => void;
  onToggleCompleted: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const overdue = isOverdue(card.dueDate, card.completed);

  if (isDragging) {
    // The dashed box itself must stay visible (that's the placeholder) —
    // only its content is hidden, as a same-shaped, invisible copy of the
    // real card. That gives the box the dragged card's exact height without
    // hardcoding a guess or measuring anything in JS.
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex w-full flex-col items-start rounded-md border border-dashed border-pine p-3 text-left"
      >
        <div className="invisible">
          <p className="text-sm">{card.title}</p>
          {card.description && (
            <p className="mt-1 line-clamp-1 text-[13px]">{card.description}</p>
          )}
          {assignee && (
            <div className="mt-2 flex w-full justify-end">
              <Avatar name={assignee.name ?? assignee.email} />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    // A plain <button> can't nest the checkbox's own <button> (invalid HTML,
    // and browsers close the outer tag early) — a div gets the same
    // semantics without that restriction; dnd-kit's `attributes` below
    // already supplies role="button" and tabIndex for it.
    <div
      ref={setNodeRef}
      style={style}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      {...attributes}
      {...listeners}
      className={cn(
        "flex w-full cursor-pointer items-start gap-2.5 rounded-md border border-rule bg-surface p-3 text-left transition-[background-color,opacity] duration-[120ms] ease-out hover:bg-tint",
        dimmed && "opacity-35"
      )}
    >
      <CompletionCheckbox completed={card.completed} onToggle={onToggleCompleted} />

      <div className="min-w-0 flex-1">
        <p className={cn("text-sm text-ink", card.completed && "text-muted line-through")}>
          {card.title}
        </p>
        {card.description && (
          <p className="mt-1 line-clamp-1 text-[13px] text-muted">{card.description}</p>
        )}
        <div className="mt-2 flex items-center justify-between gap-2">
          {card.dueDate ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 font-mono text-[11px] tracking-[0.02em]",
                overdue ? "text-danger" : "text-muted"
              )}
            >
              <Clock size={11} strokeWidth={1.75} />
              {formatDueDate(card.dueDate)}
            </span>
          ) : (
            <span />
          )}
          {assignee && <Avatar name={assignee.name ?? assignee.email} />}
        </div>
      </div>
    </div>
  );
}
