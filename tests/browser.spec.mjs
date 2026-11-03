import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = ["/", "/about/", "/experience/", "/work/", "/contact/"];
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
        await page
          .locator("img")
          .evaluateAll(async (images) => (await Promise.all(images.map(async (img) => {
            img.loading = "eager";
            try {
              await img.decode();
              return null;
            } catch {
              return img.src;
            }
          }))).filter(Boolean)),
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

test("mobile menu can be opened, closed by keyboard and used to navigate", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Menu" });
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }),
  ).not.toBeVisible();
  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await menu.click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Selected Work" })
    .click();
  await expect(page).toHaveURL(/\/work\/$/);
});

test("project cards navigate to real case studies", async ({ page }) => {
  await page.goto("/");
  await page.locator(".project-card.eldex").click();
  await expect(page).toHaveURL(/\/work\/#eldex$/);
  await expect(page.locator("#eldex h2")).toBeInViewport();
});

test("moving text can be paused and reduced motion suppresses animation", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Pause moving text" }).click();
  await expect(
    page.getByRole("button", { name: "Resume moving text" }),
  ).toHaveAttribute("aria-pressed", "true");
  expect(
    await page
      .locator(".ticker-track")
      .evaluate((el) => getComputedStyle(el).animationPlayState),
  ).toBe("paused");
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await page
      .locator(".ticker-track")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  expect(
    await page
      .locator("[data-reveal]")
      .evaluateAll((elements) =>
        elements.every((el) => getComputedStyle(el).opacity === "1"),
      ),
  ).toBeTruthy();
});

test("content and navigation remain usable without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 375, height: 812 },
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/");
  expect(await page.locator('.ticker-track').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  await expect(page.getByRole('button', { name: 'Pause moving text' })).not.toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }),
  ).toBeVisible();
  await expect(page.locator("#introduction h2")).toBeVisible();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "About" })
    .click();
  await expect(page).toHaveURL(/\/about\/$/);
  await context.close();
});
