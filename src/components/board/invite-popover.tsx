"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { UserPlus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar } from "@/components/avatar";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { inviteMemberAction, type InviteState } from "@/lib/actions/members";
import type { MemberData } from "@/components/board/types";

export function InvitePopover({
  boardId,
  members,
}: {
  boardId: string;
  members: MemberData[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const action = inviteMemberAction.bind(null, boardId);
  const [state, formAction, pending] = useActionState<InviteState, FormData>(
    action,
    undefined
  );

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (open && ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <div className="flex items-center gap-2">
        <div className="hidden -space-x-2 sm:flex">
          {members.slice(0, 5).map((member) => (
            <Avatar
              key={member.id}
              name={member.name ?? member.email}
              className="ring-2 ring-surface"
            />
          ))}
        </div>
        <motion.button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Invite a member"
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-1.5 rounded-md border border-rule px-2.5 py-1.5 text-sm text-ink transition-colors duration-[120ms] ease-out hover:bg-tint"
        >
          <UserPlus size={14} strokeWidth={1.75} />
          <span className="hidden sm:inline">Invite</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full z-30 mt-2 w-[260px] rounded-lg border border-rule bg-surface p-3"
          >
            <form action={formAction} className="flex flex-col gap-2">
              <label className="text-sm text-muted" htmlFor="invite-email">
                Add member by email
              </label>
              <Input id="invite-email" name="email" type="email" placeholder="teammate@email.com" required />
              {state?.error && <p className="text-sm text-muted">{state.error}</p>}
              <Button type="submit" disabled={pending} className="mt-1">
                {pending ? "Adding…" : "Add member"}
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
