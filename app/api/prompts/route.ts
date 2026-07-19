import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    const page = pageParam ? parseInt(pageParam, 10) : 1;
    const limit = limitParam ? parseInt(limitParam, 10) : 12;

    const skip = (page - 1) * limit;

    let version = 1;
    if (redis.isConfigured) {
      try {
        const cachedVersion = await redis.get<number | string>("prompts:version");
        if (cachedVersion) {
          version = Number(cachedVersion);
        }
      } catch (err) {
        console.error("Redis error fetching prompts version:", err);
      }
    }

    const cacheKey = `prompts:search:${q.trim().toLowerCase()}:p:${page}:l:${limit}:v:${version}`;
    let results = null;

    if (redis.isConfigured) {
      try {
        const cached = await redis.get<any>(cacheKey);
        if (cached) {
          results = cached;
        }
      } catch (err) {
        console.error("Redis read error in prompts API:", err);
      }
    }

    if (!results) {
      const whereClause: any = {
        isActive: true,
      };

      if (q.trim()) {
        whereClause.OR = [
          { title: { contains: q, mode: "insensitive" } },
          { prompt: { contains: q, mode: "insensitive" } },
        ];
      }

      const [prompts, totalCount] = await Promise.all([
        prisma.aiPrompt.findMany({
          where: whereClause,
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.aiPrompt.count({
          where: whereClause,
        }),
      ]);

      const hasMore = skip + prompts.length < totalCount;
      const nextPage = hasMore ? page + 1 : null;

      results = { prompts, nextPage };

      if (redis.isConfigured && prompts.length > 0) {
        try {
          await redis.set(cacheKey, results, { ex: 300 }); // Cache for 5 minutes
        } catch (err) {
          console.error("Redis write error in prompts API:", err);
        }
      }
    }

    const response = NextResponse.json(results, { status: 200 });

    // Optimize cache control header for high traffic CDN/Edge caching
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=120"
    );

    return response;
  } catch (error: any) {
    console.error("Prompts API Route Error:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred during prompt retrieval." },
      { status: 500 }
    );
  }
}
