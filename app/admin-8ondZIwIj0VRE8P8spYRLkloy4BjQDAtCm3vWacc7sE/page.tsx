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
  LogOut,
  Sparkles,
  Paperclip,
  Check,
  X,
  FileArchive,
  Image as ImageIcon,
  File as FileIcon,
  Video
} from "lucide-react";
import { getAdminBlogsAction, deleteBlogAction } from "../actions/blogs";
import { getAdminPromptsAction, createPromptAction, deletePromptAction } from "../actions/prompts";
import { getAdminFilesAction, createFileAction, deleteFileAction } from "../actions/files";
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

interface AiPrompt {
  id: string;
  title: string;
  image: string;
  prompt: string;
  createdAt: Date;
}

interface MaterialFile {
  id: string;
  title: string;
  fileUrl: string;
  fileSize: string;
  fileType: string;
  createdAt: Date;
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
  const [activeTab, setActiveTab] = useState<"blogs" | "prompts" | "files" | "media">("blogs");

  // Modal Dialog states
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);

  // Form states
  const [promptForm, setPromptForm] = useState({ title: "", image: "", prompt: "" });
  const [fileForm, setFileForm] = useState({ title: "", fileUrl: "", fileSize: "", fileType: "PDF" });

  // ----------------------------------------------------
  // 1. QUERY HOOKS
  // ----------------------------------------------------
  
  // Blogs
  const { data: blogsData, isLoading: loadingBlogs, error: blogsError } = useQuery({
    queryKey: ["admin-blogs"],
    queryFn: async () => {
      const res = await getAdminBlogsAction();
      if (!res.success) throw new Error(res.error || "Failed to load dashboard blogs.");
      return res.blogs || [];
    },
  });
  const blogs = (blogsData as Blog[]) || [];

  // AI Prompts
  const { data: promptsData, isLoading: loadingPrompts, error: promptsError } = useQuery({
    queryKey: ["admin-prompts"],
    queryFn: async () => {
      const res = await getAdminPromptsAction();
      if (!res.success) throw new Error(res.error || "Failed to load prompts.");
      return res.prompts || [];
    },
  });
  const prompts = (promptsData as AiPrompt[]) || [];

  // Files
  const { data: filesData, isLoading: loadingFiles, error: filesError } = useQuery({
    queryKey: ["admin-files"],
    queryFn: async () => {
      const res = await getAdminFilesAction();
      if (!res.success) throw new Error(res.error || "Failed to load files.");
      return res.files || [];
    },
  });
  const files = (filesData as MaterialFile[]) || [];

  // Compute Blog Stats dynamically
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

  // ----------------------------------------------------
  // 2. MUTATION HOOKS (using TanStack useMutation)
  // ----------------------------------------------------

  // Delete Blog
  const deleteBlogMutation = useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
        throw new Error("Cancelled");
      }
      const res = await deleteBlogAction(id);
      if (!res.success) throw new Error(res.error || "Failed to delete article.");
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blogs-infinite"] });
    },
    onError: (err: any) => {
      if (err.message !== "Cancelled") alert(err.message);
    },
  });

  // Create Prompt
  const createPromptMutation = useMutation({
    mutationFn: async (data: typeof promptForm) => {
      const res = await createPromptAction(data);
      if (!res.success) throw new Error(res.error || "Failed to create prompt.");
      return res.prompt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-prompts"] });
      queryClient.invalidateQueries({ queryKey: ["prompts-infinite"] });
      setIsPromptModalOpen(false);
      setPromptForm({ title: "", image: "", prompt: "" });
    },
    onError: (err: any) => {
      alert(err.message);
    },
  });

  // Delete Prompt
  const deletePromptMutation = useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      if (!window.confirm(`Are you sure you want to delete prompt "${title}"?`)) {
        throw new Error("Cancelled");
      }
      const res = await deletePromptAction(id);
      if (!res.success) throw new Error(res.error || "Failed to delete prompt.");
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-prompts"] });
      queryClient.invalidateQueries({ queryKey: ["prompts-infinite"] });
    },
    onError: (err: any) => {
      if (err.message !== "Cancelled") alert(err.message);
    },
  });

  // Create File
  const createFileMutation = useMutation({
    mutationFn: async (data: typeof fileForm) => {
      const res = await createFileAction(data);
      if (!res.success) throw new Error(res.error || "Failed to create file.");
      return res.file;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-files"] });
      queryClient.invalidateQueries({ queryKey: ["files-infinite"] });
      setIsFileModalOpen(false);
      setFileForm({ title: "", fileUrl: "", fileSize: "", fileType: "PDF" });
    },
    onError: (err: any) => {
      alert(err.message);
    },
  });

  // Delete File
  const deleteFileMutation = useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      if (!window.confirm(`Are you sure you want to delete file "${title}"?`)) {
        throw new Error("Cancelled");
      }
      const res = await deleteFileAction(id);
      if (!res.success) throw new Error(res.error || "Failed to delete file.");
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-files"] });
      queryClient.invalidateQueries({ queryKey: ["files-infinite"] });
    },
    onError: (err: any) => {
      if (err.message !== "Cancelled") alert(err.message);
    },
  });

  const getFileIcon = (type: string) => {
    const norm = type.toUpperCase();
    if (norm === "PDF") return <FileText className="w-4 h-4 text-red-500" />;
    if (norm === "ZIP" || norm === "RAR") return <FileArchive className="w-4 h-4 text-amber-500" />;
    if (norm === "PNG" || norm === "JPG" || norm === "JPEG") return <ImageIcon className="w-4 h-4 text-emerald-500" />;
    return <FileIcon className="w-4 h-4 text-blue-500" />;
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Header Navigation */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-660 dark:text-zinc-400"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-500/10 text-blue-500 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
                NewsRoom Admin
              </h1>
              <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Content Control panel</p>
            </div>
          </div>
        </div>

        {/* Tab Buttons Row */}
        <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("blogs")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "blogs"
                ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Blogs
          </button>
          <button
            onClick={() => setActiveTab("prompts")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "prompts"
                ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Prompts
          </button>
          <button
            onClick={() => setActiveTab("files")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "files"
                ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            <Paperclip className="w-3.5 h-3.5" />
            Files & Materials
          </button>
          <button
            onClick={() => setActiveTab("media")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "media"
                ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Media Uploader
          </button>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === "blogs" && (
            <Link
              href="/admin-8ondZIwIj0VRE8P8spYRLkloy4BjQDAtCm3vWacc7sE/richeditor"
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Create Blog Post
            </Link>
          )}

          {activeTab === "prompts" && (
            <button
              onClick={() => setIsPromptModalOpen(true)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add AI Prompt
            </button>
          )}

          {activeTab === "files" && (
            <button
              onClick={() => setIsFileModalOpen(true)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add Study File
            </button>
          )}

          <button
            onClick={async () => {
              await logoutAction();
              window.location.href = "/admin-8ondZIwIj0VRE8P8spYRLkloy4BjQDAtCm3vWacc7sE/login";
            }}
            className="px-3 py-1.5 border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-xs font-semibold text-red-650 dark:text-red-400 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content Frame */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto p-4 lg:p-8 flex flex-col gap-6">

        {/* ----------------------------------------------------
            TAB 1: BLOGS MANAGER VIEW
            ---------------------------------------------------- */}
        {activeTab === "blogs" && (
          <>
            {/* STATS OVERVIEW CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                <div className="p-3.5 bg-blue-500/10 text-blue-500 rounded-xl">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-zinc-455 font-semibold uppercase tracking-wider block">Total Articles</span>
                  <span className="text-2xl font-black text-zinc-900 dark:text-white mt-0.5 block">{stats.totalBlogs}</span>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                <div className="p-3.5 bg-amber-500/10 text-amber-500 rounded-xl">
                  <LayoutDashboard className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-zinc-455 font-semibold uppercase tracking-wider block">Words Written</span>
                  <span className="text-2xl font-black text-zinc-900 dark:text-white mt-0.5 block">{stats.totalWords.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                <div className="p-3.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-zinc-455 font-semibold uppercase tracking-wider block">Audience Read Time</span>
                  <span className="text-2xl font-black text-zinc-900 dark:text-white mt-0.5 block">{stats.totalReadTime} mins</span>
                </div>
              </div>
            </div>

            {/* Blogs Table Card */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <h2 className="text-sm font-bold text-zinc-850 dark:text-white uppercase tracking-wider">
                  Manage Articles List
                </h2>
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full">
                  {blogs.length} posts
                </span>
              </div>

              {loadingBlogs ? (
                <div className="py-24 text-center flex flex-col items-center justify-center gap-3 text-zinc-450">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  <span className="text-sm font-medium">Loading database records...</span>
                </div>
              ) : blogsError ? (
                <div className="py-20 text-center px-4">
                  <span className="text-sm font-medium text-red-500 border border-red-500/20 bg-red-500/5 p-4 rounded-xl inline-block max-w-md">
                    {(blogsError as Error).message}
                  </span>
                </div>
              ) : blogs.length === 0 ? (
                <div className="py-24 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 grid place-items-center text-zinc-400 mb-4">
                    <Inbox className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-1">No articles found</h3>
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
                                onClick={() => deleteBlogMutation.mutate({ id: blog.id, title: blog.title })}
                                disabled={deleteBlogMutation.isPending && deleteBlogMutation.variables?.id === blog.id}
                                className="p-2 border border-zinc-200 dark:border-zinc-800 hover:bg-red-500/10 hover:border-red-500/20 text-zinc-500 hover:text-red-500 rounded-lg transition-colors disabled:opacity-50"
                                title="Delete article"
                              >
                                {deleteBlogMutation.isPending && deleteBlogMutation.variables?.id === blog.id ? (
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
          </>
        )}

        {/* ----------------------------------------------------
            TAB 2: AI PROMPTS MANAGER VIEW
            ---------------------------------------------------- */}
        {activeTab === "prompts" && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden animate-fade-in">
            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <h2 className="text-sm font-bold text-zinc-850 dark:text-white uppercase tracking-wider">
                Manage AI Prompts
              </h2>
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full">
                {prompts.length} templates
              </span>
            </div>

            {loadingPrompts ? (
              <div className="py-24 text-center flex flex-col items-center justify-center gap-3 text-zinc-450">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <span className="text-sm font-medium">Loading prompts from database...</span>
              </div>
            ) : promptsError ? (
              <div className="py-20 text-center px-4">
                <span className="text-sm font-medium text-red-500 border border-red-500/20 bg-red-500/5 p-4 rounded-xl inline-block max-w-md">
                  {(promptsError as Error).message}
                </span>
              </div>
            ) : prompts.length === 0 ? (
              <div className="py-24 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 grid place-items-center text-zinc-400 mb-4">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-1">No AI prompts registered</h3>
                <button
                  onClick={() => setIsPromptModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 mt-2"
                >
                  <Plus className="w-4 h-4" />
                  Add First Prompt
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-zinc-700 dark:text-zinc-350 text-xs">
                  <thead>
                    <tr className="bg-zinc-50 dark:bg-zinc-950/40 text-zinc-400 uppercase font-bold text-[10px] tracking-wider border-b border-zinc-200 dark:border-zinc-800">
                      <th className="px-6 py-3.5">Image & Title</th>
                      <th className="px-6 py-3.5">Prompt Template</th>
                      <th className="px-6 py-3.5">Created Date</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
                    {prompts.map((prompt) => (
                      <tr key={prompt.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors">
                        <td className="px-6 py-4 min-w-[200px]">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-850 shrink-0 border border-zinc-200 dark:border-zinc-800 relative">
                              <img
                                src={prompt.image}
                                alt={prompt.title}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <span className="font-bold text-zinc-900 dark:text-white text-sm line-clamp-2">
                              {prompt.title}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 max-w-[400px]">
                          <span className="line-clamp-2 font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed font-mono">
                            {prompt.prompt}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-zinc-550 dark:text-zinc-400 min-w-[120px]">
                          <div className="flex items-center gap-1.5 font-mono text-[10px]">
                            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                            <span>
                              {new Date(prompt.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric"
                              })}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-right min-w-[100px]">
                          <button
                            onClick={() => deletePromptMutation.mutate({ id: prompt.id, title: prompt.title })}
                            disabled={deletePromptMutation.isPending && deletePromptMutation.variables?.id === prompt.id}
                            className="p-2 border border-zinc-200 dark:border-zinc-800 hover:bg-red-500/10 hover:border-red-500/20 text-zinc-500 hover:text-red-500 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete Prompt"
                          >
                            {deletePromptMutation.isPending && deletePromptMutation.variables?.id === prompt.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ----------------------------------------------------
            TAB 3: FILES MANAGER VIEW
            ---------------------------------------------------- */}
        {activeTab === "files" && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden animate-fade-in">
            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <h2 className="text-sm font-bold text-zinc-850 dark:text-white uppercase tracking-wider">
                Manage Material Files
              </h2>
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full">
                {files.length} documents
              </span>
            </div>

            {loadingFiles ? (
              <div className="py-24 text-center flex flex-col items-center justify-center gap-3 text-zinc-450">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <span className="text-sm font-medium">Loading document lists...</span>
              </div>
            ) : filesError ? (
              <div className="py-20 text-center px-4">
                <span className="text-sm font-medium text-red-500 border border-red-500/20 bg-red-500/5 p-4 rounded-xl inline-block max-w-md">
                  {(filesError as Error).message}
                </span>
              </div>
            ) : files.length === 0 ? (
              <div className="py-24 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 grid place-items-center text-zinc-400 mb-4">
                  <Paperclip className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-1">No files listed</h3>
                <button
                  onClick={() => setIsFileModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 mt-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Study Material
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-zinc-700 dark:text-zinc-350 text-xs">
                  <thead>
                    <tr className="bg-zinc-50 dark:bg-zinc-950/40 text-zinc-400 uppercase font-bold text-[10px] tracking-wider border-b border-zinc-200 dark:border-zinc-800">
                      <th className="px-6 py-3.5">Document details</th>
                      <th className="px-6 py-3.5">Size / Format</th>
                      <th className="px-6 py-3.5">Added Date</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
                    {files.map((file) => (
                      <tr key={file.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors">
                        <td className="px-6 py-4 min-w-[240px]">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-gray-50 dark:bg-zinc-950 border border-gray-150 dark:border-zinc-850 shrink-0 flex items-center justify-center">
                              {getFileIcon(file.fileType)}
                            </div>
                            <div>
                              <span className="font-bold text-zinc-900 dark:text-white text-sm line-clamp-1">
                                {file.title}
                              </span>
                              <a
                                href={file.fileUrl}
                                target="_blank"
                                rel="noopener"
                                className="text-[10px] text-blue-600 hover:underline inline-flex items-center gap-0.5 mt-0.5"
                              >
                                View File URL <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">
                          <div className="flex items-center gap-1.5">
                            <span className="uppercase text-[9px] font-extrabold tracking-wider bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded-md">
                              {file.fileType}
                            </span>
                            <span className="font-semibold text-xs font-sans">{file.fileSize}</span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-zinc-550 dark:text-zinc-400 min-w-[125px]">
                          <div className="flex items-center gap-1.5 font-mono text-[10px]">
                            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                            <span>
                              {new Date(file.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric"
                              })}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-right min-w-[100px]">
                          <button
                            onClick={() => deleteFileMutation.mutate({ id: file.id, title: file.title })}
                            disabled={deleteFileMutation.isPending && deleteFileMutation.variables?.id === file.id}
                            className="p-2 border border-zinc-200 dark:border-zinc-800 hover:bg-red-500/10 hover:border-red-500/20 text-zinc-500 hover:text-red-500 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete File"
                          >
                            {deleteFileMutation.isPending && deleteFileMutation.variables?.id === file.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ----------------------------------------------------
            TAB 4: MEDIA MANAGER (UPLOADER)
            ---------------------------------------------------- */}
        {activeTab === "media" && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden p-6 space-y-6 animate-fade-in">
            <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <h2 className="text-sm font-bold text-zinc-850 dark:text-white uppercase tracking-wider">
                CDN Media Uploader
              </h2>
              <p className="text-xs text-zinc-500 mt-1 font-semibold">
                Upload image or video files to your Cloudflare R2 / S3 Storage and instantly copy their CDN URLs.
              </p>
            </div>

            <MediaUploadForm />
          </div>
        )}

      </main>

      {/* ----------------------------------------------------
          MODAL: ADD NEW PROMPT
          ---------------------------------------------------- */}
      {isPromptModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsPromptModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl w-full max-w-md overflow-hidden animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="font-black text-zinc-900 dark:text-white text-base">Add AI Prompt template</h3>
              <button
                onClick={() => setIsPromptModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                createPromptMutation.mutate(promptForm);
              }}
              className="p-6 space-y-4"
            >
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1.5">Prompt Title</label>
                <input
                  type="text"
                  required
                  value={promptForm.title}
                  onChange={(e) => setPromptForm({ ...promptForm, title: e.target.value })}
                  placeholder="e.g. Cinematic Retro Cyberpunk Girl"
                  className="w-full px-3.5 py-2 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50/50 dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1.5">Image Preview URL</label>
                <input
                  type="url"
                  required
                  value={promptForm.image}
                  onChange={(e) => setPromptForm({ ...promptForm, image: e.target.value })}
                  placeholder="e.g. https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50/50 dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1.5">Prompt Instructions</label>
                <textarea
                  required
                  rows={4}
                  value={promptForm.prompt}
                  onChange={(e) => setPromptForm({ ...promptForm, prompt: e.target.value })}
                  placeholder="Paste the generative prompt instructions here..."
                  className="w-full px-3.5 py-2 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50/50 dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsPromptModalOpen(false)}
                  className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-850 rounded-xl text-xs font-bold text-gray-650 dark:text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createPromptMutation.isPending}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
                >
                  {createPromptMutation.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  Create Prompt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          MODAL: ADD NEW MATERIAL FILE
          ---------------------------------------------------- */}
      {isFileModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsFileModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl w-full max-w-md overflow-hidden animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="font-black text-zinc-900 dark:text-white text-base">Add Material Document</h3>
              <button
                onClick={() => setIsFileModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                createFileMutation.mutate(fileForm);
              }}
              className="p-6 space-y-4"
            >
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1.5">Document Title</label>
                <input
                  type="text"
                  required
                  value={fileForm.title}
                  onChange={(e) => setFileForm({ ...fileForm, title: e.target.value })}
                  placeholder="e.g. AP EAMCET 2023 Chemistry Syllabus"
                  className="w-full px-3.5 py-2 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50/50 dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1.5">Resource File URL</label>
                <input
                  type="url"
                  required
                  value={fileForm.fileUrl}
                  onChange={(e) => setFileForm({ ...fileForm, fileUrl: e.target.value })}
                  placeholder="e.g. https://domain.com/syllabus.pdf"
                  className="w-full px-3.5 py-2 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50/50 dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1.5">File Size</label>
                  <input
                    type="text"
                    required
                    value={fileForm.fileSize}
                    onChange={(e) => setFileForm({ ...fileForm, fileSize: e.target.value })}
                    placeholder="e.g. 1.8 MB"
                    className="w-full px-3.5 py-2 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50/50 dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1.5">File Type Format</label>
                  <select
                    value={fileForm.fileType}
                    onChange={(e) => setFileForm({ ...fileForm, fileType: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50/50 dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-zinc-300"
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="ZIP">ZIP Archive</option>
                    <option value="RAR">RAR Archive</option>
                    <option value="DOCX">DOCX Word Document</option>
                    <option value="PNG">PNG Image</option>
                    <option value="JPG">JPG Image</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsFileModalOpen(false)}
                  className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-850 rounded-xl text-xs font-bold text-gray-650 dark:text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createFileMutation.isPending}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
                >
                  {createFileMutation.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  Create File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const MediaUploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successUrl, setSuccessUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<{ url: string; name: string; date: string }[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("admin_uploaded_media");
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setSuccessUrl(null);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError(null);
    setSuccessUrl(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Upload failed");
      }

      setSuccessUrl(data.url);
      const newMedia = {
        url: data.url,
        name: file.name,
        date: new Date().toLocaleString(),
      };
      
      const updatedHistory = [newMedia, ...history].slice(0, 30); // Keep last 30 items
      setHistory(updatedHistory);
      localStorage.setItem("admin_uploaded_media", JSON.stringify(updatedHistory));
      setFile(null);
      
      // Clear file input manually
      const fileInput = document.getElementById("media-file-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

    } catch (err: any) {
      setError(err.message || "An error occurred during file upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("admin_uploaded_media");
  };

  return (
    <div className="space-y-6">
      {/* Upload Box */}
      <form onSubmit={handleUploadSubmit} className="max-w-xl space-y-4">
        <div>
          <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1.5 font-sans">
            Select File (Image / Video / Document)
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="media-file-input"
              type="file"
              onChange={handleFileChange}
              required
              className="flex-grow text-xs border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 bg-zinc-50/50 dark:bg-zinc-955 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-600/10 file:text-blue-600 hover:file:bg-blue-600/20 dark:file:bg-blue-600/20 dark:file:text-blue-400"
            />
            <button
              type="submit"
              disabled={uploading || !file}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed min-w-[130px]"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  Upload to CDN
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Error display */}
      {error && (
        <div className="max-w-xl p-4 bg-red-500/5 border border-red-500/10 rounded-2xl text-xs font-semibold text-red-500 font-sans">
          ⚠️ {error}
        </div>
      )}

      {/* Success details */}
      {successUrl && (
        <div className="max-w-xl p-5 border border-emerald-500/25 bg-emerald-500/5 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-450 font-bold text-xs">
            <Check className="w-4 h-4" />
            File uploaded successfully!
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={successUrl}
              className="flex-grow px-3.5 py-2 border border-zinc-250 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-950 text-xs font-mono select-all focus:outline-none"
            />
            <button
              onClick={() => handleCopy(successUrl)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1"
            >
              {copied ? "Copied!" : "Copy URL"}
            </button>
          </div>

          {/* Render small preview */}
          <div className="pt-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-2 font-sans">Live Preview</span>
            {successUrl.match(/\.(jpeg|jpg|gif|png|webp|svg)/i) ? (
              <div className="relative w-36 h-24 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950">
                <img src={successUrl} alt="Preview" className="object-cover w-full h-full" />
              </div>
            ) : successUrl.match(/\.(mp4|mkv|webm|mov|avi)/i) ? (
              <video src={successUrl} controls className="w-full max-w-sm rounded-lg border border-zinc-200 dark:border-zinc-800" />
            ) : (
              <span className="text-xs text-zinc-500 font-semibold font-sans">Uploaded asset has no live preview</span>
            )}
          </div>
        </div>
      )}

      {/* Upload History list */}
      <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider font-sans">
            Uploaded Media History
          </h3>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-[10px] uppercase font-black text-red-500 hover:underline"
            >
              Clear History
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-zinc-200 dark:border-zinc-850 rounded-2xl bg-zinc-50/20 dark:bg-zinc-900/10">
            <span className="text-xs text-zinc-450 font-semibold font-sans">No uploads in this session yet. Upload a file to populate this list.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {history.map((item, idx) => {
              const isImage = item.url.match(/\.(jpeg|jpg|gif|png|webp|svg)/i);
              const isVideo = item.url.match(/\.(mp4|mkv|webm|mov|avi)/i);
              return (
                <div key={idx} className="flex gap-4 p-4 border border-zinc-200 dark:border-zinc-850 bg-zinc-50/30 dark:bg-zinc-900/30 rounded-2xl items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-14 h-10 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 shrink-0 flex items-center justify-center">
                      {isImage ? (
                        <img src={item.url} alt="History preview" className="object-cover w-full h-full" />
                      ) : isVideo ? (
                        <Video className="w-5 h-5 text-purple-500" />
                      ) : (
                        <FileIcon className="w-5 h-5 text-zinc-500" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-xs text-zinc-900 dark:text-white truncate" title={item.name}>
                        {item.name}
                      </h4>
                      <span className="text-[9px] text-zinc-400 font-semibold block mt-0.5">{item.date}</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-blue-500 hover:bg-blue-500/5 rounded-lg transition-all"
                      title="View Live URL"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => handleCopy(item.url)}
                      className="p-2 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-emerald-500 hover:bg-emerald-500/5 rounded-lg transition-all"
                      title="Copy URL"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

