"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  SlidersHorizontal,
  LayoutGrid,
  Layers,
  Sparkles,
  Newspaper,
  Cpu,
  TrendingUp,
  Film,
  Eye,

  Plus,
  Search,
  Trash2,
  MoveUp,
  MoveDown,
  ExternalLink,
  Edit,
  Check,
  Loader2,
  AlertCircle,
  X,
  Star,
  Settings2,
} from "lucide-react";
import {
  getHomepageSectionItemsAction,
  addPostToSectionAction,
  removePostFromSectionAction,
  reorderSectionItemsAction,
  searchBlogsForSectionAction,
} from "@/app/actions/homepage";
import { HOMEPAGE_SECTIONS } from "@/lib/homepage-sections";
import { formatBlogDate, extractBlogCategory, getCategoryBadge } from "@/lib/homepage-utils";

// Legacy manual forms kept for optional custom sponsor / ad links
import LatestNewsForm from "@/components/adminforms/latestnews";
import RightCardForm from "@/components/adminforms/rightcard";
import SlideForm from "@/components/adminforms/slide";
import TechnologyNewsForm from "@/components/adminforms/technologynews";
import TrendingnewsForm from "@/components/adminforms/trendingnow";

import VideoForm from "@/components/adminforms/videos";
import MostReadForm from "@/components/adminforms/mostread";


interface AssignedBlog {
  id: string;
  title: string;
  slug: string;
  featuredImg: string | null;
  createdAt: Date | string;
  tags?: { tag: { id: string; name: string; slug: string; parentId?: string | null } }[];
  homepageItems?: { section: string }[];
}

interface AssignedHomepageItem {
  id: string;
  blogId: string;
  section: string;
  order: number;
  priority: number;
  isActive: boolean;
  createdAt: Date | string;
  blog: AssignedBlog;
}

const SECTION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  slide_data: Layers,
  right_cards: LayoutGrid,
  latest_news: Newspaper,
  trending_news: TrendingUp,
  technology_news: Cpu,

  videos: Film,
  most_read: Eye,
};

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

export default function HomepageSectionsManager() {
  const queryClient = useQueryClient();
  const [activeSectionId, setActiveSectionId] = useState("slide_data");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFeedback, setActionFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // 1. Fetch posts currently assigned to the active homepage section
  const {
    data: sectionData,
    isLoading: isSectionLoading,
    error: sectionError,
  } = useQuery({
    queryKey: ["homepage-section-items", activeSectionId],
    queryFn: async () => {
      const res = await getHomepageSectionItemsAction(activeSectionId);
      if (!res.success) throw new Error(res.error || "Failed to load section items.");
      return (res.items || []) as unknown as AssignedHomepageItem[];
    },
  });

  // 2. Fetch candidate posts when the "Add to Section" search modal is open
  const {
    data: candidatePosts,
    isLoading: isSearchLoading,
  } = useQuery({
    queryKey: ["homepage-search-candidates", searchQuery],
    queryFn: async () => {
      const res = await searchBlogsForSectionAction(searchQuery);
      if (!res.success) throw new Error(res.error || "Failed to search blogs.");
      return (res.blogs || []) as unknown as AssignedBlog[];
    },
    enabled: showAddModal,
  });

  const assignedItems: AssignedHomepageItem[] = sectionData || [];

  // Mutation: Remove post from section
  const removeMutation = useMutation({
    mutationFn: async ({ blogId }: { blogId: string }) => {
      const res = await removePostFromSectionAction(blogId, activeSectionId);
      if (!res.success) throw new Error(res.error || "Failed to remove post.");
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homepage-section-items", activeSectionId] });
      queryClient.invalidateQueries({ queryKey: ["homepage-search-candidates"] });
      setActionFeedback({ type: "success", text: "Post removed from this section." });
      setTimeout(() => setActionFeedback(null), 3500);
    },
    onError: (err: unknown) => {
      setActionFeedback({ type: "error", text: getErrorMessage(err) });
    },
  });

  // Mutation: Add post to section
  const addMutation = useMutation({
    mutationFn: async ({ blogId, priority }: { blogId: string; priority?: number }) => {
      const res = await addPostToSectionAction(blogId, activeSectionId, priority);
      if (!res.success) throw new Error(res.error || "Failed to add post.");
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homepage-section-items", activeSectionId] });
      queryClient.invalidateQueries({ queryKey: ["homepage-search-candidates"] });
      setActionFeedback({ type: "success", text: "Post successfully assigned to this section!" });
      setTimeout(() => setActionFeedback(null), 3500);
    },
    onError: (err: unknown) => {
      setActionFeedback({ type: "error", text: getErrorMessage(err) });
    },
  });

  // Mutation: Reorder items
  const reorderMutation = useMutation({
    mutationFn: async (updates: { id: string; order: number; priority?: number }[]) => {
      const res = await reorderSectionItemsAction(updates);
      if (!res.success) throw new Error(res.error || "Failed to reorder items.");
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homepage-section-items", activeSectionId] });
      setActionFeedback({ type: "success", text: "Order and priority updated successfully." });
      setTimeout(() => setActionFeedback(null), 3000);
    },
    onError: (err: unknown) => {
      setActionFeedback({ type: "error", text: getErrorMessage(err) });
    },
  });

  // Handler: Move item up or down
  const handleMove = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === assignedItems.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const newItems = [...assignedItems];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(targetIndex, 0, moved);

    const updates = newItems.map((item, idx) => ({
      id: item.id,
      order: idx,
      priority: item.priority,
    }));

    reorderMutation.mutate(updates);
  };

  // Handler: Change item priority (0 = normal, 1 = high, 2 = top featured)
  const handlePriorityChange = (item: AssignedHomepageItem, newPriority: number) => {
    reorderMutation.mutate([
      {
        id: item.id,
        order: item.order,
        priority: newPriority,
      },
    ]);
  };

  const activeSectionDef = HOMEPAGE_SECTIONS.find((s) => s.id === activeSectionId);
  const ActiveIcon = SECTION_ICONS[activeSectionId] || SlidersHorizontal;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2.5">
            <SlidersHorizontal className="w-5 h-5 text-blue-600" />
            Dynamic Homepage Section Management
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Manage which published database articles appear on the homepage sections. Assign, reorder, prioritize, or search articles in real time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/richeditor"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Create New Post
          </Link>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionFeedback && (
        <div
          className={`p-3.5 rounded-xl text-xs font-medium border flex items-center justify-between transition-all ${actionFeedback.type === "success"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-red-50 text-red-700 border-red-200"
            }`}
        >
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{actionFeedback.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionFeedback(null)}
            className="text-xs font-bold hover:opacity-70 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Navigation Pills for 10 Sections */}
      <div className="flex flex-wrap gap-2 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-sm">
        {HOMEPAGE_SECTIONS.map((tab, idx) => {
          const Icon = SECTION_ICONS[tab.id] || Layers;
          const isActive = activeSectionId === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveSectionId(tab.id);
                setShowManualForm(false);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60"
                }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{idx + 1}. {tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-slate-100 gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 grid place-items-center shrink-0 border border-blue-100">
              <ActiveIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                {activeSectionDef?.label}
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/80">
                  {assignedItems.length} {assignedItems.length === 1 ? "article" : "articles"} assigned
                </span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {activeSectionDef?.description}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Assign Existing Post
            </button>

            <button
              type="button"
              onClick={() => setShowManualForm(!showManualForm)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 border text-xs font-bold rounded-xl transition-colors cursor-pointer ${showManualForm
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
            >
              <Settings2 className="w-3.5 h-3.5" />
              {showManualForm ? "Hide Custom Form" : "Custom Sponsor Card"}
            </button>
          </div>
        </div>

        {/* Dynamic Assigned Posts List */}
        {!showManualForm ? (
          <div>
            {isSectionLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="text-xs font-medium">Loading section articles...</span>
              </div>
            ) : sectionError ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Failed to load section articles: {getErrorMessage(sectionError)}</span>
              </div>
            ) : assignedItems.length === 0 ? (
              <div className="py-12 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-6 bg-slate-50/50">
                <ActiveIcon className="w-10 h-10 text-slate-300 mb-3" />
                <h5 className="text-sm font-bold text-slate-700">No articles assigned to {activeSectionDef?.label} yet</h5>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Click &quot;Assign Existing Post&quot; above or select &quot;{activeSectionDef?.label}&quot; in the Post Editor settings to feature articles here.
                </p>
                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Assign An Article Now
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {assignedItems.map((item: AssignedHomepageItem, index: number) => {
                  const blog = item.blog;
                  if (!blog) return null;
                  const { slug: catSlug, name: catName } = extractBlogCategory(blog);
                  const badge = getCategoryBadge(catSlug, catName);
                  const canonicalUrl = `/${catSlug}/${blog.slug}`;

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 rounded-2xl gap-3 transition-colors"
                    >
                      {/* Left: Thumbnail & Details */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Order badge */}
                        <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-600 text-[11px] font-bold grid place-items-center shrink-0">
                          {index + 1}
                        </div>

                        {/* Thumbnail */}
                        <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-200/80 shadow-xs">
                          {blog.featuredImg ? (
                            <Image
                              src={blog.featuredImg}
                              alt={blog.title}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[9px] text-slate-400">
                              No Image
                            </div>
                          )}
                        </div>

                        {/* Text info */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.colorClass}`}>
                              {badge.label}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {formatBlogDate(blog.createdAt)}
                            </span>
                            {item.priority > 0 && (
                              <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                {item.priority === 2 ? "Top Pinned" : "High Priority"}
                              </span>
                            )}
                          </div>
                          <h5 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                            {blog.title}
                          </h5>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                            <span className="truncate">URL: {canonicalUrl}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Controls & Actions */}
                      <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                        {/* Priority Selector */}
                        <select
                          value={item.priority}
                          onChange={(e) => handlePriorityChange(item, parseInt(e.target.value))}
                          className="text-[11px] font-semibold bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                        >
                          <option value="0">Normal</option>
                          <option value="1">High Priority</option>
                          <option value="2">Top Featured</option>
                        </select>

                        {/* Move Up / Down */}
                        <button
                          type="button"
                          onClick={() => handleMove(index, "up")}
                          disabled={index === 0 || reorderMutation.isPending}
                          title="Move Up"
                          className="p-1.5 bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-200 rounded-lg text-slate-600 transition-colors cursor-pointer"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleMove(index, "down")}
                          disabled={index === assignedItems.length - 1 || reorderMutation.isPending}
                          title="Move Down"
                          className="p-1.5 bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-200 rounded-lg text-slate-600 transition-colors cursor-pointer"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit Post */}
                        <Link
                          href={`/admin/richeditor?edit=${blog.id}`}
                          title="Edit Post"
                          className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-blue-600 transition-colors inline-block"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>

                        {/* View Live Article */}
                        <Link
                          href={canonicalUrl}
                          target="_blank"
                          title="View Live Article"
                          className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 transition-colors inline-block"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        {/* Remove from Section */}
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Remove "${blog.title}" from ${activeSectionDef?.label}? (The article will not be deleted)`)) {
                              removeMutation.mutate({ blogId: blog.id });
                            }
                          }}
                          disabled={removeMutation.isPending}
                          title="Remove from this section"
                          className="p-1.5 bg-white hover:bg-red-50 text-red-600 border border-slate-200 hover:border-red-200 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Fallback / Manual Custom Sponsor Card Form Container */
          <div>
            <div className="mb-5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
              <span className="font-bold">Manual Sponsor / Ad Entry:</span> Use this form only if you need to create an off-site ad card or sponsored link that does not originate from an article.
            </div>

            {activeSectionId === "slide_data" && <SlideForm />}
            {activeSectionId === "right_cards" && <RightCardForm />}
            {activeSectionId === "latest_news" && <LatestNewsForm />}
            {activeSectionId === "trending_news" && <TrendingnewsForm />}
            {activeSectionId === "technology_news" && <TechnologyNewsForm />}

            {activeSectionId === "videos" && <VideoForm />}
            {activeSectionId === "most_read" && <MostReadForm />}
          </div>
        )}
      </div>

      {/* MODAL: SEARCH & ASSIGN CANDIDATE POSTS */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div>
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-blue-600" />
                  Assign Post to {activeSectionDef?.label}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Search published articles by title or slug to feature in this section.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setSearchQuery("");
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Box */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search articles by title or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
            </div>

            {/* Candidate Results List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {isSearchLoading ? (
                <div className="py-8 flex flex-col items-center justify-center text-slate-400 gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                  <span className="text-xs">Searching articles...</span>
                </div>
              ) : !candidatePosts || candidatePosts.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No articles found matching &quot;{searchQuery}&quot;.
                </div>
              ) : (
                candidatePosts.map((blog: AssignedBlog) => {
                  const isAlreadyAssigned = blog.homepageItems?.some(
                    (hi: { section: string }) => hi.section === activeSectionId
                  );
                  const { slug: catSlug, name: catName } = extractBlogCategory(blog);
                  const badge = getCategoryBadge(catSlug, catName);

                  return (
                    <div
                      key={blog.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-200 bg-white hover:bg-blue-50/20 transition-all gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-12 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                          {blog.featuredImg ? (
                            <Image
                              src={blog.featuredImg}
                              alt={blog.title}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[8px] text-slate-400">
                              No Img
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${badge.colorClass}`}>
                              {badge.label}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {formatBlogDate(blog.createdAt)}
                            </span>
                          </div>
                          <h6 className="text-xs font-bold text-slate-900 truncate">
                            {blog.title}
                          </h6>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isAlreadyAssigned ? (
                          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl inline-flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            Assigned
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => addMutation.mutate({ blogId: blog.id })}
                            disabled={addMutation.isPending}
                            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1 disabled:opacity-50"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setSearchQuery("");
                }}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
