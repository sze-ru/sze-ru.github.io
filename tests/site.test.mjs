import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { profile } from "../src/content.mjs";

const routes = [
  "index.html",
  "about/index.html",
  "experience/index.html",
  "work/index.html",
  "contact/index.html",
];
test("all portfolio pages are directly accessible with working local links and assets", () => {
  for (const route of routes) {
    const path = join("dist", route);
    assert.ok(existsSync(path), `Missing page: ${route}`);
    const html = readFileSync(path, "utf8");
    assert.equal(
      (html.match(/<h1[ >]/g) || []).length,
      1,
      `${route}: exactly one h1`,
    );
    assert.match(html, /<meta name="description" content="[^"]+"/);
    assert.match(html, /<link rel="canonical"/);
    assert.match(html, /aria-current="page"/);
    const socialImage = html.match(/property="og:image" content="([^"]+)"/)[1];
    assert.ok(existsSync(join("dist", new URL(socialImage).pathname)), "Social preview must exist");
    for (const [, link] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^(https?:|mailto:|#)/.test(link)) continue;
      const pathname = link.split("#")[0];
      const local = pathname.startsWith("/")
        ? join("dist", pathname)
        : resolve(path, "..", pathname);
      assert.ok(existsSync(local), `${route}: broken reference ${link}`);
      if (link.includes("#")) {
        const target = readFileSync(
          local.endsWith("/") ? `${local}index.html` : local,
          "utf8",
        );
        assert.ok(
          target.includes(`id="${link.split("#")[1]}"`),
          `Missing anchor: ${link}`,
        );
      }
    }
  }
});
test("contact page renders only the provided contact destinations", () => {
  assert.ok(existsSync("dist/contact/index.html"), "Contact page must exist");
  const html = readFileSync("dist/contact/index.html", "utf8");
  assert.doesNotMatch(html, /href="#"/);
  if (!profile.email) assert.doesNotMatch(html, /mailto:/);
  else assert.ok(html.includes(`mailto:${profile.email}`));
  if (!profile.linkedin) assert.doesNotMatch(html, /linkedin\.com\/in\//);
  else assert.ok(html.includes(profile.linkedin.replaceAll('&', '&amp;')));
  if (!profile.email && !profile.linkedin) assert.match(html, /Contact details coming soon/);
  else assert.doesNotMatch(html, /Contact details coming soon/);
});
test("publication contains only curated website assets", () => {
  assert.ok(existsSync("dist"), "Deployment directory must exist");
  const files = readdirSync("dist", { recursive: true });
  assert.ok(
    !files.some((file) =>
      /research|attachemnts|\.pdf$|resume\.jpeg/.test(file),
    ),
  );
});
