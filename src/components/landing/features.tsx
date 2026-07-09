"use client";

import { motion, MotionConfig, type Variants } from "framer-motion";
import { LayoutGrid, MousePointerClick, UserPlus } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

const FEATURES = [
  {
    icon: LayoutGrid,
    title: "Lists and cards",
    body: "Type a title, hit enter. No modal, no ceremony — the board is the interface.",
  },
  {
    icon: MousePointerClick,
    title: "Drag to move work",
    body: "Cards move between lists instantly, on the mouse or the keyboard, and stay put on refresh.",
  },
  {
    icon: UserPlus,
    title: "Invite a teammate",
    body: "Add anyone by email, assign them a card, and the board stays in sync.",
  },
];

export function Features() {
  return (
    <MotionConfig reducedMotion="user">
      <motion.section
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="mt-20 grid w-full max-w-[920px] grid-cols-1 gap-4 sm:grid-cols-3"
      >
        {FEATURES.map(({ icon: Icon, title, body }) => (
          <motion.div
            key={title}
            variants={item}
            className="rounded-md border border-rule bg-surface p-5"
          >
            <Icon size={18} strokeWidth={1.75} className="text-pine" />
            <h3 className="mt-3 text-sm font-medium text-ink">{title}</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{body}</p>
          </motion.div>
        ))}
      </motion.section>
    </MotionConfig>
  );
}
