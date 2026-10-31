"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Film,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  Check,
  X,
  Eye,
  EyeOff,
  Upload,
  Play,
  ImageIcon,
} from "lucide-react";
import { MediaPicker } from "@/components/ui/media-picker";

interface ShortVideo {
  id: string;
  title: string;
  image: string | null;
  video: string | null;
  isActive: boolean;
  createdAt: Date | string;
}

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ShortVideosManager() {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  // Preview state
  const [previewVideoId, setPreviewVideoId] = useState<string | null>(null);
  const previewRef = useRef<HTMLVideoElement>(null);

  // Fetch all short videos (including inactive, for admin)
  const {
    data: videos,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-short-videos"],
    queryFn: async () => {
      const res = await fetch("/api/webstories?all=true");
      if (!res.ok) throw new Error("Failed to load short videos");
      const json = await res.json();
      return (json.data || []) as ShortVideo[];
    },
    refetchInterval: 8000,
  });

  const showFeedback = (type: "success" | "error", text: string) => {
    setActionFeedback({ type, text });
    setTimeout(() => setActionFeedback(null), 4000);
  };

  // Create short video
  const createMutation = useMutation({
    mutationFn: async () => {
      if (!title.trim()) throw new Error("Title is required");
      if (!videoUrl.trim()) throw new Error("Video URL is required");
      if (!thumbnail.trim()) throw new Error("Thumbnail is required");

      // Validate video format
      const url = videoUrl.trim().toLowerCase();
      if (!url.endsWith(".mp4") && !url.endsWith(".m3u8") && !url.includes(".mp4") && !url.includes(".m3u8")) {
        throw new Error("Only .mp4 and .m3u8 video formats are supported");
      }

      const res = await fetch("/api/webstories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          image: thumbnail.trim(),
          video: videoUrl.trim(),
          isActive: true,
        }),
      });
      if (!res.ok) throw new Error("Failed to create short video");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-short-videos"] });
      queryClient.invalidateQueries({ queryKey: ["webstories"] });
      setTitle("");
      setThumbnail("");
      setVideoUrl("");
      setShowCreateForm(false);
      showFeedback("success", "Short video created successfully!");
    },
    onError: (err: Error) => {
      showFeedback("error", err.message);
    },
  });

  // Toggle active/inactive
  const toggleMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const res = await fetch("/api/webstories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive }),
      });
      if (!res.ok) throw new Error("Failed to update video");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-short-videos"] });
      queryClient.invalidateQueries({ queryKey: ["webstories"] });
      showFeedback("success", "Video visibility updated");
    },
    onError: (err: Error) => {
      showFeedback("error", err.message);
    },
  });

  // Delete short video
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch("/api/webstories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete video");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-short-videos"] });
      queryClient.invalidateQueries({ queryKey: ["webstories"] });
      showFeedback("success", "Short video deleted successfully");
    },
    onError: (err: Error) => {
      showFeedback("error", err.message);
    },
  });

  const allVideos = videos || [];
  const activeCount = allVideos.filter((v) => v.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2.5">
            <Film className="w-5 h-5 text-rose-600" />
            Short Videos Manager
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
            Upload and manage Instagram Reels-style short videos (.mp4 &amp;
            .m3u8). Videos appear on the homepage and /short-videos page.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="text-xs font-bold bg-rose-50 text-rose-700 px-3 py-1.5 rounded-xl border border-rose-100">
            {activeCount} Active / {allVideos.length} Total
          </span>
          <button
            type="button"
            onClick={() => setShowCreateForm(!showCreateForm)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer ${
              showCreateForm
                ? "bg-slate-900 text-white"
                : "bg-rose-600 hover:bg-rose-700 text-white"
            }`}
          >
            {showCreateForm ? (
              <>
                <X className="w-3.5 h-3.5" /> Cancel
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" /> Upload Short Video
              </>
            )}
          </button>
        </div>
      </div>

      {/* Feedback */}
      {actionFeedback && (
        <div
          className={`p-3.5 rounded-xl text-xs font-medium border flex items-center justify-between transition-all ${
            actionFeedback.type === "success"
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

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 max-w-3xl">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-6">
            <Upload className="w-4 h-4 text-rose-600" />
            Upload New Short Video
          </h4>

          <div className="space-y-5">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Video Title *
              </label>
              <input
                type="text"
                placeholder="Enter short video title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              />
            </div>

            {/* Thumbnail */}
            <div className="space-y-1.5">
              <MediaPicker
                label="CUSTOM THUMBNAIL (.WEBP / .JPG / .PNG)"
                type="image"
                value={thumbnail}
                onChange={(url) => setThumbnail(url)}
                placeholder="Click or drag thumbnail image"
                helperText="Vertical aspect ratio recommended (9:16). Images auto-convert to .WebP."
              />
            </div>

            {/* Video */}
            <div className="space-y-1.5">
              <MediaPicker
                label="VIDEO FILE (.MP4 / .M3U8 ONLY)"
                type="video"
                value={videoUrl}
                onChange={(url) => setVideoUrl(url)}
                placeholder="Click or drag video file (.mp4 / .m3u8)"
                helperText="Only .mp4 and .m3u8 formats are accepted. Vertical 9:16 recommended."
              />
            </div>

            {/* Preview */}
            {thumbnail && videoUrl && (
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="relative w-20 aspect-[9/16] rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
                  {thumbnail ? (
                    <Image
                      src={thumbnail}
                      alt="Thumbnail preview"
                      fill
                      className="object-cover"
                      sizes="80px"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-slate-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Play className="w-5 h-5 text-white fill-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {title || "Untitled Video"}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 truncate">
                    {videoUrl}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-2 border border-emerald-200">
                    <Check className="w-3 h-3" /> Ready to upload
                  </span>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="button"
              onClick={() => createMutation.mutate()}
              disabled={createMutation.isPending}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Creating...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" /> Create Short Video
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Videos List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Film className="w-4 h-4 text-rose-600" />
            All Short Videos
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/80">
              {allVideos.length} {allVideos.length === 1 ? "video" : "videos"}
            </span>
          </h4>
        </div>

        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-rose-600" />
            <span className="text-xs font-medium">
              Loading short videos...
            </span>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Failed to load short videos</span>
          </div>
        ) : allVideos.length === 0 ? (
          <div className="py-12 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-6 bg-slate-50/50">
            <Film className="w-10 h-10 text-slate-300 mb-3" />
            <h5 className="text-sm font-bold text-slate-700">
              No short videos yet
            </h5>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              Click &quot;Upload Short Video&quot; above to add your first
              Instagram Reels-style short video.
            </p>
            <button
              type="button"
              onClick={() => setShowCreateForm(true)}
              className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Upload First Video
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {allVideos.map((video) => (
              <div
                key={video.id}
                className={`group relative rounded-2xl overflow-hidden border transition-all ${
                  video.isActive
                    ? "border-slate-200 shadow-sm"
                    : "border-slate-200/60 opacity-60"
                }`}
              >
                {/* Thumbnail / Video Preview */}
                <div
                  className="relative w-full aspect-[9/16] bg-slate-950 cursor-pointer"
                  onClick={() =>
                    setPreviewVideoId(
                      previewVideoId === video.id ? null : video.id
                    )
                  }
                >
                  {previewVideoId === video.id && video.video ? (
                    <video
                      ref={previewRef}
                      src={video.video}
                      poster={video.image || undefined}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : video.image ? (
                    <Image
                      src={video.image}
                      alt={video.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <Film className="w-8 h-8" />
                    </div>
                  )}

                  {/* Play overlay */}
                  {previewVideoId !== video.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="p-2.5 rounded-full bg-black/50 text-white backdrop-blur-sm">
                        <Play className="w-5 h-5 fill-current translate-x-[1px]" />
                      </div>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-2 left-2">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm ${
                        video.isActive
                          ? "bg-emerald-500/90 text-white"
                          : "bg-slate-900/70 text-slate-300"
                      }`}
                    >
                      {video.isActive ? "LIVE" : "HIDDEN"}
                    </span>
                  </div>
                </div>

                {/* Info & Controls */}
                <div className="p-3 bg-white">
                  <h5 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug mb-1.5">
                    {video.title}
                  </h5>
                  <p className="text-[10px] text-slate-400 mb-2.5">
                    {formatDate(video.createdAt)}
                  </p>

                  <div className="flex items-center gap-1.5">
                    {/* Toggle Active */}
                    <button
                      type="button"
                      onClick={() =>
                        toggleMutation.mutate({
                          id: video.id,
                          isActive: !video.isActive,
                        })
                      }
                      disabled={toggleMutation.isPending}
                      title={
                        video.isActive ? "Hide from site" : "Show on site"
                      }
                      className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                        video.isActive
                          ? "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                          : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                      }`}
                    >
                      {video.isActive ? (
                        <>
                          <EyeOff className="w-3 h-3" /> Hide
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3" /> Show
                        </>
                      )}
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          confirm(
                            `Delete "${video.title}"? This cannot be undone.`
                          )
                        ) {
                          deleteMutation.mutate(video.id);
                        }
                      }}
                      disabled={deleteMutation.isPending}
                      title="Delete video"
                      className="p-1.5 bg-white hover:bg-red-50 text-red-500 border border-slate-200 hover:border-red-200 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
