"use client";

import { useRecordBlogView } from "@/lib/useRealtimeViews";

export function ViewTracker({ slug }: { slug: string }) {
  useRecordBlogView(slug);
  return null;
}
