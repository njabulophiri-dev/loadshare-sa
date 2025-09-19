import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data (optional, useful for development)
  await prisma.business.deleteMany();

  // Create initial businesses
  await prisma.business.createMany({
    data: [
      {
        name: "Cafe Java",
        description:
          "The best coffee in town, now with a generator to keep you caffeinated through load shedding.",
        hasPower: true,
      },
      {
        name: "The Office Hub",
        description:
          "A quiet co-working space with high-speed fibre and plenty of sockets. Perfect for remote workers.",
        hasPower: true,
      },
      {
        name: "Gino's Pizzeria",
        description:
          "Authentic Italian pizza. Unfortunately, our oven is off during load shedding.",
        hasPower: false,
      },
    ],
  });
  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
