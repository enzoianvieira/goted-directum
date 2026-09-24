import { Pool } from "pg";

// Pool de conexões com o PostgreSQL (schema `goted`, ver db/schema.sql).
// Só deve ser importado por código de servidor (Server Functions em
// lib/db/queries.ts e lib/db/auth.ts) — nunca por componentes de cliente.
//
// Em dev o Next recarrega módulos a cada alteração; guardar o pool no
// globalThis evita abrir um pool novo (e esgotar conexões) a cada hot reload.

const globalForPg = globalThis as unknown as { gotedPool?: Pool };

export const pool =
  globalForPg.gotedPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
  });

if (process.env.NODE_ENV !== "production") globalForPg.gotedPool = pool;
