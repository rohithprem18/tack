"use client";

import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Textarea } from "@/components/input";
import { cn } from "@/lib/utils";

export function AddInline({
  label,
  placeholder,
  onSubmit,
  className,
}: {
  label: string;
  placeholder: string;
  onSubmit: (value: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  function submit() {
    const trimmed = value.trim();
    if (!trimmed) {
      setOpen(false);
      return;
    }
    onSubmit(trimmed);
    setValue("");
    ref.current?.focus();
  }

  if (!open) {
    return (
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.97 }}
        className={cn(
          "flex items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-sm text-muted transition-colors duration-[120ms] ease-out hover:bg-tint hover:text-ink",
          className
        )}
      >
        <Plus size={14} strokeWidth={1.75} />
        {label}
      </motion.button>
    );
  }

  return (
    <Textarea
      ref={ref}
      autoFocus
      rows={2}
      value={value}
      placeholder={placeholder}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => {
        if (!value.trim()) setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          submit();
        } else if (e.key === "Escape") {
          setValue("");
          setOpen(false);
        }
      }}
      className={className}
    />
  );
}
