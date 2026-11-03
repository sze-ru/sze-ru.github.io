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

- [ ] Write a static-site integration check for all five routes, local assets and links, contact omissions and deployment boundaries; run `node --test tests/site.test.mjs` to observe failure before a build exists.
- [ ] Optimise supplied photographs to WebP with descriptive filenames.
- [ ] Implement common navigation, metadata, footer and five source-grounded pages.
- [ ] Implement responsive styling, menu, reveal animation and pauseable ticker.
- [ ] Run `npm run build` and `npm test`.

## Task 2: Verify the experience

Files: `tests/browser.spec.mjs`, `playwright.config.mjs`.

- [ ] Exercise page navigation, menu keyboard behaviour, mobile overflow, reduced motion and no-JavaScript access.
- [ ] Run accessibility checks and inspect desktop/mobile screenshots.
- [ ] Resolve observed failures and rerun affected checks.

## Task 3: Publish and hand over

Files: `.github/workflows/pages.yml`, `README.md`.

- [ ] Document content editing and the pending contact/video assets.
- [ ] Configure Actions to build, test and upload only `dist`.
- [ ] Commit verified source, create `sze-ru/sze-ru.github.io`, enable Pages and push.
- [ ] Verify deployment and the live homepage; provide the site and repository URLs.
