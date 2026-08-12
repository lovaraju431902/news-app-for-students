"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  UploadCloud,
  X,
  Loader2,
  Image as ImageIcon,
  Film,
  Sparkles,
  Check,
  FolderArchive,
  RefreshCw,
  Trash2,
  FileText,
  Paperclip,
  Download
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getMediaLibraryAction, MediaItem } from "@/app/actions/media";

export interface FileDetails {
  url: string;
  filename: string;
  size: string;
  format: string;
}

interface MediaPickerProps {
  value?: string;
  onChange: (url: string) => void;
  onFileDetails?: (details: FileDetails) => void;
  type?: "image" | "video" | "document" | "all";
  label?: string;
  placeholder?: string;
  helperText?: string;
  className?: string;
}

export function MediaPicker({
  value,
  onChange,
  onFileDetails,
  type = "image",
  label,
  placeholder,
  helperText,
  className = "",
}: MediaPickerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isVideo = (url?: string) => {
    if (!url) return false;
    const lower = url.toLowerCase();
    return lower.endsWith(".webm") || lower.endsWith(".mp4") || lower.endsWith(".mov") || lower.includes("video");
  };

  const isDoc = (url?: string) => {
    if (!url) return type === "document";
    const lower = url.toLowerCase();
    return (
      type === "document" ||
      lower.endsWith(".pdf") ||
      lower.endsWith(".docx") ||
      lower.endsWith(".doc") ||
      lower.endsWith(".zip") ||
      lower.endsWith(".rar") ||
      lower.endsWith(".epub") ||
      lower.endsWith(".xlsx") ||
      lower.endsWith(".pptx")
    );
  };

  const { data: libraryData, isLoading: loadingLibrary, refetch: refetchLibrary } = useQuery({
    queryKey: ["media-library-picker"],
    queryFn: async () => {
      const res = await getMediaLibraryAction();
      if (!res.success) return [];
      return res.items || [];
    },
    enabled: isLibraryOpen,
  });

  const libraryItems = (libraryData as MediaItem[]) || [];

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to upload file");
      }

      onChange(data.url);

      const sizeStr = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      const ext = file.name.split('.').pop()?.toUpperCase() || "PDF";
      const format = ["PDF", "ZIP", "DOCX", "IMAGE", "DOC", "EPUB", "XLSX", "PPTX"].includes(ext)
        ? (ext === "DOC" ? "DOCX" : ext)
        : file.type.startsWith("image/") ? "IMAGE" : ext;

      onFileDetails?.({
        url: data.url,
        filename: file.name,
        size: sizeStr,
        format: format,
      });
    } catch (err: any) {
      console.error("Upload error:", err);
      setUploadError(err.message || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const acceptedTypes =
    type === "image"
      ? "image/*"
      : type === "video"
      ? "video/*,.webm,.mp4,.mov"
      : type === "document"
      ? ".pdf,.doc,.docx,.zip,.rar,.epub,.xls,.xlsx,.ppt,.pptx,application/pdf"
      : "image/*,video/*,.webm,.mp4,.pdf,.doc,.docx,.zip";

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-400">
            {label}
          </label>
          <button
            type="button"
            onClick={() => setIsLibraryOpen(true)}
            className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
          >
            <FolderArchive className="w-3.5 h-3.5" />
            <span>Browse Library</span>
          </button>
        </div>
      )}

      {/* Upload Box / Preview Area */}
      {value ? (
        <div className="relative rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 p-2.5 overflow-hidden group">
          <div className="flex items-center gap-3">
            {/* Preview Media */}
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200 dark:border-zinc-700 relative flex items-center justify-center">
              {isDoc(value) ? (
                <div className="w-full h-full bg-amber-500/10 flex items-center justify-center text-amber-600">
                  <FileText className="w-8 h-8" />
                </div>
              ) : isVideo(value) ? (
                <video
                  src={value}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  autoPlay
                  loop
                />
              ) : (
                <Image
                  src={value}
                  alt="Uploaded Media"
                  fill
                  className="object-cover"
                  unoptimized
                />
              )}
            </div>

            {/* Media Info */}
            <div className="flex-1 min-w-0 pr-8">
              <div className="flex items-center gap-1.5 mb-1">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                  isDoc(value)
                    ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    : isVideo(value)
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                }`}>
                  {isDoc(value)
                    ? `.${value.split(".").pop()?.toUpperCase() || "PDF"} Document`
                    : isVideo(value)
                    ? ".WebM Video"
                    : ".WebP Optimized"}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">
                  {isDoc(value) ? "Cloudflare Storage" : "Fast & Lazy Loaded"}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-600 dark:text-zinc-300 truncate">
                {value}
              </p>
            </div>

            {/* Remove / Replace Controls */}
            <div className="absolute right-3 top-3 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 text-slate-600 dark:text-zinc-300 shadow-xs transition-colors"
                title="Replace Media"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="p-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-red-50 hover:border-red-200 text-red-600 shadow-xs transition-colors"
                title="Remove Media"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-5 text-center cursor-pointer transition-all bg-slate-50/40 hover:bg-blue-50/20 dark:bg-zinc-900/20 group"
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center py-2">
              <Loader2 className="w-7 h-7 text-blue-600 animate-spin mb-2" />
              <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                Uploading to Cloudflare Storage...
              </p>
              <p className="text-[11px] text-slate-400">
                {type === "video"
                  ? "Optimizing WebM Video Stream"
                  : type === "document"
                  ? "Uploading Document securely"
                  : "Converting to high-speed WebP"}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                {type === "video" ? (
                  <Film className="w-5 h-5" />
                ) : type === "document" ? (
                  <FileText className="w-5 h-5 text-amber-600" />
                ) : (
                  <UploadCloud className="w-5 h-5" />
                )}
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                {placeholder ||
                  (type === "video"
                    ? "Click or drag .webm / video file"
                    : type === "document"
                    ? "Click or drag PDF, ZIP, or Study Material file"
                    : "Click or drag image file")}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {type === "video"
                  ? "Automatic .WebM fast stream encoding"
                  : type === "document"
                  ? "Uploads directly to Cloudflare R2 / S3 Storage"
                  : "Auto-converts all images (PNG, JPG) to .WebP"}
              </p>
            </div>
          )}
        </div>
      )}

      {uploadError && (
        <p className="text-xs font-semibold text-red-500 mt-1">{uploadError}</p>
      )}

      {helperText && !uploadError && (
        <p className="text-[11px] text-slate-400">{helperText}</p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
          }
        }}
        className="hidden"
      />

      {/* MEDIA LIBRARY MODAL */}
      {isLibraryOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-zinc-800 max-w-2xl w-full p-6 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FolderArchive className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Media Library Assets</h3>
                  <p className="text-[11px] text-slate-400">Select an existing .WebP image or .WebM video</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsLibraryOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Library Grid */}
            <div className="flex-1 overflow-y-auto py-4">
              {loadingLibrary ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin mb-2" />
                  <p className="text-xs text-slate-400">Loading library assets...</p>
                </div>
              ) : libraryItems.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-xs font-semibold">No media assets found</p>
                  <p className="text-[11px] mt-0.5">Upload a file directly to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {libraryItems.map((item) => {
                    const isVid = item.type === "video";
                    const isSelected = value === item.url;
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          onChange(item.url);
                          setIsLibraryOpen(false);
                        }}
                        className={`group relative rounded-xl border overflow-hidden cursor-pointer aspect-square bg-slate-950 flex flex-col justify-end transition-all ${
                          isSelected
                            ? "border-blue-600 ring-2 ring-blue-600/30"
                            : "border-slate-200 dark:border-zinc-800 hover:border-blue-400"
                        }`}
                      >
                        {isVid ? (
                          <video src={item.url} className="absolute inset-0 w-full h-full object-cover" muted />
                        ) : (
                          <Image src={item.url} alt={item.name} fill className="object-cover" unoptimized />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 text-white">
                          <span className="text-[10px] font-bold truncate">{item.name}</span>
                          <span className="text-[9px] text-slate-300 font-mono">{item.sizeFormatted}</span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setIsLibraryOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
