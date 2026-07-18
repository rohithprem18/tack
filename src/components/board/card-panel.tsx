"use client";

import { useEffect, useState } from "react";
import { X, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Input, Textarea } from "@/components/input";
import { Button } from "@/components/button";
import type { CardData, MemberData } from "@/components/board/types";

export function CardPanel({
  card,
  members,
  onClose,
  onSave,
  onDelete,
}: {
  card: CardData;
  members: MemberData[];
  onClose: () => void;
  onSave: (data: { title?: string; description?: string; assigneeId?: string | null }) => void;
  onDelete: () => void;
}) {
  // Parent keys this component by card.id, so a fresh instance (and fresh
  // initial state) mounts whenever the selected card changes.
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description ?? "");

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <>
      <motion.button
        type="button"
        aria-label="Close"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-40 bg-ink/10"
      />
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[380px] flex-col border-l border-rule bg-surface p-5"
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
            Card
          </span>
          <motion.button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            className="rounded-md p-1 text-muted transition-colors duration-[120ms] ease-out hover:bg-tint hover:text-ink"
          >
            <X size={16} strokeWidth={1.75} />
          </motion.button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-muted" htmlFor="card-title">
              Title
            </label>
            <Input
              id="card-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => {
                if (title.trim() && title !== card.title) onSave({ title });
              }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-muted" htmlFor="card-desc">
              Description
            </label>
            <Textarea
              id="card-desc"
              rows={5}
              value={description}
              placeholder="Add more detail…"
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => {
                if (description !== (card.description ?? "")) onSave({ description });
              }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-muted" htmlFor="card-assignee">
              Assignee
            </label>
            <select
              id="card-assignee"
              defaultValue={card.assigneeId ?? ""}
              onChange={(e) => onSave({ assigneeId: e.target.value || null })}
              className="w-full rounded-md border border-rule bg-surface px-3 py-2 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine"
            >
              <option value="">Unassigned</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name ?? member.email}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-auto pt-6">
          <Button
            variant="ghost"
            onClick={onDelete}
            className="flex w-full items-center justify-center gap-1.5"
          >
            <Trash2 size={14} strokeWidth={1.75} />
            Delete card
          </Button>
        </div>
      </motion.aside>
    </>
  );
}
