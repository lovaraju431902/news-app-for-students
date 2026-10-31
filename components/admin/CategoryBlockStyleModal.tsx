"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Check,
  Sparkles,
  Sliders,
  Layers,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Moon,
  Columns,
  Eye,
  Calendar,
  Image as ImageIcon,
  FileText,
  Palette,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateCategoryBlockStyleAction,
  UpdateCategoryBlockConfigInput,
} from "@/app/actions/categories";

export interface CategoryModalData {
  id: string;
  name: string;
  slug: string;
  showOnHomepage?: boolean;
  homepageBlockStyle?: string;
  homepageOrder?: number;
  homepagePostLimit?: number;
  homepageColumns?: number;
  showThumbnail?: boolean;
  showDate?: boolean;
  showExcerpt?: boolean;
  showViewAll?: boolean;
  customTitle?: string | null;
  accentColor?: string | null;
}

interface CategoryBlockStyleModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryModalData | null;
  onSuccess?: () => void;
}

const STYLE_OPTIONS = [
  {
    id: "style1",
    name: "Style 1: Featured + Compact List",
    description: "4 featured cards at top + compact thumbnail & title list below",
    bestFor: "News-heavy categories, Current Affairs, Breaking News",
    icon: List,
    // Visual mini wireframe
    renderWireframe: () => (
      <div className="space-y-1.5 p-2 bg-slate-50 dark:bg-zinc-900 rounded-lg border border-slate-200/80 dark:border-zinc-800">
        <div className="grid grid-cols-4 gap-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[16/10] bg-blue-500/25 rounded-xs" />
          ))}
        </div>
        <div className="space-y-1 pt-1 border-t border-slate-200/60 dark:border-zinc-800">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-1.5 items-center">
              <div className="w-4 h-3 bg-slate-300 dark:bg-zinc-700 rounded-xs shrink-0" />
              <div className="flex-1 space-y-0.5">
                <div className="h-1 bg-slate-300 dark:bg-zinc-700 rounded-xs w-5/6" />
                <div className="h-0.5 bg-slate-200 dark:bg-zinc-800 rounded-xs w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "style2",
    name: "Style 2: Featured Grid + Compact Rows",
    description: "3 featured cards across top + compact 2-column rows below",
    bestFor: "Govt Jobs, Scholarships, Internships, Exams",
    icon: LayoutGrid,
    renderWireframe: () => (
      <div className="space-y-1.5 p-2 bg-slate-50 dark:bg-zinc-900 rounded-lg border border-slate-200/80 dark:border-zinc-800">
        <div className="grid grid-cols-3 gap-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-[16/9] bg-emerald-500/25 rounded-xs" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-1 pt-1 border-t border-slate-200/60 dark:border-zinc-800">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-1 items-center">
              <div className="w-3.5 h-3 bg-slate-300 dark:bg-zinc-700 rounded-xs shrink-0" />
              <div className="h-1 bg-slate-300 dark:bg-zinc-700 rounded-xs w-3/4" />
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "style3",
    name: "Style 3: Two-Row Featured Grid",
    description: "3 posts per row, 2 rows (6 uniform large cards)",
    bestFor: "Part Time Income, Share Market, Visually Rich Content",
    icon: Columns,
    renderWireframe: () => (
      <div className="p-2 bg-slate-50 dark:bg-zinc-900 rounded-lg border border-slate-200/80 dark:border-zinc-800">
        <div className="grid grid-cols-3 gap-1.5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-1">
              <div className="aspect-[16/9] bg-teal-500/25 rounded-xs" />
              <div className="h-1 bg-slate-300 dark:bg-zinc-700 rounded-xs w-5/6" />
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "style4",
    name: "Style 4: Four-Column Thumbnail Grid",
    description: "4 uniform cards per row with 16:9 thumbnail and title",
    bestFor: "Technology, AI Tools, Apps & Websites, Standard News",
    icon: Layers,
    renderWireframe: () => (
      <div className="p-2 bg-slate-50 dark:bg-zinc-900 rounded-lg border border-slate-200/80 dark:border-zinc-800">
        <div className="grid grid-cols-4 gap-1.5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="space-y-1">
              <div className="aspect-[16/10] bg-purple-500/25 rounded-xs" />
              <div className="h-1 bg-slate-300 dark:bg-zinc-700 rounded-xs w-3/4" />
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "style5",
    name: "Style 5: Horizontal Slider",
    description: "Horizontally scrollable carousel with 4 cards & navigation arrows",
    bestFor: "YouTube Growth, Mobile Hacks, AI Prompts, Fast Browsing",
    icon: SlidersHorizontal,
    renderWireframe: () => (
      <div className="p-2 bg-slate-50 dark:bg-zinc-900 rounded-lg border border-slate-200/80 dark:border-zinc-800 relative">
        <div className="flex gap-1.5 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-1/4 shrink-0 space-y-1">
              <div className="aspect-[16/10] bg-cyan-500/25 rounded-xs" />
              <div className="h-1 bg-slate-300 dark:bg-zinc-700 rounded-xs w-4/5" />
            </div>
          ))}
        </div>
        <div className="absolute right-2 top-2 flex gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-zinc-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-zinc-700" />
        </div>
      </div>
    ),
  },
  {
    id: "style6",
    name: "Style 6: Dark Featured Category Block",
    description: "Modern dark background, premium contrast & featured cards",
    bestFor: "Startup Ideas, Marketing, Premium Spotlights",
    icon: Moon,
    renderWireframe: () => (
      <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800 text-white">
        <div className="h-1.5 w-16 bg-blue-500 rounded-xs mb-2" />
        <div className="grid grid-cols-3 gap-1.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-1 bg-zinc-900 p-1 rounded-xs border border-zinc-800">
              <div className="aspect-[16/9] bg-blue-400/20 rounded-xs" />
              <div className="h-1 bg-zinc-700 rounded-xs w-4/5" />
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

const ACCENT_COLORS = [
  { name: "Blue", value: "bg-blue-600" },
  { name: "Emerald", value: "bg-emerald-600" },
  { name: "Purple", value: "bg-purple-600" },
  { name: "Teal", value: "bg-teal-600" },
  { name: "Cyan", value: "bg-cyan-600" },
  { name: "Indigo", value: "bg-indigo-600" },
  { name: "Rose", value: "bg-rose-600" },
  { name: "Amber", value: "bg-amber-600" },
  { name: "Orange", value: "bg-orange-600" },
  { name: "Pink", value: "bg-pink-600" },
];

export function CategoryBlockStyleModal({
  isOpen,
  onClose,
  category,
  onSuccess,
}: CategoryBlockStyleModalProps) {
  const queryClient = useQueryClient();

  // Form State
  const [name, setName] = useState("");
  const [showOnHomepage, setShowOnHomepage] = useState(false);
  const [homepageBlockStyle, setHomepageBlockStyle] = useState("style1");
  const [homepageOrder, setHomepageOrder] = useState(0);
  const [homepagePostLimit, setHomepagePostLimit] = useState(6);
  const [homepageColumns, setHomepageColumns] = useState(3);
  const [showThumbnail, setShowThumbnail] = useState(true);
  const [showDate, setShowDate] = useState(true);
  const [showExcerpt, setShowExcerpt] = useState(false);
  const [showViewAll, setShowViewAll] = useState(true);
  const [customTitle, setCustomTitle] = useState("");
  const [accentColor, setAccentColor] = useState("bg-blue-600");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setShowOnHomepage(Boolean(category.showOnHomepage));
      setHomepageBlockStyle(category.homepageBlockStyle || "style1");
      setHomepageOrder(category.homepageOrder ?? 0);
      setHomepagePostLimit(category.homepagePostLimit ?? 6);
      setHomepageColumns(category.homepageColumns ?? 3);
      setShowThumbnail(category.showThumbnail !== false);
      setShowDate(category.showDate !== false);
      setShowExcerpt(Boolean(category.showExcerpt));
      setShowViewAll(category.showViewAll !== false);
      setCustomTitle(category.customTitle || "");
      setAccentColor(category.accentColor || "bg-blue-600");
      setSaveError("");
    }
  }, [category]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!category) throw new Error("No category selected");
      const res = await updateCategoryBlockStyleAction(category.id, {
        name,
        showOnHomepage,
        homepageBlockStyle,
        homepageOrder,
        homepagePostLimit,
        homepageColumns,
        showThumbnail,
        showDate,
        showExcerpt,
        showViewAll,
        customTitle: customTitle.trim() || null,
        accentColor: accentColor || null,
      });

      if (!res.success) {
        throw new Error(res.error || "Failed to update category style");
      }
      return res.category;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tags"] });
      queryClient.invalidateQueries({ queryKey: ["homepage-category-blocks"] });
      if (onSuccess) onSuccess();
      onClose();
    },
    onError: (err: any) => {
      setSaveError(err.message || "Failed to save category style.");
    },
  });

  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-5 sm:p-7 space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                <span>Category Block Style:</span>
                <span className="text-blue-600">{category.name}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Configure how this category displays posts on the homepage with custom grid styles.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-500 dark:text-zinc-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {saveError && (
          <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/40 rounded-xl text-xs text-red-700 dark:text-red-300 font-medium">
            {saveError}
          </div>
        )}

        {/* Section 1: Homepage Visibility & Priority */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-zinc-900/60 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80">
          {/* Homepage Toggle */}
          <div className="flex items-center justify-between sm:justify-start gap-3">
            <label className="text-xs font-bold text-slate-800 dark:text-zinc-200 cursor-pointer">
              Show on Homepage
            </label>
            <button
              type="button"
              onClick={() => setShowOnHomepage(!showOnHomepage)}
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                showOnHomepage ? "bg-blue-600" : "bg-slate-300 dark:bg-zinc-700"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                  showOnHomepage ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
          </div>

          {/* Homepage Sort Order */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-zinc-400">
              Display Order (Priority #)
            </label>
            <input
              type="number"
              min={0}
              max={99}
              value={homepageOrder}
              onChange={(e) => setHomepageOrder(Number(e.target.value))}
              className="w-full px-3 py-1.5 text-xs font-bold bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Number of Posts Limit */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-zinc-400">
              Post Limit (Count: {homepagePostLimit})
            </label>
            <input
              type="range"
              min={3}
              max={12}
              step={1}
              value={homepagePostLimit}
              onChange={(e) => setHomepagePostLimit(Number(e.target.value))}
              className="w-full cursor-pointer accent-blue-600"
            />
          </div>
        </div>

        {/* Section 2: Visual Layout Style Selector (6 Selectable Cards) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-zinc-300 flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-blue-600" />
              <span>Choose Category Block Style (1 of 6)</span>
            </label>
            <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold">
              Currently Selected: {STYLE_OPTIONS.find((s) => s.id === homepageBlockStyle)?.name.split(":")[0]}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {STYLE_OPTIONS.map((style) => {
              const isSelected = homepageBlockStyle === style.id;
              const Icon = style.icon;
              return (
                <div
                  key={style.id}
                  onClick={() => setHomepageBlockStyle(style.id)}
                  className={cn(
                    "relative p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between group select-none",
                    isSelected
                      ? "border-blue-600 bg-blue-50/40 dark:bg-blue-950/20 shadow-md ring-2 ring-blue-500/20"
                      : "border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900"
                  )}
                >
                  {/* Top Bar with Icon & Radio Checkmark */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs",
                          isSelected
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400"
                        )}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100 line-clamp-1">
                        {style.name}
                      </h4>
                    </div>

                    <div
                      className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center transition-all",
                        isSelected
                          ? "bg-blue-600 text-white"
                          : "border-2 border-slate-300 dark:border-zinc-700"
                      )}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>

                  {/* Visual Wireframe Preview */}
                  <div className="my-1.5">{style.renderWireframe()}</div>

                  {/* Description & Best For Tag */}
                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-zinc-800/80">
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {style.description}
                    </p>
                    <span className="text-[9px] font-semibold text-slate-400 dark:text-zinc-500 mt-1 block">
                      Best: {style.bestFor}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Custom Heading & Accent Color */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-zinc-900/60 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 dark:text-zinc-300">
              Custom Block Heading (Optional)
            </label>
            <input
              type="text"
              placeholder={`Default: ${category.name}`}
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <p className="text-[10px] text-slate-400">
              Leave blank to use the official category name.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-blue-600" />
              <span>Accent Color Pill</span>
            </label>
            <div className="flex flex-wrap gap-2 pt-1">
              {ACCENT_COLORS.map((col) => (
                <button
                  key={col.value}
                  type="button"
                  onClick={() => setAccentColor(col.value)}
                  className={cn(
                    "w-6 h-6 rounded-full transition-transform cursor-pointer relative",
                    col.value,
                    accentColor === col.value
                      ? "scale-115 ring-2 ring-offset-2 ring-blue-500"
                      : "opacity-80 hover:opacity-100"
                  )}
                  title={col.name}
                >
                  {accentColor === col.value && (
                    <Check className="w-3 h-3 text-white absolute inset-0 m-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Display Toggles (Thumbnail, Date, Excerpt, View All) */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
            Card Elements & Visibility
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Show Thumbnail */}
            <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 cursor-pointer text-xs font-medium text-slate-700 dark:text-zinc-300 select-none">
              <input
                type="checkbox"
                checked={showThumbnail}
                onChange={(e) => setShowThumbnail(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>Thumbnails</span>
            </label>

            {/* Show Date */}
            <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 cursor-pointer text-xs font-medium text-slate-700 dark:text-zinc-300 select-none">
              <input
                type="checkbox"
                checked={showDate}
                onChange={(e) => setShowDate(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Dates</span>
            </label>

            {/* Show Excerpt */}
            <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 cursor-pointer text-xs font-medium text-slate-700 dark:text-zinc-300 select-none">
              <input
                type="checkbox"
                checked={showExcerpt}
                onChange={(e) => setShowExcerpt(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Excerpts</span>
            </label>

            {/* Show View All */}
            <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 cursor-pointer text-xs font-medium text-slate-700 dark:text-zinc-300 select-none">
              <input
                type="checkbox"
                checked={showViewAll}
                onChange={(e) => setShowViewAll(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>"View All" Link</span>
            </label>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={updateMutation.isPending}
            onClick={() => updateMutation.mutate()}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer disabled:opacity-60"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving Style...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Save Block Style</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
