# Experience directory implementation plan

Goal: incorporate every entry from more_stuff/experiences.md into the existing portfolio, with consistent dates, full role names, locations and browsable groups.

Architecture: src/venues.mjs is the shared hospitality/event record source for the map and directory. src/experience-list.mjs renders the same compact expandable record format for hospitality, events, modelling and other work. Existing TEP project details remain in their popup, with a prominent timeline link and clearer timeline styling.

Constraints: preserve existing user edits; no deployment; no new dependencies; use native details and a progressive-enhancement role filter; no invented dates, responsibilities or week entries. Only hospitality/events receive map pins. Modelling and earlier jobs remain under Experience. Existing map IDs remain stable.

- [x] Add coverage checks for all missing entries, corrected role sets, dates and addresses, consistent events classification and TEP timeline links.
- [x] Replace stale hospitality roles with the supplied inventory; expand abbreviations into role arrays and readable map text. Use OneMap coordinates for Bugis+ (103.8542423474883, 1.299603689902971) and National Gallery (103.8517080135591, 1.290655338403677).
- [x] Render grouped hospitality/event lists below the map, using shared records and a role select. Preserve no-JavaScript access and map-error fallback.
- [x] Add modelling and other-work lists below the existing Experience cards, and to /work/. Keep CP project media accessible through its existing /work/#cp-foods anchor.
- [x] Make the existing TEP timeline prominent in project navigation, label its weeks, and preserve the existing reflection content.
- [x] Build and run content tests; check role filtering, keyboard details, TEP navigation, map filters, failure fallback, mobile layout and accessibility in Chromium. Update stale assertions only where requested behavior changes.
- [x] Document the record format and source/address corrections in README.md.

Verification: build and all 8 content/publishing tests passed. Ten targeted browser checks passed, covering the directory, timeline, all map details, category filters, no-JavaScript access, map failure and accessibility at 375/768/1440px. Additional map marker/mobile checks passed. Desktop directory and timeline screenshots were visually reviewed. No deployment performed.
