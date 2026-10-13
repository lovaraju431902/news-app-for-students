"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Topbar from "@/components/Homescreen/topbar";
import Header from "@/components/Homescreen/header";
import Navbar from "@/components/Homescreen/Navbar";
import Footer from "@/components/Homescreen/footer";
import { ShortVideoCard, ShortVideoPlayerModal, WebstoryType } from "@/components/ShortVideoComponents";

type WebstoriesResponse = {
  data: WebstoryType[];
};

export default function ShortVideosPage() {
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

  const { data: webstoriesData, isLoading, error } = useQuery<WebstoriesResponse>({
    queryKey: ["webstories", "all"],
    queryFn: async () => {
      const res = await fetch("/api/webstories");
      if (!res.ok) throw new Error("Failed to load short videos");
      return res.json();
    },
  });

  const stories = webstoriesData?.data || [];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-200">
      <Topbar />
      <Header />
      <Navbar />

      <main className="flex-grow max-w-[1440px] w-full mx-auto px-4 sm:px-6 md:px-8 py-8">
        {/* Title/Back Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <Link href="/" className="hover:text-red-600 flex items-center gap-1 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>
              <span>/</span>
              <span className="text-slate-500">Short Videos</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Short Videos
            </h1>
          </div>

          <div className="text-xs font-bold text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 self-start sm:self-center">
            {stories.length} Videos Available
          </div>
        </div>

        {/* Loading and Error States */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div key={i} className="flex flex-col">
                <div className="w-full aspect-[9/16] rounded-2xl bg-slate-200 dark:bg-zinc-800" />
                <div className="h-4 w-5/6 bg-slate-200 dark:bg-zinc-800 rounded mt-2.5" />
                <div className="h-4 w-2/3 bg-slate-200 dark:bg-zinc-800 rounded mt-1.5" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-12 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm">
            <p className="text-sm font-semibold text-red-500">Failed to load short videos</p>
            <p className="text-xs text-slate-400 mt-1">Please try again later.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && stories.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm">
            <p className="text-sm font-semibold text-slate-500">No short videos found</p>
            <p className="text-xs text-slate-400 mt-1">Check back later for new updates.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#b91c1c] border border-red-700/20 rounded-full px-4 py-2 hover:bg-red-50 transition-colors mt-4"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>
        )}

        {/* Video Grid */}
        {!isLoading && !error && stories.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {stories.map((story, index) => (
              <ShortVideoCard
                key={story.id}
                story={story}
                onClick={() => setActiveStoryIndex(index)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Video Player Modal */}
      {activeStoryIndex !== null && (
        <ShortVideoPlayerModal
          stories={stories}
          currentIndex={activeStoryIndex}
          onClose={() => setActiveStoryIndex(null)}
          onNavigate={(index) => setActiveStoryIndex(index)}
        />
      )}

      <Footer />
    </div>
  );
}
