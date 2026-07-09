"use client";

import Link from "next/link";
import { motion, MotionConfig, type Variants } from "framer-motion";
import { ButtonLink } from "@/components/button";

const EASE = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export function Hero() {
  return (
    <MotionConfig reducedMotion="user">
      <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        className="flex max-w-[640px] flex-col items-center px-2 text-center"
      >
        <motion.h1
          variants={item}
          className="font-serif text-[32px] leading-[1.08] text-ink sm:text-[38px] md:text-[44px]"
        >
          Pin the work down.
        </motion.h1>
        <motion.p variants={item} className="mt-4 max-w-[440px] text-[15px] text-muted">
          Tack is a minimal team board for lists and cards. No clutter, no
          setup ceremony — just drag work where it belongs.
        </motion.p>
        <motion.div variants={item} className="mt-7 flex flex-wrap items-center justify-center gap-5">
          <motion.span
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block"
          >
            <ButtonLink href="/register">Create board</ButtonLink>
          </motion.span>
          <Link
            href="/login"
            className="text-sm text-muted underline-offset-4 transition-colors duration-[120ms] ease-out hover:text-ink hover:underline"
          >
            Log in
          </Link>
        </motion.div>
      </motion.section>
    </MotionConfig>
  );
}
