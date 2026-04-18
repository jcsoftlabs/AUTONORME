// ─────────────────────────────────────────────────────────────────────────────
// AUTONORME — Export Prisma Client
// Singleton pattern pour éviter les connexions multiples en dev (hot reload)
// ─────────────────────────────────────────────────────────────────────────────

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env['NODE_ENV'] === 'development' ? ['query', 'warn', 'error'] : ['warn', 'error'],
  });

if (process.env['NODE_ENV'] !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;

// Re-export des types Prisma pour usage dans les autres packages
export * from '@prisma/client';
