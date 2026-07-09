import { LandingHeader } from "@/components/landing/landing-header";
import { Hero } from "@/components/landing/hero";
import { BoardPreview } from "@/components/landing/board-preview";
import { Features } from "@/components/landing/features";
import { CtaBand } from "@/components/landing/cta-band";

const PREVIEW = [
  {
    title: "To do",
    cards: [
      { title: "Ship auth", desc: "Google + email/password", who: "Siva" },
      { title: "Review Figma handoff", who: "Ana" },
      { title: "Write onboarding copy", who: "Ana" },
    ],
  },
  {
    title: "In progress",
    cards: [
      { title: "Drag and drop between lists", desc: "dnd-kit, position float", who: "Siva" },
      { title: "Slide-over card panel", who: "Rae" },
    ],
  },
  {
    title: "Done",
    cards: [
      { title: "Cut v0.2 tag", who: "Siva" },
      { title: "Set up Prisma + SQLite", who: "Rae" },
    ],
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />

      <main className="flex flex-1 flex-col items-center px-6 pb-20 pt-10 md:pt-16">
        <Hero />
        <BoardPreview lists={PREVIEW} />
        <Features />
        <CtaBand />
      </main>

      <footer className="border-t border-rule px-6 py-6 md:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
          Tack — pin the work down.
        </p>
      </footer>
    </div>
  );
}
