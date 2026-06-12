import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"


export async function GET(res: Request) {

    try {

        const result1 = await prisma.technologyNews.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 10

        })
        return NextResponse.json({ data: result1 }, { status: 200 })




    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to get Technology news" }, { status: 500 })
    }

}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const result = await prisma.technologyNews.create({
            data: {
                image: body.image,
                title: body.title,
                href: body.href,

                isActive: body.isActive

            }
        })

        return NextResponse.json(result, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to create Technology News" }, { status: 500 })
    }
}


export async function DELETE(request: Request) {

    try {
        const body = await request.json();
        const id = body.id;

        const result = await prisma.technologyNews.delete({
            where: {
                id
            }
        })
        return NextResponse.json(result, { status: 200 })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to delete technology News" }, { status: 500 })

    }

}

