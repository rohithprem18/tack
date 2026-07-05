import { cn } from "@/lib/utils";
import { initials } from "@/lib/utils";

export function Avatar({
  name,
  className,
}: {
  name: string | null | undefined;
  className?: string;
}) {
  return (
    <div
      title={name ?? undefined}
      className={cn(
        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-tint font-mono text-[11px] tracking-[0.08em] text-pine",
        className
      )}
    >
      {initials(name)}
    </div>
  );
}
