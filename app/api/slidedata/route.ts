import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"


export async function GET(res: Request) {

    try {

        const result1 = await prisma.slideData.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 4,


        })
        return NextResponse.json({ data: result1 }, { status: 200 })




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
        return NextResponse.json(result, { status: 200 })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to delete slide" }, { status: 500 })

    }

}

