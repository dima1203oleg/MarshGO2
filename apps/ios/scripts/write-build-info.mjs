import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const git = (args, cwd = '.') => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
const siteDir = process.env.MARSHGO_SITE_DIR || 'web';
const monorepoCommit = git(['rev-parse', 'HEAD']);
const siteCommit = process.env.MARSHGO_MONOREPO_COMMIT || monorepoCommit;
const siteBaseCommit = process.env.MARSHGO_SITE_SOURCE_COMMIT || git(['rev-parse', 'HEAD'], siteDir);
const iosCommit = process.env.MARSHGO_IOS_SOURCE_COMMIT || git(['rev-parse', 'HEAD']);
const sitePackage = JSON.parse(await readFile(`${siteDir}/package.json`, 'utf8'));
const outputDir = `${siteDir}/dist`;
const info = {
  schemaVersion: 2,
  application: 'MARSHGO',
  iosCommit,
  siteCommit,
  siteBaseCommit,
  serverCommit: process.env.MARSHGO_SERVER_SHA || null,
  monorepoCommit,
  siteVersion: sitePackage.version ?? null,
  apiContractVersion: process.env.MARSHGO_API_CONTRACT_VERSION ?? 'v1',
  databaseMigrationVersion: process.env.MARSHGO_DATABASE_MIGRATION_VERSION ?? null,
  buildNumber: process.env.GITHUB_RUN_NUMBER ?? null,
  releaseVersion: process.env.GITHUB_REF_NAME ?? null,
};

await mkdir(outputDir, { recursive: true });
await writeFile(`${outputDir}/release-manifest.json`, `${JSON.stringify(info, null, 2)}\n`);
console.log(`Wrote build metadata for integrated Site ${siteCommit} (base ${siteBaseCommit}) and iOS ${iosCommit}`);
