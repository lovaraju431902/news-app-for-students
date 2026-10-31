import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { invalidateHomepageSectionCache } from "@/lib/homepage-service";

export const dynamic = "force-dynamic";

/**
 * GET /api/views
 * Returns real-time view counts for all posts or requested slugs/ids
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slugsParam = searchParams.get("slugs");

    let whereClause = {};
    if (slugsParam) {
      const slugs = slugsParam.split(",").map((s) => s.trim()).filter(Boolean);
      if (slugs.length > 0) {
        whereClause = { slug: { in: slugs } };
      }
    }

    const blogs = await prisma.blog.findMany({
      where: whereClause,
      select: {
        id: true,
        slug: true,
        views: true,
      },
    });

    const viewsMap: Record<string, number> = {};
    blogs.forEach((b) => {
      viewsMap[b.slug] = b.views;
      viewsMap[b.id] = b.views;
    });

    return NextResponse.json({ success: true, viewsMap }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/views error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch views" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/views
 * Real-time view increment for a post by slug
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const slug = body.slug;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        { success: false, error: "Valid slug is required" },
        { status: 400 }
      );
    }

    // 1. Atomic increment in PostgreSQL database
    const blog = await prisma.blog.update({
      where: { slug: slug.trim() },
      data: {
        views: { increment: 1 },
      },
      select: {
        id: true,
        slug: true,
        views: true,
      },
    });

    // 2. Sync to Redis cache immediately
    if (redis.isConfigured) {
      try {
        await Promise.all([
          redis.set(`blog:views:slug:${blog.slug}`, blog.views, { ex: 86400 }),
          redis.set(`blog:views:id:${blog.id}`, blog.views, { ex: 86400 }),
          redis.del(`blog:slug:${blog.slug}`),
          redis.del("homepage:category-blocks"),
        ]);
        await invalidateHomepageSectionCache();
      } catch (err) {
        console.error("Redis sync error in /api/views:", err);
      }
    }

    return NextResponse.json(
      { success: true, slug: blog.slug, views: blog.views },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("POST /api/views error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to increment views" },
      { status: 500 }
    );
  }
}
