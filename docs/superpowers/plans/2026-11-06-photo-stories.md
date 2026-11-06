# Photo stories implementation plan

**Goal:** Integrate the new delivery, captions and final LinkedIn reflections, then publish the verified site.

**Architecture:** Extend the existing gallery module with shared photo groups and a captioned grid renderer. Reuse it in the existing homepage dialogs and shared TEP section; keep existing JavaScript dialog behavior.

**Tech stack:** Static JavaScript templates, CSS, Node test runner, Playwright, Pillow and FFmpeg for asset preparation.

## Constraints

Follow `../specs/2026-11-06-photo-stories-design.md`. No new dependencies. Preserve all 14 existing photos and six timeline milestones. The notes supplied in chat provide captions. Keep raw source material outside commits and deployment.

## Steps

- [x] Prepare 23 metadata-free WebP photos and one controlled MP4 with a poster in `public/gallery/` and `public/media/`. Inspect dimensions and video audio before publishing.
- [x] Extend `tests/browser.spec.mjs` to expect 37 gallery photos, three personal interests and ten timeline entries. Add a regression asserting the Interests preview’s unique image sources equal the Urbex/Travelling sources in the popup, readable captions, video pause on close and no overflow at 375/1440px. Run the targeted browser test against the old build and confirm failure.
- [x] Extend `src/gallery.mjs` with `photoGroups`, `photoGrid(group)` and `interestPhotos`. Keep the existing `galleryStrip()` calls working; add optional photo-list and ID parameters for the Interests preview. Escape caption and alternative text. Render gallery captions only in the non-preview strip.
- [x] Update `src/pages/home.mjs` to use the shared Interests photo preview, Urbex grid and Travelling grid/video. Add responsive photo-grid and caption rules in `public/styles.css`.
- [x] Update `src/tep.mjs` with project photo groups, Weeks 8–10 and the closing reflection; update `src/content.mjs` and `src/pages/about.mjs` where later posts supersede older project accounts.
- [x] Read the notes supplied in chat and apply every additional detail as a properly formatted caption; check all source folders and captions against the resulting pages.
- [x] Update README editing and content coverage instructions. Run `npm run build`, `npm test`, `npm run test:browser`; inspect mobile/desktop screenshots and review the diff.
- [x] Commit only implementation, curated assets, tests and documentation. Push source with `git push origin main`; publish with `npm run deploy`; verify the live page and remote branch heads.

## Verification record

- Baseline: build and all eight Node tests passed before implementation.
- Regression: the new Interests preview check failed against the old build (expected nine images, found zero), then passed after implementation.
- Full browser suite: 37 tests passed using installed Google Chrome. The bundled Playwright headless shell crashed before page loading, so verification uses the documented executable override.
- Mobile and desktop screenshots inspected; an independent code review found no actionable issues and confirmed no caption clipping or TEP overflow at 375/768/1440px.
- The owner supplied the notes in chat after the initial verification. Applied their caption details, promoted DBM to a main project subsection and added a regression for caption coverage on both the homepage and work page. The open notes file is left untouched.

- Final caption checks: all nine Node tests and 11 affected browser checks passed; the latter cover the TEP popup, mobile/desktop accessibility, no-JavaScript access, Gallery and Personal Interests. The 37-test full browser suite had already passed before the caption-only and DBM-placement follow-up.
- Source pushed to `main` at `d0ff648`; tested output published to `gh-pages` at `a585fa2`. GitHub Pages reports the deployment built successfully.
- Live homepage verified for the supplied captions, DBM subsection, Interests preview, 37-image gallery and closing reflection. Downloaded Urbex, Melissa and travel-video assets match the tested build byte for byte.
