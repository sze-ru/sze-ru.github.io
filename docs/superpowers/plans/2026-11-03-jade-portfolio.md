# Jade portfolio implementation plan

> Execute inline in this session; the user has authorised a first pass of the proposed design.

**Goal:** Build and publish Jade's five-page portfolio at https://sze-ru.github.io/.

**Architecture:** A Node build composes shared page layout and content into static HTML. Images, CSS and progressive JavaScript are copied into a deployment-only directory.

**Tech stack:** Node 24, HTML, CSS, JavaScript, Playwright for browser verification, GitHub Pages.

## Global constraints

- Follow the approved design and jades_directions.md.
- Use only supported claims and real supplied photography.
- Keep contact links absent until their destinations are supplied.
- Preserve reduced motion, keyboard access and no-JavaScript content.
- Publish only the built site; keep attachments and extracted research local.
- Ponytail is disabled by user instruction.

## Task 1: Build the complete portfolio

Files: `scripts/build.mjs`, `src/layout.mjs`, `src/content.mjs`, `src/pages/*.mjs`, `public/assets/*`, `public/styles.css`, `public/site.js`, `package.json`, `tests/site.test.mjs`.

- [x] Write a static-site integration check for all five routes, local assets and links, contact omissions and deployment boundaries; run `node --test tests/site.test.mjs` to observe failure before a build exists.
- [x] Optimise supplied photographs to WebP with descriptive filenames.
- [x] Implement common navigation, metadata, footer and five source-grounded pages.
- [x] Implement responsive styling, menu, reveal animation and pauseable ticker.
- [x] Run `npm run build` and `npm test`.

## Task 2: Verify the experience

Files: `tests/browser.spec.mjs`, `playwright.config.mjs`.

- [x] Exercise page navigation, menu keyboard behaviour, mobile overflow, reduced motion and no-JavaScript access.
- [x] Run accessibility checks and inspect desktop/mobile screenshots.
- [x] Resolve observed failures and rerun affected checks.

## Task 3: Publish and hand over

Files: `scripts/publish.mjs`, `tests/publish.test.mjs`, `docs/deployment/pages-workflow.yml`, `README.md`.

- [x] Document content editing and the pending contact/video assets.
- [x] Configure branch publication of only `dist`; preserve Actions as an optional workflow. Validate publishing and history preservation against a local bare Git repository.
- [x] Commit verified source, create `sze-ru/sze-ru.github.io`, enable Pages and push.
- [x] Verify deployment and the live homepage; provide the site and repository URLs.

## Verification result

Four Node checks and seven Chromium browser checks pass. The reviewer confirmed the publisher preserves branch history and source state. GitHub Pages deployment run 41602512641 succeeded, and all five live pages plus the social sharing image returned HTTP 200 with the expected portfolio content.
