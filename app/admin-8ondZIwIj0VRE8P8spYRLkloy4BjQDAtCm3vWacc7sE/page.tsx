"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  FileText,
  Calendar,
  Clock,
  Shield,
  Loader2,
  Inbox,
  ArrowLeft,
  LogOut
} from "lucide-react";
import { getAdminBlogsAction, deleteBlogAction } from "../actions/blogs";
import { logoutAction } from "../actions/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Tag {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
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

const AdminBlogImage = ({ src, alt }: { src: string | null; alt: string }) => {
  const [imgSrc, setImgSrc] = useState(src || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=120&q=80");
  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={56}
      height={40}
      className="object-cover w-full h-full"
      onError={() => setImgSrc("https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=120&q=80")}
    />
  );
};

export default function AdminDashboardPage() {
  const queryClient = useQueryClient();

  // Load blogs with useQuery
  const { data: blogsData, isLoading: loading, error: blogsError } = useQuery({
    queryKey: ["admin-blogs"],
    queryFn: async () => {
      const res = await getAdminBlogsAction();
      if (!res.success) throw new Error(res.error || "Failed to load dashboard blogs.");
      return res.blogs || [];
    },
  });

  const blogs = (blogsData as Blog[]) || [];
  const error = blogsError instanceof Error ? blogsError.message : null;

  // Compute stats dynamically
  const stats = useMemo(() => {
    let words = 0;
    blogs.forEach(blog => {
      const cleanText = blog.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
      words += cleanText ? cleanText.split(" ").length : 0;
    });

    const readTime = Math.max(blogs.length, Math.ceil(words / 200));

    return {
      totalBlogs: blogs.length,
      totalWords: words,
      totalReadTime: readTime
    };
  }, [blogs]);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
        throw new Error("Cancelled");
      }
      const res = await deleteBlogAction(id);
      if (!res.success) throw new Error(res.error || "Failed to delete article.");
      return id;
    },
    onSuccess: () => {
      // Invalidate all query caches so front-end components automatically reload latest data
      queryClient.invalidateQueries();
    },
    onError: (err: any) => {
      if (err.message !== "Cancelled") {
        alert(err.message || "An error occurred while deleting the article.");
      }
    },
  });

  const handleDelete = (id: string, title: string) => {
    deleteMutation.mutate({ id, title });
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">

      {/* Top Header Navigation */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-45 px-4 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-600 dark:text-zinc-400"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-500/10 text-blue-500 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-1.5">
                NewsRoom Admin
              </h1>
              <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Content Management Control</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/blogs"
            className="px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg text-xs font-semibold text-zinc-750 dark:text-zinc-300 transition-colors"
          >
            View Blogs List
          </Link>
          <Link
            href="/admin-8ondZIwIj0VRE8P8spYRLkloy4BjQDAtCm3vWacc7sE/richeditor"
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-blue-500/15 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Create Blog Post
          </Link>
          <button
            onClick={async () => {
              await logoutAction();
              window.location.href = "/admin-8ondZIwIj0VRE8P8spYRLkloy4BjQDAtCm3vWacc7sE/login";
            }}
            className="px-3 py-1.5 border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 transition-colors flex items-center gap-1.5"
            title="Logout from Admin Panel"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto p-4 lg:p-8 flex flex-col gap-6">

        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-500 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">Total Articles</span>
              <span className="text-2xl font-black text-zinc-900 dark:text-white mt-0.5 block">{stats.totalBlogs}</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3.5 bg-amber-500/10 text-amber-500 rounded-xl">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">Total Words Written</span>
              <span className="text-2xl font-black text-zinc-900 dark:text-white mt-0.5 block">{stats.totalWords.toLocaleString()}</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">Est. Audience Read Time</span>
              <span className="text-2xl font-black text-zinc-900 dark:text-white mt-0.5 block">{stats.totalReadTime} mins</span>
            </div>
          </div>
        </div>

        {/* ARTICLES MANAGE PANEL */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-850 dark:text-white uppercase tracking-wider">
              Manage Articles List
            </h2>
            <span className="text-xs font-semibold text-zinc-450 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full">
              {blogs.length} posts
            </span>
          </div>

          {loading ? (
            <div className="py-24 text-center flex flex-col items-center justify-center gap-3 text-zinc-450">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <span className="text-sm font-medium">Loading database records...</span>
            </div>
          ) : error ? (
            <div className="py-20 text-center px-4">
              <span className="text-sm font-medium text-red-500 border border-red-500/20 bg-red-500/5 p-4 rounded-xl inline-block max-w-md">
                {error}
              </span>
            </div>
          ) : blogs.length === 0 ? (
            <div className="py-24 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 grid place-items-center text-zinc-400 mb-4">
                <Inbox className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-1">No articles found</h3>
              <p className="text-xs text-zinc-550 max-w-sm mx-auto mb-6">
                You haven't written any news or tech blogs yet. Start creating your first post.
              </p>
              <Link
                href="/admin-8ondZIwIj0VRE8P8spYRLkloy4BjQDAtCm3vWacc7sE/richeditor"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Write Your First Blog
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-zinc-700 dark:text-zinc-350 text-xs">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-950/40 text-zinc-400 uppercase font-bold text-[10px] tracking-wider border-b border-zinc-200 dark:border-zinc-800">
                    <th className="px-6 py-3.5">Article Details</th>
                    <th className="px-6 py-3.5">Categories/Tags</th>
                    <th className="px-6 py-3.5">Publish Date</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
                  {blogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors">

                      {/* Image & Title */}
                      <td className="px-6 py-4 min-w-[280px]">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-10 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-850 shrink-0 border border-zinc-200 dark:border-zinc-800">
                            <AdminBlogImage src={blog.featuredImg} alt={blog.title} />
                          </div>
                          <div>
                            <div className="font-bold text-zinc-900 dark:text-white line-clamp-1 text-sm">
                              {blog.title}
                            </div>
                            <div className="text-[10px] text-zinc-400 font-mono mt-0.5 line-clamp-1">
                              ID: {blog.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Associated Tags */}
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-[250px]">
                          {blog.tags.length === 0 ? (
                            <span className="text-zinc-400 italic">None</span>
                          ) : (
                            blog.tags.map(({ tag }) => (
                              <span
                                key={tag.id}
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${tag.parentId
                                  ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-550 dark:text-zinc-400"
                                  : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                  }`}
                              >
                                {tag.name}
                              </span>
                            ))
                          )}
                        </div>
                      </td>

                      {/* Publish Date */}
                      <td className="px-6 py-4 text-zinc-550 dark:text-zinc-400 min-w-[120px]">
                        <div className="flex items-center gap-1.5 font-mono text-[10px]">
                          <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                          <span>
                            {new Date(blog.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            })}
                          </span>
                        </div>
                      </td>

                      {/* Management Actions */}
                      <td className="px-6 py-4 text-right min-w-[160px]">
                        <div className="flex items-center justify-end gap-1.5">
                          {(() => {
                            const categorySlug = blog.tags.find(({ tag }) => !tag.parentId)?.tag.slug || "uncategorized";
                            return (
                              <Link
                                href={`/${categorySlug}/${blog.slug}`}
                                target="_blank"
                                className="p-2 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-850 rounded-lg text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors inline-block"
                                title="View published article"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                            );
                          })()}

                          <Link
                            href={`/admin-8ondZIwIj0VRE8P8spYRLkloy4BjQDAtCm3vWacc7sE/richeditor?edit=${blog.id}`}
                            className="p-2 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-850 rounded-lg text-zinc-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors inline-block"
                            title="Edit article"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => handleDelete(blog.id, blog.title)}
                            disabled={deleteMutation.isPending && deleteMutation.variables?.id === blog.id}
                            className="p-2 border border-zinc-200 dark:border-zinc-800 hover:bg-red-500/10 hover:border-red-500/20 text-zinc-500 hover:text-red-500 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete article"
                          >
                            {deleteMutation.isPending && deleteMutation.variables?.id === blog.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
