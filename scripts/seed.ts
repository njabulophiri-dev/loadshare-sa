import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.business.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  console.log("👥 Creating users...");

  const businessOwner = await prisma.user.create({
    data: {
      name: "Sarah Johnson",
      email: "sarah@cafejava.com",
      emailVerified: new Date(),
      role: "BUSINESS_OWNER",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
    },
  });

  const businessOwner2 = await prisma.user.create({
    data: {
      name: "Mike Chen",
      email: "mike@officehub.com",
      emailVerified: new Date(),
      role: "BUSINESS_OWNER",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
    },
  });

  const businessOwner3 = await prisma.user.create({
    data: {
      name: "Gino Rossi",
      email: "gino@pizzeria.com",
      emailVerified: new Date(),
      role: "BUSINESS_OWNER",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      name: "Alex Taylor",
      email: "alex@example.com",
      emailVerified: new Date(),
      role: "CUSTOMER",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
    },
  });

  // Create businesses with new schema
  console.log("🏢 Creating businesses...");

  await prisma.business.createMany({
    data: [
      {
        name: "Cafe Java",
        type: "coffee",
        address: "123 Sandton Drive, Sandton",
        areaId: "eskde-4-sandton-sandton",
        areaName: "Sandton, Johannesburg",
        description:
          "Premium coffee shop with full generator backup. Perfect for remote work during load shedding.",
        hasPower: true,
        powerType: "generator",
        ownerId: businessOwner.id,
        verified: true,
        active: true,
      },
      {
        name: "The Office Hub",
        type: "coworking",
        address: "45 Rivonia Road, Sandton",
        areaId: "eskde-4-sandton-sandton",
        areaName: "Sandton, Johannesburg",
        description:
          "Modern co-working space with UPS backup and high-speed fiber. Meeting rooms available.",
        hasPower: true,
        powerType: "ups",
        ownerId: businessOwner2.id,
        verified: true,
        active: true,
      },
      {
        name: "Gino's Pizzeria",
        type: "restaurant",
        address: "78 Main Street, Pretoria",
        areaId: "eskde-10-pretoriacentral",
        areaName: "Pretoria Central",
        description:
          "Authentic Italian pizza restaurant. Currently no backup power during load shedding.",
        hasPower: false,
        powerType: "none",
        ownerId: businessOwner3.id,
        verified: true,
        active: true,
      },
      {
        name: "FitLife Gym",
        type: "gym",
        address: "22 Oak Avenue, Randburg",
        areaId: "eskde-4-sandton-sandton",
        areaName: "Randburg, Johannesburg",
        description:
          "Full-service gym with solar backup. Stay fit even during power outages.",
        hasPower: true,
        powerType: "solar",
        ownerId: businessOwner.id,
        verified: false, // Not verified yet
        active: true,
      },
    ],
  });

  console.log("✅ Seed data created successfully!");
  console.log("📊 Created Users:");
  console.log(
    `   - ${businessOwner.name} (${businessOwner.email}) - ${businessOwner.role}`
  );
  console.log(
    `   - ${businessOwner2.name} (${businessOwner2.email}) - ${businessOwner2.role}`
  );
  console.log(
    `   - ${businessOwner3.name} (${businessOwner3.email}) - ${businessOwner3.role}`
  );
  console.log(
    `   - ${regularUser.name} (${regularUser.email}) - ${regularUser.role}`
  );

  console.log("📊 Created Businesses:");
  const businesses = await prisma.business.findMany({
    include: { owner: true },
  });
  businesses.forEach((business) => {
    console.log(
      `   - ${business.name} (${business.type}) - ${
        business.hasPower ? "⚡ Has Power" : "🚫 No Power"
      } - Verified: ${business.verified} - Owner: ${business.owner.name}`
    );
  });
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
