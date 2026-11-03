import { execFileSync } from 'node:child_process';
import { access, cp, mkdtemp, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export async function publish({ remote, source }) {
  await access(join(source, 'index.html'));
  const checkout = await mkdtemp(join(tmpdir(), 'jade-pages-'));
  const git = (...args) => execFileSync('git', args, { cwd: checkout, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  try {
    const existing = git('ls-remote', '--heads', remote, 'gh-pages');
    if (existing) {
      git('clone', '--single-branch', '--branch', 'gh-pages', remote, '.');
    } else {
      git('init', '-b', 'gh-pages');
      git('remote', 'add', 'origin', remote);
    }
    for (const entry of await readdir(checkout)) {
      if (entry !== '.git') await rm(join(checkout, entry), { recursive: true, force: true });
    }
    await cp(source, checkout, { recursive: true });
    git('add', '--all');
    if (!git('diff', '--cached', '--name-only')) return;
    git('-c', 'user.name=Portfolio deployment', '-c', 'user.email=noreply@github.com', 'commit', '-m', 'Publish Jade portfolio');
    git('push', 'origin', 'gh-pages');
  } finally {
    await rm(checkout, { recursive: true, force: true });
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const remote = execFileSync('git', ['remote', 'get-url', 'origin'], { encoding: 'utf8' }).trim();
  await publish({ remote, source: resolve('dist') });
  console.log('Published dist/ to gh-pages. GitHub Pages will deploy this branch.');
}
