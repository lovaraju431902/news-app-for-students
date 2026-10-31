"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CategoryBlockData } from "@/lib/category-service";
import { NewsCard } from "./NewsCard";

interface Style5Props {
  data: CategoryBlockData;
}

/**
 * Style 5: Horizontal Card Slider with smooth navigation
 */
export function Style5Slider({ data }: Style5Props) {
  const { category, posts } = data;
  const sliderRef = useRef<HTMLDivElement>(null);

  if (!posts || posts.length === 0) return null;

  const displayTitle = category.customTitle?.trim() || category.name;
  const barColor = category.accentColor || "bg-blue-600";

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  return (
    <section className="w-full">
      {/* Custom Header with Blue Underline and Slider Controls */}
      <div className="relative mb-4 sm:mb-5 border-b border-gray-200 dark:border-zinc-800">
        <div className="flex items-end justify-between pb-2">
          <div className="relative inline-block">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-zinc-100 leading-snug">
              <Link
                href={`/${category.slug}`}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {displayTitle}
              </Link>
            </h2>
            {/* Blue active underline bar */}
            <span
              className={cn(
                "absolute -bottom-[9px] left-0 h-[3px] w-full min-w-[50px] z-10",
                barColor
              )}
            />
          </div>

          <div className="flex items-center gap-2 pb-0.5">
            {category.showViewAll && (
              <Link
                href={`/${category.slug}`}
                className="text-xs font-semibold text-gray-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors mr-2 hidden sm:inline"
              >
                View All
              </Link>
            )}
            <button
              onClick={scrollLeft}
              type="button"
              aria-label="Previous posts"
              className="w-7 h-7 rounded border border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-200 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={scrollRight}
              type="button"
              aria-label="Next posts"
              className="w-7 h-7 rounded border border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-200 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Carousel Container */}
      <div
        ref={sliderRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth pb-2 scrollbar-none snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {posts.map((post) => (
          <div
            key={post.id}
            className="w-[240px] sm:w-[260px] lg:w-[calc(25%-15px)] shrink-0 snap-start"
          >
            <NewsCard
              post={post}
              categorySlug={category.slug}
              variant="standard"
              showThumbnail={category.showThumbnail}
              showDate={category.showDate}
              showExcerpt={category.showExcerpt}
              imageAspect="aspect-[16/9]"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
