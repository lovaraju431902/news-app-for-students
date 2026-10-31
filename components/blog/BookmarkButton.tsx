"use client";

import React, { useState, useTransition } from "react";
import { Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toggleBlogBookmarkAction } from "@/app/actions/engagement";

interface BookmarkButtonProps {
  postId: string;
  initialBookmarked?: boolean;
  isAuthenticated?: boolean;
  className?: string;
  showLabel?: boolean;
}

export function BookmarkButton({
  postId,
  initialBookmarked = false,
  isAuthenticated = false,
  className = "",
  showLabel = false,
}: BookmarkButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [toast, setToast] = useState<string | null>(null);

  const handleToggle = () => {
    if (!isAuthenticated) {
      const currentUrl = typeof window !== "undefined" ? window.location.pathname : "";
      router.push(`/login?callbackUrl=${encodeURIComponent(currentUrl)}`);
      return;
    }

    if (isPending) return;

    const next = !bookmarked;
    setBookmarked(next);
    setToast(next ? "Saved to your bookmarks" : "Removed from bookmarks");
    setTimeout(() => setToast(null), 2500);

    startTransition(async () => {
      try {
        const res = await toggleBlogBookmarkAction(postId);
        if (res.success && typeof res.bookmarked === "boolean") {
          setBookmarked(res.bookmarked);
        } else {
          // Rollback
          setBookmarked(!next);
          if (!res.success && res.unauthorized) {
            router.push("/login");
          }
        }
      } catch (err) {
        setBookmarked(!next);
      }
    });
  };

  return (
    <div className="relative inline-flex items-center">
      <motion.button
        type="button"
        whileTap={{ scale: 0.94 }}
        onClick={handleToggle}
        disabled={isPending}
        aria-pressed={bookmarked}
        aria-label={bookmarked ? "Remove from saved articles" : "Save article to bookmarks"}
        className={`h-10 px-3.5 inline-flex items-center gap-2 rounded-full border text-xs sm:text-sm font-semibold transition-colors cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
          bookmarked
            ? "border-blue-500/30 bg-blue-50/80 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"
            : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700"
        } ${className}`}
      >
        <motion.span
          animate={bookmarked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Bookmark
            size={18}
            className={bookmarked ? "fill-blue-600 dark:fill-blue-400 text-blue-600 dark:text-blue-400" : "text-zinc-500 dark:text-zinc-400"}
          />
        </motion.span>
        {showLabel && (
          <span>{bookmarked ? "Saved" : "Save"}</span>
        )}
      </motion.button>

      {/* Ephemeral toast notification */}
      {toast && (
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-md bg-zinc-900 text-white text-[11px] font-medium shadow-md pointer-events-none z-50 animate-in fade-in duration-200">
          {toast}
        </div>
      )}
    </div>
  );
}

export default BookmarkButton;
