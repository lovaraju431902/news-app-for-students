"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bookmark, Calendar, Trash2, ArrowRight, BookOpen, Search } from "lucide-react";
import { toggleBlogBookmarkAction } from "@/app/actions/engagement";

interface SavedBlogItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImg: string | null;
  createdAt: string;
  savedAt: string;
  tags: {
    tag: {
      id: string;
      name: string;
      slug: string;
    };
  }[];
}

export function SavedBlogsView({ initialBlogs }: { initialBlogs: SavedBlogItem[] }) {
  const [blogs, setBlogs] = useState<SavedBlogItem[]>(initialBlogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemove = async (blogId: string) => {
    setRemovingId(blogId);
    // Optimistic remove
    setBlogs((prev) => prev.filter((b) => b.id !== blogId));

    try {
      await toggleBlogBookmarkAction(blogId);
    } catch (err) {
      console.error("Failed to remove bookmark:", err);
    } finally {
      setRemovingId(null);
    }
  };

  const filteredBlogs = blogs.filter((b) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.title.toLowerCase().includes(q) ||
      (b.excerpt && b.excerpt.toLowerCase().includes(q)) ||
      b.tags.some((t) => t.tag.name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 dark:border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Bookmark className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                Saved Articles
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-0.5">
                {blogs.length} {blogs.length === 1 ? "article" : "articles"} in your reading list
              </p>
            </div>
          </div>
        </div>

        {/* Quick search inside saved articles */}
        {blogs.length > 0 && (
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Filter saved articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          </div>
        )}
      </div>

      {/* Grid of Saved Blogs */}
      {filteredBlogs.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border border-dashed border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-8">
          <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-400 mx-auto flex items-center justify-center mb-4">
            <Bookmark className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {searchQuery ? "No matching saved articles found" : "No saved articles yet"}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 max-w-md mx-auto mt-1 mb-6">
            {searchQuery
              ? "Try adjusting your search keywords to find what you're looking for."
              : "Whenever you find an interesting guide, update, or study material, click the bookmark icon to save it here."}
          </p>
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm"
          >
            <span>Explore Articles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => {
            const primaryTag = blog.tags[0]?.tag;
            const categorySlug = primaryTag?.slug || "general";
            const postHref = `/${categorySlug}/${blog.slug}`;

            return (
              <div
                key={blog.id}
                className="group relative flex flex-col rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200"
              >
                {/* Thumbnail */}
                <Link href={postHref} className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-zinc-800 block">
                  {blog.featuredImg ? (
                    <Image
                      src={blog.featuredImg}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-103 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-semibold">
                      Students Hub
                    </div>
                  )}

                  {/* Category badge */}
                  {primaryTag && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/75 text-white backdrop-blur-xs">
                      {primaryTag.name}
                    </span>
                  )}
                </Link>

                {/* Content */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 dark:text-zinc-500 mb-2 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(blog.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <Link href={postHref}>
                      <h2 className="text-base font-bold text-gray-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                        {blog.title}
                      </h2>
                    </Link>

                    {blog.excerpt && (
                      <p className="mt-2 text-xs text-gray-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                        {blog.excerpt}
                      </p>
                    )}
                  </div>

                  {/* Card Footer / Actions */}
                  <div className="mt-5 pt-3.5 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                    <Link
                      href={postHref}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <span>Read article</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleRemove(blog.id)}
                      disabled={removingId === blog.id}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
                      title="Remove from saved articles"
                      aria-label="Remove from saved articles"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
