#!/usr/bin/env node
// Seeds an admin identity into an explicitly selected loopback development database only.
// The account still uses the normal server email/password authentication and a standard scrypt
// hash. Role elevation is limited to an explicitly selected loopback development database.
// Never point this at a preview, staging, or production database.

import { randomBytes, scryptSync } from 'node:crypto';
import pg from 'pg';

const { Pool } = pg;

function refuse(message) {
  console.error(`refusing local-admin seed: ${message}`);
  process.exit(2);
}

if (process.env.NODE_ENV !== 'development') {
  refuse('NODE_ENV must be exactly development');
}
if (process.env.MG_ENABLE_LOCAL_ADMIN_SEED !== '1') {
  refuse('set MG_ENABLE_LOCAL_ADMIN_SEED=1 explicitly');
}

const databaseUrl = process.env.MG_LOCAL_DEV_DATABASE_URL;
const email = process.env.MG_DEV_ADMIN_EMAIL;
const password = process.env.MG_DEV_ADMIN_PASSWORD;
if (!databaseUrl || !email || !password) {
  refuse('MG_LOCAL_DEV_DATABASE_URL, MG_DEV_ADMIN_EMAIL and MG_DEV_ADMIN_PASSWORD are required');
}

let db;
try {
  db = new URL(databaseUrl);
} catch {
  refuse('MG_LOCAL_DEV_DATABASE_URL must be a PostgreSQL URL');
}
if (!['localhost', '127.0.0.1', '[::1]'].includes(db.hostname)) {
  refuse('database host must be loopback');
}
if (db.port !== '5434') {
  refuse('database port must be the local MARSHGO development port 5434');
}
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
  refuse('MG_DEV_ADMIN_EMAIL must be a valid email address');
}
if (password.length < 8 || password.length > 128) {
  refuse('MG_DEV_ADMIN_PASSWORD must contain 8–128 characters');
}
if (!/[a-zA-Z\u0400-\u04FF]/.test(password) || !/[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password)) {
  refuse('MG_DEV_ADMIN_PASSWORD must satisfy the server password rule (letter plus digit or symbol)');
}

const salt = randomBytes(16).toString('hex');
const derivedKey = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
const passwordHash = `scrypt$16384$8$1$${salt}$${derivedKey.toString('hex')}`;
const pool = new Pool({ connectionString: databaseUrl, max: 1, connectionTimeoutMillis: 3000 });

try {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const existing = await client.query(
      `SELECT id, account_status FROM users WHERE lower(email)=lower($1) FOR UPDATE`,
      [email],
    );

    let userId;
    if (existing.rows[0]) {
      if (existing.rows[0].account_status !== 'active') {
        throw new Error('refusing to enable a non-active account');
      }
      userId = existing.rows[0].id;
      await client.query(
        `UPDATE users
         SET password_hash=$2, display_name='Local Development Admin',
             roles=(SELECT ARRAY(SELECT DISTINCT unnest(roles || ARRAY['admin']::text[]) ORDER BY 1)),
             email_verified=true, is_verified=true, updated_at=now()
         WHERE id=$1`,
        [userId, passwordHash],
      );
    } else {
      const inserted = await client.query(
        `INSERT INTO users(email,password_hash,display_name,roles,email_verified,is_verified)
         VALUES($1,$2,'Local Development Admin',ARRAY['passenger','admin']::text[],true,true)
         RETURNING id`,
        [email, passwordHash],
      );
      userId = inserted.rows[0].id;
    }

    await client.query(
      `INSERT INTO user_roles(user_id,role) VALUES($1,'admin') ON CONFLICT(user_id,role) DO NOTHING`,
      [userId],
    );
    await client.query('COMMIT');
    console.log('Local development admin seeded. No credentials were printed or stored by this script.');
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    client.release();
  }
} finally {
  await pool.end();
}
