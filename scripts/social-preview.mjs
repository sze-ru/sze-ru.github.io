import { chromium } from "@playwright/test";
import { readFile } from "node:fs/promises";

const image = (await readFile("public/assets/jade-portrait.webp")).toString(
  "base64",
);
const browser = await chromium.launch(
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
    : {},
);
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await page.setContent(
    `<html><style>*{box-sizing:border-box}body{margin:0;background:#151515;color:#f2f0e9;font-family:Arial,sans-serif;padding:48px 60px}p{font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#b1aaa0}h1{font-size:153px;line-height:.8;letter-spacing:-12px;margin:39px 0 28px}h1 span{color:#ec6558}.tagline{font-family:Georgia,serif;font-size:35px;line-height:1.15;letter-spacing:-1px}.photo{position:absolute;right:60px;top:45px;width:365px;height:540px;object-fit:cover}.footer{position:absolute;bottom:42px;font-size:11px;letter-spacing:1px;color:#aaa9a3}.line{position:absolute;bottom:78px;left:60px;width:610px;height:1px;background:#393936}</style><body><p>Hospitality · Creativity · Human connection</p><h1>JADE<br>ONG<span>.</span></h1><div class="tagline">People first.<br><i>Ideas into action.</i></div><div class="line"></div><div class="footer">SINGAPORE &nbsp; / &nbsp; SZE-RU.GITHUB.IO</div><img class="photo" src="data:image/webp;base64,${image}"></body></html>`,
  );
  await page.locator("img").evaluate((img) => img.decode());
  await page.screenshot({
    path: "public/assets/social-preview.jpg",
    type: "jpeg",
    quality: 90,
  });
} finally {
  await browser.close();
}
