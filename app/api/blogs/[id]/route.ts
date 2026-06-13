import { NextResponse } from "next/server";
import { getBlogByIdAction, updateBlogAction, deleteBlogAction } from "@/app/actions/blogs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await getBlogByIdAction(id);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch blog by ID" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = await updateBlogAction(id, body);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update blog" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await deleteBlogAction(id);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete blog" },
      { status: 500 }
    );
  }
}
