const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const challenges = [
    { name: "Decoder Challenge", correctFlag: `FLAG{${process.env.FLAG_1}}`, points: 500 },
    { name: "SQL Injection Challenge", correctFlag: `FLAG{${process.env.FLAG_2}}`, points: 300 },
  ];

  for (const challenge of challenges) {
    await prisma.challenge.upsert({
      where: { name: challenge.name },
      update: {},
      create: challenge,
    });
  }

  console.log("Challenges seeded successfully!");
}

main()
  .catch((error) => {
    console.error("Error seeding challenges:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
