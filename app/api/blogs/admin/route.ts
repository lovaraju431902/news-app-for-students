import { NextResponse } from "next/server";
import { getAdminBlogsAction } from "@/app/actions/blogs";

export async function GET() {
  try {
    const result = await getAdminBlogsAction();
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch admin blogs" },
      { status: 500 }
    );
  }
}
