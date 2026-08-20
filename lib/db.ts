import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

declare global {
  var __prismaPool: pg.Pool | undefined;
  var __prismaClient: PrismaClient | undefined;
}

const pool =
  globalThis.__prismaPool ??
  new pg.Pool({ connectionString: process.env.DATABASE_URL });

const adapter = new PrismaPg(pool);

export const db = globalThis.__prismaClient ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalThis.__prismaPool = pool;
  globalThis.__prismaClient = db;
}
