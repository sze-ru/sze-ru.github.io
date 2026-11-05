import { mkdir, rm, cp, writeFile } from "node:fs/promises";
import { layout } from "../src/layout.mjs";
import { profile } from "../src/content.mjs";
import home from "../src/pages/home.mjs";
import about from "../src/pages/about.mjs";
import work from "../src/pages/work.mjs";
import contact from "../src/pages/contact.mjs";

const pages = [home, about, work, contact];
await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
await cp("public", "dist", { recursive: true });
await mkdir("dist/vendor", { recursive: true });
for (const file of ["maplibre-gl.mjs", "maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs", "maplibre-gl.css"]) {
  await cp(`node_modules/maplibre-gl/dist/${file}`, `dist/vendor/${file}`);
}
await cp("node_modules/maplibre-gl/LICENSE.txt", "dist/vendor/maplibre-LICENSE.txt");
for (const page of pages) {
  const dir = `dist${page.path}`;
  await mkdir(dir, { recursive: true });
  await writeFile(`${dir}index.html`, layout(page));
}
// Preserve existing Experience links after moving the section home.
await mkdir("dist/experience", { recursive: true });
await writeFile("dist/experience/index.html", `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Experience | Jade Ong</title><link rel="canonical" href="${profile.url}/#experiences"><meta http-equiv="refresh" content="0;url=/#experiences"></head><body><p><a href="/#experiences">Explore Jade’s hospitality experience on the homepage.</a></p></body></html>`);
await writeFile(
  "dist/404.html",
  layout({
    title: "Page not found",
    path: "/404.html",
    description: "Find your way back to Jade Ong’s portfolio.",
    body: '<section class="page-heading wrap"><p class="eyebrow">404 / A little off course</p><h1>Let’s find<br><em>your way back.</em></h1><a class="button button-light" href="/">Back to home ↗</a></section>',
  }),
);
await writeFile(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map((page) => `<url><loc>${profile.url}${page.path}</loc></url>`).join("")}</urlset>`,
);
await writeFile(
  "dist/robots.txt",
  `User-agent: *\nAllow: /\nSitemap: ${profile.url}/sitemap.xml\n`,
);
await writeFile("dist/.nojekyll", "");
console.log(
  `Built ${pages.length} portfolio pages, 404, sitemap and public assets into dist/.`,
);
