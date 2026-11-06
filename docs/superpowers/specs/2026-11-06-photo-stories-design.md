# Jade’s new photographs and final TEP reflections

## Intent

Integrate the November 6 delivery into the existing dark editorial portfolio. Preserve the existing navigation, dialogs, gallery motion and original content. The owner explicitly requested a written spec followed immediately by implementation and push, without an approval checkpoint.

## Presentation

Use small, captioned photo groups inside the relevant existing sections. This gives photographs their context without adding more homepage cards. A single undifferentiated gallery would lose that context; individual pages for every folder would make the portfolio harder to browse.

| Source folder | Primary placement | Treatment |
| --- | --- | --- |
| `urban_exploration` | Personal Interests → Urbex | Six photographs as one group, preserving their full frames. |
| `Personal Interest: Travelling` | Personal Interests → Travelling | Three photographs and the supplied coastal clip with native playback controls. |
| `stock taking` | TEP → D’Studio | Two photographs supporting the inventory and operations account. |
| `TEP melissas shoes` | TEP → Melissa Shoes | One real project photograph beside the existing project description. |
| `TEP: DBM: content production.` | TEP → DBM | Three photographs together as production evidence. |
| `TEP: refresh` | TEP → Other contributions → Refresh | Two photographs together with the consumer-testing account. |
| `TEP: extras` | TEP → Other contributions → Team moments | Two photographs; use the notes to identify their specific captions and context. |
| `friends birthday` | TEP → Team moments | One photograph, identified as a personal team highlight rather than client work. |
| `gallery stuff` | Gallery | Three additional personal photographs. |

All 23 new photographs also join the 14 existing unique Gallery photographs. Keep the seamless, equal-height photo strip in the Gallery card and popup. Add visible captions in the popup, with consistent sentence case, punctuation and typographic apostrophes. Use descriptive alternative text separately from captions. The travel clip belongs in Travelling, not in the moving photo strip.

Replace the Personal Interests card’s abstract preview with a photo strip sourced from the same Urbex and Travelling photo groups shown inside its dialog. Its label lists figure skating, urbex and travelling. Keep figure skating’s existing illustration because no skating photograph was supplied. Future changes to those personal photo groups must automatically reach both the preview and dialog.

## Source and caption rules

Folder names determine content grouping. Any additional information in `more_more_stuff/notes` is caption content, not a new category or a reason to discard part of a caption. Preserve its meaning and first-person voice while correcting casing, spelling, punctuation and spacing. Associate shared captions with the complete corresponding photo group. Never invent locations, dates, identities or outcomes from an image alone.

At initial inspection the notes file was zero bytes and had an editor lock. The owner subsequently supplied its complete contents in chat. Those supplied notes are the caption source; the open local file is left untouched.

Caption details: Urbex keeps “Fun fact: I love geometric structures.” WaterSource is identified with ELDEX event coverage and content production. D’Studio is identified as Nanyang Polytechnic’s merchandise store, with stocktake, content production and e-commerce order tracking. Melissa combines product distribution to talents with talent sourcing and coordination, content production and social media analysis. DBM is a main TEP project with its own subsection and content-production caption. Refresh is prebiotic soda taste testing and survey responses for another team. CP Foods is content-production support for another team. The birthday photograph is captioned as a TEP friend’s birthday celebration. Travelling and the uncategorised team/personal moments retain their folder-based labels.

## LinkedIn integration

Retain all existing timeline entries (Weeks 1 and 3–7). Append Week 8 (stocktake, operational records and internship preparation), Week 9 (team leadership, Melissa distribution and talent briefing), Week 10 (content review, ongoing operations, SAS volunteering and Refresh consumer testing), then a distinct closing reflection. Do not create a Week 2 or assign a week number to the closing reflection.

Update Melissa’s contribution and learning copy with collection, distribution, briefing and content vetting; update D’Studio with daily spreadsheets and the T-shirt trading video. Add Refresh consumer testing, SAS Hearts Connect × Youth Corps volunteering, team leadership and the Stabilo collaboration to the appropriate TEP account. Keep the new reflections concise and in Jade’s first-person voice; no inferred performance metrics or confirmed internship placement. The closing reflection connects the existing three brand pillars with marketing, international business and the friendships formed during TEP. Update present-tense TEP introductions to reflect the supplied closing retrospective.

## Implementation and delivery

Store curated, metadata-free WebP derivatives in `public/gallery/` and a browser-compatible MP4 plus poster in `public/media/`. Keep the raw delivery, LinkedIn PDF and editor lock out of source commits and deployed output. Use existing static rendering and dialog behavior with no new dependencies. Share media records and rendering between the Gallery, Interests and TEP placements. Use native figures and figcaptions; keep photos uncropped, lazy-loaded and dimensioned. The travel video must not autoplay or preload and must pause when its dialog closes.

Use responsive photo grids (two columns where space allows, one on narrow screens). Captions should remain readable in normal sentence case. Preserve keyboard access, visible focus, reduced motion and the no-JavaScript fallback.

Verify content coverage, all local assets, preview/gallery agreement, caption rendering, video cleanup, timeline order, mobile/desktop overflow, no-JavaScript access and automated accessibility. Review the final diff, commit source, push `main`, then publish the tested build using the repository’s existing `gh-pages` deployment script and check the live page.
