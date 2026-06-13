import { NextResponse } from "next/server";
import { getBlogBySlugAction } from "@/app/actions/blogs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const result = await getBlogBySlugAction(slug);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch blog by slug" },
      { status: 500 }
    );
  }
}
