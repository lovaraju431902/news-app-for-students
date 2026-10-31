import { NextResponse } from "next/server";
import {
  getAllAdSpaces,
  saveAdSpace,
  AdSpaceId,
  AdSpaceItem,
} from "@/lib/ad-service";

export const revalidate = 60;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const spaceId = searchParams.get("space") as AdSpaceId | null;

    const spaces = await getAllAdSpaces();

    if (spaceId && spaces[spaceId]) {
      return NextResponse.json({ success: true, space: spaces[spaceId] });
    }

    return NextResponse.json({ success: true, spaces });
  } catch (error: any) {
    console.error("Ad Spaces GET error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch ad spaces" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AdSpaceItem;
    if (!body || !body.id) {
      return NextResponse.json(
        { success: false, error: "Invalid ad space data" },
        { status: 400 }
      );
    }

    const saved = await saveAdSpace(body);
    return NextResponse.json({ success: true, space: saved });
  } catch (error: any) {
    console.error("Ad Spaces POST error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save ad space" },
      { status: 500 }
    );
  }
}
