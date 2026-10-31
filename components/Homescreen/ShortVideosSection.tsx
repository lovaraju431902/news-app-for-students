"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ShortVideoCard, ShortVideoPlayerModal } from "@/components/ShortVideoComponents";

type Webstoriesnews = {
  id: string;
  title: string;
  image: string;
  video?: string | null;
  href?: string | null;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

type WebstoriesResponse = {
  data: Webstoriesnews[];
};

export default function ShortVideosSection() {
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

  const getWebstories = async (): Promise<WebstoriesResponse> => {
    const response = await fetch("/api/webstories?limit=4");
    if (!response.ok) {
      throw new Error("Failed to fetch short videos");
    }
    return response.json();
  };

  const { data: webstoriesData, isLoading } = useQuery({
    queryKey: ["webstories", "homepage"],
    queryFn: getWebstories,
  });

  const storiesData = webstoriesData?.data || [];

  if (isLoading) {
    return (
      <div className="p-3 animate-pulse">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="h-5 w-28 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-[1px] bg-red-700/20 flex-grow" />
          <div className="h-7 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col">
              <div className="w-full aspect-[9/16] rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-4 w-5/6 bg-zinc-200 dark:bg-zinc-800 rounded mt-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (storiesData.length === 0) return null;

  return (
    <div className="p-3">
      {/* Short Videos Section */}
      <section>
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-[#b91c1c] font-extrabold text-xl whitespace-nowrap">
            SHORT VIDEOS
          </h2>
          <div className="h-[1px] bg-red-700/20 flex-grow" />
          <Link
            href="/short-videos"
            className="text-xs font-bold text-[#b91c1c] border border-red-700/20 rounded-full px-4 py-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors whitespace-nowrap cursor-pointer"
          >
            VIEW ALL
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {storiesData.map((story, index) => (
            <div key={story.id}>
              <ShortVideoCard
                story={story}
                onClick={() => setActiveStoryIndex(index)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Video Player Modal */}
      {activeStoryIndex !== null && (
        <ShortVideoPlayerModal
          stories={storiesData}
          currentIndex={activeStoryIndex}
          onClose={() => setActiveStoryIndex(null)}
          onNavigate={(index) => setActiveStoryIndex(index)}
        />
      )}
    </div>
  );
}
