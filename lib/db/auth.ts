"use server";

import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { pool } from "./pool";

// Autenticação por e-mail/senha direto no PostgreSQL (substitui o Supabase
// Auth). A senha fica em goted.users.password_hash (bcrypt) e cada login cria
// uma linha em goted.sessions. O navegador guarda só o token opaco num cookie
// httpOnly; no banco fica apenas o hash SHA-256 desse token.
//
// Nenhuma rota é bloqueada: sem sessão, a plataforma continua em modo demo
// (ver lib/tenant.ts).

const COOKIE_SESSAO = "goted_session";
const DURACAO_SESSAO_DIAS = 30;

export type SessaoUsuario = { id: string; nome: string; email: string };

type Resultado = { erro?: string };

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function normalizarEmail(email: string): string {
  return email.trim().toLowerCase();
}

async function criarSessao(userId: string): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expiraEm = new Date(Date.now() + DURACAO_SESSAO_DIAS * 24 * 60 * 60 * 1000);

  await pool.query(
    "insert into goted.sessions (token_hash, user_id, expires_at) values ($1, $2, $3)",
    [hashToken(token), userId, expiraEm]
  );

  (await cookies()).set(COOKIE_SESSAO, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiraEm,
  });
}

export async function entrar(email: string, senha: string): Promise<Resultado> {
  const { rows } = await pool.query<{ id: string; password_hash: string | null }>(
    "select id, password_hash from goted.users where email = $1",
    [normalizarEmail(email)]
  );

  const usuario = rows[0];
  const senhaOk = usuario?.password_hash
    ? await bcrypt.compare(senha, usuario.password_hash)
    : false;

  if (!usuario || !senhaOk) return { erro: "E-mail ou senha incorretos." };

  await criarSessao(usuario.id);
  return {};
}

export async function criarConta(email: string, senha: string): Promise<Resultado> {
  const emailNormalizado = normalizarEmail(email);
  if (senha.length < 6) return { erro: "A senha precisa ter pelo menos 6 caracteres." };

  const passwordHash = await bcrypt.hash(senha, 10);
  const { rows } = await pool.query<{ id: string }>(
    `insert into goted.users (nome, email, password_hash)
     values ($1, $2, $3)
     on conflict (email) do nothing
     returning id`,
    [emailNormalizado.split("@")[0], emailNormalizado, passwordHash]
  );

  if (rows.length === 0) return { erro: "Já existe uma conta com este e-mail." };

  await criarSessao(rows[0].id);
  return {};
}

export async function sair(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_SESSAO)?.value;
  if (token) {
    await pool.query("delete from goted.sessions where token_hash = $1", [hashToken(token)]);
  }
  cookieStore.delete(COOKIE_SESSAO);
}

export async function getSessaoAtual(): Promise<SessaoUsuario | null> {
  const token = (await cookies()).get(COOKIE_SESSAO)?.value;
  if (!token) return null;

  const { rows } = await pool.query<SessaoUsuario>(
    `select u.id, u.nome, u.email
       from goted.sessions s
       join goted.users u on u.id = s.user_id
      where s.token_hash = $1 and s.expires_at > now()`,
    [hashToken(token)]
  );

  return rows[0] ?? null;
}
