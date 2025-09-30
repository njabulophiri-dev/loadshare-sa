import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // make sure this path is correct

interface BusinessWhereClause {
  active: boolean;
  verified: boolean;
  OR?: Array<{
    areaId?: { contains: string };
    areaName?: { contains: string };
  }>;
  type?: { contains: string };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Get optional query params
    const area = searchParams.get("area") || undefined;
    const type = searchParams.get("type") || undefined;

    // Base where clause
    const where: BusinessWhereClause = {
      active: true,
      verified: true,
    };

    // Filter by area (matches areaId OR areaName)
    if (area) {
      where.OR = [
        { areaId: { contains: area } },
        { areaName: { contains: area } },
      ];
    }

    // Filter by type if provided
    if (type) {
      where.type = { contains: type };
    }

    // Fetch businesses from Prisma
    const businesses = await prisma.business.findMany({
      where,
      select: {
        id: true,
        name: true,
        type: true,
        address: true,
        areaId: true,
        areaName: true,
        hasPower: true,
        powerType: true,
        description: true,
        verified: true,
        createdAt: true,
        updatedAt: true,
        owner: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    return NextResponse.json({ businesses });
  } catch (error: unknown) {
    console.error("Business search error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
