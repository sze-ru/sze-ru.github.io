# Jade Ong — personal portfolio

The closing résumé portrait uses separate background and foreground images through `layeredPhoto()` in `src/pages/home.mjs`. Transparent masters and earlier layered photo assets remain in `output/jade-layers/` and `public/assets/`. The homepage introduction and gallery use the original photographs.

About Me uses one night portrait beside the shared biography, with a stacked layout on phones. The pool and waterfront originals now appear alongside `posing.jpg` in Gallery. The earlier pinned three-photo introduction has been removed.

The homepage navigation is Home, About Me, Experience, Personal Interests, Gallery and Contact. Experience retains two cards: Nightlife & Hospitality and TEP. Each opens its own popup. Hospitality contains the updated personal reflection, role details and venue map. The TEP popup contains the improved project copy, contributions and learning timeline; it is not a separate homepage section or navigation item. Personal Interests and Gallery form a matching pair below. Personal Interests opens figure skating and urbex content. Gallery includes all 14 unique supplied photographs and campaign images, including hiking and the TEP photos. Its existing card and popup show equal-height images at their original proportions in a slow, seamless left-to-right loop. Hovering or focusing the photo strip pauses it; there are no pause buttons. Reduced motion or disabled JavaScript stops the animation and leaves the popup horizontally scrollable. Duplicate exports, image layers, screenshots, video posters and the résumé document are excluded. The gallery list and alt text live in `src/gallery.mjs`, with unmodified source copies in `public/gallery/`. Without JavaScript, the personal dialogs display inline. Cards grow slightly on hover or keyboard focus unless reduced motion is enabled.

The homepage email and LinkedIn links stay fixed while scrolling, then fade out when the closing contact links enter view and return when scrolling back up. Hovering or focusing the closing Jade portrait enlarges her cutout upward from a fixed bottom edge; clicking downloads `public/downloads/Jade-Ong-Resume.pdf`, converted from the supplied résumé image. Replace that PDF to update the download. The link works without JavaScript and the zoom respects reduced-motion settings.

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
- `src/pages/`: page introductions, About text and page composition.
- `src/scene.mjs`: hospitality map markup.
- `src/layout.mjs`: shared header, footer, metadata and media helpers.
- `src/projects.mjs`: experience category cards, shared project details and project media.
- `public/styles.css`: responsive layout, colours, typography and motion.
- `public/site.js`: accessible category dialogs, media playback and scroll reveals.
- `src/venues.mjs`: mapped hospitality venues, addresses and coordinates.
- `public/venue-map.js`: the homepage’s lazy-loaded venue map.
- `public/assets/`: curated WebP photography and the social preview.

### Update contact details

The supplied email and LinkedIn profile are populated in `src/content.mjs`; edit the `profile` object to update them. Use a full HTTPS profile URL for LinkedIn. The Contact page displays the email address and each supplied link; while both are empty, it explains that details are coming soon.

### Add or update work

Edit hospitality, WaterSource, Melissa and CP copy in the `projects` array in `src/content.mjs`. The TEP content is shared by its homepage popup and work-page fallback through `src/tep.mjs`; it also contains D’Studio, DBM, programme activities and the learning timeline. Shared role, contribution and reflection markup lives in `src/projects.mjs`. Card links open native dialogs; Escape, the close button or the backdrop dismisses them and restores focus. Dialog content scrolls and closing stops its media. Without JavaScript, cards link to the work page, which also includes the venue list and map. The TEP reflections paraphrase the supplied `more_stuff/linkedin_posts.pdf` (Weeks 1 and 3–7); Jade’s November brief supplies additional contributions, including Guess-the-Product and D’Studio order and inventory tasks. These additions are not assigned unsupported weekly dates. CP’s reflection draws on Week 7; its 2026 modelling date comes from `more_stuff/experiences.md`. No performance result is inferred. About Me copy is shared through `aboutCopy` in `src/content.mjs`.

The Melissa visual is a plain editorial title card visibly labelled “Project cover”, not a supplied campaign deliverable. Replace it with approved project photography when available. The WaterSource case study includes a local product film and an optional TikTok player. The CP co-branded T-shirt campaign links to the supplied Instagram post; its model contribution is separate from the TEP project dates. Media markup is in `src/projects.mjs`; local video, poster and captions are in `public/media/`. The product film is encoded as H.264/AAC for browser compatibility, with no autoplay and no video preload. Its English caption track follows the text already present in the supplied film. The TikTok player can be expanded on demand and includes a direct-link fallback.

### Homepage scene map

The hospitality dialog uses MapLibre GL JS with OpenFreeMap’s Dark style. The pinned library, stylesheet, worker and license are copied to `dist/vendor/` at build time. The map code and tiles load when the map becomes visible after opening its card. The work page also offers the map. Addresses and Google Maps links remain available without the map service or JavaScript.

The map is accessed through the Nightlife & Hospitality card. On wider maps, hover a marker for a preview; click, tap or press Enter for persistent details. Narrow maps use click or Enter so a preview cannot obscure the pins. Filters show long-term hospitality and events/ad-hoc work. `/experience/` redirects to `/#experiences`. An expandable experience directory is always available below the map, including on map failure or without JavaScript. With JavaScript, its role filter narrows the list independently of the map. The map and directory share names, dates, full role arrays, locations and coordinates in `src/venues.mjs`. All ad-hoc assignments use the Events category. J’Adore/Pernod Ricard has one record per supplied location.

Nearby overview markers are spaced apart with leader lines to their coordinates. Closing a venue panel or pressing Escape returns to the overview; a subsequent Escape closes the dialog. “Show all venues” restores all categories. The map is constrained to Singapore, with an illustrative offshore point for It’s The Ship. Scrolling stays available within the dialog, and reduced motion skips map animation.

Event and ad hoc experience locations follow Jade’s revised list supplied on 5 November 2026, replacing Dashi GoGo and adding MICE Event, Beerfest Asia, Macallan, Echo, Amber Lounge, and three separate J’Adore Models x Pernod Ricard pins (NUSS, Bosch and Havelock 2). Role abbreviations are preserved as supplied. Building coordinates were checked using [OneMap address search](https://www.onemap.gov.sg/apidocs/search). Jade’s address wording is preserved: OneMap lists Suntec Tower Four at 6 Temasek Boulevard, 038986 rather than the supplied 3 Temasek Boulevard, 038983; postal code 098033 resolves to Palawan Beach Walk, so Beerfest’s pin instead uses the named Siloso Beach Walk. It’s The Ship uses an illustrative offshore point in the Singapore Strait (1.22, 103.87), not a sailing route or confirmed event position.

VIP locations were checked against [Marquee](https://taogroup.com/venues/marquee-singapore/contact/), [ARK11](https://theark11.com/contact/), [Truth or Dare](https://www.truthordare.sg/), [Yang / 1-Group](https://www.1-group.sg/yang), [SinCity](https://www.51sincity.com/), [+65 / SISTIC](https://www.sistic.com.sg/venues?id=549), [Drip's organiser profile](https://www.eventbrite.com/o/drip-singapore-49546543903), and [Xclusiv / Marina Square](https://www.marinasquare.com.sg/articles/article-qo9l7so5). The newer `more_stuff/experiences.md` supersedes the previous Somerset location: HaveFun now uses Bugis+, 201 Victoria Street. Millis uses National Gallery, 1 Saint Andrew’s Road. Both building coordinates were retrieved from [OneMap](https://www.onemap.gov.sg/) on 5 November 2026. Xclusiv’s displayed address follows the supplied Raffles Link wording; its existing building coordinate is retained. Dates describe Jade's experience, not current venue operating status.

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

The browser suite checks mobile, tablet and desktop layouts, automated accessibility rules, category-card keyboard operation, dialog focus and media cleanup, venue interactions, project anchors, reduced motion and access without JavaScript. It starts its own preview server. Select an existing Chrome installation with `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` if the bundled browser cannot launch.

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

## Optional content additions

- Additional approved Melissa project media, if available.
- Optional higher-resolution portraits and a custom domain.

The source repository and these instructions provide the handover. No ongoing maintenance or support agreement is implied by this first pass.

### Experience inventory

`more_stuff/experiences.md` is the supplied inventory. BG means Bottle service, GR means Guest relations, BA means VIP hosting, and P means Promotion & sales. Public entries always spell these out. `src/experience-list.mjs` supplies one expandable record layout and the Modelling & Shoots / Other Work records shown under Experience and on `/work/`. Each record uses `id`, `name`, `year`, `roles`, and an optional `address`, `coordinates`, `summary` or project `href`. Add hospitality and event records to `src/venues.mjs`; add modelling and earlier employment to their arrays in `src/experience-list.mjs`. Only supplied roles and dates are used. The CP listing links to its existing project evidence.

TEP remains inside its existing popup. Its project navigation now starts with Learning timeline, which scrolls to the existing reflections for Weeks 1 and 3–7. No Week 2 or additional weekly assignments have been invented.
