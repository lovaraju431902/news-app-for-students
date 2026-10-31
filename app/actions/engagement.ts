"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

// Helper: Get authenticated user from Better Auth session
async function getAuthUser() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session?.user ?? null;
  } catch (err) {
    return null;
  }
}

// ---------------------------------------------------------------------------
// 1. ENGAGEMENT STATE (Likes & Bookmarks)
// ---------------------------------------------------------------------------

export async function getBlogEngagementStateAction(blogId: string) {
  if (!blogId) {
    return { success: false, likesCount: 0, isLiked: false, isBookmarked: false, commentsCount: 0 };
  }

  try {
    const user = await getAuthUser();

    const [likesCount, commentsCount, userLike, userBookmark] = await Promise.all([
      prisma.blogLike.count({ where: { blogId } }),
      prisma.comment.count({ where: { blogId, isDeleted: false } }),
      user ? prisma.blogLike.findUnique({ where: { userId_blogId: { userId: user.id, blogId } } }) : null,
      user ? prisma.bookmark.findUnique({ where: { userId_blogId: { userId: user.id, blogId } } }) : null,
    ]);

    return {
      success: true,
      likesCount,
      commentsCount,
      isLiked: Boolean(userLike),
      isBookmarked: Boolean(userBookmark),
    };
  } catch (error: any) {
    console.error("Error fetching engagement state:", error);
    return {
      success: false,
      likesCount: 0,
      commentsCount: 0,
      isLiked: false,
      isBookmarked: false,
    };
  }
}

// ---------------------------------------------------------------------------
// 2. TOGGLE LIKE
// ---------------------------------------------------------------------------

export type ToggleLikeResult =
  | { success: true; liked: boolean; likesCount: number }
  | { success: false; error: string; unauthorized?: boolean };

export async function toggleBlogLikeAction(blogId: string): Promise<ToggleLikeResult> {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: "Please sign in to like this post.", unauthorized: true };
    }

    // Verify blog exists
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      select: { id: true, slug: true },
    });

    if (!blog) {
      return { success: false, error: "Article not found." };
    }

    // Check existing like
    const existingLike = await prisma.blogLike.findUnique({
      where: {
        userId_blogId: {
          userId: user.id,
          blogId,
        },
      },
    });

    let liked = false;
    if (existingLike) {
      // Remove like
      await prisma.blogLike.delete({
        where: { id: existingLike.id },
      });
      liked = false;
    } else {
      // Create like (using upsert or try-catch for concurrency safety)
      try {
        await prisma.blogLike.create({
          data: {
            userId: user.id,
            blogId,
          },
        });
        liked = true;
      } catch (err: any) {
        // Unique constraint race condition
        liked = true;
      }
    }

    const likesCount = await prisma.blogLike.count({ where: { blogId } });

    return { success: true, liked, likesCount };
  } catch (error: any) {
    console.error("Error toggling like:", error);
    return { success: false, error: "Failed to update like status. Please try again." };
  }
}

// ---------------------------------------------------------------------------
// 3. TOGGLE BOOKMARK / SAVED BLOG
// ---------------------------------------------------------------------------

export type ToggleBookmarkResult =
  | { success: true; bookmarked: boolean }
  | { success: false; error: string; unauthorized?: boolean };

export async function toggleBlogBookmarkAction(blogId: string): Promise<ToggleBookmarkResult> {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: "Please sign in to save this post.", unauthorized: true };
    }

    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      select: { id: true, slug: true },
    });

    if (!blog) {
      return { success: false, error: "Article not found." };
    }

    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_blogId: {
          userId: user.id,
          blogId,
        },
      },
    });

    let bookmarked = false;
    if (existing) {
      await prisma.bookmark.delete({
        where: { id: existing.id },
      });
      bookmarked = false;
    } else {
      try {
        await prisma.bookmark.create({
          data: {
            userId: user.id,
            blogId,
          },
        });
        bookmarked = true;
      } catch (e) {
        bookmarked = true;
      }
    }

    revalidatePath("/saved");
    return { success: true, bookmarked };
  } catch (error: any) {
    console.error("Error toggling bookmark:", error);
    return { success: false, error: "Failed to update bookmark status." };
  }
}

// ---------------------------------------------------------------------------
// 4. GET SAVED BLOGS (User's Bookmarks)
// ---------------------------------------------------------------------------

export async function getSavedBlogsAction(page = 1, limit = 12) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: "Unauthorized", unauthorized: true, blogs: [], total: 0 };
    }

    const skip = (page - 1) * limit;

    const [total, bookmarks] = await Promise.all([
      prisma.bookmark.count({ where: { userId: user.id } }),
      prisma.bookmark.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          blog: {
            include: {
              tags: {
                include: {
                  tag: true,
                },
              },
            },
          },
        },
      }),
    ]);

    const formattedBlogs = bookmarks.map((b) => ({
      ...b.blog,
      savedAt: b.createdAt.toISOString(),
      bookmarkId: b.id,
    }));

    return {
      success: true,
      blogs: formattedBlogs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error: any) {
    console.error("Error fetching saved blogs:", error);
    return { success: false, error: "Failed to load saved blogs.", blogs: [], total: 0 };
  }
}

// ---------------------------------------------------------------------------
// 5. COMMENTS & NESTED REPLIES
// ---------------------------------------------------------------------------

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export async function getBlogCommentsAction(blogId: string, page = 1, limit = 20) {
  if (!blogId) return { success: false, comments: [], total: 0 };

  try {
    const user = await getAuthUser();
    const skip = (page - 1) * limit;

    // Fetch top-level comments (parentId is null)
    const [total, topComments] = await Promise.all([
      prisma.comment.count({
        where: { blogId, parentId: null },
      }),
      prisma.comment.findMany({
        where: { blogId, parentId: null },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          user: {
            select: { id: true, name: true, image: true, email: true },
          },
          replies: {
            orderBy: { createdAt: "asc" },
            include: {
              user: {
                select: { id: true, name: true, image: true, email: true },
              },
              replies: {
                orderBy: { createdAt: "asc" },
                include: {
                  user: {
                    select: { id: true, name: true, image: true, email: true },
                  },
                },
              },
            },
          },
        },
      }),
    ]);

    // Format for UI TripleD CommentThread structure
    const formatComment = (c: any): any => ({
      id: c.id,
      content: c.isDeleted ? "This comment has been deleted." : c.content,
      isDeleted: c.isDeleted,
      timestamp: formatRelativeTime(c.createdAt),
      createdAtRaw: c.createdAt.toISOString(),
      likes: 0,
      isLiked: false,
      userId: c.userId,
      isOwner: user ? user.id === c.userId : false,
      user: {
        name: c.user?.name || "Student",
        avatar: c.user?.image || "",
        role: "Student",
      },
      replies: (c.replies || []).map(formatComment),
    });

    return {
      success: true,
      comments: topComments.map(formatComment),
      total,
      page,
      hasMore: skip + topComments.length < total,
    };
  } catch (error: any) {
    console.error("Error fetching comments:", error);
    return { success: false, comments: [], total: 0 };
  }
}

// ---------------------------------------------------------------------------
// 6. CREATE COMMENT / REPLY
// ---------------------------------------------------------------------------

export async function createCommentAction(
  blogId: string,
  content: string,
  parentId?: string | null
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: "Please sign in to join the conversation.", unauthorized: true };
    }

    const trimmed = content?.trim();
    if (!trimmed) {
      return { success: false, error: "Comment cannot be empty." };
    }

    if (trimmed.length > 2500) {
      return { success: false, error: "Comment is too long (maximum 2,500 characters)." };
    }

    // Verify blog existence
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      select: { id: true },
    });

    if (!blog) {
      return { success: false, error: "Article not found." };
    }

    // If parentId is specified, verify it belongs to the same blog
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
        select: { id: true, blogId: true },
      });

      if (!parentComment || parentComment.blogId !== blogId) {
        return { success: false, error: "Invalid parent comment." };
      }
    }

    const newComment = await prisma.comment.create({
      data: {
        content: trimmed,
        blogId,
        userId: user.id,
        parentId: parentId || null,
      },
      include: {
        user: {
          select: { id: true, name: true, image: true, email: true },
        },
      },
    });

    return {
      success: true,
      comment: {
        id: newComment.id,
        content: newComment.content,
        isDeleted: false,
        timestamp: "Just now",
        createdAtRaw: newComment.createdAt.toISOString(),
        likes: 0,
        isLiked: false,
        userId: user.id,
        isOwner: true,
        user: {
          name: newComment.user?.name || "You",
          avatar: newComment.user?.image || "",
          role: "Student",
        },
        replies: [],
      },
    };
  } catch (error: any) {
    console.error("Error creating comment:", error);
    return { success: false, error: "Failed to post comment. Please try again." };
  }
}

// ---------------------------------------------------------------------------
// 7. EDIT COMMENT
// ---------------------------------------------------------------------------

export async function updateCommentAction(commentId: string, content: string) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: "Unauthorized", unauthorized: true };
    }

    const trimmed = content?.trim();
    if (!trimmed) {
      return { success: false, error: "Comment cannot be empty." };
    }

    if (trimmed.length > 2500) {
      return { success: false, error: "Comment is too long (maximum 2,500 characters)." };
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true, userId: true, isDeleted: true },
    });

    if (!comment || comment.isDeleted) {
      return { success: false, error: "Comment not found or has been deleted." };
    }

    if (comment.userId !== user.id) {
      return { success: false, error: "You can only edit your own comments." };
    }

    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: { content: trimmed },
    });

    return { success: true, content: updated.content };
  } catch (error: any) {
    console.error("Error updating comment:", error);
    return { success: false, error: "Failed to edit comment." };
  }
}

// ---------------------------------------------------------------------------
// 8. DELETE COMMENT
// ---------------------------------------------------------------------------

export async function deleteCommentAction(commentId: string) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: "Unauthorized", unauthorized: true };
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        replies: {
          select: { id: true },
        },
      },
    });

    if (!comment) {
      return { success: false, error: "Comment not found." };
    }

    if (comment.userId !== user.id) {
      return { success: false, error: "You can only delete your own comments." };
    }

    // Tombstone strategy: if comment has replies, soft delete to preserve conversation hierarchy
    if (comment.replies && comment.replies.length > 0) {
      await prisma.comment.update({
        where: { id: commentId },
        data: {
          isDeleted: true,
          content: "This comment has been deleted.",
        },
      });
      return { success: true, softDeleted: true };
    } else {
      // Leaf comment: hard delete
      await prisma.comment.delete({
        where: { id: commentId },
      });
      return { success: true, softDeleted: false };
    }
  } catch (error: any) {
    console.error("Error deleting comment:", error);
    return { success: false, error: "Failed to delete comment." };
  }
}
