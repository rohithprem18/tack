export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function initials(name: string | null | undefined) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + last).toUpperCase();
}

// Cosmetic only — the id segment next to it is the real lookup key, so a
// stale slug (title changed after the link was shared) never breaks the URL.
export function slugify(title: string) {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "board"
  );
}

export function boardHref(board: { id: string; title: string }) {
  return `/boards/${board.id}/${slugify(board.title)}`;
}

// "Aug 21" — no year, since due dates only ever matter within a board's
// working horizon of a few weeks/months.
export function formatDueDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// "Aug 21, 2:45 PM" — used for the "completed at" timestamp, where the
// time of day is the whole point.
export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function isOverdue(dueDate: string | null, completed: boolean) {
  if (!dueDate || completed) return false;
  return new Date(dueDate).getTime() < Date.now();
}
