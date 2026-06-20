"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  BookOpen,
  Inbox
} from "lucide-react";
import { searchBlogsAction } from "../actions/blogs";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Topbar from "@/components/Homescreen/topbar";
import Header from "@/components/Homescreen/header";
import Navbar from "@/components/Homescreen/Navbar";
import Footer from "@/components/Homescreen/footer";
import CategoriesSidebar from "@/components/Homescreen/CategoriesSidebar";
import RightRail from "@/components/Homescreen/righttail";

interface Tag {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  children?: Tag[];
}

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featuredImg: string | null;
  createdAt: Date;
  updatedAt: Date;
  tags: {
    tag: Tag;
  }[];
}

const BlogImage = ({ src, alt }: { src: string | null; alt: string }) => {
  const [imgSrc, setImgSrc] = useState(src || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80");
  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      className="object-cover group-hover:scale-102 transition-transform duration-500"
      onError={() => setImgSrc("https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80")}
      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 300px"
    />
  );
};

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
    "business": "bg-indigo-600 text-white",
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

export default function BlogSearchPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // React Query for fetching all blogs
  const { data: blogsData, isLoading: loadingBlogs, error: blogsError } = useQuery({
    queryKey: ["blogs", currentPage],
    queryFn: async () => {
      const res = await searchBlogsAction([], "", currentPage, ITEMS_PER_PAGE);
      if (!res.success) throw new Error(res.error || "Failed to fetch blogs.");
      return {
        blogs: (res.blogs || []) as Blog[],
        totalCount: res.totalCount || 0,
      };
    },
  });

  const blogs = blogsData?.blogs || [];
  const totalCount = blogsData?.totalCount || 0;

  const getReadingTime = (content: string) => {
    const cleanText = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    const words = cleanText ? cleanText.split(" ").length : 0;
    return Math.max(1, Math.ceil(words / 200));
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const paginatedBlogs = blogs;

  const getPaginationItems = (current: number, total: number) => {
    const items: (number | string)[] = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        items.push(i);
      }
    } else {
      if (current <= 4) {
        items.push(1, 2, 3, 4, 5, "...", total);
      } else if (current >= total - 3) {
        items.push(1, "...", total - 4, total - 3, total - 2, total - 1, total);
      } else {
        items.push(1, "...", current - 1, current, current + 1, "...", total);
      }
    }
    return items;
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col font-sans">
      <Topbar />
      <Header />
      <Navbar />

      <main className="flex-grow w-full px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6 w-full min-w-0 items-start">

          {/* Left + Middle Column Wrapper */}
          <div className="flex-grow flex-1 flex flex-col md:flex-row gap-6 w-full min-w-0">

            {/* Left Column: Categories Sidebar */}
            <CategoriesSidebar />

            {/* Middle Column: Blogs Content Column */}
            <div className="flex-grow flex-1 min-w-0 space-y-6">

              {/* Blog Title */}
              <div className="border-b border-gray-200 dark:border-zinc-800 pb-4">
                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                  All Blogs
                </h1>
                <p className="text-sm text-gray-500 mt-1 font-medium">
                  Stay updated with the latest news, tips, and guides.
                </p>
              </div>

              {/* Blogs Grid */}
              {loadingBlogs ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <div
                      key={n}
                      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm flex flex-col h-full animate-pulse"
                    >
                      {/* Image placeholder with responsive aspect-[16/10] */}
                      <div className="aspect-[16/10] w-full bg-zinc-200 dark:bg-zinc-800" />

                      {/* Body placeholder */}
                      <div className="p-4 flex-grow flex flex-col gap-3">
                        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
                        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3" />
                        <div className="h-3 bg-zinc-150 dark:bg-zinc-850 rounded w-1/2 mt-auto" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : blogsError ? (
                <div className="border border-red-200 dark:border-red-950/60 bg-red-500/5 text-red-500 p-6 rounded-2xl text-center text-sm font-medium">
                  {blogsError instanceof Error ? blogsError.message : "Failed to load blogs."}
                </div>
              ) : blogs.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-16 text-center shadow-sm flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 grid place-items-center mb-4 text-zinc-400">
                    <Inbox className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-1">
                    No articles found
                  </h3>
                  <p className="text-sm text-zinc-500 max-w-sm mx-auto">
                    Check back later for new updates and posts.
                  </p>
                </div>
              ) : (
                <>
                  {/* Grid Layout (3 Columns on Desktop/Tablet, 2 on Mobile) */}
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                    {paginatedBlogs.map((blog) => {
                      const categorySlug = blog.tags.find(({ tag }) => !tag.parentId)?.tag.slug || "uncategorized";
                      const mainTag = blog.tags.find(({ tag }) => !tag.parentId) || blog.tags[0];

                      return (
                        <article
                          key={blog.id}
                          className="group flex flex-col h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md overflow-hidden shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-350"
                        >
                          {/* Image wrapper */}
                          <div className="relative aspect-[16/10] w-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden rounded-t-md">
                            <BlogImage src={blog.featuredImg} alt={blog.title} />

                            {/* Floating tag badge */}
                            {mainTag && (
                              <span className={cn(
                                "absolute top-3.5 left-3.5 z-10 text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded shadow-sm",
                                getBadgeStyle(mainTag.tag.slug)
                              )}>
                                {mainTag.tag.name}
                              </span>
                            )}
                          </div>

                          {/* Body */}
                          <div className="p-4 flex-grow flex flex-col justify-between">
                            <div>
                              {/* Title */}
                              <h3 className="text-sm sm:text-base font-extrabold text-zinc-950 dark:text-zinc-50 line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                                <Link href={`/${categorySlug}/${blog.slug}`}>
                                  {blog.title}
                                </Link>
                              </h3>
                            </div>

                            {/* Metadata Footer */}
                            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-medium mt-3">
                              <Calendar className="w-3.5 h-3.5 shrink-0" />
                              <span>
                                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                              <span>•</span>
                              <BookOpen className="w-3.5 h-3.5 shrink-0" />
                              <span>{getReadingTime(blog.content)} min read</span>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  {/* TanStack Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-1.5 mt-10">
                      {getPaginationItems(currentPage, totalPages).map((item, index) => {
                        if (item === "...") {
                          return (
                            <span key={`dots-${index}`} className="px-3.5 py-2 text-zinc-400 font-medium">
                              ...
                            </span>
                          );
                        }

                        const isCurrent = item === currentPage;
                        return (
                          <button
                            key={`page-${item}`}
                            onClick={() => setCurrentPage(item as number)}
                            className={cn(
                              "px-3.5 py-2 rounded-lg border text-xs sm:text-sm font-bold transition-all cursor-pointer min-w-[38px] text-center",
                              isCurrent
                                ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/10"
                                : "bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-700 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-850"
                            )}
                          >
                            {item}
                          </button>
                        );
                      })}

                      {currentPage < totalPages && (
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          className="px-4 py-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-750 text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-850"
                        >
                          Next &gt;
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}

            </div>
          </div>

          {/* Right Column: Sidebar RightRail */}
          {/* <div className="w-full lg:w-[350px] shrink-0">
            <RightRail />
          </div> */}
        </div>
      </main>

      <Footer />
    </div>
  );
}
