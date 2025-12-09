import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// 🛡️ DEFENSIVE INIT: Check for Database URL before crashing
const databaseUrl = process.env.DATABASE_URL;

let prisma: PrismaClient;

if (!databaseUrl) {
  // During build, if env vars are missing, create a "dummy" or null client
  // This prevents the "Invalid URL" crash during module loading
  console.warn("⚠️ DATABASE_URL is missing. Using mock client for build.");
  prisma = new Proxy({} as PrismaClient, {
    get: () => async () => {
      console.warn("DB call ignored during build/missing env.");
      return null;
    }
  });
} else {
  // Real initialization
  prisma = globalForPrisma.prisma || new PrismaClient();
}

if (process.env.NODE_ENV !== "production" && databaseUrl) {
  globalForPrisma.prisma = prisma;
}

export const db = prisma;