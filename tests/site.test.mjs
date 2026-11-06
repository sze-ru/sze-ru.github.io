import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { profile } from "../src/content.mjs";
import { venues } from "../src/venues.mjs";

test("the experience inventory preserves Jade's roles and includes every missing entry", () => {
  const html = readFileSync("dist/index.html", "utf8");
  for (const name of ["Private Tutor", "Innoquest", "Officemate", "Millis", "70.chilling", "Max Wong Studio", "Whitefire", "CP Foods"]) {
    assert.ok(html.includes(name), `Missing experience: ${name}`);
  }
  const byId = Object.fromEntries(venues.map(venue => [venue.id, venue]));
  assert.deepEqual(byId.ark11.roles, ["VIP hosting", "Guest relations", "Administration", "Payroll"]);
  assert.deepEqual(byId['truth-or-dare'].roles, ["Guest relations", "VIP hosting", "Bottle service"]);
  assert.deepEqual(byId.yang.roles, ["VIP hosting", "Guest relations"]);
  assert.deepEqual(byId.drip.roles, ["VIP hosting"]);
  for (const id of ['sincity', 'plus65', 'xclusiv']) assert.deepEqual(byId[id].roles, ["Bottle service", "Guest relations"]);
  assert.match(byId.havefun.address, /201 Victoria St.*Bugis\+/);
  assert.equal(venues.filter(venue => venue.category === 'vip').length, 10);
  assert.equal(venues.filter(venue => venue.category === 'event').length, 14);
  assert.equal(new Set(venues.map(venue => venue.id)).size, venues.length);
  for (const venue of venues) {
    assert.ok(venue.roles.length);
    assert.doesNotMatch(`${venue.role} ${venue.summary}`, /\b(?:BG|GR|BA|P)\b/);
  }
  assert.match(html, /Filter list by role/);
  assert.match(html, /Learning timeline/);
});

const routes = [
  "index.html",
  "about/index.html",
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
  assert.ok(files.includes("downloads/Jade-Ong-Resume.pdf"));
  assert.equal(readFileSync("dist/downloads/Jade-Ong-Resume.pdf").subarray(0, 5).toString(), "%PDF-");
  assert.ok(
    !files.some((file) =>
      /research|attachemnts|\.pdf$|resume\.jpeg/.test(file) && file !== "downloads/Jade-Ong-Resume.pdf",
    ),
  );
});

test("Evergreen sampling rejects excluded ranges, one-second margins, and boundary frames", async () => {
  const { validateEvergreenSamples, evergreenSamples } = await import("../scripts/prepare-hero-video.mjs");
  assert.equal(typeof validateEvergreenSamples, "function");
  assert.doesNotThrow(() => validateEvergreenSamples(evergreenSamples));
  assert.doesNotThrow(() => validateEvergreenSamples([[0, 2], [12.1, 15]]));
  for (const interval of [
    [8, 9], [10, 13], [11, 12], [7, 12],
    [24, 25], [25, 27], [26, 27], [23, 27],
    [32, 33], [35, 36], [36, 37], [31, 37],
    [7, 7.5], [11.5, 12], [12, 12.5],
    [23, 23.5], [26.5, 27], [27, 27.5],
    [31, 31.5], [36.5, 37], [37, 37.5],
  ]) {
    assert.throws(() => validateEvergreenSamples([interval]), /excluded/,
      `Must reject source interval ${interval.join("–")}`);
  }
});

test("homepage keeps TEP content inside its experience card popup", () => {
  const html = readFileSync("dist/index.html", "utf8");
  assert.equal((html.match(/class="category-card /g) || []).length, 4);
  for (const label of ["Home", "About Me", "Experience", "Personal Interests", "Gallery", "Contact"]) {
    assert.ok(html.includes(`>${label}</a>`), `Missing navigation: ${label}`);
  }
  assert.match(html, /Nightlife &amp; Hospitality/);
  assert.match(html, /id="dialog-tep"/);
  assert.match(html, /<section id="tep"/);
  assert.ok(html.indexOf('id="tep"') > html.indexOf('id="dialog-tep"'));
  assert.doesNotMatch(html, /href="\/#tep"/);
  for (const id of ['eldex', 'melissa', 'dstudio', 'tep-other', 'tep-reflections']) {
    assert.ok(html.includes(`id="${id}"`));
  }
  assert.match(html, /Week 7/);
  assert.match(html, /Guess-the-Product/);
  assert.match(html, /claims administration/);
  assert.match(html, /Figure skating/);
  assert.match(html, /Urbex/);
  assert.match(html, /src="\/gallery\/posing.jpg"/);
  assert.match(html, /Nanyang Polytechnic/);
  assert.doesNotMatch(html, /gallery-scroll-stage/);
  assert.ok(html.indexOf('id="venue-map"') > html.indexOf('<dialog'));
});

test("hospitality card previews the real map and opens the map before its details", () => {
  const html = readFileSync("dist/index.html", "utf8");
  assert.match(html, /class="map-preview" src="\/assets\/venue-map-preview.png"/);
  assert.doesNotMatch(html, /class="map-card-art"/);
  const modal = html.slice(html.indexOf('id="dialog-hospitality"'), html.indexOf('id="dialog-tep"'));
  assert.ok(modal.indexOf('id="venue-map"') < modal.indexOf('class="case-copy"'));
});

test("Jade’s notes appear as captions beside the relevant project photographs", () => {
  for (const route of ['index.html', 'work/index.html']) {
    const html = readFileSync(join('dist', route), 'utf8');
    const captions = [...html.matchAll(/<figcaption>(.*?)<\/figcaption>/gs)].map(match => match[1]).join('\n');
    for (const detail of ['ELDEX event coverage and content production', 'e-commerce order tracking', 'Distributing products to talents', 'social media analysis', 'DBM · Content production', 'Refresh prebiotic soda taste testing and survey responses', 'Celebrating a friend’s birthday', 'CP Foods · Supporting another team']) {
      assert.ok(captions.includes(detail), `${route}: missing caption detail ${detail}`);
    }
    assert.ok(html.indexOf('id="dbm"') < html.indexOf('id="tep-other"'), 'DBM is a main project, before other contributions');
  }
});
