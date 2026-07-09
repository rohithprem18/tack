"use client";

import Link from "next/link";
import { motion, MotionConfig } from "framer-motion";
import { Logo } from "@/components/logo";
import { ButtonLink } from "@/components/button";

export function LandingHeader() {
  return (
    <MotionConfig reducedMotion="user">
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-between px-6 py-5 md:px-10"
      >
        <Logo />
        <nav className="flex items-center gap-2">
          <Link
            href="/login"
            className="px-3 py-2 text-sm text-muted transition-colors duration-[120ms] ease-out hover:text-ink"
          >
            Log in
          </Link>
          <ButtonLink href="/register">Get started</ButtonLink>
        </nav>
      </motion.header>
    </MotionConfig>
  );
}
