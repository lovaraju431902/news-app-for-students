"use client";

import React from "react";
import { Eye } from "lucide-react";
import { useRealtimePostViews } from "@/lib/useRealtimeViews";

interface RealtimeViewsBadgeProps {
  slug?: string | null;
  initialViews?: number | null;
  className?: string;
  iconClassName?: string;
  showText?: boolean;
}

export function RealtimeViewsBadge({
  slug,
  initialViews,
  className = "inline-flex items-center gap-1",
  iconClassName = "w-3.5 h-3.5 text-gray-400",
  showText = false,
}: RealtimeViewsBadgeProps) {
  const views = useRealtimePostViews(slug, initialViews);
  return (
    <span className={className}>
      <Eye className={iconClassName} />
      <span>{views}{showText ? " views" : ""}</span>
    </span>
  );
}
