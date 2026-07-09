"use client";

import { motion, MotionConfig, type Variants } from "framer-motion";
import { Avatar } from "@/components/avatar";

type PreviewCard = { title: string; desc?: string; who: string };
type PreviewList = { title: string; cards: PreviewCard[] };

const EASE = [0.16, 1, 0.3, 1] as const;

const listStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const columnVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
};

export function BoardPreview({ lists }: { lists: PreviewList[] }) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.section
        aria-hidden
        variants={listStagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="mt-16 w-full max-w-[920px] overflow-x-auto rounded-lg border border-rule bg-bone p-4 md:p-6"
      >
        <div className="flex gap-4">
          {lists.map((list) => (
            <motion.div
              key={list.title}
              variants={columnVariants}
              className="w-[240px] shrink-0 rounded-md border border-rule bg-surface p-2"
            >
              <div className="px-1 pb-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
                    {list.title}
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.08em] text-muted">
                    {list.cards.length}
                  </span>
                </div>
                <div className="mt-2 h-[2px] w-full bg-pine" />
              </div>
              <motion.div variants={listStagger} className="flex flex-col gap-2 pt-1">
                {list.cards.map((card) => (
                  <motion.div
                    key={card.title}
                    variants={cardVariants}
                    className="rounded-md border border-rule bg-surface p-3"
                  >
                    <p className="text-sm text-ink">{card.title}</p>
                    {card.desc && (
                      <p className="mt-1 line-clamp-1 text-[13px] text-muted">{card.desc}</p>
                    )}
                    <div className="mt-2 flex justify-end">
                      <Avatar name={card.who} />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </MotionConfig>
  );
}
