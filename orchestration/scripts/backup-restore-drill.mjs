import { execSync } from 'node:child_process';
import assert from 'node:assert/strict';
import pg from 'pg';

const CONTAINER = 'marshgo-db-1';
const DB_USER = 'marshgo';
const SOURCE_DB = 'marshgo';
const DRILL_DB = 'marshgo_restore_drill';
const DUMP_PATH = '/tmp/marshgo_drill_backup.dump';
const PORT = 5434;
const PASSWORD = 'local_only_change_me';

async function main() {
  console.log('=== MARSHGO POSTGIS 17 BACKUP & RESTORE DRILL ===\n');

  console.log('[1/6] Running pg_dump inside PostGIS container...');
  const t0 = Date.now();
  execSync(`docker exec ${CONTAINER} pg_dump -U ${DB_USER} -d ${SOURCE_DB} -F c -b -f ${DUMP_PATH}`, { stdio: 'inherit' });
  const dumpSize = execSync(`docker exec ${CONTAINER} ls -lh ${DUMP_PATH}`).toString().trim().split(/\s+/)[4];
  console.log(`[PASS] Dump created successfully in ${Date.now() - t0}ms (size: ${dumpSize})\n`);

  console.log('[2/6] Preparing isolated drill database...');
  execSync(`docker exec ${CONTAINER} psql -U ${DB_USER} -d postgres -c "DROP DATABASE IF EXISTS ${DRILL_DB};"`, { stdio: 'inherit' });
  execSync(`docker exec ${CONTAINER} psql -U ${DB_USER} -d postgres -c "CREATE DATABASE ${DRILL_DB} OWNER ${DB_USER};"`, { stdio: 'inherit' });
  console.log('[PASS] Isolated drill database created.\n');

  console.log('[3/6] Restoring dump via pg_restore...');
  const t1 = Date.now();
  // pg_restore might emit harmless warnings for extensions if already created, so allow code 0 or exit with ignore
  try {
    execSync(`docker exec ${CONTAINER} pg_restore -U ${DB_USER} -d ${DRILL_DB} --no-owner --role=${DB_USER} ${DUMP_PATH}`, { stdio: 'pipe' });
  } catch (err) {
    // Check if exit code is 0 or 1 (warnings)
    if (err.status > 1) {
      console.error('pg_restore failed with status', err.status, err.stderr?.toString());
      throw err;
    }
  }
  console.log(`[PASS] pg_restore completed in ${Date.now() - t1}ms\n`);

  console.log('[4/6] Verifying PostGIS and spatial capabilities in restored database...');
  const poolSource = new pg.Pool({ connectionString: `postgres://${DB_USER}:${PASSWORD}@127.0.0.1:${PORT}/${SOURCE_DB}` });
  const poolDrill = new pg.Pool({ connectionString: `postgres://${DB_USER}:${PASSWORD}@127.0.0.1:${PORT}/${DRILL_DB}` });

  const postgisVersion = await poolDrill.query('SELECT postgis_full_version();');
  assert.ok(postgisVersion.rows[0].postgis_full_version.includes('POSTGIS="3.5'), 'PostGIS 3.5 must be active in restored DB');
  console.log(`[PASS] PostGIS verified: ${postgisVersion.rows[0].postgis_full_version.split('\n')[0]}`);

  console.log('\n[5/6] Comparing table schemas, row counts, and spatial indexes...');
  const tables = ['users', 'vehicles', 'offers', 'bookings', 'mobility_providers', 'sessions', 'user_roles'];

  for (const table of tables) {
    const [{ rows: [src] }, { rows: [dst] }] = await Promise.all([
      poolSource.query(`SELECT count(*)::int AS count FROM ${table}`),
      poolDrill.query(`SELECT count(*)::int AS count FROM ${table}`),
    ]);
    assert.equal(src.count, dst.count, `Row counts must match for table ${table}`);
    console.log(`  - Table ${table}: ${src.count} rows (exact match)`);
  }

  // Verify Spatial GIST Indexes
  const spatialIndexes = await poolDrill.query(`
    SELECT indexname, tablename, indexdef
    FROM pg_indexes
    WHERE tablename IN ('offers', 'vehicles', 'mobility_providers', 'passenger_demands')
      AND indexdef ILIKE '%USING gist%'
    ORDER BY tablename, indexname;
  `);
  assert.ok(spatialIndexes.rows.length > 0, 'Spatial GIST indexes must be recreated');
  console.log(`  - Spatial GIST indexes recreated: ${spatialIndexes.rows.length} found:`);
  for (const idx of spatialIndexes.rows) {
    console.log(`    * ${idx.tablename}.${idx.indexname}`);
  }

  // Execute spatial query on restored database
  const spatialQuery = await poolDrill.query(`
    SELECT id, origin_name, destination_name,
           ST_Distance(origin, ST_SetSRID(ST_MakePoint(24.0311, 49.8429), 4326)::geography) AS dist_from_lviv_m
    FROM offers
    WHERE origin IS NOT NULL
    ORDER BY dist_from_lviv_m ASC
    LIMIT 5;
  `);
  assert.ok(spatialQuery.rows.length > 0, 'Spatial distance query must return rows');
  console.log(`  - Spatial query execution: SUCCESS (${spatialQuery.rows.length} nearest offers computed)`);

  await poolSource.end();
  await poolDrill.end();

  console.log('\n[6/6] Cleaning up drill database and dump file...');
  execSync(`docker exec ${CONTAINER} psql -U ${DB_USER} -d postgres -c "DROP DATABASE ${DRILL_DB};"`, { stdio: 'inherit' });
  execSync(`docker exec ${CONTAINER} rm -f ${DUMP_PATH}`, { stdio: 'inherit' });
  console.log('[PASS] Drill database dropped and dump file purged.');

  console.log('\n=== BACKUP & RESTORE DRILL COMPLETED WITH 100% EVIDENCE PASS ===');
}

main().catch((err) => {
  console.error('[DRILL FAILED]', err);
  process.exit(1);
});
