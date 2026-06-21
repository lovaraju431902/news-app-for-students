"use server";

import { prisma } from "@/lib/prisma";
import { searchBlogs } from "@/lib/search-service";
import { revalidatePath } from "next/cache";
import { redis } from "@/lib/redis";
import { getSession } from "@/lib/session";

export async function getTagsAction() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: "asc" },
      include: {
        children: {
          orderBy: { name: "asc" },
        },
      },
    });
    return { success: true, tags };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch tags." };
  }
}

export async function createTagAction(name: string, parentId?: string | null) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized access." };
  }

  const trimmedName = name.trim();
  if (!trimmedName) {
    return { success: false, error: "Tag name cannot be empty." };
  }

  const slug = trimmedName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  if (!slug) {
    return { success: false, error: "Invalid tag name." };
  }

  try {
    const existing = await prisma.tag.findUnique({
      where: { slug },
    });
    if (existing) {
      return { success: false, error: "A tag with this name or slug already exists." };
    }

    const tag = await prisma.tag.create({
      data: {
        name: trimmedName,
        slug,
        parentId: parentId || null,
      },
    });
    return { success: true, tag };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create tag." };
  }
}

export async function createBlogAction(data: {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImg?: string;
  tagIds: string[];
  seoKeywords?: string;
}) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized access." };
  }

  try {
    const trimmedTitle = data.title.trim();
    const trimmedSlug = data.slug.trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    if (!trimmedTitle) {
      return { success: false, error: "Title is required." };
    }
    if (!trimmedSlug) {
      return { success: false, error: "Slug is required." };
    }
    if (!data.content.trim()) {
      return { success: false, error: "Content is required." };
    }

    const existingBlog = await prisma.blog.findUnique({
      where: { slug: trimmedSlug },
    });
    if (existingBlog) {
      return { success: false, error: "A blog with this slug already exists." };
    }

    const blog = await prisma.blog.create({
      data: {
        title: trimmedTitle,
        slug: trimmedSlug,
        content: data.content,
        excerpt: data.excerpt?.trim() || null,
        featuredImg: data.featuredImg?.trim() || null,
        seoKeywords: data.seoKeywords?.trim() || null,
        tags: {
          create: data.tagIds.map((tagId) => ({
            tagId,
          })),
        },
      },
    });
    revalidatePath("/");
    revalidatePath("/blogs");
    revalidatePath("/[category]", "layout");

    return { success: true, blog };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create blog." };
  }
}

export async function searchBlogsAction(
  tagIds: string[],
  searchQuery?: string,
  page?: number,
  limit?: number
) {
  try {
    const cacheKey = `blogs:tags:${(tagIds || []).join(",")}:q:${(searchQuery || "").trim().toLowerCase()}:p:${page || "all"}:l:${limit || "all"}`;

    if (redis.isConfigured) {
      try {
        const cached = await redis.get<{ blogs: any[]; totalCount: number }>(cacheKey);
        if (cached) {
          return { success: true, blogs: cached.blogs, totalCount: cached.totalCount };
        }
      } catch (err) {
        console.error("Redis read error in searchBlogsAction:", err);
      }
    }

    let blogIds: string[] | null = null;

    if (searchQuery && searchQuery.trim()) {
      const ftsResults = await searchBlogs(searchQuery.trim(), 100);
      blogIds = ftsResults.map((r) => r.id);
    }

    const whereClause: any = {};

    if (tagIds && tagIds.length > 0) {
      whereClause.tags = {
        some: {
          tagId: {
            in: tagIds,
          },
        },
      };
    }

    if (blogIds !== null) {
      whereClause.id = {
        in: blogIds,
      };
    }

    let blogs: any[] = [];
    let totalCount = 0;

    if (blogIds !== null) {
      // Full-text search scenario: FTS results are limited to 100 items max
      const allMatchingBlogs = await prisma.blog.findMany({
        where: whereClause,
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });

      // Sort by their rank/order from FTS
      const idOrder = new Map(blogIds.map((id, index) => [id, index]));
      allMatchingBlogs.sort((a, b) => {
        const orderA = idOrder.get(a.id) ?? 999999;
        const orderB = idOrder.get(b.id) ?? 999999;
        return orderA - orderB;
      });

      totalCount = allMatchingBlogs.length;

      if (page && limit) {
        blogs = allMatchingBlogs.slice((page - 1) * limit, page * limit);
      } else {
        blogs = allMatchingBlogs;
      }
    } else {
      // Standard listing/tag filtering scenario: paginate in DB
      totalCount = await prisma.blog.count({
        where: whereClause,
      });

      const findOptions: any = {
        where: whereClause,
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      };

      if (page && limit) {
        findOptions.take = limit;
        findOptions.skip = (page - 1) * limit;
      }

      blogs = await prisma.blog.findMany(findOptions);
    }

    if (redis.isConfigured && blogs.length > 0) {
      try {
        await redis.set(cacheKey, { blogs, totalCount }, { ex: 300 });
      } catch (err) {
        console.error("Redis write error in searchBlogsAction:", err);
      }
    }

    return { success: true, blogs, totalCount };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch blogs." };
  }
}

export async function getBlogBySlugAction(slug: string) {
  try {
    const cacheKey = `blog:slug:${slug}`;
    if (redis.isConfigured) {
      try {
        const cached = await redis.get<any>(cacheKey);
        if (cached) {
          return { success: true, blog: cached };
        }
      } catch (err) {
        console.error("Redis read error in getBlogBySlugAction:", err);
      }
    }

    const blog = await prisma.blog.findUnique({
      where: { slug },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (redis.isConfigured && blog) {
      try {
        await redis.set(cacheKey, blog, { ex: 300 });
      } catch (err) {
        console.error("Redis write error in getBlogBySlugAction:", err);
      }
    }

    return { success: true, blog };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch blog." };
  }
}

export async function getBlogByIdAction(id: string) {
  try {
    const blog = await prisma.blog.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
    return { success: true, blog };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch blog by ID." };
  }
}

export async function deleteBlogAction(id: string) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized access." };
  }

  try {
    const blog = await prisma.blog.findUnique({
      where: { id },
      select: { slug: true },
    });

    await prisma.blog.delete({
      where: { id },
    });

    if (redis.isConfigured && blog) {
      try {
        await redis.del(`blog:slug:${blog.slug}`);
      } catch (err) {
        console.error("Redis invalidate error in deleteBlogAction:", err);
      }
    }

    revalidatePath("/");
    revalidatePath("/blogs");
    revalidatePath("/[category]", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete blog." };
  }
}

export async function updateBlogAction(
  id: string,
  data: {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    featuredImg?: string;
    tagIds: string[];
    seoKeywords?: string;
  }
) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized access." };
  }

  try {
    const trimmedTitle = data.title.trim();
    const trimmedSlug = data.slug.trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    if (!trimmedTitle) {
      return { success: false, error: "Title is required." };
    }
    if (!trimmedSlug) {
      return { success: false, error: "Slug is required." };
    }
    if (!data.content.trim()) {
      return { success: false, error: "Content is required." };
    }

    const currentBlog = await prisma.blog.findUnique({
      where: { id },
      select: { slug: true },
    });

    // Check slug uniqueness (excluding current blog)
    const existingBlog = await prisma.blog.findFirst({
      where: {
        slug: trimmedSlug,
        id: { not: id },
      },
    });
    if (existingBlog) {
      return { success: false, error: "Another blog with this slug already exists." };
    }

    // Delete existing BlogTags
    await prisma.blogTag.deleteMany({
      where: { blogId: id },
    });

    // Update blog and create new BlogTags
    const blog = await prisma.blog.update({
      where: { id },
      data: {
        title: trimmedTitle,
        slug: trimmedSlug,
        content: data.content,
        excerpt: data.excerpt?.trim() || null,
        featuredImg: data.featuredImg?.trim() || null,
        seoKeywords: data.seoKeywords?.trim() || null,
        tags: {
          create: data.tagIds.map((tagId) => ({
            tagId,
          })),
        },
      },
    });

    if (redis.isConfigured && currentBlog) {
      try {
        await redis.del(`blog:slug:${currentBlog.slug}`);
        await redis.del(`blog:slug:${trimmedSlug}`);
      } catch (err) {
        console.error("Redis invalidate error in updateBlogAction:", err);
      }
    }

    revalidatePath("/");
    revalidatePath("/blogs");
    revalidatePath("/[category]", "layout");

    return { success: true, blog };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update blog." };
  }
}

export async function getAdminBlogsAction() {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized access." };
  }

  try {
    const blogs = await prisma.blog.findMany({
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, blogs };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch dashboard blogs." };
  }
}

export async function seedMainCategoriesAction() {
  const mainCategories = [
    { name: "Part Time Income", slug: "part-time-income" },
    { name: "Share Market", slug: "share-market" },
    { name: "AI Prompts", slug: "ai-prompts" },
    { name: "Carrer Jobs", slug: "carrer-jobs" },
    { name: "Youtube Growth", slug: "youtube-growth" },
    { name: "Instagram", slug: "instagram" },
    { name: "Mobile Hacks", slug: "mobile-hacks" },
    { name: "AI Tools", slug: "ai-tools" },
    { name: "Marketing", slug: "marketing" },
    { name: "Startup Ideas", slug: "startup-ideas" },
    { name: "Technology", slug: "technology" },
    { name: "Apps & Websites", slug: "apps-websites" },
    { name: "Facebook", slug: "facebook" },
    { name: "Editing", slug: "editing" },
    { name: "Govt Jobs Updates", slug: "govt-jobs-updates" },
    { name: "Files & Materials", slug: "files-materials" },
    { name: "Internships", slug: "internships" },
    { name: "Scholarships", slug: "scholarships" },
    { name: "Current Affairs", slug: "current-affairs" }
  ];

  try {
    const results = [];
    for (const cat of mainCategories) {
      const existing = await prisma.tag.findUnique({
        where: { slug: cat.slug }
      });
      if (!existing) {
        const created = await prisma.tag.create({
          data: {
            name: cat.name,
            slug: cat.slug,
            parentId: null
          }
        });
        results.push(created);
      } else {
        if (existing.parentId !== null) {
          const updated = await prisma.tag.update({
            where: { id: existing.id },
            data: { parentId: null }
          });
          results.push(updated);
        } else {
          results.push(existing);
        }
      }
    }
    return { success: true, tags: results };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to seed main categories." };
  }
}

