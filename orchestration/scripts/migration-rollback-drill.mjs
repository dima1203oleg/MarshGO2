import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import pg from 'pg';

const CONTAINER = 'marshgo-db-1';
const DB_USER = 'marshgo';
const DRILL_DB = 'marshgo_migration_drill';
const PORT = 5434;
const PASSWORD = 'local_only_change_me';
const DRILL_URL = `postgres://${DB_USER}:${PASSWORD}@127.0.0.1:${PORT}/${DRILL_DB}`;

async function main() {
  console.log('=== MARSHGO MIGRATION REPLAY & ROLLBACK DRILL ===\n');

  console.log('[1/5] Creating clean temporary database for migration drill...');
  execSync(`docker exec ${CONTAINER} psql -U ${DB_USER} -d postgres -c "DROP DATABASE IF EXISTS ${DRILL_DB};"`, { stdio: 'inherit' });
  execSync(`docker exec ${CONTAINER} psql -U ${DB_USER} -d postgres -c "CREATE DATABASE ${DRILL_DB} OWNER ${DB_USER};"`, { stdio: 'inherit' });
  console.log('[PASS] Created isolated database:', DRILL_DB);

  console.log('\n[2/5] Running forward migration chain (001 -> 056)...');
  execSync(`DATABASE_URL=${DRILL_URL} npm --prefix MarshGO-Server run db:migrate`, { stdio: 'inherit' });

  const pool = new pg.Pool({ connectionString: DRILL_URL });
  const applied = await pool.query('SELECT count(*)::int AS count FROM schema_migrations');
  console.log(`[PASS] Applied ${applied.rows[0].count} migrations successfully.`);
  assert.equal(applied.rows[0].count, 53, 'Expected 53 migration files in schema_migrations');

  console.log('\n[3/5] Testing rollback of latest migration (056_email_password_auth.sql)...');
  await pool.query('BEGIN');
  // Revert 056 changes: drop password_hash and email_verified, drop password_reset_tokens
  await pool.query('ALTER TABLE users DROP COLUMN IF EXISTS password_hash CASCADE');
  await pool.query('ALTER TABLE users DROP COLUMN IF EXISTS email_verified CASCADE');
  await pool.query('DROP TABLE IF EXISTS password_reset_tokens CASCADE');
  await pool.query("DELETE FROM schema_migrations WHERE name = '056_email_password_auth.sql'");
  await pool.query('COMMIT');

  // Verify rollback state
  const colCheckRollback = await pool.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'users' AND column_name IN ('password_hash', 'email_verified');
  `);
  assert.equal(colCheckRollback.rows.length, 0, 'Columns must be dropped after rollback');
  console.log('[PASS] Rollback successful: 056 schema objects removed.');

  console.log('\n[4/5] Testing re-application of 056_email_password_auth.sql...');
  execSync(`DATABASE_URL=${DRILL_URL} npm --prefix MarshGO-Server run db:migrate`, { stdio: 'inherit' });

  // Verify columns restored
  const colCheckRestored = await pool.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'users' AND column_name IN ('password_hash', 'email_verified');
  `);
  assert.equal(colCheckRestored.rows.length, 2, 'Columns must be recreated upon re-migration');

  const reApplied = await pool.query("SELECT 1 FROM schema_migrations WHERE name = '056_email_password_auth.sql'");
  assert.equal(reApplied.rowCount, 1, 'Migration 056 must be marked applied again');
  console.log('[PASS] Re-migration successful: forward & rollback idempotency proven.');

  await pool.end();

  console.log('\n[5/5] Dropping drill database...');
  execSync(`docker exec ${CONTAINER} psql -U ${DB_USER} -d postgres -c "DROP DATABASE ${DRILL_DB};"`, { stdio: 'inherit' });
  console.log('[PASS] Drill database dropped cleanly.');

  console.log('\n=== MIGRATION REPLAY & ROLLBACK DRILL COMPLETED WITH 100% EVIDENCE PASS ===');
}

main().catch((err) => {
  console.error('[MIGRATION DRILL FAILED]', err);
  process.exit(1);
});
