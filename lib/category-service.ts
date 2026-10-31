import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import {
  formatBlogDate,
  calculateReadTime,
  getCategoryBadge,
} from "./homepage-utils";
import { getFormattedAdminName } from "./category-admins";

export interface CategoryPostItem {
  id: string;
  title: string;
  slug: string;
  image: string;
  href: string;
  date: string;
  readTime: string;
  excerpt?: string | null;
  categorySlug: string;
  categoryName: string;
  badgeColor: string;
  badgeColorClass: string;
  createdAt?: Date | string;
  author?: string;
  views?: number;
  commentsCount?: number;
  isPremium?: boolean;
}

export interface CategoryBlockConfig {
  id: string;
  name: string;
  slug: string;
  showOnHomepage: boolean;
  homepageBlockStyle: "style1" | "style2" | "style3" | "style4" | "style5" | "style6" | string;
  homepageOrder: number;
  homepagePostLimit: number;
  homepageColumns: number;
  showThumbnail: boolean;
  showDate: boolean;
  showExcerpt: boolean;
  showViewAll: boolean;
  customTitle?: string | null;
  icon?: string | null;
  accentColor?: string | null;
}

export interface CategoryBlockData {
  category: CategoryBlockConfig;
  posts: CategoryPostItem[];
}

const CACHE_KEY = "homepage:category-blocks";

/**
 * Fetch all categories configured to display on the homepage with their latest posts
 */
export async function getHomepageCategoryBlocks(): Promise<CategoryBlockData[]> {
  if (redis.isConfigured) {
    try {
      const cached = await redis.get<CategoryBlockData[]>(CACHE_KEY);
      if (cached && Array.isArray(cached) && cached.length > 0) {
        return cached;
      }
    } catch (err) {
      console.error("Redis get error for category blocks:", err);
    }
  }

  try {
    const categories = await prisma.tag.findMany({
      where: {
        showOnHomepage: true,
        NOT: {
          slug: "ai-prompts",
        },
      },
      orderBy: [
        { homepageOrder: "asc" },
        { name: "asc" },
      ],
      include: {
        blogs: {
          take: 12,
          orderBy: {
            blog: { createdAt: "desc" },
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
        },
      },
    });

    const result: CategoryBlockData[] = categories.map((cat) => {
      const limit = cat.homepagePostLimit || 6;
      const rawBlogs = cat.blogs
        .map((bt) => bt.blog)
        .filter((b): b is NonNullable<typeof b> => Boolean(b));

      // Deduplicate posts
      const seenIds = new Set<string>();
      const uniqueBlogs = rawBlogs.filter((b) => {
        if (seenIds.has(b.id)) return false;
        seenIds.add(b.id);
        return true;
      });

      const badge = getCategoryBadge(cat.slug, cat.name);

      const posts: CategoryPostItem[] = uniqueBlogs.slice(0, limit).map((blog) => {
        return {
          id: blog.id,
          title: blog.title,
          slug: blog.slug,
          image: blog.featuredImg || "/logo.png",
          href: `/${cat.slug}/${blog.slug}`,
          date: formatBlogDate(blog.createdAt),
          readTime: calculateReadTime(blog.content),
          excerpt: blog.excerpt || null,
          categorySlug: cat.slug,
          categoryName: cat.name,
          badgeColor: badge.color,
          badgeColorClass: badge.colorClass,
          createdAt: blog.createdAt,
          author: getFormattedAdminName(cat.slug),
          views: blog.views || 0,
          commentsCount: 0,
          isPremium: blog.isPremium || false,
        };
      });

      return {
        category: {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          showOnHomepage: cat.showOnHomepage,
          homepageBlockStyle: cat.homepageBlockStyle || "style1",
          homepageOrder: cat.homepageOrder ?? 0,
          homepagePostLimit: cat.homepagePostLimit ?? 6,
          homepageColumns: cat.homepageColumns ?? 3,
          showThumbnail: cat.showThumbnail ?? true,
          showDate: cat.showDate ?? true,
          showExcerpt: cat.showExcerpt ?? false,
          showViewAll: cat.showViewAll ?? true,
          customTitle: cat.customTitle || null,
          icon: cat.icon || null,
          accentColor: cat.accentColor || null,
        },
        posts,
      };
    });

    // Cache for 5 minutes
    if (redis.isConfigured && result.length > 0) {
      try {
        await redis.set(CACHE_KEY, result, { ex: 300 });
      } catch (err) {
        console.error("Redis set error for category blocks:", err);
      }
    }

    return result;
  } catch (error) {
    console.error("Failed to query homepage category blocks:", error);
    return [];
  }
}

/**
 * Invalidate the homepage category blocks cache
 */
export async function invalidateCategoryBlocksCache(): Promise<void> {
  if (redis.isConfigured) {
    try {
      await redis.del(CACHE_KEY);
    } catch (err) {
      console.error("Redis del error for category blocks:", err);
    }
  }
}
