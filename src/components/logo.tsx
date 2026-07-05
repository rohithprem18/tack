import { cn } from "@/lib/utils";
import Link from "next/link";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("font-serif text-2xl leading-none text-ink", className)}
    >
      Tack
    </Link>
  );
}
