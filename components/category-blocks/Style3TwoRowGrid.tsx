"use client";

import React from "react";
import { CategoryBlockData } from "@/lib/category-service";
import { CategorySectionHeader } from "./CategorySectionHeader";
import { NewsCard } from "./NewsCard";

interface Style3Props {
  data: CategoryBlockData;
}

/**
 * Style 3: Two-Row Grid (3 columns on desktop, 2 rows = 6 posts total)
 */
export function Style3TwoRowGrid({ data }: Style3Props) {
  const { category, posts } = data;
  if (!posts || posts.length === 0) return null;

  const displayPosts = posts.slice(0, category.homepagePostLimit || 6);

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

      {/* Two-Row Grid: 3 Posts per Row on Desktop (2 on Tablet, 1 on Mobile) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-6 sm:gap-y-7">
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
