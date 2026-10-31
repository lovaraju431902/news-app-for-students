"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

// Guard: verify admin session
async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized: Admin session required.");
  }
  return session;
}

// ---------------------------------------------------------------------------
// 1. DASHBOARD REAL-TIME STATS
// ---------------------------------------------------------------------------

export async function getAdminDashboardStatsAction() {
  try {
    await requireAdmin();

    const [
      totalPosts,
      totalCategories,
      totalUsers,
      activeSubscribers,
      totalSubscriptions,
      totalComments,
      totalLikes,
      viewsAggregate,
      recentUsers,
      recentSubscriptions,
      recentComments,
    ] = await Promise.all([
      prisma.blog.count(),
      prisma.tag.count(),
      prisma.user.count(),
      prisma.subscription.count({ where: { status: "active" } }),
      prisma.subscription.count(),
      prisma.comment.count({ where: { isDeleted: false } }),
      prisma.blogLike.count(),
      prisma.blog.aggregate({
        _sum: { views: true },
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          createdAt: true,
          subscriptions: {
            take: 1,
            orderBy: { createdAt: "desc" },
            select: { status: true, planId: true },
          },
        },
      }),
      prisma.subscription.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
      }),
      prisma.comment.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { id: true, name: true, image: true, email: true },
          },
          blog: {
            select: { id: true, title: true, slug: true },
          },
        },
      }),
    ]);

    const totalViews = viewsAggregate._sum.views ?? 0;
    const monthlyRecurringRevenue = activeSubscribers * 399; // Standard plan ₹399/mo

    return {
      success: true,
      stats: {
        totalPosts,
        totalCategories,
        totalUsers,
        activeSubscribers,
        totalSubscriptions,
        totalComments,
        totalLikes,
        totalViews,
        monthlyRecurringRevenue,
      },
      recentUsers: recentUsers.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        image: u.image,
        createdAt: u.createdAt.toISOString(),
        subscriptionStatus: u.subscriptions[0]?.status || "free",
      })),
      recentSubscriptions: recentSubscriptions.map((s) => ({
        id: s.id,
        status: s.status,
        planId: s.planId,
        provider: s.provider,
        providerSubscriptionId: s.providerSubscriptionId,
        createdAt: s.createdAt.toISOString(),
        user: s.user,
      })),
      recentComments: recentComments.map((c) => ({
        id: c.id,
        content: c.content,
        isDeleted: c.isDeleted,
        createdAt: c.createdAt.toISOString(),
        user: c.user,
        blog: c.blog,
      })),
    };
  } catch (error: any) {
    console.error("Error fetching admin stats:", error);
    return { success: false, error: error.message || "Failed to load dashboard statistics." };
  }
}

// ---------------------------------------------------------------------------
// 2. USERS MANAGEMENT (Real User Data)
// ---------------------------------------------------------------------------

export async function getAdminUsersAction(page = 1, limit = 15, search = "") {
  try {
    await requireAdmin();
    const skip = (page - 1) * limit;

    const whereClause: any = {};
    if (search && search.trim()) {
      const q = search.trim();
      whereClause.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
      ];
    }

    const [total, users] = await Promise.all([
      prisma.user.count({ where: whereClause }),
      prisma.user.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          subscriptions: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: {
              status: true,
              planId: true,
              currentPeriodEnd: true,
              cancelAtPeriodEnd: true,
            },
          },
          _count: {
            select: {
              comments: true,
              likes: true,
              bookmarks: true,
              sessions: true,
            },
          },
        },
      }),
    ]);

    const formattedUsers = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      emailVerified: u.emailVerified,
      image: u.image,
      createdAt: u.createdAt.toISOString(),
      updatedAt: u.updatedAt.toISOString(),
      subscription: u.subscriptions[0]
        ? {
            status: u.subscriptions[0].status,
            planId: u.subscriptions[0].planId,
            currentPeriodEnd: u.subscriptions[0].currentPeriodEnd?.toISOString() ?? null,
            cancelAtPeriodEnd: u.subscriptions[0].cancelAtPeriodEnd,
          }
        : null,
      stats: {
        commentsCount: u._count.comments,
        likesCount: u._count.likes,
        bookmarksCount: u._count.bookmarks,
        activeSessions: u._count.sessions,
      },
    }));

    return {
      success: true,
      users: formattedUsers,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error: any) {
    console.error("Error fetching admin users:", error);
    return { success: false, error: error.message || "Failed to load users.", users: [], total: 0 };
  }
}

// ---------------------------------------------------------------------------
// 3. SUBSCRIBERS MANAGEMENT (Real Subscription Data)
// ---------------------------------------------------------------------------

export async function getAdminSubscribersAction(
  page = 1,
  limit = 15,
  statusFilter = "all",
  search = ""
) {
  try {
    await requireAdmin();
    const skip = (page - 1) * limit;

    const whereClause: any = {};
    if (statusFilter !== "all") {
      whereClause.status = statusFilter;
    }

    if (search && search.trim()) {
      const q = search.trim();
      whereClause.user = {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
        ],
      };
    }

    const [total, activeCount, cancelledCount, subscriptions] = await Promise.all([
      prisma.subscription.count({ where: whereClause }),
      prisma.subscription.count({ where: { status: "active" } }),
      prisma.subscription.count({ where: { status: { in: ["cancelled", "halted", "expired"] } } }),
      prisma.subscription.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          user: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
      }),
    ]);

    return {
      success: true,
      subscriptions: subscriptions.map((s) => ({
        id: s.id,
        userId: s.userId,
        provider: s.provider,
        providerSubscriptionId: s.providerSubscriptionId,
        planId: s.planId,
        status: s.status,
        currentPeriodStart: s.currentPeriodStart?.toISOString() ?? null,
        currentPeriodEnd: s.currentPeriodEnd?.toISOString() ?? null,
        cancelAtPeriodEnd: s.cancelAtPeriodEnd,
        createdAt: s.createdAt.toISOString(),
        user: s.user,
      })),
      total,
      activeCount,
      cancelledCount,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error: any) {
    console.error("Error fetching admin subscribers:", error);
    return {
      success: false,
      error: error.message || "Failed to load subscribers.",
      subscriptions: [],
      total: 0,
      activeCount: 0,
      cancelledCount: 0,
    };
  }
}

// ---------------------------------------------------------------------------
// 4. COMMENTS MANAGEMENT (Real Discussion Data)
// ---------------------------------------------------------------------------

export async function getAdminCommentsAction(page = 1, limit = 15, search = "") {
  try {
    await requireAdmin();
    const skip = (page - 1) * limit;

    const whereClause: any = {};
    if (search && search.trim()) {
      const q = search.trim();
      whereClause.OR = [
        { content: { contains: q, mode: "insensitive" } },
        { user: { name: { contains: q, mode: "insensitive" } } },
        { user: { email: { contains: q, mode: "insensitive" } } },
        { blog: { title: { contains: q, mode: "insensitive" } } },
      ];
    }

    const [total, comments] = await Promise.all([
      prisma.comment.count({ where: whereClause }),
      prisma.comment.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          user: {
            select: { id: true, name: true, email: true, image: true },
          },
          blog: {
            select: { id: true, title: true, slug: true },
          },
          _count: {
            select: { replies: true },
          },
        },
      }),
    ]);

    return {
      success: true,
      comments: comments.map((c) => ({
        id: c.id,
        content: c.content,
        isDeleted: c.isDeleted,
        createdAt: c.createdAt.toISOString(),
        repliesCount: c._count.replies,
        user: c.user,
        blog: c.blog,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error: any) {
    console.error("Error fetching admin comments:", error);
    return { success: false, error: error.message || "Failed to load comments.", comments: [], total: 0 };
  }
}

// ---------------------------------------------------------------------------
// 5. DELETE COMMENT (Admin Action)
// ---------------------------------------------------------------------------

export async function deleteCommentByAdminAction(commentId: string) {
  try {
    await requireAdmin();

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { replies: { select: { id: true } } },
    });

    if (!comment) {
      return { success: false, error: "Comment not found." };
    }

    if (comment.replies && comment.replies.length > 0) {
      await prisma.comment.update({
        where: { id: commentId },
        data: {
          isDeleted: true,
          content: "[Comment removed by moderator]",
        },
      });
    } else {
      await prisma.comment.delete({
        where: { id: commentId },
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting comment as admin:", error);
    return { success: false, error: error.message || "Failed to delete comment." };
  }
}
