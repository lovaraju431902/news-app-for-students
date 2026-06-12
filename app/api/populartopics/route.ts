import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"


export async function GET(res: Request) {

    try {

        const result1 = await prisma.popularTopics.findMany({
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
        return NextResponse.json({ error: "Failed to get Popular Topics" }, { status: 500 })
    }

}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        console.log("body in route.ts", body)

        // const result = await prisma.popularTopics.create({
        //     data: {
        //         topic: body.topic,
        //         labelColor: body.labelColor,
        //         href: body.href,
        //         isActive: body.isActive

        //     }
        // })

        const result = await prisma.popularTopics.create({
            data: {
                topic: body.topic,
                labelColor: body.labelColor,
                href: body.href,
                isActive: body.isActive

            }
        })



        return NextResponse.json(result, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to create Popular Topics" }, { status: 500 })
    }
}


export async function DELETE(request: Request) {

    try {
        const body = await request.json();
        const id = body.id;

        const result = await prisma.popularTopics.delete({
            where: {
                id
            }
        })
        return NextResponse.json(result, { status: 200 })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to delete Popular Topics" }, { status: 500 })

    }

}

