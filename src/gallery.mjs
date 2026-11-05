import { escape } from "./layout.mjs";

// Unique supplied photographs and campaign artwork; excludes duplicate exports and technical assets.
export const galleryPhotos = [
  {
    "src": "/gallery/posing.jpg",
    "alt": "Jade posing in a white interior",
    "width": 853,
    "height": 1280
  },
  {
    "src": "/gallery/night-walk.jpg",
    "alt": "Jade beside the waterfront at night",
    "width": 504,
    "height": 757
  },
  {
    "src": "/gallery/night-portrait.jpg",
    "alt": "Jade posing beside warm waterfront lights",
    "width": 505,
    "height": 758
  },
  {
    "src": "/gallery/night-railing.jpg",
    "alt": "Jade leaning against a waterfront railing",
    "width": 505,
    "height": 758
  },
  {
    "src": "/gallery/waterfront.jpg",
    "alt": "Jade by a ship railing in daylight",
    "width": 505,
    "height": 759
  },
  {
    "src": "/gallery/filming-session.jpg",
    "alt": "A filming session with a phone and stabiliser",
    "width": 720,
    "height": 1280
  },
  {
    "src": "/gallery/pool.jpg",
    "alt": "Jade lining up a shot at the pool table",
    "width": 960,
    "height": 1280
  },
  {
    "src": "/gallery/watersource-visit.jpg",
    "alt": "Jade trying a product during a WaterSource visit",
    "width": 720,
    "height": 1280
  },
  {
    "src": "/gallery/eldex-booth.jpg",
    "alt": "Visitors and team members at an ELDEX exhibition booth",
    "width": 720,
    "height": 1280
  },
  {
    "src": "/gallery/eldex-filming.jpg",
    "alt": "Filming on the ELDEX exhibition floor",
    "width": 720,
    "height": 1280
  },
  {
    "src": "/gallery/team-photo.jpg",
    "alt": "A group photo during a project visit",
    "width": 720,
    "height": 1280
  },
  {
    "src": "/gallery/cp-collaboration.jpg",
    "alt": "CP campaign artwork featuring two models in graphic T-shirts",
    "width": 1024,
    "height": 1280
  },
  {
    "src": "/gallery/cp-personality.jpg",
    "alt": "CP campaign artwork featuring Jade in a graphic T-shirt",
    "width": 1024,
    "height": 1280
  },
  {
    "src": "/gallery/hiking.jpeg",
    "alt": "Jade on a wooden bridge surrounded by greenery",
    "width": 720,
    "height": 1280
  }
];

export function galleryStrip(preview = false) {
  const photos = galleryPhotos.map(photo => `<figure><img src="${photo.src}" alt="${preview ? '' : escape(photo.alt)}" width="${photo.width}" height="${photo.height}" loading="lazy" decoding="async"></figure>`).join('');
  return `<div id="${preview ? 'gallery-preview' : 'gallery-photos'}" class="gallery-viewport${preview ? ' gallery-preview' : ''}" ${preview ? 'aria-hidden="true"' : 'tabindex="0" role="region" aria-label="Gallery photographs — scroll horizontally to explore"'}><div class="gallery-track"><div class="gallery-group">${photos}</div><div class="gallery-group" aria-hidden="true" inert>${photos}</div></div></div>`;
}
