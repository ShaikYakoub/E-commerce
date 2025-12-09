import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

let prisma: PrismaClient | undefined;

// 1. Lazy Getter: Only creates the client when requested
function getClient() {
  if (!prisma) {
    // 🛡️ BUILD SAFETY: If DATABASE_URL is missing, use a placeholder.
    // This prevents "Invalid Datasource URL" errors during the build step.
    const url = process.env.DATABASE_URL || "postgresql://build_placeholder:password@localhost:5432/db";
    
    console.log(`🔌 Initializing Prisma Client (URL exists: ${!!process.env.DATABASE_URL})`);

    prisma = globalForPrisma.prisma ?? new PrismaClient({
      datasources: {
        db: { url },
      },
    });

    if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
  }
  return prisma;
}

// 2. Export a Proxy
// This mimics the real 'db' object but delays initialization until you access a property (like db.user)
export const db = new Proxy({} as PrismaClient, {
  get: (_target, prop) => {
    const client = getClient();
    return client[prop as keyof PrismaClient];
  },
});