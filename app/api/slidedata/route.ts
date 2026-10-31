export const revalidate = 60;
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { redis } from "@/lib/redis"
import { getDynamicHomepageSectionPosts } from "@/lib/homepage-service"

const CACHE_KEY = "slides:active"

export async function GET(res: Request) {
    try {
        // 1. Try dynamic posts from HomepageItem
        const dynamicSlides = await getDynamicHomepageSectionPosts("slide_data", 6);
        if (dynamicSlides.length > 0) {
            return NextResponse.json({ data: dynamicSlides }, { status: 200 });
        }

        // 2. Fallback to legacy SlideData table if no dynamic posts assigned yet
        let result1 = null;
        if (redis.isConfigured) {
            try {
                const cached = await redis.get<any[]>(CACHE_KEY);
                if (cached) {
                    result1 = cached;
                }
            } catch (err) {
                console.error("Redis read error in slidedata route:", err);
            }
        }

        if (!result1) {
            result1 = await prisma.slideData.findMany({
                where: {
                    isActive: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: 6,
            })

            if (redis.isConfigured && result1.length > 0) {
                try {
                    await redis.set(CACHE_KEY, result1, { ex: 300 });
                } catch (err) {
                    console.error("Redis write error in slidedata route:", err);
                }
            }
        }

        return NextResponse.json({ data: result1 || [] }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to get slides" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const result = await prisma.slideData.create({
            data: {
                image: body.image,
                href: body.href,
                title: body.title,
                date: body.date,
                author: body.author,
                readTime: body.readTime,
                badge: {
                    label: body.badge.label,
                    color: body.badge.color,
                },
                isActive: body.isActive

            }
        })

        if (redis.isConfigured) {
            try {
                await redis.del(CACHE_KEY);
            } catch (err) {
                console.error("Redis invalidate error in slidedata route POST:", err);
            }
        }

        return NextResponse.json(result, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to create slide" }, { status: 500 })
    }
}


export async function DELETE(request: Request) {

    try {
        const body = await request.json();
        const id = body.id;

        const result = await prisma.slideData.delete({
            where: {
                id
            }
        })

        if (redis.isConfigured) {
            try {
                await redis.del(CACHE_KEY);
            } catch (err) {
                console.error("Redis invalidate error in slidedata route DELETE:", err);
            }
        }

        return NextResponse.json(result, { status: 200 })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to delete slide" }, { status: 500 })

    }

}
