"use client";

import React, { useEffect, useState } from "react";
import { Like } from "./Like";
import { BookmarkButton } from "./BookmarkButton";
import { MessageSquare } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { getBlogEngagementStateAction } from "@/app/actions/engagement";

interface ArticleEngagementBarProps {
  blogId: string;
  initialLikes?: number;
  initialLiked?: boolean;
  initialBookmarked?: boolean;
  commentsCount?: number;
  isAuthenticated?: boolean;
  className?: string;
}

export function ArticleEngagementBar({
  blogId,
  initialLikes = 0,
  initialLiked = false,
  initialBookmarked = false,
  commentsCount = 0,
  isAuthenticated: propAuth,
  className = "",
}: ArticleEngagementBarProps) {
  const { data: session } = useSession();
  const isAuth = propAuth !== undefined ? propAuth : Boolean(session?.user);

  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initialLiked);
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [comments, setComments] = useState(commentsCount);

  useEffect(() => {
    let mounted = true;
    if (blogId) {
      getBlogEngagementStateAction(blogId).then((res) => {
        if (mounted && res.success) {
          setLikes(res.likesCount);
          setLiked(res.isLiked);
          setBookmarked(res.isBookmarked);
          setComments(res.commentsCount);
        }
      });
    }
    return () => {
      mounted = false;
    };
  }, [blogId]);

  const scrollToComments = () => {
    const el = document.getElementById("comments-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className={`flex items-center justify-between gap-3 flex-wrap py-3.5 px-3 sm:px-5 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 my-8 shadow-xs ${className}`}
    >
      <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
        {/* Exact Bencho animated Like button */}
        <Like
          postId={blogId}
          start={likes}
          initialLiked={liked}
          isAuthenticated={isAuth}
          effect="Bloom"
          burst={50}
        />

        {/* Bookmark Button */}
        <BookmarkButton
          postId={blogId}
          initialBookmarked={bookmarked}
          isAuthenticated={isAuth}
          showLabel={true}
        />

        {/* Comments counter jump button */}
        <button
          type="button"
          onClick={scrollToComments}
          className="h-10 px-3.5 inline-flex items-center gap-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs sm:text-sm font-semibold transition-colors cursor-pointer select-none"
          aria-label={`Jump to comments (${comments} comments)`}
        >
          <MessageSquare className="w-4 h-4 text-zinc-500" />
          <span>{comments}</span>
          <span className="hidden sm:inline">Comments</span>
        </button>
      </div>

      <div className="text-xs text-muted-foreground font-medium hidden sm:flex items-center gap-1">
        <span>Enjoyed this post? Show your support!</span>
      </div>
    </div>
  );
}

export default ArticleEngagementBar;
