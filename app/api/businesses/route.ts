import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log("🟢 API Route: Fetching all businesses...");
    const businesses = await prisma.business.findMany();
    console.log("🟢 Found businesses:", businesses.length);
    return NextResponse.json(businesses);
  } catch (error) {
    console.error("🔴 Error fetching businesses:", error);
    return NextResponse.json(
      { error: "Failed to fetch businesses", details: String(error) },
      { status: 500 }
    );
  }
}
