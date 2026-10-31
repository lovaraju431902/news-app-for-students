"use client";

import React from "react";
import { CategoryBlockData } from "@/lib/category-service";
import { CategorySectionHeader } from "./CategorySectionHeader";
import { NewsCard } from "./NewsCard";

interface Style4Props {
  data: CategoryBlockData;
}

/**
 * Style 4: 4-Column Grid (Image 1 reference)
 * Renders 4 clean news cards per row with 16:9 thumbnails, bold titles,
 * and author/date/comments/views metadata line.
 */
export function Style4FourColumnGrid({ data }: Style4Props) {
  const { category, posts } = data;
  if (!posts || posts.length === 0) return null;

  const displayPosts = posts.slice(0, category.homepagePostLimit || 8);

  return (
    <section className="w-full">
      <CategorySectionHeader
        title={category.name}
        categorySlug={category.slug}
        customTitle={category.customTitle}
        accentColor={category.accentColor}
        postCount={posts.length}
        showViewAll={category.showViewAll}
      />

      {/* 4-Column Grid: 4 items across on desktop, 2 on tablet, 1 on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-5 gap-y-6 sm:gap-y-7">
        {displayPosts.map((post) => (
          <NewsCard
            key={post.id}
            post={post}
            categorySlug={category.slug}
            variant="standard"
            showThumbnail={category.showThumbnail}
            showDate={category.showDate}
            showExcerpt={category.showExcerpt}
            imageAspect="aspect-[16/9]"
          />
        ))}
      </div>
    </section>
  );
}
