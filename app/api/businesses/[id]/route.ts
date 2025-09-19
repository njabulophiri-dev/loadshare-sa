import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Context {
  params: Promise<{ id: string }>;
}

// Handle both GET /api/businesses AND GET /api/businesses/[id]
export async function GET(request: Request, context: Context) {
  try {
    const params = await context.params;
    const id = params?.id;

    // If no ID provided, return ALL businesses
    if (!id) {
      const businesses = await prisma.business.findMany();
      return NextResponse.json(businesses);
    }

    // If ID provided, return a SINGLE business
    const businessId = parseInt(id);
    if (isNaN(businessId)) {
      return NextResponse.json(
        { error: "Invalid business ID" },
        { status: 400 }
      );
    }

    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(business);
  } catch (error) {
    console.error("Error fetching business(es):", error);
    return NextResponse.json(
      { error: "Failed to fetch business(es)", details: String(error) },
      { status: 500 }
    );
  }
}

// PUT - Update a business's power status (unchanged)
export async function PUT(request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { hasPower } = body;

    console.log("UPDATE REQUEST:", { id, hasPower });

    const businessId = parseInt(id);
    if (isNaN(businessId)) {
      return NextResponse.json(
        { error: "Invalid business ID" },
        { status: 400 }
      );
    }

    const updatedBusiness = await prisma.business.update({
      where: { id: businessId },
      data: { hasPower },
    });

    console.log("UPDATE SUCCESS:", updatedBusiness);
    return NextResponse.json(updatedBusiness);
  } catch (error) {
    console.error("Error updating business:", error);
    return NextResponse.json(
      { error: "Failed to update business", details: String(error) },
      { status: 500 }
    );
  }
}
