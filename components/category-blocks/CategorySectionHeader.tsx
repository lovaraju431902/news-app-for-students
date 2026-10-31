"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategorySectionHeaderProps {
  title: string;
  categorySlug: string;
  customTitle?: string | null;
  accentColor?: string | null;
  postCount?: number;
  showViewAll?: boolean;
  isDark?: boolean;
  className?: string;
}

export function CategorySectionHeader({
  title,
  categorySlug,
  customTitle,
  accentColor,
  postCount,
  showViewAll = true,
  isDark = false,
  className,
}: CategorySectionHeaderProps) {
  const displayTitle = customTitle?.trim() || title;
  const barColor = accentColor || "bg-blue-600";

  return (
    <div
      className={cn(
        "relative mb-4 sm:mb-5 border-b",
        isDark ? "border-zinc-800" : "border-gray-200 dark:border-zinc-800",
        className
      )}
    >
      <div className="flex items-end justify-between pb-2">
        <div className="relative inline-block">
          <h2
            className={cn(
              "text-lg sm:text-xl font-bold tracking-tight leading-snug",
              isDark ? "text-white" : "text-gray-900 dark:text-zinc-100"
            )}
          >
            <Link
              href={`/${categorySlug}`}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {displayTitle}
            </Link>
          </h2>
          {/* Blue active underline bar aligned with bottom border */}
          <span
            className={cn(
              "absolute -bottom-[9px] left-0 h-[3px] w-full min-w-[50px] z-10",
              barColor
            )}
          />
        </div>

        {showViewAll && (
          <Link
            href={`/${categorySlug}`}
            className={cn(
              "text-xs font-semibold flex items-center gap-0.5 transition-colors pb-0.5",
              isDark
                ? "text-zinc-400 hover:text-white"
                : "text-gray-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400"
            )}
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
