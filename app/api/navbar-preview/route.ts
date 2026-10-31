import { NextResponse } from "next/server";
import {
  getNavbarPreviewForCategory,
  getAllNavbarPreviews,
} from "@/lib/navbar-service";

export const revalidate = 60;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || searchParams.get("slug");

    if (category) {
      const posts = await getNavbarPreviewForCategory(category);
      return NextResponse.json({ success: true, posts });
    }

    // Default: fetch all categories
    const previews = await getAllNavbarPreviews();
    return NextResponse.json({ success: true, previews });
  } catch (error: any) {
    console.error("Navbar preview API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch navbar preview" },
      { status: 500 }
    );
  }
}
