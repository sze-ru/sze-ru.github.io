import { scene } from "./scene.mjs";
import { image, melissaCover, icons, arrow, escape } from "./layout.mjs";
import { additionalExperience } from "./experience-list.mjs";

const watersourceFilm = `<section class="project-film" aria-labelledby="watersource-film-heading">
  <figure><video controls playsinline preload="none" width="720" height="1280" poster="/media/watersource-poster.jpg" aria-label="WaterSource water filter product film" aria-describedby="watersource-film-description"><source src="/media/watersource-product-film.mp4" type="video/mp4"><track kind="captions" src="/media/watersource-captions.vtt" srclang="en" label="English">Your browser does not support this video. <a href="/media/watersource-product-film.mp4">Open the WaterSource product film</a>.</video><figcaption>WaterSource Evergreen · Product content</figcaption></figure>
  <div class="film-copy"><p class="eyebrow">In motion</p><h3 id="watersource-film-heading">From product<br><em>to story.</em></h3><p id="watersource-film-description">A closer look at WaterSource’s water filter, brought to life through product shots and on-camera presentation.</p><a class="text-link" href="https://www.tiktok.com/@evergreen_health/video/7695387684163865876" target="_blank" rel="noopener noreferrer">View on TikTok ${arrow}</a><details class="social-embed"><summary>Watch the TikTok post</summary><iframe title="WaterSource Evergreen video on TikTok" src="https://www.tiktok.com/player/v1/7695387684163865876?autoplay=0&amp;description=1&amp;music_info=1" loading="lazy" allow="fullscreen; encrypted-media; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe><p>If TikTok doesn’t load here, use the direct link above.</p></details></div>
</section>`;

export function projectDetails(project, heading = "h3") {
  return `<div class="case-copy"><p>${escape(project.description)}</p>
    <div class="case-role"><${heading} class="micro">My Role</${heading}><p>${escape(project.role)}</p></div>
    <${heading}>What I Contributed</${heading}><ul>${project.contributions.map(text => `<li>${escape(text)}</li>`).join("")}</ul>
    <div class="takeaway"><${heading} class="micro">What I Took Away</${heading}><p>${escape(project.learning)}</p></div>
    ${project.id === "hospitality" ? `<a class="text-link" href="/work/#occasions">My roles at Marquee, Havefun & more ${arrow}</a>` : ""}
  </div>`;
}

export function projectExtras(project) {
  if (project.id === "eldex") return watersourceFilm;
  if (project.id === "cp-foods") return `<div class="cp-images">${image("cp-collaboration.webp", "CP campaign artwork showing Jade and another model outside colourful shophouses")}</div><a class="text-link social-post-link" href="https://www.instagram.com/p/DfCYdlGDdT5/?img_index=3" target="_blank" rel="noopener noreferrer">${icons.instagram}<span>View on Instagram</span>${arrow}</a>`;
  return "";
}

export function experienceCards(projects, tepContent) {
  const hospitality = projects.find(project => project.id === "hospitality");
  return `<div class="experience-categories">
    <a class="category-card nightlife-card" href="/work/#occasions" data-dialog="dialog-hospitality" aria-haspopup="dialog"><img class="map-preview" src="/assets/venue-map-preview.png" alt="Map of Jade’s hospitality venues and events across Singapore" width="600" height="600" loading="lazy" decoding="async"><div class="category-caption"><h3>Nightlife &amp; Hospitality</h3><span>Explore the map ↗</span></div></a>
    <a class="category-card tep-card" href="/work/#tep" data-dialog="dialog-tep" aria-haspopup="dialog">${image("eldex-filming.webp", "Jade creating content on the ELDEX exhibition floor")}<div class="category-caption"><h3>TEP</h3><span>Projects &amp; learning timeline ↗</span></div></a>
  </div>
  ${additionalExperience()}
  <dialog class="category-modal" id="dialog-hospitality" aria-labelledby="hospitality-title"><button class="modal-close" type="button" aria-label="Close experience" autofocus>×</button><h2 id="hospitality-title">Nightlife &amp; Hospitality</h2>${scene()}${projectDetails(hospitality)}</dialog>
  <dialog class="category-modal" id="dialog-tep" aria-labelledby="tep-heading"><button class="modal-close" type="button" aria-label="Close experience" autofocus>×</button>${tepContent}</dialog>
  `;
}
