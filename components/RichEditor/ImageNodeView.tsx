"use client";

import React from "react";
import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import Image from "next/image";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  ZoomIn,
  ZoomOut,
  Trash2,
  GripVertical,
} from "lucide-react";

export default function ImageNodeView({
  node,
  updateAttributes,
  deleteNode,
  selected,
}: NodeViewProps) {
  const { src, alt, width, alignment } = node.attrs;

  const handleAlign = (align: "left" | "center" | "right") => {
    updateAttributes({ alignment: align });
  };

  const handleResize = (amount: number) => {
    const newWidth = Math.min(100, Math.max(10, width + amount));
    updateAttributes({ width: newWidth });
  };

  // Build the alignment-based CSS styling for the wrapper
  const wrapperStyle: React.CSSProperties = {
    width: `${width}%`,
    transition: "width 0.2s ease, float 0.2s ease, margin 0.2s ease",
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
    // Middle/Center
    wrapperStyle.float = "none";
    wrapperStyle.margin = "1rem auto";
    wrapperStyle.clear = "both";
    alignmentClass = "mx-auto";
  }

  return (
    <NodeViewWrapper
      style={wrapperStyle}
      className={`relative group my-4 select-none ${alignmentClass} ${
        selected ? "ring-2 ring-blue-500 rounded-lg" : ""
      }`}
    >
      <div className="relative overflow-hidden rounded-lg border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/40">
        <Image
          src={src}
          alt={alt || "Image link"}
          width={800}
          height={500}
          className="w-full h-auto object-contain block select-none pointer-events-none"
          sizes="100vw"
        />

        {/* Control Toolbar - visible on hover or selection */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-zinc-950/95 backdrop-blur shadow-xl border border-zinc-200/80 dark:border-zinc-800/80 px-2.5 py-1.5 rounded-full flex items-center gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200 z-30">
          {/* Drag Handle Button */}
          <div
            data-drag-handle
            className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500 dark:text-zinc-400 cursor-grab active:cursor-grabbing flex items-center justify-center"
            title="Drag to reposition image"
          >
            <GripVertical className="w-4 h-4" />
          </div>

          <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-0.5 self-center align-middle" />

          {/* Alignment Buttons */}
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

          <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-1 align-middle self-center" />

          {/* Sizing Buttons */}
          <button
            type="button"
            onClick={() => handleResize(-10)}
            disabled={width <= 10}
            className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400 disabled:opacity-40"
            title="Decrease Size (-10%)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <span className="text-[11px] font-bold px-1.5 text-zinc-700 dark:text-zinc-300 min-w-[36px] text-center select-none">
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

          <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-1 align-middle self-center" />

          {/* Delete Button */}
          <button
            type="button"
            onClick={deleteNode}
            className="p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-950/50 text-red-500 transition-colors"
            title="Delete Image"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </NodeViewWrapper>
  );
}
