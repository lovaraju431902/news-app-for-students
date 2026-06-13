import { NextResponse } from "next/server";
import { seedMainCategoriesAction } from "@/app/actions/blogs";

export async function POST() {
  try {
    const result = await seedMainCategoriesAction();
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to seed main categories" },
      { status: 500 }
    );
  }
}
