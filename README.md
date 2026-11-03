# Jade Ong — personal portfolio

Five static pages for Jade’s personal brand: Home, About, Experience, Selected Work and Contact.

**Website:** https://sze-ru.github.io/
**Owner:** [sze-ru](https://github.com/sze-ru)

## Local development

Requires Node.js 24 or newer and Python 3 for the local preview server.

```sh
npm ci
npm run build
npm run preview
```

Open http://127.0.0.1:4173/. Rebuild after source changes and refresh the browser.

## Editing content

- `src/content.mjs`: profile settings, contact destinations, project descriptions and hospitality roles.
- `src/pages/`: page introductions, About text, experience sections and page composition.
- `src/layout.mjs`: shared navigation, footer, metadata and project card markup.
- `public/styles.css`: responsive layout, colours, typography and motion.
- `public/site.js`: mobile navigation, scroll reveals and moving-text controls.
- `public/assets/`: curated WebP photography and the social preview.

### Add contact details

Set `email` and `linkedin` in the `profile` object in `src/content.mjs`. Use a full HTTPS profile URL for LinkedIn. The Contact page automatically renders each supplied link; while both are empty, it explains that details are coming soon.

### Add or update work

Edit the `projects` array in `src/content.mjs`. Each entry needs a unique lowercase `id`, number, category, title, short title, year, role, description, contributions and learning. For photography, add the optimised image to `public/assets/` and set its filename and descriptive alt text. Add explicit dimensions to the image helper when introducing a different asset size. Cards and work-page case studies use the same content.

The Melissa visual is an editorial title treatment for the project, not a supplied campaign deliverable. Replace it with approved project photography when available. Final video links can be added to the appropriate case study in `src/pages/work.mjs` once provided.

### Photography and fonts

Photos are derived from the supplied originals. Original attachments, résumé and research are kept outside Git and outside the deployed build. The CP collaboration name was confirmed by the owner. Fonts are self-hosted DM Sans and Instrument Serif; their SIL Open Font Licenses are included in `public/fonts/`.

To regenerate the sharing image after a brand change:

```sh
npx playwright install chromium
node scripts/social-preview.mjs
npm run build
```

## Verification

```sh
npm run build
npm test
npx playwright install chromium
npm run test:browser
```

The browser suite checks five pages at mobile, tablet and desktop widths, automated accessibility rules, menu keyboard operation, project anchors, motion preferences and access with JavaScript disabled. The suite starts its own preview server. An existing Chromium installation can be selected with `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`.

## Deployment

Source lives on `main`. GitHub Pages publishes the built `gh-pages` branch, using the branch root as its source. The current GitHub sign-in does not include permission to upload workflow files, so the first pass uses branch-based publishing.

After editing, verifying and pushing source changes to `main`, publish with:

```sh
npm run test:browser
npm run deploy
```

`deploy` rebuilds and checks the site, then copies **only `dist/`** into a temporary checkout of `gh-pages` and pushes a new commit. It preserves deployment history and leaves the source checkout untouched. GitHub builds and publishes that branch automatically. No force push is used.

An optional Actions workflow is saved at `docs/deployment/pages-workflow.yml`. If workflow-upload permission is added later, move it to `.github/workflows/pages.yml` and change Settings → Pages to **GitHub Actions**. It builds, checks and publishes the same `dist/` output.

The site assumes the user-site root URL `https://sze-ru.github.io/`. If changing to a custom domain, update `profile.url`, add `public/CNAME`, configure the domain in Pages settings and update DNS at the domain provider. Changing to a project subdirectory also requires updating root-relative links.

No contact backend, CMS subscription or analytics service is required. Content is edited in the repository and published using the deployment command above.

## First-pass content still to supply

- Jade’s professional email and exact LinkedIn profile URL.
- Approved final video URLs and any additional Melissa project media.
- Optional higher-resolution portraits and a custom domain.

The source repository and these instructions provide the handover. No ongoing maintenance or support agreement is implied by this first pass.
