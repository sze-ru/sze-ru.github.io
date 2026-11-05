import { tepSection } from "../tep.mjs";
import { scene } from "../scene.mjs";
import { projects } from "../content.mjs";
import { eyebrow, image, invitation, melissaCover } from "../layout.mjs";
import { projectDetails, projectExtras } from "../projects.mjs";
import { additionalExperience } from "../experience-list.mjs";

export default {
  title: "Selected work",
  path: "/work/",
  className: "work",
  description:
    "Explore Jade Ong’s work in VIP hospitality, ELDEX Asia 2026 for WaterSource Evergreen, Melissa Shoes and a CP collaboration.",
  body: `<section class="page-heading work-heading wrap">${eyebrow("03", "Selected work")}<h1>Selected <em>work.</em></h1><p class="page-lead">A selection of experiences, projects<br>and the part I played in bringing them to life.</p><nav class="work-jump" aria-label="Jump to project">${projects.map((p) => `<a href="#${p.id}"><span>${p.number}</span> ${p.shortTitle} ↓</a>`).join("")}</nav></section>
  ${projects.filter(p => p.id === "hospitality").map((p) => `<article id="${p.id}" class="case-study wrap section"><div class="case-heading" data-reveal><p class="eyebrow">${p.number} / ${p.category}</p><span class="micro">${p.year}</span><h2>${p.title}</h2></div><div class="case-layout"><div class="case-media ${p.className}">${p.image ? image(p.image, p.alt) : melissaCover()}${p.id === "hospitality" ? '<p class="media-caption">Personal portrait · Waterfront setting</p>' : ""}${p.id === "eldex" ? `<div class="case-small-image">${image("watersource-visit.webp", "Jade exploring a WaterSource product during a brand visit")}</div>` : ""}</div>${projectDetails(p)}</div>${projectExtras(p)}${p.id === "hospitality" ? scene() : ""}</article>`).join("")}
  ${tepSection()}
  <section class="section wrap" aria-label="More experience">${additionalExperience()}</section>
  ${invitation()}`,
};
