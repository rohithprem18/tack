import { Clock } from "lucide-react";
import { cn, formatDueDate, isOverdue } from "@/lib/utils";
import { Avatar } from "@/components/avatar";
import type { CardData, MemberData } from "@/components/board/types";

export function CardPreview({
  card,
  assignee,
}: {
  card: CardData;
  assignee?: MemberData;
}) {
  const overdue = isOverdue(card.dueDate, card.completed);

  return (
    <div
      className="flex w-[264px] flex-col items-start rounded-md border border-rule bg-surface p-3 text-left"
      style={{ boxShadow: "0 8px 24px -8px rgb(23 24 27 / 0.18)" }}
    >
      <p className={cn("text-sm text-ink", card.completed && "text-muted line-through")}>
        {card.title}
      </p>
      {card.description && (
        <p className="mt-1 line-clamp-1 text-[13px] text-muted">
          {card.description}
        </p>
      )}
      <div className="mt-2 flex w-full items-center justify-between gap-2">
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
  );
}
