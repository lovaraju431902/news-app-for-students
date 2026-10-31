"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getHomepageCategoryBlocksAction } from "@/app/actions/categories";
import { CategoryBlockRenderer } from "@/components/category-blocks/CategoryBlockRenderer";
import { CategoryBlockData } from "@/lib/category-service";

interface HomepageCategoryBlocksProps {
  initialData?: CategoryBlockData[];
}

export default function HomepageCategoryBlocks({ initialData }: HomepageCategoryBlocksProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["homepage-category-blocks"],
    queryFn: async () => {
      const res = await getHomepageCategoryBlocksAction();
      if (!res.success) {
        throw new Error(res.error || "Failed to load category blocks");
      }
      return res.data;
    },
    initialData: initialData && initialData.length > 0 ? initialData : undefined,
    staleTime: 1000 * 10, // 10 seconds for real-time updates
    refetchOnWindowFocus: true,
    refetchInterval: 30000, // Live poll every 30s to keep views count fresh
  });

  const categoryBlocks = data || [];

  if (isLoading && categoryBlocks.length === 0) {
    return (
      <div className="space-y-8 sm:space-y-10 animate-pulse">
        {[1, 2].map((i) => (
          <div key={i} className="w-full">
            <div className="flex items-end justify-between pb-2 mb-4 border-b border-gray-200 dark:border-zinc-800">
              <div className="h-6 w-36 bg-slate-200 dark:bg-zinc-800 rounded" />
              <div className="h-4 w-14 bg-slate-200 dark:bg-zinc-800 rounded" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="space-y-2">
                  <div className="w-full aspect-[16/9] rounded-[3px] bg-slate-200 dark:bg-zinc-800" />
                  <div className="h-4 w-5/6 bg-slate-200 dark:bg-zinc-800 rounded" />
                  <div className="h-3 w-1/2 bg-slate-200 dark:bg-zinc-800 rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const visibleBlocks = categoryBlocks.filter(
    (block) => block.category?.slug !== "ai-prompts"
  );

  if (visibleBlocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      {visibleBlocks.map((block) => (
        <CategoryBlockRenderer key={block.category.id} data={block} />
      ))}
    </div>
  );
}

