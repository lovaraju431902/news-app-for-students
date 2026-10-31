"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redis } from "@/lib/redis";
import { isValidSection } from "@/lib/homepage-sections";

// Helper to invalidate all homepage-related Redis keys and Next.js ISR path
async function invalidateHomepageCaches() {
  if (redis.isConfigured) {
    try {
      const keys = [
        "slides:active",
        "rightcards:active",
        "latestnews:active",
        "trendingnews:active",
        "technologynews:active",
        "videos:active",
        "mostread:active",
      ];
      for (const k of keys) {
        await redis.del(k);
      }
    } catch (err) {
      console.error("Redis cache invalidation error:", err);
    }
  }
  revalidatePath("/");
}

/**
 * Fetch all items currently assigned to a given homepage section
 */
export async function getHomepageSectionItemsAction(section: string) {
  try {
    if (!isValidSection(section)) {
      return { success: false, error: `Invalid section: ${section}` };
    }

    const items = await prisma.homepageItem.findMany({
      where: {
        section,
      },
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
      orderBy: [
        { priority: "desc" },
        { order: "asc" },
        { createdAt: "desc" },
      ],
    });

    return { success: true, items };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch homepage section items." };
  }
}

/**
 * Assign an existing blog post to a homepage section
 */
export async function addPostToSectionAction(
  blogId: string,
  section: string,
  priority: number = 0
) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized access." };
  }

  if (!isValidSection(section)) {
    return { success: false, error: `Invalid section: ${section}` };
  }

  try {
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
    });
    if (!blog) {
      return { success: false, error: "Blog post not found." };
    }

    // Get the current max order in this section to place the new item at the end
    const lastItem = await prisma.homepageItem.findFirst({
      where: { section },
      orderBy: { order: "desc" },
      select: { order: true },
    });
    const nextOrder = (lastItem?.order ?? -1) + 1;

    const item = await prisma.homepageItem.upsert({
      where: {
        blogId_section: {
          blogId,
          section,
        },
      },
      update: {
        priority,
        isActive: true,
      },
      create: {
        blogId,
        section,
        order: nextOrder,
        priority,
        isActive: true,
      },
    });

    await invalidateHomepageCaches();

    return { success: true, item };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to add post to section." };
  }
}

/**
 * Remove an existing blog post from a homepage section without deleting the post
 */
export async function removePostFromSectionAction(blogId: string, section: string) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized access." };
  }

  try {
    await prisma.homepageItem.deleteMany({
      where: {
        blogId,
        section,
      },
    });

    await invalidateHomepageCaches();

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to remove post from section." };
  }
}

/**
 * Reorder or update priorities for items within a section
 */
export async function reorderSectionItemsAction(
  updates: { id: string; order: number; priority?: number; isActive?: boolean }[]
) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized access." };
  }

  if (!Array.isArray(updates) || updates.length === 0) {
    return { success: false, error: "No updates provided." };
  }

  try {
    await prisma.$transaction(
      updates.map((u) =>
        prisma.homepageItem.update({
          where: { id: u.id },
          data: {
            order: u.order,
            priority: u.priority !== undefined ? u.priority : undefined,
            isActive: u.isActive !== undefined ? u.isActive : undefined,
          },
        })
      )
    );

    await invalidateHomepageCaches();

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to reorder section items." };
  }
}

/**
 * Search posts available to be assigned to homepage sections
 */
export async function searchBlogsForSectionAction(searchQuery?: string, tagId?: string) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized access." };
  }

  try {
    const where: any = {};

    if (tagId && tagId.trim()) {
      where.tags = {
        some: {
          tagId: tagId.trim(),
        },
      };
    }

    if (searchQuery && searchQuery.trim()) {
      where.OR = [
        { title: { contains: searchQuery.trim(), mode: "insensitive" } },
        { slug: { contains: searchQuery.trim(), mode: "insensitive" } },
      ];
    }

    const blogs = await prisma.blog.findMany({
      where,
      take: 25,
      orderBy: { createdAt: "desc" },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        homepageItems: {
          select: { section: true },
        },
      },
    });

    return { success: true, blogs };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to search blogs." };
  }
}
