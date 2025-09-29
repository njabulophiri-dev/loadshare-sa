import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, type, address, areaId, areaName, powerType } = body;

    if (!name || !type || !address || !areaId || !areaName || !powerType) {
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
        areaName,
        powerType,
        hasPower: powerType !== "none",
        ownerId: session.user.id,
        verified: false,
        active: true,
      },
    });

    return NextResponse.json({ business });
  } catch (error) {
    console.error("Business registration error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
