import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const git = (args, cwd = '.') => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
const siteCommit = git(['rev-parse', 'HEAD'], 'web');
const iosCommit = git(['rev-parse', 'HEAD']);
const sitePackage = JSON.parse(await readFile('web/package.json', 'utf8'));
const info = {
  schemaVersion: 1,
  application: 'MARSHGO',
  iosCommit,
  siteCommit,
  serverCommit: process.env.MARSHGO_SERVER_SHA || null,
  siteVersion: sitePackage.version ?? null,
  apiContractVersion: process.env.MARSHGO_API_CONTRACT_VERSION ?? 'v1',
  databaseMigrationVersion: process.env.MARSHGO_DATABASE_MIGRATION_VERSION ?? null,
  buildNumber: process.env.GITHUB_RUN_NUMBER ?? null,
  releaseVersion: process.env.GITHUB_REF_NAME ?? null,
};

await mkdir('web/dist', { recursive: true });
await writeFile('web/dist/release-manifest.json', `${JSON.stringify(info, null, 2)}\n`);
console.log(`Wrote build metadata for Site ${siteCommit} and iOS ${iosCommit}`);
