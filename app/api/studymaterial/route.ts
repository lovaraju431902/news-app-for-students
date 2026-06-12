import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"


export async function GET(res: Request) {

    try {

        const result1 = await prisma.studyMaterial.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 3

        })
        return NextResponse.json({ data: result1 }, { status: 200 })




    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to get Study materials news" }, { status: 500 })
    }

}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const result = await prisma.studyMaterial.create({
            data: {

                title: body.title,
                href: body.href,

                isActive: body.isActive

            }
        })

        return NextResponse.json(result, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to create Study material News" }, { status: 500 })
    }
}


export async function DELETE(request: Request) {

    try {
        const body = await request.json();
        const id = body.id;

        const result = await prisma.studyMaterial.delete({
            where: {
                id
            }
        })
        return NextResponse.json(result, { status: 200 })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to delete Study material" }, { status: 500 })

    }

}

