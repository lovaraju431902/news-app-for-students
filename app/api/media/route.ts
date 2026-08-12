import { NextResponse } from "next/server";
import { getMediaLibraryAction, deleteMediaItemAction } from "@/app/actions/media";

export async function GET() {
  const result = await getMediaLibraryAction();
  return NextResponse.json(result);
}

export async function DELETE(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ success: false, error: "Media URL is required" }, { status: 400 });
    }
    const result = await deleteMediaItemAction(url);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to delete media" }, { status: 500 });
  }
}
