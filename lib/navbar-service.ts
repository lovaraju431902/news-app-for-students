import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { formatBlogDate } from "./homepage-utils";
import { getFormattedAdminName } from "./category-admins";

export interface NavbarPreviewPost {
  id: string;
  title: string;
  slug: string;
  image: string;
  href: string;
  date: string;
  author: string;
  views: number;
  commentsCount: number;
}

export const NAVBAR_CATEGORIES = [
  { name: "Latest News", href: "/blogs", slug: "latest-news" },
  { name: "Government Jobs", href: "/govt-jobs-updates", slug: "govt-jobs-updates" },
  { name: "Scholarships", href: "/scholarships", slug: "scholarships" },
  { name: "Part Time Income", href: "/part-time-income", slug: "part-time-income" },
  { name: "Share Market", href: "/share-market", slug: "share-market" },
  { name: "YouTube Tips", href: "/youtube-growth", slug: "youtube-growth" },
  { name: "AI Tools", href: "/ai-tools", slug: "ai-tools" },
  { name: "Internships", href: "/internships", slug: "internships" },
  { name: "Current Affairs", href: "/current-affairs", slug: "current-affairs" },
];

const PREVIEW_LIMIT = 5;

/**
 * Fetch 5 preview posts for a specific category slug
 */
export async function getNavbarPreviewForCategory(slug: string): Promise<NavbarPreviewPost[]> {
  const cacheKey = `navbar:preview:${slug}`;

  if (redis.isConfigured) {
    try {
      const cached = await redis.get<NavbarPreviewPost[]>(cacheKey);
      if (cached && Array.isArray(cached) && cached.length > 0) {
        return cached;
      }
    } catch (err) {
      console.error(`Redis read error for navbar preview [${slug}]:`, err);
    }
  }

  try {
    // 1. If "latest-news" or "blogs", return the latest 5 posts overall
    if (slug === "latest-news" || slug === "blogs") {
      const blogs = await prisma.blog.findMany({
        take: PREVIEW_LIMIT,
        orderBy: { createdAt: "desc" },
        include: {
          tags: {
            include: { tag: true },
          },
        },
      });

      const formatted = blogs.map((blog) => {
        const catSlug = blog.tags[0]?.tag.slug || "blogs";
        return {
          id: blog.id,
          title: blog.title,
          slug: blog.slug,
          image: blog.featuredImg || "/logo.png",
          href: `/${catSlug}/${blog.slug}`,
          date: formatBlogDate(blog.createdAt),
          author: getFormattedAdminName(catSlug),
          views: blog.views || 0,
          commentsCount: 0,
        };
      });

      if (redis.isConfigured && formatted.length > 0) {
        try {
          await redis.set(cacheKey, formatted, { ex: 300 });
        } catch (e) {}
      }

      return formatted;
    }

    // 2. Find the tag by slug or related variation
    const baseSlug = slug.replace(/-updates$/, "");
    const tag = await prisma.tag.findFirst({
      where: {
        OR: [
          { slug: slug },
          { slug: baseSlug },
          { slug: { contains: baseSlug } },
        ],
      },
    });

    let blogs: any[] = [];

    if (tag) {
      blogs = await prisma.blog.findMany({
        where: {
          tags: {
            some: {
              OR: [
                { tagId: tag.id },
                { tag: { parentId: tag.id } },
              ],
            },
          },
        },
        take: PREVIEW_LIMIT,
        orderBy: { createdAt: "desc" },
        include: {
          tags: {
            include: { tag: true },
          },
        },
      });
    }

    // Fallback: If not enough posts in this tag, fill up with latest blogs
    if (blogs.length < PREVIEW_LIMIT) {
      const existingIds = blogs.map((b) => b.id);
      const fallbackBlogs = await prisma.blog.findMany({
        where: {
          id: { notIn: existingIds },
        },
        take: PREVIEW_LIMIT - blogs.length,
        orderBy: { createdAt: "desc" },
        include: {
          tags: {
            include: { tag: true },
          },
        },
      });
      blogs = [...blogs, ...fallbackBlogs];
    }

    const formatted: NavbarPreviewPost[] = blogs.map((blog) => {
      const primaryTagSlug = blog.tags[0]?.tag.slug || slug;
      return {
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        image: blog.featuredImg || "/logo.png",
        href: `/${primaryTagSlug}/${blog.slug}`,
        date: formatBlogDate(blog.createdAt),
        author: getFormattedAdminName(primaryTagSlug),
        views: blog.views || 0,
        commentsCount: 0,
      };
    });

    if (redis.isConfigured && formatted.length > 0) {
      try {
        await redis.set(cacheKey, formatted, { ex: 300 });
      } catch (e) {}
    }

    return formatted;
  } catch (error) {
    console.error(`Failed to fetch navbar preview for [${slug}]:`, error);
    return [];
  }
}

/**
 * Fetch all category previews in one batch
 */
export async function getAllNavbarPreviews(): Promise<Record<string, NavbarPreviewPost[]>> {
  const cacheKey = "navbar:previews:all";

  if (redis.isConfigured) {
    try {
      const cached = await redis.get<Record<string, NavbarPreviewPost[]>>(cacheKey);
      if (cached && typeof cached === "object") {
        return cached;
      }
    } catch (err) {
      console.error("Redis read error for all navbar previews:", err);
    }
  }

  const results: Record<string, NavbarPreviewPost[]> = {};

  await Promise.all(
    NAVBAR_CATEGORIES.map(async (cat) => {
      results[cat.slug] = await getNavbarPreviewForCategory(cat.slug);
    })
  );

  if (redis.isConfigured && Object.keys(results).length > 0) {
    try {
      await redis.set(cacheKey, results, { ex: 300 });
    } catch (e) {}
  }

  return results;
}
