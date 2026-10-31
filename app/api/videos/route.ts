export const revalidate = 60;
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getDynamicHomepageSectionPosts } from "@/lib/homepage-service"

export async function GET(request: Request) {
    try {
        // 1. Try dynamic posts from HomepageItem
        const dynamicVideos = await getDynamicHomepageSectionPosts("videos", 10);
        if (dynamicVideos.length > 0) {
            return NextResponse.json({ data: dynamicVideos }, { status: 200 });
        }

        // 2. Fallback to legacy Video table if no dynamic posts assigned yet
        const result = await prisma.video.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 10
        })
        return NextResponse.json({ data: result }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to get Videos" }, { status: 500 })
    }
}


export async function POST(request: Request) {
    try {
        const body = await request.json()
        const result = await prisma.video.create({
            data: {
                title: body.title,
                image: body.image,
                badge: body.badge,
                isActive: body.isActive,
                href: body.href || null
            }
        })
        return NextResponse.json(result, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to create Video" }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const body = await request.json()
        const id = body.id
        const result = await prisma.video.delete({
            where: {
                id
            }
        })
        return NextResponse.json(result, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to delete Video" }, { status: 500 })
    }
}
