import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis; // Ensure Prisma doesn't get recreated in hot reloads

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
