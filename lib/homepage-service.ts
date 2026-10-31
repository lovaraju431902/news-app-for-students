import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { getFormattedAdminName } from "./category-admins";
import {
  formatBlogDate,
  calculateReadTime,
  CATEGORY_COLORS,
  getCategoryBadge,
  extractBlogCategory,
} from "./homepage-utils";

export {
  formatBlogDate,
  calculateReadTime,
  CATEGORY_COLORS,
  getCategoryBadge,
  extractBlogCategory,
};


/**
 * Fetch dynamic homepage items for a section
 */
export async function getDynamicHomepageSectionPosts(section: string, takeLimit?: number) {
  const cacheKey = `homepage:section:${section}:${takeLimit || "all"}`;

  if (redis.isConfigured) {
    try {
      const cached = await redis.get<any[]>(cacheKey);
      if (cached && Array.isArray(cached) && cached.length > 0) {
        return cached;
      }
    } catch (err) {
      console.error(`Redis get error for section ${section}:`, err);
    }
  }

  const items = await prisma.homepageItem.findMany({
    where: {
      section,
      isActive: true,
    },
    include: {
      blog: {
        include: {
          tags: {
            include: { tag: true },
          },
        },
      },
    },
    orderBy: [
      { priority: "desc" },
      { order: "asc" },
      { createdAt: "desc" },
    ],
    ...(takeLimit ? { take: takeLimit } : {}),
  });

  const formatted = items
    .filter((item) => item.blog !== null)
    .map((item) => {
      const blog = item.blog;
      const { slug: catSlug, name: catName } = extractBlogCategory(blog);
      const badge = getCategoryBadge(catSlug, catName);
      const canonicalHref = `/${catSlug}/${blog.slug}`;

      return {
        id: blog.id,
        assignmentId: item.id,
        title: blog.title,
        image: blog.featuredImg || "/logo.png",
        href: canonicalHref,
        date: formatBlogDate(blog.createdAt),
        readTime: calculateReadTime(blog.content),
        read: calculateReadTime(blog.content),
        author: getFormattedAdminName(catSlug),
        views: blog.views ?? 0,
        badge: {
          label: badge.label,
          color: badge.color,
        },
        tag: badge.label,
        tagColor: badge.color,
        video: blog.videoUrl || null,
        duration: blog.videoDuration || "03:45",
        category: catName,
        headline: blog.title,
        description: blog.excerpt || blog.title,
        isActive: item.isActive,
        priority: item.priority,
        order: item.order,
        createdAt: blog.createdAt,
      };
    });

  if (redis.isConfigured && formatted.length > 0) {
    try {
      await redis.set(cacheKey, formatted, { ex: 300 }); // 5 minutes cache
    } catch (err) {
      console.error(`Redis set error for section ${section}:`, err);
    }
  }

  return formatted;
}

export async function invalidateHomepageSectionCache(section?: string) {
  if (!redis.isConfigured) return;
  try {
    if (section) {
      await redis.del(`homepage:section:${section}:all`);
      await redis.del(`homepage:section:${section}:6`);
      await redis.del(`homepage:section:${section}:4`);
      await redis.del(`homepage:section:${section}:8`);
    } else {
      const keys = await redis.keys("homepage:section:*");
      if (keys.length > 0) {
        await Promise.all(keys.map((k: string) => redis.del(k)));
      }
    }
  } catch (err) {
    console.error("Error invalidating homepage sections cache:", err);
  }
}
