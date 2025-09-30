import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface BusinessWhereClause {
  active: boolean;
  verified: boolean;
  AND?: Array<{
    OR?: Array<{
      areaId?: { contains: string; mode: "insensitive" };
      areaName?: { contains: string; mode: "insensitive" };
    }>;
    name?: { contains: string; mode: "insensitive" };
  }>;
  type?: { contains: string; mode: "insensitive" };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const areaQuery = searchParams.get("area") || undefined;
    const type = searchParams.get("type") || undefined;
    const search = searchParams.get("search") || undefined; // business name search

    // Pagination
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const skip = (page - 1) * limit;

    // Sorting
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as
      | "asc"
      | "desc";

    const where: BusinessWhereClause = {
      active: true,
      verified: true,
    };

    // Smart area search: split into tokens
    if (areaQuery) {
      const areaTokens = areaQuery
        .split(/[^a-zA-Z0-9]+/)
        .filter(Boolean)
        .map((token) => token.toLowerCase());

      where.AND = areaTokens.map((token: string) => ({
        OR: [
          { areaId: { contains: token, mode: "insensitive" } },
          { areaName: { contains: token, mode: "insensitive" } },
        ],
      }));
    }

    // Type filter
    if (type) {
      where.type = { contains: type, mode: "insensitive" };
    }

    // Tokenized business name search
    if (search) {
      const nameTokens = search
        .split(/[^a-zA-Z0-9]+/)
        .filter(Boolean)
        .map((token) => token.toLowerCase());

      // Match any token in business name
      where.AND = where.AND || [];

      // Create name conditions with proper typing
      const nameConditions = nameTokens.map((token) => ({
        name: { contains: token, mode: "insensitive" as const },
      }));

      where.AND.push(...nameConditions);
    }

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
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    });

    const total = await prisma.business.count({ where });

    return NextResponse.json({
      businesses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    console.error("Business search error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
