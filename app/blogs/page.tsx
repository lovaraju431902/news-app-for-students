"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  Tag as TagIcon, 
  Filter, 
  ArrowRight, 
  Calendar, 
  BookOpen, 
  RotateCcw, 
  ChevronRight, 
  ChevronDown,
  Sparkles,
  Inbox,
  ArrowLeft
} from "lucide-react";
import { getTagsAction, searchBlogsAction } from "../actions/blogs";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

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

export default function BlogSearchPage() {
  // Tag filter state
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [expandedParentIds, setExpandedParentIds] = useState<string[]>([]);

  // React Query for loading tags
  const { data: tagsData, isLoading: loadingTags } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const res = await getTagsAction();
      if (!res.success) throw new Error(res.error || "Failed to fetch tags.");
      return res.tags || [];
    },
  });

  const parentTags = tagsData ? tagsData.filter(t => !t.parentId) : [];

  // React Query for fetching blogs (reactive on selectedTagIds)
  const { data: blogsData, isLoading: loadingBlogs, error: blogsError } = useQuery({
    queryKey: ["blogs", selectedTagIds],
    queryFn: async () => {
      const res = await searchBlogsAction(selectedTagIds);
      if (!res.success) throw new Error(res.error || "Failed to fetch blogs.");
      return res.blogs || [];
    },
  });

  const blogs = (blogsData as Blog[]) || [];

  // Initialize expanded parent tags by default when tags load
  useEffect(() => {
    if (tagsData) {
      const parentTagsList = tagsData.filter(t => !t.parentId);
      setExpandedParentIds(prev => {
        if (prev.length === 0) {
          return parentTagsList.map(p => p.id);
        }
        return prev;
      });
    }
  }, [tagsData]);

  // Toggle tag selection
  const handleToggleTag = (tagId: string, parentTag?: Tag) => {
    setSelectedTagIds(prev => {
      if (prev.includes(tagId)) {
        // If parent tag, we also want to deselect its subtags
        if (parentTag && parentTag.children) {
          const childIds = parentTag.children.map(c => c.id);
          return prev.filter(id => id !== tagId && !childIds.includes(id));
        }
        return prev.filter(id => id !== tagId);
      } else {
        // If parent tag, we also want to select all its subtags
        if (parentTag && parentTag.children) {
          const childIds = parentTag.children.map(c => c.id);
          const newSelection = [...prev, tagId];
          childIds.forEach(cid => {
            if (!newSelection.includes(cid)) {
              newSelection.push(cid);
            }
          });
          return newSelection;
        }
        return [...prev, tagId];
      }
    });
  };

  // Toggle subtag selection
  const handleToggleSubtag = (subtagId: string, parentId: string) => {
    setSelectedTagIds(prev => {
      let nextSelection: string[] = [];
      if (prev.includes(subtagId)) {
        nextSelection = prev.filter(id => id !== subtagId);
        // If we deselect a subtag, we should also check if the parent tag is selected, and if so deselect the parent tag too (since not all children are selected anymore)
        nextSelection = nextSelection.filter(id => id !== parentId);
      } else {
        nextSelection = [...prev, subtagId];
        // If all subtags of this parent are now selected, we can select the parent tag too
        const parent = parentTags.find(t => t.id === parentId);
        if (parent && parent.children) {
          const allChildrenSelected = parent.children.every(child => nextSelection.includes(child.id));
          if (allChildrenSelected && !nextSelection.includes(parentId)) {
            nextSelection.push(parentId);
          }
        }
      }
      return nextSelection;
    });
  };

  // Toggle accordion parent tags
  const toggleParentExpand = (parentId: string) => {
    setExpandedParentIds(prev => 
      prev.includes(parentId) 
        ? prev.filter(id => id !== parentId) 
        : [...prev, parentId]
    );
  };

  // Clear filters
  const handleClearFilters = () => {
    setSelectedTagIds([]);
  };

  const getReadingTime = (content: string) => {
    const cleanText = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    const words = cleanText ? cleanText.split(" ").length : 0;
    return Math.max(1, Math.ceil(words / 200));
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-250">
      
      {/* Navigation Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-650 dark:text-zinc-400"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
              Blog Explorer
            </h1>
            <p className="text-xs text-zinc-500">Search news & tech articles by tag hierarchies</p>
          </div>
        </div>

        <Link
          href="/admin/richeditor"
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-750 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-blue-500/10 flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Admin Composer
        </Link>
      </header>

      {/* Main Layout */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* SIDEBAR FILTERS */}
        <aside className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm sticky top-24">
            
            {/* Header info */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800 mb-4">
              <div className="flex items-center gap-2 font-bold text-sm tracking-wide text-zinc-700 dark:text-zinc-350">
                <Filter className="w-4 h-4 text-blue-500" />
                FILTERS
              </div>
              {selectedTagIds.length > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs font-semibold text-red-500 hover:text-red-650 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>

            {/* Filter tags list */}
            {loadingTags ? (
              <div className="space-y-3 py-4">
                <div className="h-6 bg-zinc-150 dark:bg-zinc-800 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse w-1/2 ml-4"></div>
                <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse w-2/3 ml-4"></div>
                <div className="h-6 bg-zinc-150 dark:bg-zinc-800 rounded animate-pulse w-5/6 mt-6"></div>
              </div>
            ) : parentTags.length === 0 ? (
              <div className="py-6 text-center text-xs text-zinc-500">
                No tags found in the database. Use the admin composer to create tags.
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Tags & Subtags Hierarchy
                </h3>
                
                <div className="space-y-2.5">
                  {parentTags.map((parent) => {
                    const isExpanded = expandedParentIds.includes(parent.id);
                    const isParentSelected = selectedTagIds.includes(parent.id);
                    const hasChildren = parent.children && parent.children.length > 0;

                    // Count how many children are selected
                    const selectedChildrenCount = parent.children
                      ? parent.children.filter(c => selectedTagIds.includes(c.id)).length
                      : 0;

                    return (
                      <div key={parent.id} className="border border-zinc-100 dark:border-zinc-800/60 rounded-xl overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/40">
                        {/* Parent Row */}
                        <div className="flex items-center justify-between p-3 hover:bg-zinc-100/55 dark:hover:bg-zinc-800/40 transition-colors">
                          <label className="flex items-center gap-2.5 cursor-pointer flex-1 select-none">
                            <input
                              type="checkbox"
                              checked={isParentSelected}
                              onChange={() => handleToggleTag(parent.id, parent)}
                              className="rounded border-zinc-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-500 w-4 h-4"
                            />
                            <span className={cn(
                              "text-xs font-bold transition-colors",
                              isParentSelected ? "text-blue-600 dark:text-blue-400" : "text-zinc-750 dark:text-zinc-200"
                            )}>
                              {parent.name}
                            </span>
                            {selectedChildrenCount > 0 && !isParentSelected && (
                              <span className="bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-450 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                {selectedChildrenCount}
                              </span>
                            )}
                          </label>

                          {hasChildren && (
                            <button
                              onClick={() => toggleParentExpand(parent.id)}
                              className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded text-zinc-500 transition-colors"
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                        </div>

                        {/* Children List */}
                        {hasChildren && isExpanded && (
                          <div className="px-3.5 pb-3 pt-1 border-t border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-950/20 pl-7 space-y-2">
                            {parent.children!.map((child) => {
                              const isChildSelected = selectedTagIds.includes(child.id);
                              return (
                                <label key={child.id} className="flex items-center gap-2 cursor-pointer select-none py-0.5">
                                  <input
                                    type="checkbox"
                                    checked={isChildSelected}
                                    onChange={() => handleToggleSubtag(child.id, parent.id)}
                                    className="rounded border-zinc-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                                  />
                                  <span className={cn(
                                    "text-xs transition-colors",
                                    isChildSelected ? "text-blue-500 dark:text-blue-400 font-semibold" : "text-zinc-650 dark:text-zinc-400 hover:text-zinc-800"
                                  )}>
                                    {child.name}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* BLOGS CONTENT */}
        <section className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Search overview bar */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-6 py-4 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                <Search className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-zinc-950 dark:text-white">
                  {blogs.length === 0 ? "No Blogs Found" : `${blogs.length} Published Articles`}
                </h2>
                <p className="text-xs text-zinc-500">
                  {selectedTagIds.length > 0 
                    ? `Filtered by ${selectedTagIds.length} active tags & subtags`
                    : "Showing all published content"}
                </p>
              </div>
            </div>

            {selectedTagIds.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-zinc-400 font-medium">Filters:</span>
                {selectedTagIds.map(id => {
                  // Find tag name
                  let tagObj: any = parentTags.find(t => t.id === id);
                  if (!tagObj) {
                    // Search in children
                    for (const p of parentTags) {
                      const child = p.children?.find(c => c.id === id);
                      if (child) {
                        tagObj = child;
                        break;
                      }
                    }
                  }
                  if (!tagObj) return null;
                  
                  return (
                    <span 
                      key={id}
                      onClick={() => {
                        // Deselect tag
                        if (tagObj!.parentId) {
                          handleToggleSubtag(id, tagObj!.parentId);
                        } else {
                          handleToggleTag(id, tagObj!);
                        }
                      }}
                      className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-500 hover:bg-blue-550/15 cursor-pointer text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors"
                    >
                      {tagObj.name}
                      <span className="text-[8px] opacity-70">✕</span>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Blogs Grid */}
          {loadingBlogs ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden h-[380px] animate-pulse">
                  <div className="h-48 bg-zinc-100 dark:bg-zinc-800"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-zinc-150 dark:bg-zinc-800 rounded w-1/3"></div>
                    <div className="h-6 bg-zinc-150 dark:bg-zinc-800 rounded w-5/6"></div>
                    <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-full"></div>
                    <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-2/3"></div>
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
                No matching articles
              </h3>
              <p className="text-sm text-zinc-500 max-w-sm mx-auto mb-6">
                Try selecting different tags or reset filters to explore our full library of news.
              </p>
              {selectedTagIds.length > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  Clear Filters & Show All
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogs.map((blog) => {
                const categorySlug = blog.tags.find(({ tag }) => !tag.parentId)?.tag.slug || "uncategorized";
                return (
                  <article 
                    key={blog.id} 
                    className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 flex flex-col h-full"
                  >
                    {/* Image wrapper */}
                    <div className="relative aspect-video w-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                      <img 
                        src={blog.featuredImg || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80"} 
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as any).src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80";
                        }}
                      />
                      
                      {/* Floating main tag */}
                      {blog.tags.length > 0 && (
                        <span className="absolute top-4 left-4 bg-zinc-950/80 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                          {blog.tags[0].tag.name}
                        </span>
                      )}
                    </div>

                    {/* Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Meta */}
                        <div className="flex items-center gap-3 text-[10px] text-zinc-400 font-mono mb-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(blog.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {getReadingTime(blog.content)} min read
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-extrabold text-zinc-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors mb-2">
                          <Link href={`/${categorySlug}/${blog.slug}`}>
                            {blog.title}
                          </Link>
                        </h3>

                        {/* Excerpt */}
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                          {blog.excerpt || blog.content.replace(/<[^>]*>/g, " ").substring(0, 120) + "..."}
                        </p>
                      </div>

                      {/* Footer - Tags and Link */}
                      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/60 mt-auto flex items-center justify-between gap-4">
                        {/* Tags list */}
                        <div className="flex flex-wrap gap-1 max-w-[65%]">
                          {blog.tags.slice(0, 3).map(({ tag }) => (
                            <span 
                              key={tag.id}
                              className={cn(
                                "text-[9px] font-bold px-1.5 py-0.5 rounded-full",
                                tag.parentId 
                                  ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                                  : "bg-blue-500/5 text-blue-500"
                              )}
                            >
                              {tag.name}
                            </span>
                          ))}
                          {blog.tags.length > 3 && (
                            <span className="text-[9px] text-zinc-400 font-bold px-1 py-0.5">
                              +{blog.tags.length - 3}
                            </span>
                          )}
                        </div>

                        <Link 
                          href={`/${categorySlug}/${blog.slug}`}
                          className="text-xs font-bold text-blue-600 hover:text-blue-750 flex items-center gap-1 shrink-0 group-hover:translate-x-0.5 transition-transform"
                        >
                          Read Post
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

        </section>
      </main>
    </div>
  );
}
