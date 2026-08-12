import { NextResponse } from "next/server";
import { getSiteSettingsAction } from "@/app/actions/settings";

export async function GET() {
  try {
    const settings = await getSiteSettingsAction();
    const response = NextResponse.json(settings, { status: 200 });
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=120"
    );
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch settings" },
      { status: 500 }
    );
  }
}
