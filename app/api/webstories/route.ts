export const revalidate = 60;
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const limitParam = searchParams.get("limit")
        const limit = limitParam ? parseInt(limitParam) : undefined
        const all = searchParams.get("all") === "true"

        const result = await prisma.webStory.findMany({
            where: all ? {} : { isActive: true },
            orderBy: { createdAt: "desc" },
            ...(limit ? { take: limit } : {})
        })
        return NextResponse.json({ data: result }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to get Short Videos" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const result = await prisma.webStory.create({
            data: {
                title: body.title,
                image: body.image || null,
                video: body.video || null,
                isActive: body.isActive ?? true,
            }
        })
        return NextResponse.json(result, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to create Short Video" }, { status: 500 })
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json()
        const result = await prisma.webStory.update({
            where: { id: body.id },
            data: {
                ...(body.title !== undefined && { title: body.title }),
                ...(body.image !== undefined && { image: body.image }),
                ...(body.video !== undefined && { video: body.video }),
                ...(body.isActive !== undefined && { isActive: body.isActive }),
            }
        })
        return NextResponse.json(result, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to update Short Video" }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const body = await request.json()
        const id = body.id
        const result = await prisma.webStory.delete({
            where: { id }
        })
        return NextResponse.json(result, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to delete Short Video" }, { status: 500 })
    }
}
