import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

test('publishing preserves branch history and removes stale deployed files', async () => {
  const folder = await mkdtemp(join(tmpdir(), 'jade-publish-test-'));
  try {
    const remote = join(folder, 'remote.git');
    const source = join(folder, 'site');
    execFileSync('git', ['init', '--bare', remote], { stdio: 'pipe' });
    await mkdir(source);
    await writeFile(join(source, 'index.html'), 'First version');
    await writeFile(join(source, 'old.html'), 'Old page');
    let scriptExists = true;
    try { await access('scripts/publish.mjs'); } catch { scriptExists = false; }
    assert.ok(scriptExists, 'The branch publisher must exist');
    const { publish } = await import('../scripts/publish.mjs');
    await publish({ remote, source });
    await writeFile(join(source, 'index.html'), 'Second version');
    await rm(join(source, 'old.html'));
    await publish({ remote, source });
    const git = (...args) => execFileSync('git', ['--git-dir', remote, ...args], { encoding: 'utf8' }).trim();
    assert.equal(git('show', 'gh-pages:index.html'), 'Second version');
    assert.equal(git('ls-tree', '--name-only', 'gh-pages'), 'index.html');
    assert.equal(git('rev-list', '--count', 'gh-pages'), '2');
    await publish({ remote, source });
    assert.equal(git('rev-list', '--count', 'gh-pages'), '2', 'No empty deployment commits');
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
});
