"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Calendar, BookOpen, ArrowLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Tag {
    id: string;
    name: string;
    slug: string;
}

interface BlogItem {
    id: string;
    title: string;
    slug: string;
    content: string;
    featuredImg: string | null;
    createdAt: string;
    tags: {
        tag: Tag;
    }[];
}

interface InfiniteCategoryBlogsProps {
    categoryTag: any;
    categorySlug: string;
}

const getBadgeStyle = (slug: string) => {
    const colors: Record<string, string> = {
        "govt-jobs": "bg-blue-600 text-white",
        "study-tips": "bg-indigo-600 text-white",
        "tech-news": "bg-blue-500 text-white",
        "youtube-tips": "bg-red-600 text-white",
        "results": "bg-emerald-600 text-white",
        "scholarships": "bg-orange-500 text-white",
        "exam-prep": "bg-indigo-600 text-white",
        "part-time-income": "bg-emerald-600 text-white",
        "share-market": "bg-blue-600 text-white",
        "ai-prompts": "bg-indigo-600 text-white",
        "carrer-jobs": "bg-violet-600 text-white",
        "youtube-growth": "bg-red-600 text-white",
        "instagram": "bg-pink-600 text-white",
        "mobile-hacks": "bg-cyan-600 text-white",
        "ai-tools": "bg-purple-600 text-white",
        "marketing": "bg-amber-600 text-white",
        "startup-ideas": "bg-orange-600 text-white",
        "technology": "bg-teal-600 text-white",
        "apps-websites": "bg-sky-600 text-white",
        "facebook": "bg-blue-600 text-white",
        "editing": "bg-rose-600 text-white",
        "govt-jobs-updates": "bg-yellow-600 text-zinc-900",
        "files-materials": "bg-zinc-600 text-white",
        "internships": "bg-lime-600 text-white",
        "current-affairs": "bg-amber-600 text-white",
    };
    return colors[slug] || "bg-zinc-700 text-white";
};

const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
};

export default function InfiniteCategoryBlogs({
    categoryTag,
    categorySlug,
}: InfiniteCategoryBlogsProps) {
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const LIMIT = 8;

    // Query blogs using Infinite Query
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ["category-blogs", categoryTag.id],
        queryFn: async ({ pageParam = 1 }) => {
            const res = await fetch(
                `/api/blogs?tagIds=${categoryTag.id}&page=${pageParam}&limit=${LIMIT}`
            );
            if (!res.ok) throw new Error("Failed to load category blogs");
            const result = await res.json();
            if (!result.success) throw new Error(result.error || "Failed to load blogs");
            return result;
        },
        getNextPageParam: (lastPage, allPages) => {
            const totalLoaded = allPages.length * LIMIT;
            return totalLoaded < lastPage.totalCount ? allPages.length + 1 : undefined;
        },
        initialPageParam: 1,
        refetchInterval: 4000, // Poll every 4 seconds for real-time updates
    });

    const blogs = data ? data.pages.flatMap((page) => page.blogs || []) : [];

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

    return (
        <div className="flex-grow py-6 flex-1 min-w-0 space-y-6">
            {/* Category Header Title / Subtitle */}
            {/* <div className="border-b border-gray-200 dark:border-zinc-800 pb-4">
                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                    {categoryTag.name}
                </h1>
                <p className="text-sm text-gray-500 mt-1 font-medium">
                    Browse all articles and resources in the {categoryTag.name} category.
                </p>
            </div> */}

            {/* Empty State */}
            {isLoading ? (
                <div className="py-24 text-center flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    <span className="text-sm font-medium text-zinc-500 dark:text-zinc-450">Loading articles...</span>
                </div>
            ) : blogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center border border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl p-12 text-center bg-gray-50/50 dark:bg-zinc-900/20">
                    <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 text-zinc-400 dark:text-zinc-650">
                        <BookOpen className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        No articles found
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-450 max-w-sm mb-6 font-medium">
                        We couldn't find any articles published in the category "{categoryTag.name}" yet. Check back soon!
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg shadow transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Return Home
                    </Link>
                </div>
            ) : (
                <>
                    {/* Blogs Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                        {blogs.map((item: BlogItem) => {
                            const primaryTag =
                                item.tags.find((t: any) => !t.tag.parentId)?.tag ||
                                item.tags[0]?.tag;
                            const catSlug = primaryTag?.slug || categorySlug;
                            const readTime = getReadTime(item.content);

                            return (
                                <article
                                    key={item.id}
                                    className="group flex flex-col h-full  rounded-2xl overflow-hidden  hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300"
                                >
                                    {/* Image container */}
                                    <div className="relative aspect-[16/9] w-full bg-zinc-100 dark:bg-zinc-850 overflow-hidden border rounded-2xl">
                                        {item.featuredImg && (
                                            <Link href={`/${catSlug}/${item.slug}`} className="block w-full h-full relative">
                                                <img
                                                    src={item.featuredImg}
                                                    alt={item.title}
                                                    className="object-cover w-full h-full group-hover:scale-102 transition-transform duration-500"
                                                    loading="lazy"
                                                />
                                            </Link>
                                        )}

                                        {/* Floating badge */}
                                        {/* {primaryTag && (
                                            <span
                                                className={cn(
                                                    "absolute top-3.5 left-3.5 z-10 text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded shadow-sm",
                                                    getBadgeStyle(primaryTag.slug)
                                                )}
                                            >
                                                {primaryTag.name}
                                            </span>
                                        )} */}
                                    </div>

                                    {/* Body details */}
                                    <div className="p-2 flex-grow flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-extrabold text-sm sm:text-base text-zinc-950 dark:text-zinc-50 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
                                                <Link href={`/${catSlug}/${item.slug}`}>{item.title}</Link>
                                            </h3>
                                        </div>

                                        {/* Metadata footer */}
                                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-medium mt-0.1">
                                            <Calendar className="w-3.5 h-3.5 shrink-0" />
                                            <span>
                                                {new Date(item.createdAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </span>
                                            <span className="hidden md:block px-2">•</span>
                                            <BookOpen className="w-3.5 h-3.5 shrink-0 hidden md:block" />
                                            <span className="hidden md:block">{readTime}</span>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    {/* Load More bottom scroll anchor */}
                    <div ref={loadMoreRef} className="w-full py-8 flex justify-center">
                        {isFetchingNextPage && (
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                                <span className="text-xs text-zinc-400 font-semibold">Loading more posts...</span>
                            </div>
                        )}
                        {!hasNextPage && blogs.length > 0 && (
                            <span className="text-xs text-zinc-400 font-semibold bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-850 px-4 py-2 rounded-full">
                                You've reached the end of the {categoryTag.name} articles! 🎉

                            </span>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
