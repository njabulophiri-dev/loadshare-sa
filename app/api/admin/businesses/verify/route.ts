import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface VerificationRequest {
  businessId: string;
  verified: boolean;
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { businessId, verified } = (await req.json()) as VerificationRequest;

    if (!businessId || typeof verified !== "boolean") {
      return NextResponse.json(
        { error: "Missing or invalid parameters" },
        { status: 400 }
      );
    }

    const business = await prisma.business.update({
      where: { id: businessId },
      data: { verified },
    });

    return NextResponse.json({ business });
  } catch (error: unknown) {
    console.error("Business verify error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
