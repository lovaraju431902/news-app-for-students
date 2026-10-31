"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { CommentThread, CommentItemData } from "@/components/ui/comment-thread";
import {
  getBlogCommentsAction,
  createCommentAction,
  updateCommentAction,
  deleteCommentAction,
} from "@/app/actions/engagement";
import { Loader2 } from "lucide-react";

interface BlogCommentsProps {
  blogId: string;
  initialComments?: CommentItemData[];
}

export function BlogComments({ blogId, initialComments = [] }: BlogCommentsProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [comments, setComments] = useState<CommentItemData[]>(initialComments);
  const [loading, setLoading] = useState(initialComments.length === 0);
  const [error, setError] = useState<string | null>(null);

  const currentUser = session?.user
    ? {
        id: session.user.id,
        name: session.user.name || "Student",
        avatar: session.user.image || undefined,
      }
    : null;

  // Fetch comments if none were provided initially
  useEffect(() => {
    let mounted = true;
    if (initialComments.length === 0) {
      setLoading(true);
      getBlogCommentsAction(blogId)
        .then((res) => {
          if (mounted && res.success) {
            setComments(res.comments);
          }
        })
        .catch(() => {
          if (mounted) setError("Could not load comments.");
        })
        .finally(() => {
          if (mounted) setLoading(false);
        });
    }
    return () => {
      mounted = false;
    };
  }, [blogId, initialComments.length]);

  const requireAuth = () => {
    if (!session?.user) {
      const currentUrl = typeof window !== "undefined" ? window.location.pathname : "";
      router.push(`/login?callbackUrl=${encodeURIComponent(currentUrl)}`);
      return false;
    }
    return true;
  };

  const handleAddComment = async (content: string): Promise<CommentItemData | null> => {
    if (!requireAuth()) return null;

    const res = await createCommentAction(blogId, content);
    if (res.success && res.comment) {
      return res.comment;
    } else {
      alert(res.error || "Failed to post comment.");
      return null;
    }
  };

  const handleAddReply = async (
    parentId: string,
    content: string
  ): Promise<CommentItemData | null> => {
    if (!requireAuth()) return null;

    const res = await createCommentAction(blogId, content, parentId);
    if (res.success && res.comment) {
      return res.comment;
    } else {
      alert(res.error || "Failed to post reply.");
      return null;
    }
  };

  const handleEditComment = async (commentId: string, content: string): Promise<boolean> => {
    if (!requireAuth()) return false;

    const res = await updateCommentAction(commentId, content);
    if (res.success) {
      return true;
    } else {
      alert(res.error || "Failed to update comment.");
      return false;
    }
  };

  const handleDeleteComment = async (commentId: string): Promise<boolean> => {
    if (!requireAuth()) return false;

    const res = await deleteCommentAction(commentId);
    if (res.success) {
      return true;
    } else {
      alert(res.error || "Failed to delete comment.");
      return false;
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="text-xs">Loading discussion...</span>
      </div>
    );
  }

  return (
    <div className="pt-8 border-t border-gray-200 dark:border-zinc-800">
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 text-xs">
          {error}
        </div>
      )}
      <CommentThread
        blogId={blogId}
        initialComments={comments}
        currentUser={currentUser}
        onAddComment={handleAddComment}
        onAddReply={handleAddReply}
        onEditComment={handleEditComment}
        onDeleteComment={handleDeleteComment}
      />
    </div>
  );
}

export default BlogComments;
