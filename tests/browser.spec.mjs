import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { venues } from "../src/venues.mjs";

const routes = ["/", "/about/", "/work/", "/contact/"];
test("experience directory filters full roles and TEP timeline works inside its popup", async ({ page }) => {
  await page.route('https://tiles.openfreemap.org/**', route => route.abort());
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/#experiences');
    await page.locator('.nightlife-card').click();
    const directory = page.locator('[data-experience-directory]');
    const filter = directory.getByLabel('Filter list by role');
    await filter.selectOption('Payroll');
    await expect(directory.locator('.experience-entry:not([hidden])')).toHaveCount(1);
    const ark = directory.locator('.experience-entry:not([hidden])');
    await ark.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(ark).toHaveAttribute('open', '');
    await expect(ark.locator('.experience-roles')).toHaveText('VIP hostingGuest relationsAdministrationPayroll');
    await expect(directory.locator('[data-experience-group]').last()).toBeHidden();
    await filter.selectOption('Bottle service');
    await expect(directory.locator('.experience-entry:not([hidden])')).toHaveCount(venues.filter(v => v.roles.includes('Bottle service')).length);
    await filter.selectOption('');
    await expect(directory.locator('.experience-entry:not([hidden])')).toHaveCount(24);
    const results = await new AxeBuilder({ page }).include('[data-experience-directory]').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(results.violations).toEqual([]);
    await page.getByRole('button', { name: 'Close experience', exact: true }).click();
    const shoots = page.locator('.additional-experience');
    await expect(shoots.locator('.experience-entry')).toHaveCount(7);
    await shoots.locator('summary').filter({ hasText: 'Max Wong Studio' }).click();
    await expect(shoots.locator('details[open]')).toContainText('2025, 2026');
    await shoots.locator('summary').filter({ hasText: 'Max Wong Studio' }).click();
    await page.locator('.tep-card').click();
    const dialog = page.locator('#dialog-tep');
    await dialog.getByRole('link', { name: 'Learning timeline', exact: true }).click();
    await expect(dialog.locator('#tep-reflections-heading')).toBeInViewport();
    await expect(dialog.getByRole('list', { name: 'TEP learning timeline' }).locator('li')).toHaveCount(10);
    await expect(dialog.getByRole('list', { name: 'TEP learning timeline' })).toContainText('Week 7');
    await page.getByRole('button', { name: 'Close experience', exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test("navigation backdrop appears immediately when the hero turns grey and reverses on return", async ({ page }) => {
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    const header = page.locator(".header");
    const opacity = () => header.evaluate(el => Number(getComputedStyle(el, "::before").opacity));
    await expect.poll(opacity).toBe(0);
    for (const progress of [0, 0.5, 0.84, 0.86, 1.5, 0]) {
      await page.evaluate(progress => {
        const hero = document.querySelector(".hero");
        scrollTo({ top: scrollY + hero.getBoundingClientRect().top + progress * hero.offsetHeight, behavior: "instant" });
      }, progress);
      await expect.poll(opacity).toBe(progress >= 0.85 ? 1 : 0);
    }
    await page.getByRole("navigation").getByRole("link", { name: "Contact", exact: true }).click();
    await expect.poll(opacity).toBe(1);
    await page.getByRole("navigation").getByRole("link", { name: "Home", exact: true }).click();
    await expect.poll(opacity).toBe(0);
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.getByRole("navigation").getByRole("link", { name: "About Me", exact: true }).click();
    await expect.poll(opacity).toBe(1);
    await page.getByRole("navigation").getByRole("link", { name: "Home", exact: true }).click();
    await expect.poll(opacity).toBe(0);
  }
});

test("floating contacts follow scrolling and hand off to the closing contacts", async ({ page }) => {
  for (const [width, height] of [[375, 900], [1440, 900], [375, 400]]) {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    const floating = page.locator(".floating-contacts");
    await expect(floating).toBeVisible();
    const initial = await floating.boundingBox();
    await page.locator("#introduction").scrollIntoViewIfNeeded();
    await expect(floating).toHaveCSS("opacity", "1");
    expect((await floating.boundingBox()).y).toBeCloseTo(initial.y, 0);
    for (const link of await floating.locator("a").all()) await link.click({ trial: true });
    await floating.locator("a").first().focus();
    await page.locator("#connect .contact-links").scrollIntoViewIfNeeded();
    await expect(floating).toHaveCSS("opacity", "0");
    await expect(floating).toHaveAttribute("inert", "");
    await expect(page.locator('#connect a[href^="mailto:"]')).toBeInViewport();
    await expect(page.locator('#connect a[href^="mailto:"]')).toBeFocused();
    await page.evaluate(() => scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
    await expect(page.locator(".resume-label")).toBeInViewport();
    await expect(floating).toHaveCSS("opacity", "0");
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await expect(floating).toHaveCSS("opacity", "1");
    await expect(floating).not.toHaveAttribute("inert", "");
  }
});

test("Jade grows from the bottom on hover and keyboard focus and downloads her resume", async ({ page }) => {
  await page.goto("/#connect");
  const download = page.getByRole("link", { name: "Download Jade’s résumé (PDF)" });
  await expect(download).toBeVisible();
  await download.scrollIntoViewIfNeeded();
  const subject = download.locator(".photo-subject");
  const scale = () => subject.evaluate(el => new DOMMatrix(getComputedStyle(el).transform).a);
  const bottomOffset = () => subject.evaluate(el => el.getBoundingClientRect().bottom - el.closest("figure").getBoundingClientRect().bottom);
  const originalScale = await scale();
  await expect.poll(bottomOffset).toBeCloseTo(0, 1);
  await download.hover();
  await expect.poll(scale).toBeGreaterThan(originalScale + 0.03);
  await expect.poll(bottomOffset).toBeCloseTo(0, 1);
  await expect(download.locator(".photo-background")).toHaveCSS("transform", "none");
  await page.mouse.move(0, 0);
  await download.focus();
  await expect.poll(scale).toBeGreaterThan(originalScale + 0.03);
  await expect.poll(bottomOffset).toBeCloseTo(0, 1);
  const pending = page.waitForEvent("download");
  await page.keyboard.press("Enter");
  const file = await pending;
  expect(file.suggestedFilename()).toBe("Jade-Ong-Resume.pdf");
  expect(await file.failure()).toBeNull();
  const response = await page.request.get(await download.getAttribute("href"));
  expect(response.ok()).toBe(true);
  expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(subject).toHaveCSS("transform", "none");
});

test("Jade stays rooted while scrolling and photo layers respect reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const figures = page.locator("[data-photo-layers]");
  await expect(figures).toHaveCount(1);
  const figure = page.locator("#connect .photo-waterfront");
  await figure.scrollIntoViewIfNeeded();
  const foreground = figure.locator(".photo-subject");
  const background = figure.locator(".photo-background");
  await expect.poll(() => foreground.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
  await page.evaluate(() => scrollBy(0, 150));
  await expect.poll(() => foreground.evaluate(img => img.getBoundingClientRect().bottom - img.closest("figure").getBoundingClientRect().bottom)).toBeCloseTo(0, 1);
  expect(await background.evaluate(img => getComputedStyle(img).transform)).toBe("none");
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const subject of await page.locator(".photo-subject").all()) {
    await expect(subject).toHaveCSS("transform", "none");
  }
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const item of await figures.all()) {
      await item.scrollIntoViewIfNeeded();
      await expect.poll(() => item.locator("img").evaluateAll(images => images.every(img => img.complete && img.naturalWidth > 0))).toBe(true);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test("About Me uses one portrait and personal cards open their contents", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('#introduction img')).toHaveCount(1);
    await expect(page.locator('#introduction img')).toHaveAttribute('src', '/assets/jade-night-original.jpg');
    await expect(page.locator('#experiences > .section-heading h2')).toHaveText('03Experience');
    const interests = page.locator('.interests-opener');
    const gallery = page.locator('.gallery-opener');
    const left = await interests.boundingBox(), right = await gallery.boundingBox();
    if (width > 760) {
      expect(left.y).toBeCloseTo(right.y, 0);
      expect(right.x).toBeGreaterThan(left.x + left.width);
    }
    for (const card of [interests, gallery]) {
      const box = await card.boundingBox();
      expect(box.width / box.height).toBeCloseTo(3 / 4, 2);
      await card.focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('dialog[open]')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(card).toBeFocused();
    }
    await interests.click();
    await expect(page.locator('#dialog-interests h3')).toHaveText(['Figure skating', 'Urbex', 'Travelling']);
    await page.keyboard.press('Escape');
    await gallery.click();
    await expect(page.locator('#dialog-gallery .gallery-group:not([aria-hidden]) img')).toHaveCount(37);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(results.violations).toEqual([]);
    await page.keyboard.press('Escape');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test("gallery preview moves right and respects reduced motion", async ({ page }) => {
  await page.goto('/#gallery');
  const track = page.locator('#gallery-preview .gallery-track');
  await expect(page.locator('#gallery-preview .gallery-group:not([aria-hidden]) img')).toHaveCount(37);
  await page.mouse.move(0, 0);
  const x = () => track.evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m41);
  const before = await x();
  await expect.poll(x).toBeGreaterThan(before + 2);
  await page.locator('.gallery-opener').hover();
  await expect(track).toHaveCSS('animation-play-state', 'paused');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(track).toHaveCSS('animation-name', 'none');
});

test("venue map loads on scroll and supports selection without trapping scrolling", async ({ page }) => {
  const mapRequests = [];
  page.on("request", request => {
    if (request.url().includes("/vendor/maplibre-gl.mjs")) mapRequests.push(request.url());
  });
  await page.goto("/");
  await page.goto("/#experiences");
  await page.locator(".nightlife-card").click();
  await page.mouse.move(0, 0);
  const map = page.locator("#venue-map");
  await map.scrollIntoViewIfNeeded();
  await expect(map).toHaveAttribute("data-state", "ready", { timeout: 30000 });
  await expect(page.locator(".venue-pin")).toHaveCount(venues.filter(venue => venue.coordinates).length);
  await page.getByRole("button", { name: "Explore Echo" }).click();
  await expect(page.locator(".venue-pin-echo")).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: "Explore Echo" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Show all venues" }).click();
  await expect(page.locator('.venue-pin[aria-pressed="true"]')).toHaveCount(0);
  await map.hover();
  const before = await page.locator("#dialog-hospitality").evaluate(el => el.scrollTop);
  await page.mouse.wheel(0, 350);
  await expect.poll(() => page.locator("#dialog-hospitality").evaluate(el => el.scrollTop)).toBeGreaterThan(before + 100);
  await page.locator(".scene-map-slot").scrollIntoViewIfNeeded();
  const qi = page.getByRole("button", { name: "Explore Qi", exact: true });
  await qi.click();
  await expect(page.locator(".venue-pin-qi")).toHaveAttribute("aria-pressed", "true");
  await page.waitForTimeout(1600); // Allow the selection's camera animation to settle.
  const pin = page.locator(".venue-pin-qi");
  const position = await pin.getAttribute("style");
  await page.locator("#hospitality-title").scrollIntoViewIfNeeded();
  await map.scrollIntoViewIfNeeded();
  await expect(qi).toHaveAttribute("aria-pressed", "true");
  await expect(pin).toHaveAttribute("style", position);
  expect(mapRequests).toHaveLength(1);
});

test("map markers remain in frame and diamonds connect to their locations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const [width, height] of [[320, 900], [375, 900], [768, 900], [1024, 900], [1440, 900], [320, 667], [375, 667]]) {
    await page.setViewportSize({ width, height });
    await page.goto("/");
  await page.goto("/#experiences");
  await page.locator(".nightlife-card").click();
  await page.mouse.move(0, 0);
    await page.locator("#venue-map").scrollIntoViewIfNeeded();
    await expect(page.locator("#venue-map")).toHaveAttribute("data-state", "ready", { timeout: 30000 });
    for (const category of ["all", "vip", "event"]) {
      await page.locator(`.map-filters [data-category="${category}"]`).click();
      const geometry = await page.locator(".venue-leaders polyline").evaluateAll(lines => lines.map(line => ({
        category: line.dataset.category,
        visible: getComputedStyle(line).display !== "none",
        points: [...line.points].map(point => ({ x: point.x, y: point.y })),
      })));
      const placementIssues = await page.locator('.venue-pin:visible').evaluateAll(pins => {
        const frame = document.querySelector('#venue-map').getBoundingClientRect();
        const heading = document.querySelector('.map-heading').getBoundingClientRect();
        return pins.filter(pin => {
          const box = pin.getBoundingClientRect();
          return box.left < frame.left || box.right > frame.right || box.top < frame.top || box.bottom > frame.bottom
            || (box.left < heading.right && box.right > heading.left && box.top < heading.bottom && box.bottom > heading.top);
        }).map(pin => pin.getAttribute('aria-label'));
      });
      expect(placementIssues, `${width}×${height} / ${category}`).toEqual([]);
      for (const line of geometry) {
        if (line.category === "vip" && category !== "event") {
          expect(line.visible).toBe(true);
          expect(line.points).toHaveLength(2);
          const pinSize = await page.locator('.venue-pin[data-category="vip"]').first().evaluate(pin => pin.offsetWidth);
          expect(Math.hypot(line.points[0].x - line.points[1].x, line.points[0].y - line.points[1].y)).toBeGreaterThanOrEqual(pinSize + 3.99);
        }
        if (line.category === "venue") expect(line.visible).toBe(false);
        if (line.category === "event" && category !== "vip") {
          expect(line.visible).toBe(false);
        }
      }
    }
  }
});

test("settled compact markers respond to their own visible faces", async ({ page }) => {
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
  await page.goto("/#experiences");
  await page.locator(".nightlife-card").click();
  await page.mouse.move(0, 0);
    await page.locator("#venue-map").scrollIntoViewIfNeeded();
    await expect(page.locator("#venue-map")).toHaveAttribute("data-state", "ready", { timeout: 30000 });
    await page.waitForFunction(() => {
      const state = [...document.querySelectorAll(".venue-pin")].map(pin => pin.style.transform).join("|");
      if (window.markerSnapshot !== state) {
        window.markerSnapshot = state;
        window.markerStableSince = performance.now();
        return false;
      }
      return performance.now() - window.markerStableSince > 1000;
    });
    const misses = await page.locator('.venue-pin:not([data-category="vip"])').evaluateAll(pins => {
      const misses = [];
      for (const pin of pins) {
        const face = pin.querySelector(".pin-number").getBoundingClientRect();
        for (const [dx, dy] of [[0, 0], [-10, -10], [10, -10], [-10, 10], [10, 10], [0, 12], [0, -12]]) {
          const hit = document.elementFromPoint(face.x + face.width / 2 + dx, face.y + face.height / 2 + dy)?.closest(".venue-pin");
          if (hit !== pin) misses.push({ expected: pin.getAttribute("aria-label"), actual: hit?.getAttribute("aria-label"), dx, dy });
        }
      }
      return misses;
    });
    expect(misses).toEqual([]);
  }
});

test("venue information survives map service failure", async ({ page }) => {
  await page.route("https://tiles.openfreemap.org/**", route => route.abort());
  await page.goto("/");
  await page.goto("/#experiences");
  await page.locator(".nightlife-card").click();
  await page.mouse.move(0, 0);
  await page.locator("#venue-map").scrollIntoViewIfNeeded();
  await expect(page.locator(".map-status")).toContainText("Map unavailable", { timeout: 20000 });
  await page.locator(".venue-fallback summary").filter({ hasText: /^Horangi/ }).click();
  await expect(page.getByText("67 Neil Rd, Singapore 088898", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Find Horangi on Google Maps" })).toHaveAttribute("href", /google.com\/maps/);
  await page.locator(".venue-fallback summary").filter({ hasText: /Marquee/ }).click();
  await expect(page.getByText("Bottle parades and VIP guest engagement, delivered with professional hospitality standards.", { exact: true })).toBeVisible();
});

test("mobile venue map fits every pin, supports keyboard selection and respects reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.goto("/#experiences");
  await page.locator(".nightlife-card").click();
  await page.mouse.move(0, 0);
  const map = page.locator("#venue-map");
  await map.scrollIntoViewIfNeeded();
  await expect(map).toHaveAttribute("data-state", "ready", { timeout: 30000 });
  await expect(map).toHaveCSS("transition-duration", "0s");
  const frame = await map.boundingBox();
  for (const pin of await page.locator(".venue-pin").all()) {
    const box = await pin.boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(frame.x);
    expect(box.x + box.width).toBeLessThanOrEqual(frame.x + frame.width);
    expect(box.y).toBeGreaterThanOrEqual(frame.y);
    expect(box.y + box.height).toBeLessThanOrEqual(frame.y + frame.height);
  }
  const boxes = await page.locator(".venue-pin").evaluateAll(pins => pins.map(pin => {
    const { x, y, width, height } = pin.getBoundingClientRect();
    return { x: x + width / 2, y: y + height / 2, width, height, category: pin.dataset.category };
  }));
  for (let i = 0; i < boxes.length; i++) {
    for (const other of boxes.slice(i + 1)) {
      const spacing = boxes[i].category === "vip" || other.category === "vip" ? Math.max(boxes[i].width, other.width) : 32;
      expect(Math.abs(boxes[i].x - other.x) >= spacing || Math.abs(boxes[i].y - other.y) >= spacing).toBe(true);
    }
  }
  const button = page.getByRole("button", { name: "Explore Horangi" });
  await button.focus();
  await page.keyboard.press("Enter");
  await expect(button).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".venue-pin-horangi")).toHaveAttribute("aria-pressed", "true");
  const results = await new AxeBuilder({ page }).include("#occasions")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(results.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
});

test("venue addresses and map links remain available without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/work/#occasions");
  await expect(page.locator(".venue-directions")).toHaveCount(venues.filter(venue => venue.coordinates).length);
  await page.locator(".venue-fallback summary").filter({ hasText: /^Horangi/ }).click();
  await expect(page.getByText("67 Neil Rd, Singapore 088898", { exact: true })).toBeVisible();
  await expect(page.locator(".venue-fallback summary").filter({ hasText: "It’s The Ship" })).toBeVisible();
  await page.locator(".venue-fallback summary").filter({ hasText: /Marquee/ }).click();
  await expect(page.getByText("Bottle parades and VIP guest engagement, delivered with professional hospitality standards.", { exact: true })).toBeVisible();
  await context.close();
});

test("homepage scene follows the introduction and every place has a dismissible panel", async ({ page }) => {
  test.setTimeout(60000); // Open and close all places, including map rendering.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.goto("/#experiences");
  await page.locator(".nightlife-card").click();
  await page.mouse.move(0, 0);
  await expect(page.locator("main > section").nth(1)).toHaveAttribute("id", "introduction");
  await expect(page.locator("main > section").nth(2)).toHaveAttribute("id", "experiences");
  await page.locator("#venue-map").scrollIntoViewIfNeeded();
  await expect(page.locator("#venue-map")).toHaveAttribute("data-state", "ready");
  const panel = page.locator(".venue-panel");
  await expect(panel).toBeHidden();
  await expect(page.locator(".venue-list")).toHaveCount(0);
  await expect(page.locator(".venue-fallback")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Main navigation", includeHidden: true }).getByRole("link", { name: "Experience", exact: true, includeHidden: true })).toHaveCount(1);
  for (const venue of venues) {
    await page.locator(`.venue-pin-${venue.id}`).click();
    await expect(panel).toBeVisible();
    await expect(panel.locator("h3")).toHaveText(venue.name);
    const summary = await panel.locator(".venue-panel-summary").textContent();
    expect(summary.match(/[.!?](?:\s|$)/g)).toHaveLength(1);
    await page.mouse.move(0, 0);
    await page.keyboard.press("Escape");
  }
  await page.locator('.venue-pin-erdinger').click();
  await expect(panel).toContainText("18 Raffles Quay");
  await expect(page.locator(".venue-pin-ship svg")).toHaveCount(1);
  await expect(page.locator(".venue-pin-erdinger svg")).toHaveCount(1);
  expect(await page.locator('.venue-pin[data-category="event"]').evaluateAll(pins => {
    const lines = document.querySelector('.venue-leaders');
    return pins.every(pin => pin.parentElement === lines.parentElement
      && Number(getComputedStyle(pin).zIndex) > Number(getComputedStyle(lines).zIndex));
  })).toBe(true);
  await page.getByRole("button", { name: "Close place details" }).click();
  await expect(panel).toBeHidden();
  await page.locator(".venue-pin-ship").click();
  await expect(panel).toContainText("Offshore, Singapore Strait (approximate location)");
  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await expect(page.locator(".venue-pin-ship")).toBeFocused();
});

test("VIP hospitality is a map category with role details and working filters", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#experiences");
  await page.locator(".nightlife-card").click();
  await page.mouse.move(0, 0);
  await expect(page.locator("#venue-map")).toHaveAttribute("data-state", "ready", { timeout: 30000 });
  const vip = page.locator('.map-filters [data-category="vip"]');
  await expect(page.locator('.map-filters [data-category="all"]')).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator('.venue-pin:visible')).toHaveCount(venues.length);
  await vip.click();
  await expect(vip).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("section#vip-hospitality")).toHaveCount(0);
  await expect(page.locator('.venue-pin:visible')).toHaveCount(venues.filter(venue => venue.category === 'vip' && venue.coordinates).length);
  await page.locator(".venue-pin-marquee").click();
  const panel = page.locator(".venue-panel");
  await expect(panel).toContainText("Long-term hospitality / 2024–Present");
  await expect(panel.locator(".venue-panel-role")).toHaveText("Bottle service");
  await expect(panel).toContainText("Bottle parades and VIP guest engagement");
  await expect(page.locator('.venue-pin-marquee svg')).toHaveCount(1);
  await page.keyboard.press("Escape");
  await page.locator(".venue-pin-havefun").click();
  await expect(panel).toContainText("201 Victoria St");
  await expect(panel.locator(".venue-panel-role")).toContainText("Guest relations");
  await page.getByRole("button", { name: "Close place details" }).click();
  await expect.poll(() => page.locator('.venue-pin:visible').evaluateAll(pins => {
    const frame = document.querySelector('#venue-map').getBoundingClientRect();
    return pins.every(pin => {
      const box = pin.getBoundingClientRect();
      return box.left >= frame.left && box.right <= frame.right && box.top >= frame.top && box.bottom <= frame.bottom;
    });
  })).toBe(true);
  await page.locator('.map-filters [data-category="event"]').click();
  await expect(panel).toBeHidden();
  await expect(page.locator('.venue-pin:visible')).toHaveCount(venues.filter(venue => venue.category === 'event').length);
  await page.locator('.map-filters [data-category="all"]').click();
  await expect(page.locator('.venue-pin:visible')).toHaveCount(venues.filter(venue => venue.coordinates).length);
});

test("hover previews follow the mouse, stay in frame and remain usable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.goto("/#experiences");
  await page.locator(".nightlife-card").click();
  await page.mouse.move(0, 0);
  const map = page.locator("#venue-map");
  await map.scrollIntoViewIfNeeded();
  await expect(map).toHaveAttribute("data-state", "ready", { timeout: 30000 });
  const panel = page.locator(".venue-panel");
  for (const venue of venues) {
    const pin = page.locator(`.venue-pin-${venue.id}`);
    await pin.hover({ position: { x: 18, y: 18 } });
    await expect(panel).toBeVisible();
    await expect(panel.locator("h3")).toHaveText(venue.name);
    const first = await panel.boundingBox();
    await pin.hover({ position: { x: 22, y: 22 } });
    const second = await panel.boundingBox();
    expect(first.x !== second.x || first.y !== second.y).toBe(true);
    const frame = await map.boundingBox();
    expect(second.x).toBeGreaterThanOrEqual(frame.x);
    expect(second.x + second.width).toBeLessThanOrEqual(frame.x + frame.width);
    expect(second.y).toBeGreaterThanOrEqual(Math.max(0, frame.y));
    expect(second.y + second.height).toBeLessThanOrEqual(Math.min(page.viewportSize().height, frame.y + frame.height));
    await expect(pin).toHaveAttribute("aria-pressed", "false");
  }
  await panel.hover();
  await expect(panel).toBeVisible();
  await expect(panel.locator("a")).toHaveAttribute("href", /google.com\/maps/);
  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await page.mouse.move(0, 0);
  await page.locator(".venue-pin-horangi").hover();
  await expect(panel).toBeVisible();
  await page.mouse.move(0, 0);
  await expect(panel).toBeHidden();
});

test("old Experience links redirect to the homepage scene", async ({ page }) => {
  await page.goto("/experience/#vip-hospitality");
  await expect(page).toHaveURL(/\/#experiences$/);
});

test("touch markers open persistent details without needing hover", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 375, height: 900 }, hasTouch: true, isMobile: true, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");
  await page.goto("/#experiences");
  await page.locator(".nightlife-card").tap();
  await page.locator("#venue-map").scrollIntoViewIfNeeded();
  await expect(page.locator("#venue-map")).toHaveAttribute("data-state", "ready", { timeout: 30000 });
  await page.locator(".venue-pin-qi").tap();
  await expect(page.locator(".venue-panel")).toContainText("Suntec Tower 4");
  await expect(page.locator(".venue-panel")).not.toHaveClass(/is-preview/);
  await page.getByRole("button", { name: "Close place details" }).tap();
  await expect(page.locator(".venue-panel")).toBeHidden();
  await context.close();
});

test("hero film plays silently as a background without controls", async ({ page }) => {
  await page.goto("/");
  const video = page.locator(".hero-film video.is-active");
  await expect.poll(() => video.evaluate(el => !el.paused && el.currentTime > 0)).toBe(true);
  expect(await video.evaluate(el => el.muted && el.playsInline)).toBe(true);
  await expect(video).not.toHaveAttribute("controls", "");
  await expect(page.locator(".hero button")).toHaveCount(0);
});

test("hero alternates ten-second turns, resumes each reel, and rotates the focused specialty", async ({ page }) => {
  await page.goto("/");
  const activeVideo = page.locator(".hero-film video.is-active");
  const activeSpecialty = page.locator(".hero-tagline .is-active");
  const production = page.locator('.hero-film video[data-specialty="video-production"]');
  const marketing = page.locator('.hero-film video[data-specialty="marketing"]');
  await expect(activeSpecialty).toHaveText("Video Production");
  await expect.poll(() => activeVideo.evaluate(el => el.readyState)).toBeGreaterThanOrEqual(2);
  expect(await activeVideo.evaluate(el => el.duration)).toBeGreaterThan(15);
  await expect(activeSpecialty).toHaveText("Marketing", { timeout: 12000 });
  await expect(activeVideo).toHaveAttribute("src", "/media/watersource-marketing-reel-v2.mp4");
  const productionPosition = await production.evaluate(el => el.currentTime);
  expect(productionPosition).toBeGreaterThanOrEqual(9.9);
  expect(productionPosition).toBeLessThan(10.5);
  await expect.poll(() => page.locator(".hero-film video").evaluateAll(videos =>
    videos.every(video => {
      const opacity = Number(getComputedStyle(video).opacity);
      return opacity > 0 && opacity < 1;
    }))).toBe(true);
  await expect(activeVideo).toHaveCSS("opacity", "1");
  await expect(activeSpecialty).toHaveCSS("opacity", "1");
  await expect(page.locator('.hero-tagline [data-specialty="video-production"]')).toHaveAttribute("data-position", "previous");
  const activeBox = await activeSpecialty.boundingBox();
  const distantBox = await page.locator('.hero-tagline [data-specialty="hospitality"]').boundingBox();
  expect(activeBox.height).toBeGreaterThan(distantBox.height * 1.3);
  await expect(activeSpecialty).toHaveText("Video Production", { timeout: 12000 });
  expect(await production.evaluate(el => el.currentTime)).toBeGreaterThanOrEqual(productionPosition);
  const marketingPosition = await marketing.evaluate(el => el.currentTime);
  expect(marketingPosition).toBeGreaterThanOrEqual(9.9);
  expect(marketingPosition).toBeLessThan(10.5);
});

test("hero progress wraps only after each safe reel has been played", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    window.heroTurns = [];
    let previousVideo;
    const rememberTurn = () => {
      const video = document.querySelector(".hero-film video.is-active");
      if (video === previousVideo) return;
      previousVideo = video;
      window.heroTurns.push({ specialty: video.dataset.specialty, position: video.currentTime });
    };
    new MutationObserver(rememberTurn).observe(document.querySelector(".hero-film"), {
      subtree: true, attributes: true, attributeFilter: ["class"],
    });
    document.querySelectorAll(".hero-film video").forEach(video => { video.playbackRate = 8; });
    rememberTurn();
  });
  await expect.poll(() => page.evaluate(() => window.heroTurns.length), { timeout: 20000 }).toBeGreaterThanOrEqual(8);
  const turns = await page.evaluate(() => window.heroTurns);
  for (const specialty of ["video-production", "marketing"]) {
    const positions = turns.filter(turn => turn.specialty === specialty).map(turn => turn.position);
    expect(positions[1]).toBeGreaterThan(9.9);
    expect(positions.some((position, i) => i > 0 && position < positions[i - 1])).toBe(true);
  }
});

test("hero film respects reduced motion on load and when preferences change", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const video = page.locator(".hero-film video.is-active");
  expect(await video.evaluate(el => el.paused && el.currentTime === 0)).toBe(true);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect.poll(() => video.evaluate(el => !el.paused)).toBe(true);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => video.evaluate(el => el.paused)).toBe(true);
});

test("hero video fills the opening screen behind the header and scrolls into the site", async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const film = await page.locator(".hero-film video.is-active").boundingBox();
    const header = await page.locator(".header").boundingBox();
    const intro = await page.locator(".hero + section").boundingBox();
    expect(film.x).toBe(0);
    expect(film.y).toBe(0);
    expect(film.width).toBe(viewport.width);
    expect(film.height).toBeGreaterThanOrEqual(viewport.height);
    expect(header.y + header.height).toBeLessThan(film.height);
    expect(intro.y).toBeGreaterThanOrEqual(viewport.height);
    await page.getByRole("link", { name: "Scroll to discover" }).click();
    await expect(page.locator(".hero + section h2").first()).toBeInViewport();
  }
});

test("hero film fades progressively on scroll and returns when scrolling back", async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const film = page.locator(".hero-film");
    const opacity = () => film.evaluate(el => Number(getComputedStyle(el).opacity));
    const heroHeight = await page.locator(".hero").evaluate(el => el.offsetHeight);
    const videoBefore = await film.locator("video.is-active").boundingBox();
    const headingBefore = await page.locator(".hero h1").boundingBox();
    expect(await opacity()).toBe(1);
    await page.evaluate(y => scrollTo({ top: y, behavior: "instant" }), heroHeight * 0.25);
    await expect.poll(opacity).toBeLessThan(0.9);
    const videoAfter = await film.locator("video.is-active").boundingBox();
    expect(videoAfter.y).toBeCloseTo(videoBefore.y, 0);
    expect(videoAfter.height).toBe(videoBefore.height);
    expect((await page.locator(".hero h1").boundingBox()).y).toBeLessThan(headingBefore.y);
    const earlyOpacity = await opacity();
    await page.evaluate(y => scrollTo({ top: y, behavior: "instant" }), heroHeight * 0.6);
    await expect.poll(opacity).toBeLessThan(earlyOpacity);
    await expect(page.locator(".hero-copy")).toHaveCSS("opacity", "1");
    await page.evaluate(y => scrollTo({ top: y, behavior: "instant" }), heroHeight * 0.9);
    await expect.poll(opacity).toBe(0);
    await expect(page.locator(".hero + section h2").first()).toBeInViewport();
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await expect.poll(opacity).toBe(1);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.evaluate(y => scrollTo({ top: y, behavior: "instant" }), heroHeight * 0.5);
    await expect(film).toHaveCSS("opacity", "1");
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect.poll(opacity).toBeLessThan(0.9);
  }
});

test("hero text fits narrow screens", async ({ page }) => {
  for (const width of [320, 360, 375, 390, 430]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const hero = await page.locator(".hero-composition").boundingBox();
    const tagline = await page.locator(".hero-tagline").boundingBox();
    expect(tagline.y + tagline.height).toBeLessThanOrEqual(hero.y + hero.height);
    await expect(page.locator(".hero-description")).toHaveCount(0);
    const contacts = page.locator(".floating-contacts .social-links");
    await expect(contacts.locator("a")).toHaveCount(2);
    const contactBox = await contacts.boundingBox();
    const bottom = await page.locator(".hero-bottom").boundingBox();
    expect(contactBox.x + contactBox.width).toBeCloseTo(bottom.x + bottom.width, 0);
    for (const link of await contacts.locator("a").all()) {
      await expect(link).toBeInViewport({ ratio: 1 });
      await link.click({ trial: true });
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test("contact icon links use the supplied email and LinkedIn destinations", async ({
  page,
}) => {
  await page.goto("/contact/");
  const links = page.locator("main .social-links");
  await expect(links.getByRole("link", { name: /Email Jade/ })).toHaveAttribute(
    "href",
    "mailto:szeruong@gmail.com",
  );
  await expect(links.getByRole("link", { name: /LinkedIn/ })).toHaveAttribute(
    "href",
    "https://www.linkedin.com/in/jade-o-7610bb433/",
  );
  await expect(links.locator("svg")).toHaveCount(2);
  await expect(page.getByText("Contact details coming soon")).toHaveCount(0);
  await expect(page.locator("footer")).toHaveCount(0);
});

test("project media has playable local video and correctly placed social links", async ({
  page,
}) => {
  await page.goto("/work/");
  await expect(
    page.locator('#cp-foods a[href*="instagram.com/p/DfCYdlGDdT5/"]'),
  ).toBeVisible();
  const video = page.locator("#eldex video");
  await expect(video).toHaveAttribute("preload", "none");
  await expect(video).toHaveAttribute("controls", "");
  const playback = await video.evaluate(async (element) => {
    element.muted = true;
    await element.play();
    const result = {
      paused: element.paused,
      duration: element.duration,
      width: element.videoWidth,
    };
    element.pause();
    return result;
  });
  expect(playback.paused).toBe(false);
  expect(playback.duration).toBeGreaterThan(35);
  expect(playback.width).toBe(720);
  await expect(
    page.locator(
      '#eldex a[href*="tiktok.com/@evergreen_health/video/7695387684163865876"]',
    ),
  ).toBeVisible();
  await page.getByText("Watch the TikTok post", { exact: true }).click();
  await expect(page.locator("#eldex iframe")).toHaveAttribute(
    "src",
    /player\/v1\/7695387684163865876\?.*autoplay=0/,
  );
});
for (const width of [375, 768, 1440]) {
  test(`pages are accessible and fit a ${width}px viewport`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    // Audit settled content; transition behaviour is exercised separately below.
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator("h1")).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBeTruthy();
      expect(
        await page.locator("img").evaluateAll(async (images) =>
          (
            await Promise.all(
              images.map(async (img) => {
                img.loading = "eager";
                try {
                  await img.decode();
                  return null;
                } catch {
                  return img.src;
                }
              }),
            )
          ).filter(Boolean),
        ),
      ).toEqual([]);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        results.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
      ).toEqual([]);
    }
    expect(errors).toEqual([]);
  });
}

test("reduced motion keeps revealed content visible", async ({ page }) => {
  await page.goto("/");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() =>
    page
      .locator("[data-reveal]")
      .evaluateAll((elements) =>
        elements.every((el) => getComputedStyle(el).opacity === "1"),
      ),
  ).toBeTruthy();
});


test("experience cards open their content and restore focus", async ({ page }) => {
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.goto("/#experiences");
    const cards = page.locator("#experiences .category-card");
    await expect(cards).toHaveCount(2);
    await expect(page.locator("#venue-map")).toHaveAttribute("data-state", "idle");
    for (const card of await cards.all()) {
      const box = await card.boundingBox();
      expect(box.width / box.height).toBeCloseTo(3 / 4, 2);
      await card.focus();
      await page.keyboard.press("Enter");
      const modal = page.locator("dialog[open]");
      await expect(modal).toBeVisible();
      expect(await modal.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
      await page.keyboard.press("Escape");
      await expect(modal).toHaveCount(0);
      await expect(card).toBeFocused();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test("category cards grow slightly on hover and respect reduced motion", async ({ page }) => {
  await page.goto('/#experiences');
  const card = page.locator('.nightlife-card');
  await card.hover();
  await expect.poll(() => card.evaluate(el => new DOMMatrix(getComputedStyle(el).transform).a)).toBeCloseTo(1.025, 3);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(card).toHaveCSS('transform', 'none');
});

test("new sections and navigation work without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByRole('navigation', { name: 'Main navigation' }).locator('a')).toHaveText(['Home', 'About Me', 'Experience', 'Personal Interests', 'Gallery', 'Contact']);
  await page.getByRole('link', { name: 'Personal Interests', exact: true }).click();
  await expect(page.locator('#dialog-interests h3')).toHaveText(['Figure skating', 'Urbex', 'Travelling']);
  await page.getByRole('link', { name: 'Gallery', exact: true }).click();
  await page.locator('.gallery-opener').click();
  await expect(page.locator('#dialog-gallery .gallery-group:not([aria-hidden]) img')).toHaveCount(37);
  await expect(page.locator('#dialog-gallery')).toBeVisible();
  await page.locator('.nightlife-card').click();
  await expect(page).toHaveURL(/work\/#occasions$/);
  await expect(page.locator('.venue-fallback')).toBeVisible();
  await page.goto('/');
  await page.locator('.tep-card').click();
  await expect(page).toHaveURL(/work\/#tep$/);
  await expect(page.locator('#eldex .case-copy')).toBeVisible();
  await context.close();
});

test('TEP card contains the improved projects and reflections', async ({ page }) => {
  test.setTimeout(60000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('#tep')).toBeHidden();
    await expect(page.locator('main > #tep')).toHaveCount(0);
    await page.locator('.tep-card').click();
    await expect(page.locator('#tep')).toBeVisible();
    await expect(page.locator('dialog #tep')).toHaveCount(1);
    await expect(page.locator('#dialog-tep')).toBeVisible();
    await expect(page.locator('#tep .tep-timeline li')).toHaveCount(10);
    for (const target of ['eldex', 'melissa', 'dstudio', 'tep-other']) {
      const link = page.locator(`.tep-project-nav a[href="#${target}"]`);
      await link.click();
      await expect(page.locator(`#${target}`)).toBeVisible();
      await expect(page).toHaveURL(new RegExp(`#${target}$`));
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const duplicateIds = await page.locator('[id]').evaluateAll(elements => {
      const ids = elements.map(el => el.id);
      return ids.filter((id, index) => ids.indexOf(id) !== index);
    });
    expect(duplicateIds).toEqual([]);
    await page.locator('#dialog-tep .modal-close').click();
    await expect(page.locator('#tep')).toBeHidden();
    await expect(page.locator('.tep-card')).toBeFocused();
  }
  await page.locator('.tep-card').click();
  const results = await new AxeBuilder({ page }).include('#dialog-tep')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(results.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
  await page.goto('/work/#dstudio');
  await expect(page.locator('#dstudio')).toBeVisible();
  await expect(page.locator('#tep-reflections')).toBeVisible();
});

test('gallery shows every unique photo at equal heights and drifts right without pause buttons', async ({ page }) => {
  await page.goto('/#gallery');
  await page.locator('.gallery-opener').click();
  const gallery = page.locator('#gallery-photos');
  const photos = gallery.locator('.gallery-group:not([aria-hidden]) img');
  await expect(photos).toHaveCount(37);
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const heights = await photos.evaluateAll(images => images.map(image => image.getBoundingClientRect().height));
    expect(Math.max(...heights) - Math.min(...heights)).toBeLessThan(1);
    expect(await page.locator('#dialog-gallery').evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
  }
  await page.mouse.move(0, 0);
  const track = gallery.locator('.gallery-track');
  const x = () => track.evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m41);
  const before = await x();
  await expect.poll(x).toBeGreaterThan(before + 2);
  await expect(page.locator('.gallery-pause')).toHaveCount(0);
  await gallery.focus();
  await expect(track).toHaveCSS('animation-play-state', 'paused');
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const paused = await x();
  await page.waitForTimeout(150);
  expect(await x()).toBeCloseTo(paused, 1);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(track).toHaveCSS('animation-name', 'none');
  await expect(gallery.locator('.gallery-group[aria-hidden]')).toBeHidden();
});


test('personal photo groups stay in sync with the preview and travel media closes cleanly', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const preview = page.locator('#interests-preview .gallery-group:not([aria-hidden]) img');
    await expect(preview).toHaveCount(9);
    await page.locator('.interests-opener').click();
    const dialog = page.locator('#dialog-interests');
    const photos = dialog.locator('.photo-grid img');
    await expect(photos).toHaveCount(9);
    expect(await preview.evaluateAll(imgs => imgs.map(img => img.getAttribute('src')).sort()))
      .toEqual(await photos.evaluateAll(imgs => imgs.map(img => img.getAttribute('src')).sort()));
    for (const photo of await photos.all()) {
      await photo.scrollIntoViewIfNeeded();
      await expect.poll(() => photo.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
    }
    expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    const video = dialog.locator('video');
    await expect(video).toHaveAttribute('preload', 'none');
    await video.scrollIntoViewIfNeeded();
    await video.evaluate(el => { el.muted = true; return el.play(); });
    await expect.poll(() => video.evaluate(el => el.paused)).toBe(false);
    const results = await new AxeBuilder({ page }).include('#dialog-interests')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(results.violations).toEqual([]);
    await page.keyboard.press('Escape');
    await expect.poll(() => video.evaluate(el => el.paused)).toBe(true);
    await expect(page.locator('.interests-opener')).toBeFocused();
  }
});
