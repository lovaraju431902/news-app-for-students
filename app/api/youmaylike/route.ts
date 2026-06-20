export const revalidate = 60;
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
    try {
        const result = await prisma.youMayLike.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 9
        })
        return NextResponse.json({ data: result }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to get You May Like items" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const result = await prisma.youMayLike.create({
            data: {
                headline: body.headline,
                description: body.description,
                image: body.image,
                isActive: body.isActive,
                href: body.href || null
            }
        })
        return NextResponse.json(result, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to create You May Like item" }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const body = await request.json()
        const id = body.id
        const result = await prisma.youMayLike.delete({
            where: {
                id
            }
        })
        return NextResponse.json(result, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to delete You May Like item" }, { status: 500 })
    }
}
