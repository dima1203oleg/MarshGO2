#!/usr/bin/env node
/* global fetch */
// Dev-login bootstrap for MARSHGO development environments (never production).
// Creates the account if missing, otherwise proves the password still signs in,
// then verifies the token against GET /api/v1/users/me.
//
//   MG_API_BASE=https://marshgo-dima.shares.zrok.io/api/v1 \
//   node scripts/dev-login-account.mjs --email dima@marshgo.local --password 'Marshgo#2026dev'
//
// Credentials are taken only from CLI flags or MG_DEV_EMAIL / MG_DEV_PASSWORD and are
// never written to disk or printed by this script.
const args = process.argv.slice(2);
const flag = (name) => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? undefined : args[index + 1];
};
const email = flag('email') ?? process.env.MG_DEV_EMAIL;
const password = flag('password') ?? process.env.MG_DEV_PASSWORD;
const base = process.env.MG_API_BASE ?? 'http://127.0.0.1:3902/api/v1';
if (!email || !password) {
  console.error('usage: --email <email> --password <password> (or MG_DEV_EMAIL/MG_DEV_PASSWORD); MG_API_BASE defaults to :3902');
  process.exit(2);
}
if (!['127.0.0.1', 'localhost'].includes(new URL(base).hostname) && process.env.MG_ALLOW_REMOTE !== '1') {
  // Guard against pointing this at a real deployment by accident: a loopback target is
  // always fine, anything else needs MG_ALLOW_REMOTE=1 to say "yes, this is my preview".
  console.error('refusing to create an account on a non-loopback target without MG_ALLOW_REMOTE=1');
  process.exit(2);
}

const post = async (path, body, token) => {
  const response = await fetch(`${base}${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
  });
  return { status: response.status, json: await response.json().catch(() => null) };
};

const session = async () => {
  const login = await post('/auth/login', { email, password });
  if (login.status === 200) return { mode: 'login', ...login };
  const register = await post('/auth/register', { email, password, displayName: flag('name') ?? 'Власник (dev)' });
  if (register.status >= 400) return { mode: 'register', ...register };
  const relogin = await post('/auth/login', { email, password });
  return { mode: 'register+login', ...relogin };
};

const result = await session();
const token = result.json?.data?.accessToken ?? '';
const user = result.json?.data?.user ?? {};
if (!token) {
  console.error(`${result.mode} failed http=${result.status} code=${result.json?.error?.code ?? 'n/a'}`);
  process.exit(1);
}
const me = await fetch(`${base}/users/me`, { headers: { authorization: `Bearer ${token}` } });
console.log(`${result.mode} ok  http=${result.status}`);
console.log(`  email=${email}  user.id=${user.id ?? 'n/a'}  roles=${JSON.stringify(user.roles ?? [])}`);
console.log(`  GET /users/me with the new token: http=${me.status}`);
console.log(`  sign-in URL: ${(process.env.MG_APP_URL ?? new URL('/api/v1', base).origin)}`);
