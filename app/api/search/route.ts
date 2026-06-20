import { NextResponse } from "next/server";
import { searchBlogs } from "@/lib/search-service";
import { redis } from "@/lib/redis";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 5;

    // Check for empty or invalid queries
    if (!query.trim()) {
      return NextResponse.json([], { status: 200 });
    }

    const cacheKey = `search:${query.trim().toLowerCase()}:${limit}`;
    let results = null;

    if (redis.isConfigured) {
      try {
        const cached = await redis.get<any[]>(cacheKey);
        if (cached) {
          results = cached;
        }
      } catch (err) {
        console.error("Redis read error:", err);
      }
    }

    if (!results) {
      // Perform full-text search
      results = await searchBlogs(query, limit);

      if (redis.isConfigured && results.length > 0) {
        try {
          await redis.set(cacheKey, results, { ex: 300 }); // Cache for 5 minutes (300 seconds)
        } catch (err) {
          console.error("Redis write error:", err);
        }
      }
    }

    // Create the response object
    const response = NextResponse.json(results, { status: 200 });

    // Set cache control headers to optimize for high traffic (1 million monthly page views)
    // Cache for 60 seconds at CDN/Edge, and allow serving stale data up to 120 seconds while revalidating
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=120"
    );

    return response;
  } catch (error: any) {
    console.error("Search API Route Error:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred during search." },
      { status: 500 }
    );
  }
}
