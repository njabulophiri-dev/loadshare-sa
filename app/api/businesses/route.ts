import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const area = searchParams.get("area");
    const type = searchParams.get("type");
    const hasPower = searchParams.get("hasPower");
    const owner = searchParams.get("owner");

    // If owner=true, return user's businesses (including unverified)
    if (owner === "true") {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const userBusinesses = await prisma.business.findMany({
        where: {
          ownerId: session.user.id,
          active: true,
        },
        select: {
          id: true,
          name: true,
          type: true,
          address: true,
          area: true,
          hasPower: true,
          powerType: true,
          capacity: true,
          description: true,
          verified: true,
          active: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return NextResponse.json({ businesses: userBusinesses });
    }

    // Build where clause for public business search
    const where: any = {
      active: true,
      verified: true, // Only show verified businesses to public
    };

    if (area) {
      // Case-insensitive search that works with SQLite now
      where.area = { contains: area.toLowerCase() };
    }

    if (type && type !== "") {
      where.type = type;
    }

    if (hasPower === "true") {
      where.hasPower = true;
    }

    const businesses = await prisma.business.findMany({
      where,
      select: {
        id: true,
        name: true,
        type: true,
        address: true,
        area: true,
        hasPower: true,
        powerType: true,
        capacity: true,
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
      take: 50, // Limit results
    });

    return NextResponse.json({ businesses });
  } catch (error) {
    console.error("Business search error:", error);
    return NextResponse.json({ businesses: [] }, { status: 500 });
  }
}
