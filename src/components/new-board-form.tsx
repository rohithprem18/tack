"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { createBoardAction } from "@/lib/actions/boards";

export function NewBoardForm() {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  if (!open) {
    return (
      <Button variant="ghost" onClick={() => setOpen(true)}>
        New board
      </Button>
    );
  }

  return (
    <form
      ref={formRef}
      action={createBoardAction}
      className="flex flex-wrap items-center gap-2"
    >
      <Input
        name="title"
        placeholder="Board title"
        autoFocus
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
        className="w-full sm:w-auto sm:max-w-[280px]"
      />
      <div className="flex items-center gap-2">
        <Button type="submit" className="whitespace-nowrap">
          Create board
        </Button>
        <Button variant="quiet" type="button" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
