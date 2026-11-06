import { escape } from "./layout.mjs";

// Unique supplied photographs and campaign artwork; excludes duplicate exports and technical assets.
const originalPhotos = [
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

// Groups are shared by project evidence, personal interests and both card previews.
export const photoGroups = {
  "urbex": {
    "title": "Urban exploration",
    "caption": "",
    "photos": [
      {
        "src": "/gallery/urbex-1.webp",
        "width": 720,
        "height": 1280,
        "alt": "Angular concrete walkways viewed through a stairwell"
      },
      {
        "src": "/gallery/urbex-2.webp",
        "width": 720,
        "height": 1280,
        "alt": "Red lanterns above a narrow, cluttered passage"
      },
      {
        "src": "/gallery/urbex-3.webp",
        "width": 720,
        "height": 1280,
        "alt": "An empty concrete corridor opening onto a stairwell"
      },
      {
        "src": "/gallery/urbex-4.webp",
        "width": 720,
        "height": 1280,
        "alt": "Light entering an empty industrial floor"
      },
      {
        "src": "/gallery/urbex-5.webp",
        "width": 960,
        "height": 1280,
        "alt": "Jade standing inside a dim industrial space"
      },
      {
        "src": "/gallery/urbex-6.webp",
        "width": 960,
        "height": 1280,
        "alt": "A narrow lane lined with stalls and hanging lights"
      }
    ]
  },
  "travelling": {
    "title": "Travelling",
    "caption": "",
    "photos": [
      {
        "src": "/gallery/travelling-1.webp",
        "width": 1280,
        "height": 960,
        "alt": "Skyscrapers rising into a cloudy night sky"
      },
      {
        "src": "/gallery/travelling-2.webp",
        "width": 1280,
        "height": 960,
        "alt": "Jade looking out across a city skyline at dusk"
      },
      {
        "src": "/gallery/travelling-3.webp",
        "width": 960,
        "height": 1280,
        "alt": "Jade photographing a city skyline at night"
      }
    ]
  },
  "stocktake": {
    "title": "D’Studio stocktake",
    "caption": "",
    "photos": [
      {
        "src": "/gallery/stocktake-1.webp",
        "width": 720,
        "height": 1280,
        "alt": "Team members sorting stock among boxes at D’Studio"
      },
      {
        "src": "/gallery/stocktake-2.webp",
        "width": 590,
        "height": 1280,
        "alt": "Jade and a teammate counting and recording clothing stock"
      }
    ]
  },
  "melissa": {
    "title": "Melissa Shoes",
    "caption": "",
    "photos": [
      {
        "src": "/gallery/melissa-1.webp",
        "width": 1280,
        "height": 960,
        "alt": "The team gathered around shoes and boxes during the Melissa project"
      }
    ]
  },
  "dbm": {
    "title": "DBM content production",
    "caption": "",
    "photos": [
      {
        "src": "/gallery/dbm-1.webp",
        "width": 720,
        "height": 1280,
        "alt": "A studio filming setup with lights, a backdrop and a camera"
      },
      {
        "src": "/gallery/dbm-2.webp",
        "width": 1280,
        "height": 960,
        "alt": "A recording session outside the School of Business Management"
      },
      {
        "src": "/gallery/dbm-3.webp",
        "width": 1280,
        "height": 960,
        "alt": "Team members filming a scene outdoors on campus"
      }
    ]
  },
  "refresh": {
    "title": "Refresh consumer testing",
    "caption": "",
    "photos": [
      {
        "src": "/gallery/refresh-1.webp",
        "width": 1280,
        "height": 720,
        "alt": "Participants seated around tables during a Refresh session"
      },
      {
        "src": "/gallery/refresh-2.webp",
        "width": 720,
        "height": 1280,
        "alt": "A presentation during the Refresh brand experience"
      }
    ]
  },
  "team": {
    "title": "Team moments",
    "caption": "",
    "photos": [
      {
        "src": "/gallery/team-1.webp",
        "width": 719,
        "height": 1280,
        "alt": "Three teammates standing together in a classroom"
      },
      {
        "src": "/gallery/team-2.webp",
        "width": 1280,
        "height": 960,
        "alt": "The team gathered around a restaurant table"
      }
    ]
  },
  "birthday": {
    "title": "A friend’s birthday",
    "caption": "",
    "photos": [
      {
        "src": "/gallery/birthday-1.webp",
        "width": 1280,
        "height": 853,
        "alt": "Friends gathered around a birthday cake"
      }
    ]
  },
  "moments": {
    "title": "Out and about",
    "caption": "",
    "photos": [
      {
        "src": "/gallery/moments-1.webp",
        "width": 1280,
        "height": 960,
        "alt": "Jade beside a blue vehicle at night"
      },
      {
        "src": "/gallery/moments-2.webp",
        "width": 720,
        "height": 1280,
        "alt": "Jade and a friend leaning over an arcade game"
      },
      {
        "src": "/gallery/moments-3.webp",
        "width": 1017,
        "height": 1280,
        "alt": "A crowd celebrating beneath falling confetti"
      }
    ]
  }
};

export const interestPhotos = [...photoGroups.urbex.photos, ...photoGroups.travelling.photos];
export const galleryPhotos = [...originalPhotos, ...Object.values(photoGroups).flatMap(group =>
  group.photos.map(photo => ({ ...photo, caption: group.caption || group.title }))
)];

function photoImage(photo, decorative = false) {
  return `<img src="${escape(photo.src)}" alt="${decorative ? '' : escape(photo.alt)}" width="${photo.width}" height="${photo.height}" loading="lazy" decoding="async">`;
}

function caption(text) {
  return text.split('\n').filter(Boolean).map(paragraph => `<p>${escape(paragraph)}</p>`).join('');
}

export function photoGrid(group) {
  return `<figure class="photo-story"><div class="photo-grid">${group.photos.map(photo => photoImage(photo)).join('')}</div><figcaption>${caption(group.caption || group.title)}</figcaption></figure>`;
}

export function galleryStrip(preview = false, items = galleryPhotos, id = preview ? 'gallery-preview' : 'gallery-photos') {
  const photos = items.map(photo => `<figure>${photoImage(photo, preview)}${preview ? '' : `<figcaption>${caption(photo.caption || photo.alt)}</figcaption>`}</figure>`).join('');
  return `<div id="${id}" class="gallery-viewport${preview ? ' gallery-preview' : ''}" ${preview ? 'aria-hidden="true"' : 'tabindex="0" role="region" aria-label="Gallery photographs — scroll horizontally to explore"'}><div class="gallery-track" style="--gallery-duration:${items.length * 12}s"><div class="gallery-group">${photos}</div><div class="gallery-group" aria-hidden="true" inert>${photos}</div></div></div>`;
}
