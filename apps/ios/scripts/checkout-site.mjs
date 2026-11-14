import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync } from 'node:fs';

const destination = 'web';
if (existsSync(destination)) {
  console.error('Refusing to replace an existing web checkout. Remove or rename it explicitly first.');
  process.exit(2);
}

const repository = 'https://github.com/dima1203oleg/MarshGO-Site.git';
const requestedRef = process.env.SITE_REF?.trim();
const ref = requestedRef || 'main';

mkdirSync(destination);
const run = (args) => {
  const result = spawnSync('git', args, { cwd: destination, stdio: 'inherit' });
  if (result.status !== 0) {
    rmSync(destination, { recursive: true, force: true });
    process.exit(result.status ?? 1);
  }
};

run(['init', '--quiet']);
run(['remote', 'add', 'origin', repository]);
run(['fetch', '--depth=1', 'origin', ref]);
run(['checkout', '--quiet', '--detach', 'FETCH_HEAD']);

const sha = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: destination, encoding: 'utf8' }).stdout.trim();
console.log(`Checked out MarshGO-Site ${sha} (${requestedRef ? 'pinned SITE_REF' : 'development main'})`);
