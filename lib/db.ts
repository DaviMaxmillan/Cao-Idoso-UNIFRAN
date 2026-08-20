import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

declare global {
  var __prismaPool: pg.Pool | undefined;
  var __prismaClient: PrismaClient | undefined;
}

function criarPool() {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    // Se o Postgres for reiniciado ou derrubar uma conexão ociosa, o cliente
    // afetado emite 'error'. Sem este handler o Node encerra o processo inteiro
    // por evento de erro não tratado — o pool sozinho já descarta a conexão
    // quebrada e abre outra na próxima consulta.
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });

  pool.on("error", (erro) => {
    console.error("[db] conexão ociosa caiu, será descartada:", erro.message);
  });

  return pool;
}

const pool = globalThis.__prismaPool ?? criarPool();
const adapter = new PrismaPg(pool);

export const db = globalThis.__prismaClient ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalThis.__prismaPool = pool;
  globalThis.__prismaClient = db;
}
