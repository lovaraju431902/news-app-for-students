// Shared helpers for Homepage Section Admin Forms

export const MAIN_10_COLORS = [
  { name: "Blue", value: "bg-blue-100 text-blue-600", border: "border-blue-300" },
  { name: "Emerald", value: "bg-emerald-100 text-emerald-600", border: "border-emerald-300" },
  { name: "Purple", value: "bg-purple-100 text-purple-600", border: "border-purple-300" },
  { name: "Amber", value: "bg-amber-100 text-amber-600", border: "border-amber-300" },
  { name: "Rose", value: "bg-rose-100 text-rose-600", border: "border-rose-300" },
  { name: "Indigo", value: "bg-indigo-100 text-indigo-600", border: "border-indigo-300" },
  { name: "Cyan", value: "bg-cyan-100 text-cyan-600", border: "border-cyan-300" },
  { name: "Orange", value: "bg-orange-100 text-orange-600", border: "border-orange-300" },
  { name: "Teal", value: "bg-teal-100 text-teal-600", border: "border-teal-300" },
  { name: "Pink", value: "bg-pink-100 text-pink-600", border: "border-pink-300" },
];

/**
 * Returns a random read time between 2 and 10 minutes
 */
export function getRandomReadTime(): string {
  const mins = Math.floor(Math.random() * 9) + 2; // 2 to 10
  return `${mins} min read`;
}

/**
 * Returns today's formatted readable date (e.g. "May 25, 2024")
 */
export function getDefaultFormattedDate(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Returns today's ISO date for input type="date" (e.g. "2024-05-25")
 */
export function getDefaultISODate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Converts YYYY-MM-DD input date to readable "May 25, 2024"
 */
export function formatDateStringToReadable(dateStr: string): string {
  if (!dateStr) return getDefaultFormattedDate();
  try {
    const [year, month, day] = dateStr.split("-").map(Number);
    if (!year || !month || !day) return dateStr;
    const dateObj = new Date(year, month - 1, day);
    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/**
 * Default author name
 */
export const DEFAULT_AUTHOR = "Admin";

/**
 * Returns a random color class from the 10 main color pairs
 */
export function getRandomBadgeColor(): string {
  const idx = Math.floor(Math.random() * MAIN_10_COLORS.length);
  return MAIN_10_COLORS[idx].value;
}
