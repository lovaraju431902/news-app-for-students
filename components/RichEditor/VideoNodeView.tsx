"use client";

import React, { useState } from "react";
import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import Image from "next/image";
import { getEmbedUrl } from "./CustomVideo";
import {
  GripVertical,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ZoomIn,
  ZoomOut,
  Trash2,
  Play,
  Film,
  RefreshCw,
} from "lucide-react";

export default function VideoNodeView({
  node,
  updateAttributes,
  deleteNode,
  selected,
}: NodeViewProps) {
  const { src, thumbnail, videoType, width, alignment } = node.attrs;
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAlign = (align: "left" | "center" | "right") => {
    updateAttributes({ alignment: align });
  };

  const handleResize = (amount: number) => {
    const newWidth = Math.min(100, Math.max(20, width + amount));
    updateAttributes({ width: newWidth });
  };

  const toggleVideoType = () => {
    updateAttributes({ videoType: videoType === "long" ? "shorts" : "long" });
  };

  // Build the alignment-based CSS styling for the wrapper
  const wrapperStyle: React.CSSProperties = {
    width: `${width}%`,
    transition: "all 0.2s ease",
  };

  let alignmentClass = "";
  if (alignment === "left") {
    wrapperStyle.float = "left";
    wrapperStyle.margin = "0.5rem 1.5rem 1rem 0";
    alignmentClass = "mr-auto";
  } else if (alignment === "right") {
    wrapperStyle.float = "right";
    wrapperStyle.margin = "0.5rem 0 1rem 1.5rem";
    alignmentClass = "ml-auto";
  } else {
    // Center block layout
    wrapperStyle.float = "none";
    wrapperStyle.margin = "1rem auto";
    wrapperStyle.clear = "both";
    alignmentClass = "mx-auto";
  }

  // Set the height and aspect ratio classes based on video type
  const aspectClass =
    videoType === "shorts"
      ? "aspect-[9/16] w-full max-w-[280px] mx-auto"
      : "aspect-video w-full";

  const embedInfo = getEmbedUrl(src);
  const displayPoster = thumbnail || embedInfo.poster;

  return (
    <NodeViewWrapper
      style={wrapperStyle}
      className={`relative group my-6 select-none ${alignmentClass} ${
        selected ? "ring-2 ring-blue-500 rounded-xl" : ""
      }`}
    >
      <div className="relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950/90 shadow-md">
        
        {/* Render actual video/embed or thumbnail cover preview */}
        <div className={`relative ${aspectClass} overflow-hidden bg-black flex items-center justify-center`}>
          {isPlaying ? (
            embedInfo.type === "embed" ? (
              <iframe
                src={`${embedInfo.url}?autoplay=1`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full object-contain rounded-lg border-0 bg-black"
              />
            ) : (
              <video
                src={src}
                poster={thumbnail}
                controls
                autoPlay
                className="w-full h-full object-contain rounded-lg"
              />
            )
          ) : (
            <div
              onClick={() => setIsPlaying(true)}
              className="relative w-full h-full flex items-center justify-center bg-zinc-900/60 cursor-pointer group/video"
            >
              {displayPoster ? (
                <Image
                  src={displayPoster}
                  alt="Video thumbnail"
                  fill
                  className="object-cover opacity-70 group-hover/video:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 800px"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-zinc-900 flex flex-col items-center justify-center text-zinc-650 gap-2">
                  <Film className="w-12 h-12" />
                  <span className="text-xs font-semibold">Click to preview player</span>
                </div>
              )}

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/video:bg-black/35 transition-colors duration-200">
                <div className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-xl transition-all duration-300 transform scale-90 group-hover/video:scale-100">
                  <Play className="w-6 h-6 fill-current ml-1" />
                </div>
              </div>

              {/* Shorts / Long format badge */}
              <div className="absolute bottom-3 right-3 bg-zinc-900/90 dark:bg-zinc-950/90 text-[10px] text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider select-none shadow-sm">
                {videoType === "shorts" ? "Shorts (9:16)" : "Video (16:9)"}
              </div>
            </div>
          )}
        </div>

        {/* Video Control Toolbar - visible on hover or selection */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-zinc-950/95 backdrop-blur shadow-xl border border-zinc-200/85 dark:border-zinc-800/85 px-2.5 py-1.5 rounded-full flex items-center gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200 z-30">
          
          {/* Drag Handle */}
          <div
            data-drag-handle
            className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500 dark:text-zinc-400 cursor-grab active:cursor-grabbing flex items-center justify-center"
            title="Drag to move video"
          >
            <GripVertical className="w-4 h-4" />
          </div>

          <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-0.5" />

          {/* Toggle Shorts / Long Aspect Ratio */}
          <button
            type="button"
            onClick={toggleVideoType}
            className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-650 dark:text-zinc-350 flex items-center gap-1 text-[11px] font-bold px-2.5"
            title="Toggle Shorts (9:16) / Long (16:9) sizes"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{videoType === "long" ? "Shorts Format" : "Standard 16:9"}</span>
          </button>

          <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-0.5" />

          {/* Alignment Controls */}
          <button
            type="button"
            onClick={() => handleAlign("left")}
            className={`p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${
              alignment === "left"
                ? "text-blue-500 bg-blue-50 dark:bg-blue-950/50"
                : "text-zinc-600 dark:text-zinc-400"
            }`}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          
          <button
            type="button"
            onClick={() => handleAlign("center")}
            className={`p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${
              alignment === "center"
                ? "text-blue-500 bg-blue-50 dark:bg-blue-950/50"
                : "text-zinc-600 dark:text-zinc-400"
            }`}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => handleAlign("right")}
            className={`p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${
              alignment === "right"
                ? "text-blue-500 bg-blue-50 dark:bg-blue-950/50"
                : "text-zinc-600 dark:text-zinc-400"
            }`}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-0.5" />

          {/* Width Resizing Controls */}
          <button
            type="button"
            onClick={() => handleResize(-10)}
            disabled={width <= 20}
            className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400 disabled:opacity-40"
            title="Decrease Size (-10%)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <span className="text-[11px] font-bold px-1 select-none text-zinc-700 dark:text-zinc-300 min-w-[36px] text-center">
            {width}%
          </span>

          <button
            type="button"
            onClick={() => handleResize(10)}
            disabled={width >= 100}
            className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400 disabled:opacity-40"
            title="Increase Size (+10%)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-0.5" />

          {/* Delete Button */}
          <button
            type="button"
            onClick={deleteNode}
            className="p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-950/50 text-red-500 transition-colors"
            title="Delete Video"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

      </div>
    </NodeViewWrapper>
  );
}
