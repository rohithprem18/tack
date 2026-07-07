import { Avatar } from "@/components/avatar";
import type { CardData, MemberData } from "@/components/board/types";

export function CardPreview({
  card,
  assignee,
}: {
  card: CardData;
  assignee?: MemberData;
}) {
  return (
    <div
      className="flex w-[264px] flex-col items-start rounded-md border border-rule bg-surface p-3 text-left"
      style={{ boxShadow: "0 8px 24px -8px rgb(23 24 27 / 0.18)" }}
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
    </div>
  );
}
