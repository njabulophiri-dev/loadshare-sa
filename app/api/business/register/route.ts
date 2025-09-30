import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, type, address, areaId, areaName, hasPower, powerType } =
      await req.json();

    if (!name || !type || !address || !areaId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const business = await prisma.business.create({
      data: {
        name,
        type,
        address,
        areaId,
        areaName: areaName || null,
        hasPower: hasPower ?? false,
        powerType: powerType || null,
        verified: false,
        active: true,
        ownerId: session.user.id,
      },
    });

    return NextResponse.json({ business });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
