import { NextResponse } from "next/server";
import { getTagsAction, createTagAction } from "@/app/actions/blogs";

export async function GET() {
  try {
    const result = await getTagsAction();
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch tags" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, parentId } = body;
    const result = await createTagAction(name, parentId);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create tag" },
      { status: 500 }
    );
  }
}
