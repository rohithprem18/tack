import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

type Variant = "primary" | "quiet" | "ghost";

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

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={buttonClasses(variant, className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  className,
  href,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  href: string;
}) {
  return (
    <Link href={href} className={buttonClasses(variant, className)} {...props} />
  );
}
