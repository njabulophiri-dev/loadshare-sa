import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const areaId = searchParams.get("areaId");
    if (!areaId)
      return NextResponse.json({ businesses: [], eskomStatus: null });

    // Fetch Eskom status
    const eskomRes = await fetch(
      `https://developer.sepush.co.za/business/2.0/area?id=${areaId}`,
      {
        headers: {
          Token: process.env.ESKOM_SEPUSH_API_KEY || "",
        },
      }
    );

    let eskomData = null;
    if (eskomRes.ok) {
      eskomData = await eskomRes.json();
    }

    // Fetch businesses in this area
    const businesses = await prisma.business.findMany({
      where: { areaId, verified: true, active: true },
      include: { owner: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({
      eskomStatus: {
        area: eskomData?.area?.name || "Unknown Area",
        status: eskomData?.events?.[0]?.stage || "Unknown",
        lastUpdated: eskomData?.area?.updated || new Date().toISOString(),
      },
      businesses,
    });
  } catch (error: unknown) {
    console.error("Eskom + business search error:", error);
    return NextResponse.json(
      { businesses: [], eskomStatus: null },
      { status: 500 }
    );
  }
}
