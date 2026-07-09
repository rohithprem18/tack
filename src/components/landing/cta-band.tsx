"use client";

import { motion, MotionConfig, type Variants } from "framer-motion";
import { ButtonLink } from "@/components/button";

const EASE = [0.16, 1, 0.3, 1] as const;

const variants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export function CtaBand() {
  return (
    <MotionConfig reducedMotion="user">
      <motion.section
        variants={variants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.6 }}
        className="mt-20 flex w-full max-w-[920px] flex-col items-center gap-4 rounded-lg border border-rule bg-surface px-6 py-12 text-center sm:flex-row sm:justify-between sm:text-left"
      >
        <div>
          <h2 className="text-[20px] font-medium text-ink">Ready to pin your work down?</h2>
          <p className="mt-1 text-sm text-muted">Free to start. No credit card, no setup ceremony.</p>
        </div>
        <ButtonLink href="/register" className="shrink-0">
          Create board
        </ButtonLink>
      </motion.section>
    </MotionConfig>
  );
}
