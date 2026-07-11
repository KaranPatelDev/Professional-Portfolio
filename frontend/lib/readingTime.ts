import { stripHtml } from "./text";

export function estimateReadingTime(html: string | null | undefined): string {
  if (!html) return "1 min read";
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}
