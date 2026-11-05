import { profile } from "./content.mjs";

export const arrow = '<span aria-hidden="true">↗</span>';
export const icons = {
  diamond:
    '<svg class="vip-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" focusable="false"><path d="m12 3 8 9-8 9-8-9Z"/><path d="m8 12 4-9 4 9-4 9Z"/></svg>',
  clock:
    '<svg class="event-clock" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" role="img" aria-label="Event"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  email:
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" focusable="false"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/></svg>',
  linkedin:
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true" focusable="false"><path d="M5.4 3a2.1 2.1 0 1 0 0 4.2 2.1 2.1 0 0 0 0-4.2ZM3.6 9h3.6v12H3.6V9Zm6 0H13v1.6h.1c.5-.9 1.6-1.9 3.5-1.9 3.7 0 4.4 2.4 4.4 5.5V21h-3.6v-6c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3.1V21H9.6V9Z"/></svg>',
  instagram:
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" focusable="false"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".75" fill="currentColor" stroke="none"/></svg>',
};
export const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
const imageSizes = {
  "jade-portrait.webp": [505, 758],
  "jade-nightlife.webp": [505, 758],
  "jade-daylight.webp": [505, 759],
  "jade-evening.webp": [504, 757],
  "eldex-filming.webp": [720, 1280],
  "watersource-visit.webp": [720, 1280],
  "cp-personality.webp": [1024, 1280],
  "cp-collaboration.webp": [1024, 1280],
};
export const image = (name, alt) => {
  const [width, height] = imageSizes[name];
  return `<img src="/assets/${name}" alt="${escape(alt)}" width="${width}" height="${height}" loading="lazy" decoding="async">`;
};
export const eyebrow = (number, text) =>
  `<p class="eyebrow"><span class="section-number">${number}</span>${text}</p>`;

export function socialLinks(showLabels = false) {
  return `<div class="social-links${showLabels ? " social-links-labelled" : ""}">${profile.email ? `<a class="social-link" href="mailto:${escape(profile.email)}" aria-label="Email Jade at ${escape(profile.email)}" title="${escape(profile.email)}">${icons.email}${showLabels ? `<span>${escape(profile.email)}</span>` : ""}</a>` : ""}${profile.linkedin ? `<a class="social-link" href="${escape(profile.linkedin)}" target="_blank" rel="noopener noreferrer" aria-label="Jade on LinkedIn (opens in a new tab)" title="LinkedIn">${icons.linkedin}${showLabels ? "<span>LinkedIn</span>" : ""}</a>` : ""}</div>`;
}

export const melissaCover = () => `<div class="editorial-cover"><span class="micro">Project cover / 2026</span><strong>melissa</strong><p>Talent coordination<br>& content planning</p></div>`;

export function invitation() {
  return `<section class="invitation wrap" data-reveal><p class="eyebrow">Good things start with a conversation.</p><a href="/contact/" class="invitation-link">Let’s make<br><em>something happen.</em>${arrow}</a></section>`;
}

export function layout({
  title,
  description,
  path = "/",
  body,
  className = "",
}) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(title)} | Jade Ong</title><meta name="description" content="${escape(description)}">
<meta name="theme-color" content="#151515"><link rel="canonical" href="${profile.url}${path}">
<meta property="og:type" content="website"><meta property="og:site_name" content="Jade Ong"><meta property="og:title" content="${escape(title)} | Jade Ong"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${profile.url}${path}"><meta property="og:image" content="${profile.url}/assets/social-preview.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Jade Ong — People first. Ideas into action."><meta name="twitter:card" content="summary_large_image">
${(path === "/" || path === "/work/") ? '<link rel="stylesheet" href="/vendor/maplibre-gl.css">' : ""}
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="preload" href="/fonts/dm-sans-latin.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/fonts/fonts.css"><link rel="stylesheet" href="/styles.css"><script src="/site.js" defer></script>
</head><body class="${className}"><a class="skip-link" href="#main">Skip to content</a>
<header class="header wrap"><a href="/" class="wordmark" aria-label="Jade Ong home">JADE ONG<span class="brand-dot" aria-hidden="true">.</span></a><nav aria-label="Main navigation"><a href="/#home">Home</a><a href="/#introduction">About Me</a><a href="/#experiences">Experience</a><a href="/#personal-interests">Personal Interests</a><a href="/#gallery">Gallery</a><a href="/#connect">Contact</a></nav></header>
<main id="main">${body}</main>
</body></html>`;
}
