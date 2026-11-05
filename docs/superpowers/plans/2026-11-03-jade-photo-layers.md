# Jade photo layers

Approved direction: separate Jade from the three supplied photographs and move her independently of their backgrounds. Use original-photo masking, as explicitly selected by the user, rather than generated portraits.

- [x] Extract full-canvas alpha masks using local rembg/BiRefNet; preserve source RGB pixels. Inspect hair, hands, arm gaps and the pool cue. Save transparent PNG masters and lossless WebP website layers.
- [x] Save the three generated empty backgrounds at matching source dimensions. Keep source photographs untouched and rejected generated portraits outside the website.
- [x] Add two layered figures below the introduction and one beside the closing invitation in `src/pages/home.mjs`. Keep existing copy and contact destinations. Use one small figure helper for the paired images.
- [x] Add responsive composition in `public/styles.css` and bounded scroll transforms in `public/site.js`. Backgrounds remain fixed within each figure; foregrounds move independently. Disable transforms for reduced motion and retain a useful static composition without JavaScript.
- [x] Verify original RGB preservation and real alpha transparency. Check independent movement, reduced motion, asset loading, desktop/mobile overflow and existing site tests. Inspect browser screenshots.

Runtime uses plain HTML, CSS and JavaScript with no new website dependencies. Image processing tools stay outside the runtime. Hidden background details are reconstructed approximations; no missing body parts are invented. Existing unrelated workspace changes must remain intact.

## Three-portrait introduction

The user reverted the whole-image heading overlap and requested all three layered photographs next to each other with the same zoom effect. The introduction now has its original heading size and paragraph, followed by a sticky row of night, pool and waterfront portraits. A single scroll progress drives all three foregrounds from 1 to 1.08 and backgrounds from 1 to 0.97 after revealing the clean plates. Original photographs cover each pair at the start and in reduced-motion/no-JavaScript mode. Pool layers share the table-rail anchor; night layers use the bottom center; waterfront layers use the handrail area. The figures clip any expansion at their edges. Mobile retains a horizontal row with native swiping and keyboard scrolling. There is no whole-scene scale, heading overlap, translation, rotation or artificial shadow. The closing waterfront portrait remains in place. Tests check synchronized zoom, reverse scroll, original alignment, reduced motion and responsive overflow; current screenshots use `three-portraits-`.

The final pacing correction pins `.intro-stage`, which contains the heading, paragraph and photos together. Its parent supplies 150svh of scroll travel rather than 65svh. Desktop copy uses a compact two-column header above the photos; mobile uses stacked copy and viewport-sized photo heights so the whole stage fits even at 320×568. The clean-plate reveal occupies the first 4% of the longer interval. The hero film uses absolute positioning within its section, so the video travels with the page while its existing fade continues. Browser tests assert heading, paragraph and photos remain visible at start, middle and end, verify at least twice the former hold distance, and check that the video moves by the same distance as the page. Previews use `intro-pinned-`.


### Scroll corrections after the stop.png reference

- Restore the fixed, fading hero film behind the page; reduced motion keeps the film in the hero.
- Pin the whole introduction near 13.5% of viewport height, capped to fit short screens. Keep the 150svh portrait zoom hold.
- Hold the scene chapter in one viewport position before and during the map zoom. Crossfade the title words to A sense of (work) experience during the last 18%, retain it through the gallery pause, then release it with the gallery. Keep the original semantic headings and the existing map interaction window.
- Check forward/reverse scroll, desktop/mobile geometry, map interaction, reduced motion and keyboard gallery controls.

- Keep the Skills label and pill borders steady while their words crossfade. Remove the decorative neighboring card and keep the existing gallery pause. Style native scrollbars with the coral accent and charcoal background.
