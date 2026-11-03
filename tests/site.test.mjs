import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

const routes = ['index.html', 'about/index.html', 'experience/index.html', 'work/index.html', 'contact/index.html'];
test('all portfolio pages are directly accessible with working local links and assets', () => {
  for (const route of routes) {
    const path = join('dist', route);
    assert.ok(existsSync(path), `Missing page: ${route}`);
    const html = readFileSync(path, 'utf8');
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `${route}: exactly one h1`);
    assert.match(html, /<meta name="description" content="[^"]+"/);
    assert.match(html, /<link rel="canonical"/);
    assert.match(html, /aria-current="page"/);
    for (const [, link] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^(https?:|mailto:|#)/.test(link)) continue;
      const pathname = link.split('#')[0];
      const local = pathname.startsWith('/') ? join('dist', pathname) : resolve(path, '..', pathname);
      assert.ok(existsSync(local), `${route}: broken reference ${link}`);
      if (link.includes('#')) {
        const target = readFileSync(local.endsWith('/') ? `${local}index.html` : local, 'utf8');
        assert.ok(target.includes(`id="${link.split('#')[1]}"`), `Missing anchor: ${link}`);
      }
    }
  }
});
test('unprovided contact information is not replaced by invented links', () => {
  assert.ok(existsSync('dist/contact/index.html'), 'Contact page must exist');
  const html = readFileSync('dist/contact/index.html', 'utf8');
  assert.doesNotMatch(html, /mailto:|linkedin\.com\/in\/|href="#"/);
  assert.match(html, /Contact details coming soon/);
});
test('publication contains only curated website assets', () => {
  assert.ok(existsSync('dist'), 'Deployment directory must exist');
  const files = readdirSync('dist', { recursive: true });
  assert.ok(!files.some(file => /research|attachemnts|\.pdf$|resume\.jpeg/.test(file)));
});
