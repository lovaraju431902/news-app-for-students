import { NextResponse } from "next/server";
import { searchBlogsAction, createBlogAction } from "@/app/actions/blogs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tagIdsAll = searchParams.getAll("tagIds");
    
    let tagIds: string[] = [];
    if (tagIdsAll.length > 0) {
      tagIds = tagIdsAll
        .flatMap((id) => id.split(",").map((i) => i.trim()))
        .filter(Boolean);
    } else {
      const tagIdsParam = searchParams.get("tagIds");
      if (tagIdsParam) {
        tagIds = tagIdsParam
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean);
      }
    }

    const result = await searchBlogsAction(tagIds);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createBlogAction(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create blog" },
      { status: 500 }
    );
  }
}
