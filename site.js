document.documentElement.classList.add("js-enabled");

const navigationHeader = document.querySelector(".home .header");

document.querySelectorAll('[data-experience-directory]').forEach(directory => {
  const filter = directory.querySelector('select');
  const entries = [...directory.querySelectorAll('[data-experience-roles]')];
  const update = () => {
    let visible = 0;
    entries.forEach(entry => {
      entry.hidden = !!filter.value && !JSON.parse(entry.dataset.experienceRoles).includes(filter.value);
      if (!entry.hidden) visible++;
    });
    directory.querySelectorAll('[data-experience-group]').forEach(group => {
      group.hidden = !group.querySelector('.experience-entry:not([hidden])');
    });
    directory.querySelector('.experience-count').textContent = `${visible} ${visible === 1 ? 'entry' : 'entries'}`;
  };
  directory.querySelector('.experience-filter').hidden = false;
  filter.addEventListener('change', update);
  update();
});

const heroContacts = document.querySelector(".hero-bottom .social-links");
const closingContacts = document.querySelector("#connect .contact-links");
if (heroContacts && closingContacts) {
  // Keep the links outside the hero's clipping and stacking context.
  const floatingContacts = document.createElement("div");
  floatingContacts.className = "floating-contacts wrap";
  floatingContacts.append(heroContacts);
  document.body.append(floatingContacts);
  let contactFramePending = false;
  const updateContacts = () => {
    contactFramePending = false;
    const handedOff = closingContacts.getBoundingClientRect().top < innerHeight - 80;
    if (handedOff && floatingContacts.contains(document.activeElement)) {
      const destination = [...closingContacts.querySelectorAll("a")]
        .find(link => link.href === document.activeElement.href);
      destination?.focus({ preventScroll: true });
    }
    floatingContacts.classList.toggle("is-hidden", handedOff);
    floatingContacts.inert = handedOff;
    floatingContacts.setAttribute("aria-hidden", String(handedOff));
  };
  const scheduleContacts = () => {
    if (contactFramePending) return;
    contactFramePending = true;
    requestAnimationFrame(updateContacts);
  };
  window.addEventListener("scroll", scheduleContacts, { passive: true });
  window.addEventListener("resize", scheduleContacts);
  window.addEventListener("load", scheduleContacts);
  updateContacts();
}

function openCategory(modal, target) {
  modal.showModal();
  modal.scrollTop = 0;
  modal.querySelector("#venue-map")?.dispatchEvent(new Event("scene-map-resize"));
  document.documentElement.classList.add("modal-open");
  if (target) {
    const heading = target.querySelector('h3, h4') || target;
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
    target.scrollIntoView({ block: 'start', behavior: 'instant' });
  }
}

document.querySelectorAll("[data-dialog]").forEach(opener => {
  const modal = document.getElementById(opener.dataset.dialog);
  if (!modal) return;
  opener.setAttribute('aria-haspopup', 'dialog');
  opener.addEventListener("click", event => {
    event.preventDefault();
    openCategory(modal, document.getElementById(opener.dataset.dialogTarget));
  });
});

document.querySelectorAll('.category-modal').forEach(modal => {
    modal.querySelector(".modal-close").addEventListener("click", () => modal.close());
    let backdropPressed = false;
    const outside = event => {
      const rect = modal.getBoundingClientRect();
      return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    };
    modal.addEventListener("pointerdown", event => { backdropPressed = event.target === modal && outside(event); });
    modal.addEventListener("click", event => {
      if (backdropPressed && event.target === modal && outside(event)) modal.close();
      backdropPressed = false;
    });
    modal.addEventListener("close", () => {
      modal.querySelectorAll("video").forEach(video => video.pause());
      modal.querySelectorAll("iframe").forEach(frame => { frame.src = frame.src; });
      modal.querySelectorAll("details").forEach(detail => { detail.open = false; });
      if (!document.querySelector("dialog[open]")) document.documentElement.classList.remove("modal-open");
    });
    modal.querySelectorAll('a[href^="/#"]').forEach(link => link.addEventListener("click", () => modal.close()));
  });
// Fragment links also work when opened directly or in another tab.
const openLinkedSection = () => {
  const target = document.getElementById(location.hash.slice(1));
  const modal = target?.closest('.category-modal');
  if (modal && !modal.open) openCategory(modal, target === modal ? null : target);
};
window.addEventListener('hashchange', openLinkedSection);
openLinkedSection();

const venueMap = document.querySelector("#venue-map");
if (venueMap) {
  const loadMap = () => import("/venue-map.js").catch(() => {
    document.querySelector(".map-status").textContent = "Map unavailable. Explore the venue links below.";
    venueMap.dataset.state = "error";
  });
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      loadMap();
    }, { rootMargin: "150px" });
    observer.observe(venueMap);
  } else {
    loadMap();
  }
}

const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
const photoLayers = [...document.querySelectorAll("[data-photo-layers]")];
if (photoLayers.length) {
  let photoFramePending = false;
  const updatePhotoLayers = () => {
    photoFramePending = false;
    for (const figure of photoLayers) {
      const { top, height } = figure.getBoundingClientRect();
      const progress = Math.max(-1, Math.min(1, (innerHeight / 2 - top - height / 2) / (innerHeight / 2 + height / 2)));
      figure.style.setProperty("--subject-y", `${motionPreference.matches ? 0 : progress * Math.min(12, height * 0.02)}px`);
    }
  };
  const schedulePhotoLayers = () => {
    if (photoFramePending) return;
    photoFramePending = true;
    requestAnimationFrame(updatePhotoLayers);
  };
  window.addEventListener("scroll", schedulePhotoLayers, { passive: true });
  window.addEventListener("resize", schedulePhotoLayers);
  motionPreference.addEventListener("change", schedulePhotoLayers);
  updatePhotoLayers();
}
const heroVideo = document.querySelector(".hero-film video");
if (heroVideo) {
  const heroVideos = [...document.querySelectorAll(".hero-film video")];
  let heroClipIndex = 0;
  let selectingClip = false;
  let turnElapsed = 0;
  let lastMediaTime = 0;
  const specialtyLabels = [...document.querySelectorAll(".hero-tagline [data-specialty]")];
  const updateHeroPlayback = () => {
    heroVideos.forEach((video, index) => {
      if (motionPreference.matches || document.hidden || index !== heroClipIndex) {
        video.pause();
      } else {
        video.muted = true;
        video.play().catch(() => {}); // Keep the poster if autoplay is unavailable.
      }
    });
  };
  async function selectHeroVideo(index) {
    if (selectingClip || motionPreference.matches || document.hidden) return;
    selectingClip = true;
    const incoming = heroVideos[index];
    incoming.muted = true;
    try {
      // Keep the outgoing frame until the incoming clip is actually playing.
      await incoming.play();
      if (motionPreference.matches || document.hidden) {
        incoming.pause();
        return;
      }
      heroClipIndex = index;
      turnElapsed = 0;
      lastMediaTime = incoming.currentTime;
      heroVideos.forEach((video, i) => {
        video.classList.toggle("is-active", i === index);
        if (i !== index) video.pause();
      });
      const focusIndex = specialtyLabels.findIndex(label => label.dataset.specialty === incoming.dataset.specialty);
      specialtyLabels.forEach((label, i) => {
        const position = (i - focusIndex + specialtyLabels.length) % specialtyLabels.length;
        label.classList.toggle("is-active", position === 0);
        label.dataset.position = position === 0 ? "active" : position === 1 ? "next" : "previous";
      });
    } catch {
      // Continue the current reel if the next one is temporarily unavailable.
      turnElapsed = 0;
      updateHeroPlayback();
    } finally {
      selectingClip = false;
    }
  }
  heroVideos.forEach((video, index) => {
    const trackProgress = () => {
      if (index !== heroClipIndex || selectingClip || video.paused) return;
      const current = video.currentTime;
      // A native loop wraps the safe reel, while the ten-second turn continues.
      turnElapsed += current >= lastMediaTime
        ? current - lastMediaTime
        : video.duration - lastMediaTime + current;
      lastMediaTime = current;
      if (turnElapsed >= 10) {
        video.pause();
        selectHeroVideo((index + 1) % heroVideos.length);
      }
    };
    if ("requestVideoFrameCallback" in video) {
      const onFrame = () => {
        trackProgress();
        video.requestVideoFrameCallback(onFrame);
      };
      video.requestVideoFrameCallback(onFrame);
    } else {
      video.addEventListener("timeupdate", trackProgress);
    }
  });
  motionPreference.addEventListener("change", updateHeroPlayback);
  document.addEventListener("visibilitychange", updateHeroPlayback);
  updateHeroPlayback();

  const film = heroVideo.closest(".hero-film");
  const hero = heroVideo.closest(".hero");
  let fadePending = false;
  const updateHeroFade = () => {
    const { top, height } = hero.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, -top / (height * 0.85)));
    film.style.opacity = motionPreference.matches ? "1" : String(1 - progress);
    navigationHeader?.style.setProperty("--header-opacity", progress === 1 ? "1" : "0");
    fadePending = false;
  };
  const scheduleHeroFade = () => {
    if (fadePending) return;
    fadePending = true;
    requestAnimationFrame(updateHeroFade);
  };
  window.addEventListener("scroll", scheduleHeroFade, { passive: true });
  window.addEventListener("resize", scheduleHeroFade);
  window.addEventListener("load", scheduleHeroFade);
  window.addEventListener("pageshow", scheduleHeroFade);
  motionPreference.addEventListener("change", scheduleHeroFade);
  updateHeroFade();
}

if (!motionPreference.matches && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.08 },
  );
  document.querySelectorAll("[data-reveal]").forEach((element) => {
    element.classList.add("reveal-ready");
    observer.observe(element);
  });
  motionPreference.addEventListener("change", () => {
    if (motionPreference.matches) {
      document
        .querySelectorAll(".reveal-ready")
        .forEach((element) => element.classList.add("visible"));
      observer.disconnect();
    }
  });
}
