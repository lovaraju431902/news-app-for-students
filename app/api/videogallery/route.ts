export const revalidate = 60;
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
    try {
        const result = await prisma.videoGallery.findMany({
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
        return NextResponse.json({ error: "Failed to get Video Gallery items" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const result = await prisma.videoGallery.create({
            data: {
                title: body.title,
                image: body.image || null,
                duration: body.duration,
                category: body.category,
                isActive: body.isActive,
                href: body.href || null
            }
        })
        return NextResponse.json(result, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to create Video Gallery item" }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const body = await request.json()
        const id = body.id
        const result = await prisma.videoGallery.delete({
            where: {
                id
            }
        })
        return NextResponse.json(result, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to delete Video Gallery item" }, { status: 500 })
    }
}
