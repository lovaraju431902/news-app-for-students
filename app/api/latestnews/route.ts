import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"


export async function GET(res: Request) {

    try {

        const result1 = await prisma.latestNews.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 4


        })
        return NextResponse.json({ data: result1 }, { status: 200 })




    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to get Latest news" }, { status: 500 })
    }

}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const result = await prisma.latestNews.create({
            data: {
                image: body.image,
                tag: body.tag,
                tagColor: body.tagColor,
                href: body.href,
                title: body.title,
                date: body.date,
                read: body.read,
                isActive: body.isActive

            }
        })

        return NextResponse.json(result, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to create Latest News" }, { status: 500 })
    }
}


export async function DELETE(request: Request) {

    try {
        const body = await request.json();
        const id = body.id;

        const result = await prisma.latestNews.delete({
            where: {
                id
            }
        })
        return NextResponse.json(result, { status: 200 })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to delete slide" }, { status: 500 })

    }

}

