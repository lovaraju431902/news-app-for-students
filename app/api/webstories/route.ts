import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
    try {
        const result = await prisma.webStory.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 4
        })
        return NextResponse.json({ data: result }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to get Web Stories" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const result = await prisma.webStory.create({
            data: {
                title: body.title,
                image: body.image || null,
                isActive: body.isActive,
                href: body.href || null
            }
        })
        return NextResponse.json(result, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to create Web Story" }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const body = await request.json()
        const id = body.id
        const result = await prisma.webStory.delete({
            where: {
                id
            }
        })
        return NextResponse.json(result, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to delete Web Story" }, { status: 500 })
    }
}
