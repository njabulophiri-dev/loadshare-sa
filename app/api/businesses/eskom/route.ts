import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fetch from "node-fetch";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const areaId = searchParams.get("areaId");
    if (!areaId)
      return NextResponse.json({ businesses: [], eskomStatus: null });

    // Fetch Eskom status
    const eskomRes = await fetch(
      `https://developer.sepush.co.za/business/areas/${areaId}/status`,
      {
        headers: {
          Authorization: `Bearer ${process.env.ESKOM_SEPUSH_API_KEY}`,
        },
      }
    );
    const eskomData = await eskomRes.json();

    // Fetch businesses in this area
    const businesses = await prisma.business.findMany({
      where: { areaId, verified: true, active: true },
      include: { owner: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({
      eskomStatus: {
        area: eskomData.name,
        status: eskomData.stage || "Unknown",
        lastUpdated: eskomData.updatedAt || new Date().toISOString(),
      },
      businesses,
    });
  } catch (error) {
    console.error("Eskom + business search error:", error);
    return NextResponse.json(
      { businesses: [], eskomStatus: null },
      { status: 500 }
    );
  }
}
