
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  Copy,
  Check,
  Search,
  Sparkles,
  X,
  Loader2,
  Inbox,
  ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface PromptItem {
  id: string;
  title: string;
  image: string;
  prompt: string;
  createdAt: string;
}

interface AIPromptsViewProps {
  categoryTag: any;
}

export default function AIPromptsView({ categoryTag }: AIPromptsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState<PromptItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const LIMIT = 15;

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 450);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // TanStack Query Infinite Query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["prompts", debouncedSearch],
    queryFn: async ({ pageParam = 1 }) => {
      const queryStr = debouncedSearch ? `&q=${encodeURIComponent(debouncedSearch)}` : "";
      const res = await fetch(`/api/prompts?page=${pageParam}&limit=${LIMIT}${queryStr}`);
      if (!res.ok) throw new Error("Failed to load prompts");
      return res.json();
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.length * LIMIT;
      return totalLoaded < lastPage.totalCount ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    refetchInterval: 3000, // Poll every 4 seconds for real-time updates
  });

  // Flatten paginated results
  const prompts = data ? data.pages.flatMap((page) => page.prompts || []) : [];
  const totalCount = data?.pages[0]?.totalCount || 0;

  // Scroll detection using IntersectionObserver
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleCopyPrompt = async (id: string, text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Could not copy prompt text: ", err);
    }
  };

  return (
    <div className="w-full space-y-8 py-6 max-w-[1440px] mx-auto px-4 sm:px-6">



      {/* Masonry Layout Container */}
      {isLoading ? (
        <div className="py-32 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-9 h-9 animate-spin text-blue-500" />
          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-450 animate-pulse">
            Loading prompt canvas...
          </p>
        </div>
      ) : prompts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 border border-dashed border-zinc-200 dark:border-zinc-850 rounded-3xl bg-zinc-50/20 dark:bg-zinc-900/10 text-center">
          <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 grid place-items-center mb-4 text-zinc-400">
            <Inbox className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">
            No Prompts Found
          </h3>
          <p className="text-sm text-zinc-550 dark:text-zinc-450 max-w-sm">
            We couldn't find any prompts matching your search concepts. Try exploring other keywords!
          </p>
        </div>
      ) : (
        <>
          {/* Pinterest-like CSS columns masonry layout */}
          <div className="columns-2 sm:columns-3 md:columns-4 xl:columns-5 gap-5 space-y-5">
            {prompts.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedPrompt(item)}
                className="break-inside-avoid relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 group shadow-sm hover:shadow-xl hover:scale-[1.01] hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-350 cursor-pointer"
              >
                {/* Image element */}
                <div className="relative w-full h-auto overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-auto object-cover group-hover:scale-103 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4 text-white">
                  <h3 className="font-extrabold text-sm md:text-base leading-tight mb-2 text-white shadow-sm line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex gap-2 w-full mt-1">
                    <button
                      onClick={(e) => handleCopyPrompt(item.id, item.prompt, e)}
                      className={cn(
                        "flex items-center justify-center gap-1.5 px-3 py-2 w-full  rounded-xl text-xs font-bold transition-all shadow-md active:scale-95",
                        copiedId === item.id
                          ? "bg-emerald-600 text-white"
                          : "bg-white text-zinc-900 hover:bg-zinc-100"
                      )}
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy Prompt
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More bottom scroll anchor */}
          <div ref={loadMoreRef} className="w-full py-8 flex justify-center">
            {isFetchingNextPage && (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                <span className="text-xs text-zinc-400 font-semibold">Loading more prompts...</span>
              </div>
            )}
            {!hasNextPage && prompts.length > 0 && (
              <span className="text-xs text-zinc-400 font-semibold bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 px-4 py-2 rounded-full">
                You've reached the end of the prompts list 🎉
              </span>
            )}
          </div>
        </>
      )}

      {/* Floating Prompt modal overlay details */}
      {selectedPrompt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedPrompt(null)}
        >
          <div
            className="bg-white dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl animate-in scale-in duration-200 flex flex-col md:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image side */}
            <div className="relative flex-1 bg-zinc-900 md:max-h-none max-h-[350px] overflow-hidden flex items-center justify-center">
              <img
                src={selectedPrompt.image}
                alt={selectedPrompt.title}
                className="w-full h-full object-contain md:max-h-none max-h-[350px]"
              />
              <button
                onClick={() => setSelectedPrompt(null)}
                className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 rounded-full text-white md:hidden transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Prompt information side */}
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[90vh]">
              <div className="space-y-6">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white tracking-tight leading-snug">
                      {selectedPrompt.title}
                    </h2>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 mt-1 block">
                      Published on{" "}
                      {new Date(selectedPrompt.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedPrompt(null)}
                    className="p-2 border border-zinc-200 dark:border-zinc-850 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-250 md:block hidden transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-zinc-400">
                    Image Prompt Text
                  </label>
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-850 text-sm font-medium leading-relaxed font-mono text-zinc-700 dark:text-zinc-300 break-words select-all select-text">
                    {selectedPrompt.prompt}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-100 dark:border-zinc-900 mt-6 flex flex-col gap-2">
                <button
                  onClick={() => handleCopyPrompt(selectedPrompt.id, selectedPrompt.prompt)}
                  className={cn(
                    "flex items-center justify-center gap-2 py-3.5 w-full rounded-2xl text-sm font-bold shadow-lg transition-all active:scale-[0.98]",
                    copiedId === selectedPrompt.id
                      ? "bg-emerald-600 text-white shadow-emerald-500/10"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/10 hover:shadow-blue-500/20"
                  )}
                >
                  {copiedId === selectedPrompt.id ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied! Ready to generate
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Creative Prompt
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

