export const revalidate = 60;
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { redis } from "@/lib/redis"
import { getDynamicHomepageSectionPosts } from "@/lib/homepage-service"

const CACHE_KEY = "rightcards:active"

export async function GET(res: Request) {
    try {
        // 1. Try dynamic posts from HomepageItem
        const dynamicCards = await getDynamicHomepageSectionPosts("right_cards", 4);
        if (dynamicCards.length > 0) {
            return NextResponse.json({ data: dynamicCards }, { status: 200 });
        }

        // 2. Fallback to legacy RightCards table if no dynamic posts assigned yet
        let result1 = null;
        if (redis.isConfigured) {
            try {
                const cached = await redis.get<any[]>(CACHE_KEY);
                if (cached) {
                    result1 = cached;
                }
            } catch (err) {
                console.error("Redis read error in rightcard route:", err);
            }
        }

        if (!result1) {
            result1 = await prisma.rightCards.findMany({
                where: {
                    isActive: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: 2,
            })

            if (redis.isConfigured && result1.length > 0) {
                try {
                    await redis.set(CACHE_KEY, result1, { ex: 300 });
                } catch (err) {
                    console.error("Redis write error in rightcard route:", err);
                }
            }
        }

        return NextResponse.json({ data: result1 || [] }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to get right cards" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const result = await prisma.rightCards.create({
            data: {
                image: body.image,
                href: body.href,
                title: body.title,
                date: body.date,
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
                console.error("Redis invalidate error in rightcard route POST:", err);
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

        const result = await prisma.rightCards.delete({
            where: {
                id
            }
        })

        if (redis.isConfigured) {
            try {
                await redis.del(CACHE_KEY);
            } catch (err) {
                console.error("Redis invalidate error in rightcard route DELETE:", err);
            }
        }

        return NextResponse.json(result, { status: 200 })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to delete slide" }, { status: 500 })

    }

}
