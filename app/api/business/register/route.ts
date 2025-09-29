import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description } = await request.json();

    // Validate input
    if (!name || !description) {
      return NextResponse.json(
        { error: "Business name and description are required" },
        { status: 400 }
      );
    }

    // Check if user already has a business
    const existingBusiness = await prisma.business.findFirst({
      where: { ownerId: session.user.id },
    });

    if (existingBusiness) {
      return NextResponse.json(
        { error: "You already have a registered business" },
        { status: 400 }
      );
    }

    // Create the business
    const business = await prisma.business.create({
      data: {
        name,
        description,
        ownerId: session.user.id,
      },
    });

    // Update user role to BUSINESS_OWNER
    await prisma.user.update({
      where: { id: session.user.id },
      data: { role: "BUSINESS_OWNER" },
    });

    return NextResponse.json({ business }, { status: 201 });
  } catch (error) {
    console.error("Business registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
