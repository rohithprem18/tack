"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/button";

// Shared confirmation gate for destructive actions (delete board, delete
// card, ...) — anything that throws away data with no undo. Renders
// nothing when `open` is false, so it's safe to mount unconditionally
// wherever a delete trigger lives.
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  pending = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close confirmation dialog"
            onClick={onCancel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[60] bg-ink/20"
          />
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-1/2 z-[60] w-[calc(100%-2.5rem)] max-w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-rule bg-surface p-5"
          >
            <h2 id="confirm-dialog-title" className="text-[15px] font-medium text-ink">
              {title}
            </h2>
            <p id="confirm-dialog-description" className="mt-1.5 text-sm text-muted">
              {description}
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="ghost" type="button" onClick={onCancel} disabled={pending}>
                Cancel
              </Button>
              <Button variant="danger" type="button" onClick={onConfirm} disabled={pending} autoFocus>
                {pending ? "Deleting…" : confirmLabel}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
