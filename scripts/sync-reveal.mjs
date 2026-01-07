import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const revealRoot = path.join(root, 'node_modules', 'reveal.js');
const outRoot = path.join(root, 'vendor', 'reveal');

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  // fs.cp is available in Node 16+
  await fs.cp(src, dest, { recursive: true, force: true });
}

async function main() {
  if (!(await exists(revealRoot))) {
    console.error(
      `[sync-reveal] Missing ${revealRoot}. Run "npm install" first.`
    );
    process.exitCode = 1;
    return;
  }

  await fs.mkdir(outRoot, { recursive: true });

  // Copy the runtime assets we reference from index.html
  await copyDir(path.join(revealRoot, 'dist'), path.join(outRoot, 'dist'));
  await copyDir(path.join(revealRoot, 'plugin'), path.join(outRoot, 'plugin'));

  // Keep this explicit so we don't accidentally bloat vendor over time
  const marker = path.join(outRoot, '.synced');
  await fs.writeFile(
    marker,
    `Synced from ${path.relative(root, revealRoot)} at ${new Date().toISOString()}\n`
  );

  console.log('[sync-reveal] OK');
}

main().catch((err) => {
  console.error('[sync-reveal] Failed:', err);
  process.exitCode = 1;
});


