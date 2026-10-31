"use client";

import { useEffect, useState } from "react";

// In-memory cache for live views during the user session
const liveViewsCache: Record<string, number> = {};
const listeners: Record<string, Set<(views: number) => void>> = {};

function notifyListeners(slug: string, views: number) {
  liveViewsCache[slug] = views;
  if (listeners[slug]) {
    listeners[slug].forEach((listener) => listener(views));
  }
}

/**
 * Hook to record a view in real-time when a user opens an article
 */
export function useRecordBlogView(slug?: string | null) {
  useEffect(() => {
    if (!slug) return;
    const cleanSlug = slug.trim();

    // Call /api/views to increment views in real time
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: cleanSlug }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && typeof data.views === "number") {
          notifyListeners(cleanSlug, data.views);
        }
      })
      .catch((err) => {
        console.error("Failed to record real-time view:", err);
      });
  }, [slug]);
}

/**
 * Hook to get real-time view count for any post card or element
 */
export function useRealtimePostViews(
  slug?: string | null,
  initialViews?: number | null
): number {
  const cleanSlug = slug ? slug.trim() : "";
  const startingViews =
    cleanSlug && liveViewsCache[cleanSlug] !== undefined
      ? liveViewsCache[cleanSlug]
      : initialViews ?? 0;

  const [views, setViews] = useState<number>(startingViews);

  useEffect(() => {
    if (!cleanSlug) return;

    if (liveViewsCache[cleanSlug] !== undefined) {
      setViews(liveViewsCache[cleanSlug]);
    }

    if (!listeners[cleanSlug]) {
      listeners[cleanSlug] = new Set();
    }
    const updateHandler = (newViews: number) => {
      setViews(newViews);
    };
    listeners[cleanSlug].add(updateHandler);

    return () => {
      if (listeners[cleanSlug]) {
        listeners[cleanSlug].delete(updateHandler);
      }
    };
  }, [cleanSlug]);

  return views;
}
