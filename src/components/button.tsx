"use client";

import Link from "next/link";
import { motion, MotionConfig } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

type Variant = "primary" | "quiet" | "ghost";

// framer-motion's event props (onAnimationStart, onDrag, ...) collide with
// React's native DOM event types of the same name — drop the native ones.
type MotionSafeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration" | "onDrag" | "onDragStart" | "onDragEnd"
>;
type MotionSafeAnchorProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration" | "onDrag" | "onDragStart" | "onDragEnd"
>;

const MotionLink = motion.create(Link);

function buttonClasses(variant: Variant, className?: string) {
  return cn(
    "inline-flex items-center justify-center rounded-md px-3.5 py-2 text-sm font-medium transition-colors duration-[120ms] ease-out disabled:opacity-50 disabled:pointer-events-none",
    variant === "primary" && "bg-pine text-bone hover:bg-pine/90",
    variant === "quiet" &&
      "text-muted hover:text-ink underline-offset-4 hover:underline",
    variant === "ghost" && "border border-rule text-ink hover:bg-tint",
    className
  );
}

// Every button/link built on top of this gets the same tap feedback for
// free — centralizing it here means "add motion everywhere" is one change,
// not forty. Kept off the board's draggable cards on purpose: their scale
// transform would fight dnd-kit's own drag transform.
const tapFeedback = { whileHover: { scale: 1.015 }, whileTap: { scale: 0.97 } };

export function Button({
  variant = "primary",
  className,
  ...props
}: MotionSafeButtonProps & { variant?: Variant }) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.button
        className={buttonClasses(variant, className)}
        {...tapFeedback}
        {...props}
      />
    </MotionConfig>
  );
}

export function ButtonLink({
  variant = "primary",
  className,
  href,
  ...props
}: MotionSafeAnchorProps & {
  variant?: Variant;
  href: string;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <MotionLink
        href={href}
        className={buttonClasses(variant, className)}
        {...tapFeedback}
        {...props}
      />
    </MotionConfig>
  );
}
