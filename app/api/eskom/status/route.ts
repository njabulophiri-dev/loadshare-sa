import { NextResponse } from "next/server";
import { eskomAPI } from "@/lib/eskom-api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const areaId = searchParams.get("areaId") || "eskde-4-sandton-sandton";

  try {
    console.log(`⚡ Fetching status for area: ${areaId}`);

    // This will automatically use mock data if API fails
    const status = await eskomAPI.getStatus(areaId);

    console.log("✅ Status loaded successfully");
    return NextResponse.json(status);
  } catch {
    console.log("🔄 Using mock data due to error");
    // Always return mock data as fallback
    const status = eskomAPI.getMockAreaInfo(areaId);
    return NextResponse.json(status);
  }
}
