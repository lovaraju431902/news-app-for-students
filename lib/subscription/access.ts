import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getSession as getAdminSession } from "@/lib/session";
import { headers } from "next/headers";

export interface UserAccessInfo {
  userId: string | null;
  isAuthenticated: boolean;
  hasActiveSubscription: boolean;
  isAdmin: boolean;
  subscription: {
    status: string;
    currentPeriodEnd: Date | null;
    cancelAtPeriodEnd: boolean;
  } | null;
}

/**
 * Checks if a user has active subscription privileges
 * Returns true if subscription is 'active', or 'cancelled' but before currentPeriodEnd.
 */
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  if (!userId) return false;

  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      OR: [
        { status: "active" },
        {
          status: "cancelled",
          currentPeriodEnd: { gt: new Date() },
        },
      ],
    },
    orderBy: { updatedAt: "desc" },
  });

  return Boolean(subscription);
}

/**
 * Evaluates the full access level for the current visitor on the server.
 */
export async function getAccessLevel(): Promise<UserAccessInfo> {
  // 1. Check if user is site admin (admin bypasses paywall)
  const admin = await getAdminSession().catch(() => null);
  const isAdmin = Boolean(admin);

  // 2. Check Better Auth user session
  let session = null;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (err) {
    session = null;
  }

  if (!session?.user) {
    return {
      userId: null,
      isAuthenticated: false,
      hasActiveSubscription: isAdmin, // Admins always have access
      isAdmin,
      subscription: null,
    };
  }

  const userId = session.user.id;

  // 3. Find latest subscription
  const sub = await prisma.subscription.findFirst({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });

  const isSubActive =
    sub?.status === "active" ||
    (sub?.status === "cancelled" &&
      sub?.currentPeriodEnd &&
      new Date(sub.currentPeriodEnd) > new Date());

  return {
    userId,
    isAuthenticated: true,
    hasActiveSubscription: isAdmin || Boolean(isSubActive),
    isAdmin,
    subscription: sub
      ? {
          status: sub.status,
          currentPeriodEnd: sub.currentPeriodEnd,
          cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
        }
      : null,
  };
}
