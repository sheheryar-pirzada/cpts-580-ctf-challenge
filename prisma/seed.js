const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const challenges = [
    {
      name: "SQL Injection Challenge",
      correctFlag: `FLAG{${process.env.FLAG_2}}`,
      points: 100, difficulty: "EASY",
      description: "A vulnerable auth page holds the key—if you can speak its language",
    },
    {
      name: "Decoder Challenge",
      correctFlag: `FLAG{${process.env.FLAG_1}}`,
      points: 200, difficulty: "MEDIUM",
      description: "Unravel the secrets of a token to uncover the hidden image",
    },
    {
      name: "IDOR Challenge",
      correctFlag: `FLAG{${process.env.FLAG_3}}`,
      points: 200, difficulty: "MEDIUM",
      description: "A little ID swap never hurt anyone… or did it?",
    },
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
