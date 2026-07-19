import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const type = searchParams.get("type") || "";
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    const page = pageParam ? parseInt(pageParam, 10) : 1;
    const limit = limitParam ? parseInt(limitParam, 10) : 12;

    const skip = (page - 1) * limit;

    let version = 1;
    if (redis.isConfigured) {
      try {
        const cachedVersion = await redis.get<number | string>("files:version");
        if (cachedVersion) {
          version = Number(cachedVersion);
        }
      } catch (err) {
        console.error("Redis error fetching files version:", err);
      }
    }

    const cacheKey = `files:search:${q.trim().toLowerCase()}:t:${type.trim().toLowerCase()}:p:${page}:l:${limit}:v:${version}`;
    let results = null;

    if (redis.isConfigured) {
      try {
        const cached = await redis.get<any>(cacheKey);
        if (cached) {
          results = cached;
        }
      } catch (err) {
        console.error("Redis read error in files API:", err);
      }
    }

    if (!results) {
      const whereClause: any = {
        isActive: true,
      };

      if (q.trim()) {
        whereClause.title = { contains: q, mode: "insensitive" };
      }

      if (type.trim()) {
        whereClause.fileType = { equals: type, mode: "insensitive" };
      }

      const [files, totalCount] = await Promise.all([
        prisma.materialFile.findMany({
          where: whereClause,
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.materialFile.count({
          where: whereClause,
        }),
      ]);

      const hasMore = skip + files.length < totalCount;
      const nextPage = hasMore ? page + 1 : null;

      results = { files, nextPage };

      if (redis.isConfigured && files.length > 0) {
        try {
          await redis.set(cacheKey, results, { ex: 300 }); // Cache for 5 minutes
        } catch (err) {
          console.error("Redis write error in files API:", err);
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
    console.error("Files API Route Error:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred during file list retrieval." },
      { status: 500 }
    );
  }
}
