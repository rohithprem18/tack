"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { deleteBoardAction } from "@/lib/actions/boards";

export function BoardCard({
  id,
  title,
  listCount,
  isOwner,
}: {
  id: string;
  title: string;
  listCount: number;
  isOwner: boolean;
}) {
  return (
    <div className="group relative rounded-md border border-rule bg-surface p-4 transition-colors duration-[120ms] ease-out hover:bg-tint">
      <Link href={`/boards/${id}`} className="block">
        <p className="pr-6 text-sm font-medium text-ink">{title}</p>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
          {listCount} {listCount === 1 ? "list" : "lists"}
        </p>
      </Link>
      {isOwner && (
        <button
          type="button"
          aria-label="Delete board"
          onClick={() => deleteBoardAction(id)}
          className="absolute right-3 top-3 rounded-md p-1 text-muted opacity-0 transition-opacity duration-[120ms] ease-out hover:text-ink group-hover:opacity-100"
        >
          <Trash2 size={14} strokeWidth={1.75} />
        </button>
      )}
    </div>
  );
}
