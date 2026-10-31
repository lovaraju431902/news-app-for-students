export const revalidate = 60;
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { redis } from "@/lib/redis"
import { getDynamicHomepageSectionPosts } from "@/lib/homepage-service"

const CACHE_KEY = "trending_news:all"

export async function GET(res: Request) {
    try {
        // 1. Try dynamic posts from HomepageItem
        const dynamicTrending = await getDynamicHomepageSectionPosts("trending_news", 10);
        if (dynamicTrending.length > 0) {
            return NextResponse.json({ data: dynamicTrending }, { status: 200 });
        }

        // 2. Fallback to legacy TrendingNews table if no dynamic posts assigned yet
        let result1 = null;
        if (redis.isConfigured) {
            try {
                const cached = await redis.get<any[]>(CACHE_KEY);
                if (cached) {
                    result1 = cached;
                }
            } catch (err) {
                console.error("Redis read error:", err);
            }
        }

        if (!result1) {
            result1 = await prisma.trendingNews.findMany({
                where: {
                    isActive: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: 8
            })

            if (redis.isConfigured && result1.length > 0) {
                try {
                    await redis.set(CACHE_KEY, result1, { ex: 300 });
                } catch (err) {
                    console.error("Redis write error:", err);
                }
            }
        }

        return NextResponse.json({ data: result1 || [] }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to get Trending news" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const result = await prisma.trendingNews.create({
            data: {
                image: body.image,
                title: body.title,
                href: body.href,
                date: body.date,
                isActive: body.isActive
            }
        })

        if (redis.isConfigured) {
            try {
                await redis.del(CACHE_KEY);
            } catch (err) {
                console.error("Redis invalidate error:", err);
            }
        }

        return NextResponse.json(result, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to create Trending News" }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const body = await request.json();
        const id = body.id;

        const result = await prisma.trendingNews.delete({
            where: {
                id
            }
        })

        if (redis.isConfigured) {
            try {
                await redis.del(CACHE_KEY);
            } catch (err) {
                console.error("Redis invalidate error:", err);
            }
        }

        return NextResponse.json(result, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to delete trendingNews" }, { status: 505 })
    }
}

