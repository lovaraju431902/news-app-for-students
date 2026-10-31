"use client";

import React from "react";
import { CategoryBlockData } from "@/lib/category-service";
import { CategorySectionHeader } from "./CategorySectionHeader";
import { NewsCard } from "./NewsCard";

interface Style6Props {
  data: CategoryBlockData;
}

/**
 * Style 6: High-contrast Dark Block for featured technology / special news
 */
export function Style6DarkBlock({ data }: Style6Props) {
  const { category, posts } = data;
  if (!posts || posts.length === 0) return null;

  const displayPosts = posts.slice(0, category.homepagePostLimit || 6);

  return (
    <section className="bg-zinc-950 border border-zinc-800/90 rounded-lg p-4 sm:p-6 shadow-sm relative overflow-hidden">
      <div className="relative z-10">
        <CategorySectionHeader
          title={category.name}
          categorySlug={category.slug}
          customTitle={category.customTitle}
          accentColor={category.accentColor || "bg-blue-500"}
          postCount={posts.length}
          showViewAll={category.showViewAll}
          isDark={true}
        />

        {/* Dark Grid: 3 columns on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-6">
          {displayPosts.map((post) => (
            <NewsCard
              key={post.id}
              post={post}
              categorySlug={category.slug}
              variant="dark"
              showThumbnail={category.showThumbnail}
              showDate={category.showDate}
              showExcerpt={category.showExcerpt}
              imageAspect="aspect-[16/9]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
