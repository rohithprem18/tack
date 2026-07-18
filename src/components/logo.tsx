"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";

const MotionLink = motion.create(Link);

export function Logo({ className }: { className?: string }) {
  return (
    <MotionLink
      href="/"
      whileTap={{ scale: 0.96 }}
      className={cn("inline-block font-serif text-2xl leading-none text-ink", className)}
    >
      Tack
    </MotionLink>
  );
}
