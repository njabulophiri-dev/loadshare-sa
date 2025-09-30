import { NextResponse } from "next/server";
import { eskomAPI } from "@/lib/eskom-api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "johannesburg";

  try {
    console.log(`🔍 Searching areas for: ${query}`);

    // This will automatically use mock data if API fails
    const areas = await eskomAPI.searchAreas(query);

    console.log(`✅ Found ${areas.length} areas`);
    return NextResponse.json({ areas });
  } catch {
    console.log("🔄 Using mock area data due to error");
    // Always return mock data as fallback
    const areas = eskomAPI.getMockAreas(query);
    return NextResponse.json({ areas });
  }
}
