import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const root = process.cwd();
const dist = path.join(root, 'dist');

async function rimraf(target) {
  await fs.rm(target, { recursive: true, force: true });
}

async function copy(srcRel, destRel = srcRel) {
  const src = path.join(root, srcRel);
  const dest = path.join(dist, destRel);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.cp(src, dest, { recursive: true, force: true });
}

async function main() {
  // Ensure vendor/reveal exists (sync script is idempotent)
  await execFileAsync(process.execPath, [path.join(root, 'scripts', 'sync-reveal.mjs')], {
    cwd: root,
    stdio: 'inherit'
  });

  await rimraf(dist);
  await fs.mkdir(dist, { recursive: true });

  // Prevent Jekyll processing (and underscore filtering) on Pages
  await fs.writeFile(path.join(dist, '.nojekyll'), '');

  // Minimal static site payload
  await copy('index.html');
  await copy('css');
  await copy('images');
  await copy('vendor');

  console.log('[build-site] OK -> dist/');
}

main().catch((err) => {
  console.error('[build-site] Failed:', err);
  process.exitCode = 1;
});


