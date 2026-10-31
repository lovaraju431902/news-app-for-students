"use client";

import React, { useEffect, useRef, useState, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  CornerDownRight,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
  Share2,
  Trash2,
  Edit2,
  Smile,
  Check,
} from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

export interface CommentUser {
  name: string;
  avatar?: string;
  role?: string;
}

export interface CommentItemData {
  id: string;
  user: CommentUser;
  content: string;
  timestamp: string;
  likes: number;
  replies?: CommentItemData[];
  isLiked?: boolean;
  isDeleted?: boolean;
  isOwner?: boolean;
  userId?: string;
}

export interface CommentThreadProps {
  blogId?: string;
  initialComments?: CommentItemData[];
  currentUser?: {
    id: string;
    name: string;
    avatar?: string;
  } | null;
  onAddComment?: (content: string) => Promise<CommentItemData | null>;
  onAddReply?: (parentId: string, content: string) => Promise<CommentItemData | null>;
  onEditComment?: (commentId: string, content: string) => Promise<boolean>;
  onDeleteComment?: (commentId: string) => Promise<boolean>;
  className?: string;
}

// ============================================================================
// COMMENT INPUT
// ============================================================================

export function CommentInput({
  placeholder = "What are your thoughts?",
  onSubmit,
  onCancel,
  autoFocus = false,
  className,
  inputId,
  labelId,
  initialValue = "",
  submitLabel,
  currentUserAvatar,
  currentUserName,
}: {
  placeholder?: string;
  onSubmit: (content: string) => void | Promise<void>;
  onCancel?: () => void;
  autoFocus?: boolean;
  className?: string;
  inputId?: string;
  labelId?: string;
  initialValue?: string;
  submitLabel?: string;
  currentUserAvatar?: string;
  currentUserName?: string;
}) {
  const [content, setContent] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(autoFocus);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;
    try {
      setIsSubmitting(true);
      await onSubmit(content.trim());
      setContent("");
      setIsFocused(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape" && onCancel) {
      e.preventDefault();
      onCancel();
    }
  };

  const uniqueId = inputId || `comment-input-${Math.random().toString(36).substring(2, 9)}`;
  const uniqueLabelId = labelId || `comment-label-${Math.random().toString(36).substring(2, 9)}`;
  const initial = (currentUserName || "U")[0].toUpperCase();

  return (
    <div
      className={cn(
        "relative rounded-xl border bg-background/50 dark:bg-zinc-900/60 backdrop-blur-sm transition-all duration-200",
        isFocused
          ? "border-blue-500/50 ring-4 ring-blue-500/5 shadow-md"
          : "border-border/60",
        className
      )}
      role="form"
      aria-label="Comment input"
    >
      <div className="p-4">
        <div className="flex gap-3.5">
          <Avatar className="h-8 w-8 border border-border/50 shrink-0" aria-hidden="true">
            {currentUserAvatar && <AvatarImage src={currentUserAvatar} alt="" />}
            <AvatarFallback className="bg-blue-600 text-white font-bold text-xs">{initial}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <label htmlFor={uniqueId} id={uniqueLabelId} className="sr-only">
              {placeholder}
            </label>
            <Textarea
              id={uniqueId}
              ref={textareaRef}
              placeholder={placeholder}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onKeyDown={handleKeyDown}
              autoFocus={autoFocus}
              aria-label={placeholder}
              aria-describedby={uniqueLabelId}
              className="min-h-[64px] border-none bg-transparent p-0 resize-none focus-visible:ring-0 placeholder:text-muted-foreground/70 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-4 py-2 border-t border-border/30 bg-muted/20 dark:bg-zinc-900/40 rounded-b-xl"
        role="toolbar"
        aria-label="Comment formatting options"
      >
        <div className="flex items-center gap-1 text-xs text-muted-foreground" role="group">
          <span className="hidden sm:inline text-[11px] text-muted-foreground/60">
            Press <kbd className="px-1 py-0.5 rounded border border-border/60 text-[10px] bg-muted">Ctrl+Enter</kbd> to submit
          </span>
        </div>
        <div className="flex items-center gap-2">
          {onCancel && (
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={onCancel}
              className="text-xs h-8 cursor-pointer"
              aria-label="Cancel reply"
            >
              Cancel
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting}
            size="sm"
            type="submit"
            className="gap-1.5 transition-all h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium cursor-pointer"
            aria-label={onCancel ? "Submit reply" : "Submit comment"}
          >
            {isSubmitting ? "Posting..." : submitLabel || (onCancel ? "Reply" : "Post")}
            <Send className="h-3 w-3" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// COMMENT ITEM
// ============================================================================

export function CommentItem({
  comment,
  isReply = false,
  activeReplyId,
  setActiveReplyId,
  onAddReply,
  onEditComment,
  onDeleteComment,
  currentUserAvatar,
  currentUserName,
}: {
  comment: CommentItemData;
  isReply?: boolean;
  activeReplyId: string | null;
  setActiveReplyId: (id: string | null) => void;
  onAddReply?: (parentId: string, content: string) => Promise<any>;
  onEditComment?: (commentId: string, content: string) => Promise<any>;
  onDeleteComment?: (commentId: string) => Promise<any>;
  currentUserAvatar?: string;
  currentUserName?: string;
}) {
  const [isLiked, setIsLiked] = useState(Boolean(comment.isLiked));
  const [likesCount, setLikesCount] = useState(comment.likes || 0);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [copied, setCopied] = useState(false);
  const replyInputRef = useRef<HTMLDivElement>(null);

  const handleLike = () => {
    if (isLiked) {
      setLikesCount((prev) => Math.max(0, prev - 1));
    } else {
      setLikesCount((prev) => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const isReplying = activeReplyId === comment.id;

  useEffect(() => {
    if (isReplying && replyInputRef.current) {
      const textarea = replyInputRef.current.querySelector("textarea");
      if (textarea) {
        setTimeout(() => textarea.focus(), 100);
      }
    }
  }, [isReplying]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}${window.location.pathname}#comment-${comment.id}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim() || !onEditComment) return;
    const ok = await onEditComment(comment.id, editContent.trim());
    if (ok) {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!onDeleteComment) return;
    if (window.confirm("Are you sure you want to delete this comment?")) {
      await onDeleteComment(comment.id);
    }
  };

  const commentId = `comment-${comment.id}`;
  const repliesId = `replies-${comment.id}`;
  const authorInitial = (comment.user.name || "S")[0].toUpperCase();

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className={cn(
        "relative group text-left",
        isReply ? "ml-4 sm:ml-8 pl-3 sm:pl-4 border-l-2 border-border/40" : "mb-6"
      )}
      id={commentId}
      aria-label={`Comment by ${comment.user.name}`}
    >
      <div className="flex gap-3 sm:gap-4 items-start">
        <Avatar
          className={cn(
            "border border-border/50 shrink-0",
            isReply ? "h-7 w-7 sm:h-8 sm:h-8" : "h-9 w-9 sm:h-10 sm:w-10"
          )}
        >
          {comment.user.avatar && (
            <AvatarImage src={comment.user.avatar} alt={`${comment.user.name}'s avatar`} />
          )}
          <AvatarFallback className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs" aria-hidden="true">
            {authorInitial}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-1.5 min-w-0">
          {/* Header */}
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-semibold text-foreground truncate">
                {comment.user.name}
              </span>
              {comment.user.role && (
                <span
                  className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium"
                  aria-label={`Role: ${comment.user.role}`}
                >
                  {comment.user.role}
                </span>
              )}
              <time
                className="text-[11px] text-muted-foreground"
                dateTime={comment.timestamp}
                aria-label={`Posted ${comment.timestamp}`}
              >
                • {comment.timestamp}
              </time>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 cursor-pointer"
                  aria-label={`More options for ${comment.user.name}'s comment`}
                  aria-haspopup="true"
                >
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : null}
                  <span>{copied ? "Copied Link!" : "Copy Link"}</span>
                </DropdownMenuItem>

                {comment.isOwner && !comment.isDeleted && (
                  <>
                    <DropdownMenuItem
                      onClick={() => setIsEditing(true)}
                      className="cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleDelete}
                      className="text-red-600 dark:text-red-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          {/* Content / Edit Form */}
          {isEditing ? (
            <div className="space-y-2 pt-1">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="text-sm rounded-lg"
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  className="h-7 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
                  className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <p
              className={cn(
                "text-xs sm:text-sm leading-relaxed break-words",
                comment.isDeleted
                  ? "italic text-muted-foreground/70"
                  : "text-foreground/90"
              )}
            >
              {comment.content}
            </p>
          )}

          {/* Actions */}
          {!comment.isDeleted && (
            <nav className="flex items-center gap-4 pt-1" aria-label="Comment actions">
              <button
                onClick={handleLike}
                type="button"
                className={cn(
                  "flex items-center gap-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded cursor-pointer",
                  isLiked
                    ? "text-red-500"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-label={
                  isLiked
                    ? `Unlike comment (${likesCount} likes)`
                    : `Like comment (${likesCount} likes)`
                }
                aria-pressed={isLiked}
              >
                <Heart
                  className={cn("h-3.5 w-3.5", isLiked && "fill-current")}
                  aria-hidden="true"
                />
                <span aria-live="polite" aria-atomic="true">
                  {likesCount}
                </span>
              </button>

              <button
                onClick={() => setActiveReplyId(isReplying ? null : comment.id)}
                type="button"
                className={cn(
                  "flex items-center gap-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded cursor-pointer",
                  isReplying
                    ? "text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-label={isReplying ? "Cancel reply" : `Reply to ${comment.user.name}`}
                aria-expanded={isReplying}
                aria-controls={isReplying ? `reply-input-${comment.id}` : undefined}
              >
                <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                Reply
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded cursor-pointer"
                aria-label={`Share ${comment.user.name}'s comment`}
              >
                <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
                Share
              </button>
            </nav>
          )}

          {/* Inline Reply Input */}
          <AnimatePresence>
            {isReplying && onAddReply && (
              <motion.div
                ref={replyInputRef}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-3 overflow-hidden"
                id={`reply-input-${comment.id}`}
                role="region"
                aria-label={`Reply to ${comment.user.name}`}
              >
                <CommentInput
                  autoFocus
                  placeholder={`Reply to ${comment.user.name}...`}
                  onSubmit={async (content) => {
                    await onAddReply(comment.id, content);
                    setActiveReplyId(null);
                  }}
                  onCancel={() => setActiveReplyId(null)}
                  currentUserAvatar={currentUserAvatar}
                  currentUserName={currentUserName}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <section
          className="mt-3.5 space-y-3.5"
          id={repliesId}
          aria-label={`${comment.replies.length} ${comment.replies.length === 1 ? "reply" : "replies"}`}
        >
          {isExpanded ? (
            <AnimatePresence>
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  isReply={true}
                  activeReplyId={activeReplyId}
                  setActiveReplyId={setActiveReplyId}
                  onAddReply={onAddReply}
                  onEditComment={onEditComment}
                  onDeleteComment={onDeleteComment}
                  currentUserAvatar={currentUserAvatar}
                  currentUserName={currentUserName}
                />
              ))}
            </AnimatePresence>
          ) : null}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            type="button"
            className="ml-8 sm:ml-12 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded cursor-pointer"
            aria-label={
              isExpanded
                ? "Hide replies"
                : `Show ${comment.replies.length} replies`
            }
            aria-expanded={isExpanded}
            aria-controls={repliesId}
          >
            {isExpanded ? (
              <div className="h-[1px] w-4 bg-blue-500/50 mr-1" aria-hidden="true" />
            ) : (
              <CornerDownRight className="h-3 w-3" aria-hidden="true" />
            )}
            {isExpanded
              ? "Hide replies"
              : `Show ${comment.replies.length} ${comment.replies.length === 1 ? "reply" : "replies"}`}
          </button>
        </section>
      )}
    </motion.article>
  );
}

// ============================================================================
// MAIN COMPONENT: CommentThread
// ============================================================================

export function CommentThread({
  blogId,
  initialComments = [],
  currentUser,
  onAddComment,
  onAddReply,
  onEditComment,
  onDeleteComment,
  className = "",
}: CommentThreadProps) {
  const [comments, setComments] = useState<CommentItemData[]>(initialComments);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "top">("newest");

  // Keep internal comments in sync if initialComments updates from server
  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  // Recursive function to add reply into comment tree
  const addReplyToTree = (
    list: CommentItemData[],
    parentId: string,
    newReply: CommentItemData
  ): CommentItemData[] => {
    return list.map((c) => {
      if (c.id === parentId) {
        return {
          ...c,
          replies: [...(c.replies || []), newReply],
        };
      } else if (c.replies && c.replies.length > 0) {
        return {
          ...c,
          replies: addReplyToTree(c.replies, parentId, newReply),
        };
      }
      return c;
    });
  };

  // Recursive function to update a comment in the tree
  const updateInTree = (
    list: CommentItemData[],
    commentId: string,
    newContent: string
  ): CommentItemData[] => {
    return list.map((c) => {
      if (c.id === commentId) {
        return { ...c, content: newContent };
      }
      if (c.replies && c.replies.length > 0) {
        return { ...c, replies: updateInTree(c.replies, commentId, newContent) };
      }
      return c;
    });
  };

  // Recursive function to soft-delete or remove a comment from tree
  const deleteFromTree = (
    list: CommentItemData[],
    commentId: string
  ): CommentItemData[] => {
    return list
      .map((c) => {
        if (c.id === commentId) {
          if (c.replies && c.replies.length > 0) {
            return {
              ...c,
              isDeleted: true,
              content: "This comment has been deleted.",
            };
          }
          return null;
        }
        if (c.replies && c.replies.length > 0) {
          return { ...c, replies: deleteFromTree(c.replies, commentId) };
        }
        return c;
      })
      .filter(Boolean) as CommentItemData[];
  };

  const handleAddComment = async (content: string) => {
    if (onAddComment) {
      const created = await onAddComment(content);
      if (created) {
        setComments((prev) => [created, ...prev]);
        setAnnouncement("Comment posted successfully");
        setTimeout(() => setAnnouncement(""), 1000);
      }
    }
  };

  const handleAddReply = async (parentId: string, content: string) => {
    if (onAddReply) {
      const created = await onAddReply(parentId, content);
      if (created) {
        setComments((prev) => addReplyToTree(prev, parentId, created));
        setActiveReplyId(null);
        setAnnouncement("Reply posted successfully");
        setTimeout(() => setAnnouncement(""), 1000);
      }
    }
  };

  const handleEditComment = async (commentId: string, newContent: string) => {
    if (onEditComment) {
      const success = await onEditComment(commentId, newContent);
      if (success) {
        setComments((prev) => updateInTree(prev, commentId, newContent));
        return true;
      }
    }
    return false;
  };

  const handleDeleteComment = async (commentId: string) => {
    if (onDeleteComment) {
      const success = await onDeleteComment(commentId);
      if (success) {
        setComments((prev) => deleteFromTree(prev, commentId));
        return true;
      }
    }
    return false;
  };

  // Count total visible comments including nested replies
  const countAll = (list: CommentItemData[]): number => {
    return list.reduce((acc, c) => acc + 1 + (c.replies ? countAll(c.replies) : 0), 0);
  };
  const totalCount = countAll(comments);

  return (
    <div
      className={cn("w-full mx-auto space-y-6 sm:space-y-8", className)}
      role="region"
      aria-label="Comments section"
    >
      {/* Screen reader announcements */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      {/* Header */}
      <header className="flex items-center justify-between border-b border-border/40 pb-4">
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground" id="comments-heading">
          Discussion ({totalCount})
        </h2>
        <div className="flex items-center gap-1.5" role="group" aria-label="Sort comments">
          <Button
            variant={sortBy === "newest" ? "secondary" : "ghost"}
            size="sm"
            type="button"
            onClick={() => setSortBy("newest")}
            className="text-xs h-7 px-2.5 cursor-pointer font-medium"
            aria-label="Sort by newest"
          >
            Newest
          </Button>
          <Button
            variant={sortBy === "top" ? "secondary" : "ghost"}
            size="sm"
            type="button"
            onClick={() => setSortBy("top")}
            className="text-xs h-7 px-2.5 cursor-pointer font-medium"
            aria-label="Sort by top"
          >
            Top
          </Button>
        </div>
      </header>

      {/* Main Input Area */}
      <section aria-labelledby="new-comment-heading">
        <h3 id="new-comment-heading" className="sr-only">
          Write a comment
        </h3>
        <CommentInput
          onSubmit={handleAddComment}
          currentUserAvatar={currentUser?.avatar}
          currentUserName={currentUser?.name}
          placeholder="Share your perspective or ask a question..."
        />
      </section>

      {/* Comments List */}
      <section aria-labelledby="comments-heading">
        {comments.length === 0 ? (
          <div className="py-12 text-center rounded-xl border border-dashed border-border/60 bg-muted/10">
            <MessageCircle className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm font-semibold text-foreground/80">No comments yet</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Be the first to share your thoughts on this article!
            </p>
          </div>
        ) : (
          <div className="space-y-4" role="list" aria-label="Comment thread">
            <AnimatePresence mode="popLayout">
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  activeReplyId={activeReplyId}
                  setActiveReplyId={setActiveReplyId}
                  onAddReply={handleAddReply}
                  onEditComment={handleEditComment}
                  onDeleteComment={handleDeleteComment}
                  currentUserAvatar={currentUser?.avatar}
                  currentUserName={currentUser?.name}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </div>
  );
}

export default CommentThread;
