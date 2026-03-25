import { PrismaClient } from "@prisma/client";
import { fileURLToPath } from "node:url";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

if (!process.env.DATABASE_URL) {
  const fallbackDbPath = fileURLToPath(new URL("../prisma/dev.db", import.meta.url));
  process.env.DATABASE_URL = `file:${fallbackDbPath}`;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
