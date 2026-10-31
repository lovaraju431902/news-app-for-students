"use client";

import React from "react";
import { CategoryBlockData } from "@/lib/category-service";
import { CategorySectionHeader } from "./CategorySectionHeader";
import { NewsCard } from "./NewsCard";

interface Style2Props {
  data: CategoryBlockData;
}

/**
 * Style 2: 3 Featured Grid on Top + 3 Columns of Compact Rows below (Image 2 reference)
 * Top: 3 prominent columns with thumbnail, 2-line title, metadata, and snippet excerpt.
 * Bottom: 3 columns of compact horizontal news items.
 */
export function Style2FeaturedGridList({ data }: Style2Props) {
  const { category, posts } = data;
  if (!posts || posts.length === 0) return null;

  // Top 3 featured posts
  const topFeatured = posts.slice(0, 3);
  // Lower compact posts (up to 6 posts, 2 per column)
  const lowerPosts = posts.slice(3, 9);

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

      {/* 1. Top Featured Row: 3 Posts across the top with excerpts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 mb-5 sm:mb-6">
        {topFeatured.map((post) => (
          <NewsCard
            key={post.id}
            post={post}
            categorySlug={category.slug}
            variant="standard"
            showThumbnail={category.showThumbnail}
            showDate={category.showDate}
            showExcerpt={true}
            imageAspect="aspect-[16/9]"
            titleClassName="text-sm sm:text-base"
          />
        ))}
      </div>

      {/* 2. Lower Compact Thumbnail & Title Rows: 3 Columns matching the grid above */}
      {lowerPosts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4 pt-1">
          {lowerPosts.map((post) => (
            <NewsCard
              key={post.id}
              post={post}
              categorySlug={category.slug}
              variant="compact-row"
              showThumbnail={category.showThumbnail}
              showDate={category.showDate}
            />
          ))}
        </div>
      )}
    </section>
  );
}
