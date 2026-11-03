import { mkdir, rm, cp, writeFile } from "node:fs/promises";
import { layout } from "../src/layout.mjs";
import { profile } from "../src/content.mjs";
import home from "../src/pages/home.mjs";
import about from "../src/pages/about.mjs";
import experience from "../src/pages/experience.mjs";
import work from "../src/pages/work.mjs";
import contact from "../src/pages/contact.mjs";

const pages = [home, about, experience, work, contact];
await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
await cp("public", "dist", { recursive: true });
for (const page of pages) {
  const dir = `dist${page.path}`;
  await mkdir(dir, { recursive: true });
  await writeFile(`${dir}index.html`, layout(page));
}
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
