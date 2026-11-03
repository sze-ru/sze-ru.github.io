import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = ["/", "/about/", "/experience/", "/work/", "/contact/"];
test("mobile hero portrait clears the introductory paragraph", async ({ page }) => {
  for (const width of [320, 360, 375, 390, 430]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const photo = await page.locator(".hero-photo").boundingBox();
    const description = await page.locator(".hero-description").boundingBox();
    expect(photo.y + photo.height, `${width}px portrait bottom`).toBeLessThanOrEqual(description.y);
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
  await expect(page.locator("footer .social-links a")).toHaveCount(2);
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
  expect(
    await page
      .locator(".ticker-track")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  await expect(
    page.getByRole("button", { name: "Pause moving text" }),
  ).not.toBeVisible();
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
