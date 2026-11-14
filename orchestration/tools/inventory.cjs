const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const repoPaths = [
  { name: 'MarshGO (Root Orchestrator)', path: '/Users/dima1203/Desktop/MarshGO' },
  { name: 'MarshGO-Server', path: '/Users/dima1203/Desktop/MarshGO/MarshGO-Server' },
  { name: 'MarshGO-Site', path: '/Users/dima1203/Desktop/MarshGO/MarshGO-Site' },
  { name: 'MarshGO-iOS', path: '/Users/dima1203/Desktop/MarshGO/MarshGO-iOS' },
  { name: 'MarshGO-Admin', path: '/Users/dima1203/Desktop/MarshGO-Admin' },
  { name: 'MarshGO-Partner', path: '/Users/dima1203/Desktop/MarshGO-Partner' },
];

function runCmd(cmd, cwd) {
  try {
    return execSync(cmd, { cwd, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }).trim();
  } catch (err) {
    return `ERROR: ${err.message}`;
  }
}

const inventory = [];

for (const repo of repoPaths) {
  if (!fs.existsSync(repo.path)) {
    inventory.push({ name: repo.name, path: repo.path, error: 'Path does not exist' });
    continue;
  }
  const isGit = fs.existsSync(path.join(repo.path, '.git'));
  if (!isGit) {
    inventory.push({ name: repo.name, path: repo.path, error: 'Not a git repository' });
    continue;
  }

  const branch = runCmd('git branch --show-current', repo.path);
  const headSha = runCmd('git rev-parse HEAD', repo.path);
  const remotes = runCmd('git remote -v', repo.path);
  const statusPorcelain = runCmd('git status --porcelain=v1 -uall', repo.path);
  const log5 = runCmd('git log -5 --oneline --decorate', repo.path);
  const branches = runCmd('git branch -avv', repo.path);
  const openPrs = runCmd('gh pr list --state open --limit 20', repo.path);

  inventory.push({
    name: repo.name,
    path: repo.path,
    branch,
    headSha,
    remotes,
    dirty: statusPorcelain.length > 0,
    statusPorcelain,
    log5,
    branches,
    openPrs
  });
}

const outPath = '/Users/dima1203/.gemini/antigravity-ide/brain/e508fd6d-8a68-4a57-9f93-681a5627f9f1/workspace_inventory.json';
fs.writeFileSync(outPath, JSON.stringify(inventory, null, 2));
console.log('INVENTORY_WRITTEN');
