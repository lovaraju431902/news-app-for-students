import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"


export async function GET(res: Request) {

    try {

        const result1 = await prisma.trendingNews.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 5


        })
        return NextResponse.json({ data: result1 }, { status: 200 })




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
        return NextResponse.json(result, { status: 200 })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to delete trendingNews" }, { status: 500 })

    }

}

