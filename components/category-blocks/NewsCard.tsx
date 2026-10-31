"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageSquare, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { CategoryPostItem } from "@/lib/category-service";
import { getFormattedAdminName } from "@/lib/category-admins";
import { useRealtimePostViews } from "@/lib/useRealtimeViews";
import { PremiumBadge } from "@/components/subscription/PremiumBadge";

interface NewsCardProps {
  post: CategoryPostItem;
  categorySlug?: string;
  variant?: "standard" | "compact" | "compact-row" | "featured-overlay" | "dark";
  showThumbnail?: boolean;
  showDate?: boolean;
  showExcerpt?: boolean;
  showBadge?: boolean;
  className?: string;
  imageAspect?: string;
  titleClassName?: string;
}

export function NewsCard({
  post,
  categorySlug,
  variant = "standard",
  showThumbnail = true,
  showDate = true,
  showExcerpt = false,
  className,
  imageAspect = "aspect-[16/9]",
  titleClassName,
}: NewsCardProps) {
  const [imgSrc, setImgSrc] = useState(post.image || "/logo.png");
  const liveViews = useRealtimePostViews(post.slug, post.views);

  const extractedSlug = post.categorySlug || (post.href ? post.href.split("/").filter(Boolean)[0] : "");
  const catSlug = categorySlug || extractedSlug;
  const authorDisplay = getFormattedAdminName(catSlug);

  // Compact horizontal row variant (used in Style 1 & Style 2 bottom lists)
  if (variant === "compact-row") {
    return (
      <Link
        href={post.href}
        className={cn("group flex items-start gap-3", className)}
      >
        {showThumbnail && (
          <div className="relative w-24 h-16 sm:w-28 sm:h-18 rounded-[3px] overflow-hidden shrink-0 bg-slate-100 dark:bg-zinc-800">
            {post.isPremium && (
              <div className="absolute top-1 left-1 z-10">
                <PremiumBadge size="sm" />
              </div>
            )}
            <Image
              src={imgSrc}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 96px, 112px"
              onError={() => setImgSrc("/logo.png")}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="text-xs sm:text-[13px] font-bold text-gray-900 dark:text-zinc-100 line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {post.title}
          </h4>
          {showDate && (
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-gray-500 dark:text-zinc-400 mt-1 flex-wrap">
              <span>{authorDisplay}</span>
              <span>{post.date}</span>
              <span className="inline-flex items-center gap-0.5 ml-0.5">
                <MessageSquare className="w-2.5 h-2.5 text-gray-400" />
                <span>{post.commentsCount ?? 0}</span>
              </span>
              <span className="inline-flex items-center gap-0.5 ml-0.5">
                <Eye className="w-3 h-3 text-gray-400" />
                <span>{liveViews}</span>
              </span>
            </div>
          )}
        </div>
      </Link>
    );
  }

  // Dark variant for Style 6 (Dark Featured Block)
  if (variant === "dark") {
    return (
      <article className={cn("group flex flex-col w-full", className)}>
        {showThumbnail && (
          <div className={cn("relative w-full overflow-hidden bg-zinc-900 rounded-[3px]", imageAspect)}>
            {post.isPremium && (
              <div className="absolute top-2 left-2 z-10">
                <PremiumBadge size="sm" />
              </div>
            )}
            <Link href={post.href} className="block w-full h-full relative">
              <Image
                src={imgSrc}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={() => setImgSrc("/logo.png")}
              />
            </Link>
          </div>
        )}

        <div className="mt-2 flex flex-col flex-1">
          <h3 className={cn("font-bold text-[14px] sm:text-[15px] text-white leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors", titleClassName)}>
            <Link href={post.href}>{post.title}</Link>
          </h3>

          {showDate && (
            <div className="flex items-center gap-2 text-[11px] sm:text-xs text-zinc-400 mt-1.5 flex-wrap">
              <span>{authorDisplay}</span>
              <span>{post.date}</span>
              <span className="inline-flex items-center gap-0.5 ml-0.5">
                <MessageSquare className="w-3 h-3 text-zinc-500" />
                <span>{post.commentsCount ?? 0}</span>
              </span>
              <span className="inline-flex items-center gap-0.5 ml-0.5">
                <Eye className="w-3.5 h-3.5 text-zinc-500" />
                <span>{liveViews}</span>
              </span>
            </div>
          )}

          {showExcerpt && post.excerpt && (
            <p className="text-xs text-zinc-400 line-clamp-2 mt-1.5 leading-relaxed">
              {post.excerpt}
            </p>
          )}
        </div>
      </article>
    );
  }

  // Standard vertical card (Matching screenshots exactly: 16:9 thumbnail, 2-line bold title, author/date/comments/views, optional excerpt)
  return (
    <article className={cn("group flex flex-col w-full", className)}>
      {showThumbnail && (
        <div className={cn("relative w-full overflow-hidden bg-slate-100 dark:bg-zinc-800 rounded-[3px]", imageAspect)}>
          {post.isPremium && (
            <div className="absolute top-2 left-2 z-10">
              <PremiumBadge size="sm" />
            </div>
          )}
          <Link href={post.href} className="block w-full h-full relative">
            <Image
              src={imgSrc}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-104 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              onError={() => setImgSrc("/logo.png")}
            />
          </Link>
        </div>
      )}

      <div className="mt-2 flex flex-col flex-1">
        <h3 className={cn("font-bold text-[14px] sm:text-[15px] text-gray-900 dark:text-zinc-100 leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors", titleClassName)}>
          <Link href={post.href}>{post.title}</Link>
        </h3>

        {showDate && (
          <div className="flex items-center gap-2 text-[11px] sm:text-xs text-gray-500 dark:text-zinc-400 mt-1.5 flex-wrap">
            <span>{authorDisplay}</span>
            <span>{post.date}</span>
            <span className="inline-flex items-center gap-0.5 ml-0.5">
              <MessageSquare className="w-3 h-3 text-gray-400" />
              <span>{post.commentsCount ?? 0}</span>
            </span>
            <span className="inline-flex items-center gap-0.5 ml-0.5">
              <Eye className="w-3.5 h-3.5 text-gray-400" />
              <span>{liveViews}</span>
            </span>
          </div>
        )}

        {showExcerpt && post.excerpt && (
          <p className="text-xs text-gray-500 dark:text-zinc-400 line-clamp-2 mt-1.5 leading-relaxed">
            {post.excerpt}
          </p>
        )}
      </div>
    </article>
  );
}
