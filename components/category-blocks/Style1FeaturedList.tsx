"use client";

import React from "react";
import { CategoryBlockData } from "@/lib/category-service";
import { CategorySectionHeader } from "./CategorySectionHeader";
import { NewsCard } from "./NewsCard";

interface Style1Props {
  data: CategoryBlockData;
}

/**
 * Style 1: 4 Featured Cards on Top + Compact Rows below
 */
export function Style1FeaturedList({ data }: Style1Props) {
  const { category, posts } = data;
  if (!posts || posts.length === 0) return null;

  // Top 4 featured posts
  const topFeatured = posts.slice(0, 4);
  // Lower compact posts
  const lowerPosts = posts.slice(4, 10);

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

      {/* 1. Top Featured Row: 4 Posts in a Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-5 sm:mb-6">
        {topFeatured.map((post) => (
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

      {/* 2. Lower Compact Posts: 3 Columns */}
      {lowerPosts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 pt-1">
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
