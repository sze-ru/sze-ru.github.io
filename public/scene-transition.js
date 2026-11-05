const slot = document.querySelector('.scene-map-slot');
const frame = slot?.querySelector('.venue-map-frame');
const map = frame?.querySelector('#venue-map');
const gallery = document.querySelector('.experience-gallery');
const card = document.querySelector('#experience-hospitality .experience-card');
const image = card?.querySelector('.project-visual');
const motion = matchMedia('(prefers-reduced-motion: reduce)');

if (slot && frame && card) {
  const transfer = document.createElement('div');
  transfer.className = 'scene-transfer';
  transfer.inert = true;
  transfer.setAttribute('aria-hidden', 'true');
  transfer.hidden = true;
  const media = document.createElement('div');
  media.className = 'scene-transfer-media';
  const caption = card.querySelector('.gallery-caption').cloneNode(true);
  transfer.append(media, caption);
  document.body.append(transfer);
  const stage = gallery.closest('.gallery-scroll-stage');
  let location = 'source';
  let scheduled = false;
  let sourceWidth = 0;
  let sourceHeight = 0;
  let completeOnRequest = false;
  const heading = document.querySelector('#experiences .section-heading');
  const sourceHeading = document.querySelector('.scene-chapter');
  const chapter = document.createElement('div');
  chapter.className = 'scene-chapter-overlay';
  chapter.inert = true;
  chapter.setAttribute('aria-hidden', 'true');
  chapter.hidden = true;
  const incoming = heading.cloneNode(true);
  incoming.removeAttribute('data-reveal');
  incoming.classList.remove('reveal-ready', 'visible');
  const incomingTitle = incoming.querySelector('h2');
  chapter.append(incoming);
  document.body.append(chapter);
  let targetCardTop = 280;
  const controls = gallery.querySelector('.gallery-controls');
  const atlas = slot.closest('.venue-atlas');
  const clamp = value => Math.max(0, Math.min(1, value));
  const mix = (from, to, progress) => from + (to - from) * progress;

  function restore() {
    if (location !== 'source') {
      slot.append(frame);
      frame.removeAttribute('style');
      frame.classList.remove('map-thumbnail');
      frame.inert = false;
      location = 'source';
      map.dispatchEvent(new Event('scene-map-enter'));
    }
    transfer.hidden = true;
    card.style.visibility = '';
  }

  function update() {
    scheduled = false;
    if (map.dataset.state === 'error') {
      restore();
      slot.style.height = '';
      gallery.classList.remove('scene-enabled');
      atlas.classList.remove('scene-departed');
      heading.style.opacity = controls.style.opacity = '';
      sourceHeading.style.opacity = '';
      chapter.hidden = true;
      stage.classList.remove('is-held');
      stage.style.height = '';
      return;
    }
    const source = slot.getBoundingClientRect();
    const height = map.offsetHeight;
    if (!source.width || !height) return;
    slot.style.height = `${height}px`;
    gallery.classList.add('scene-enabled');
    if (sourceWidth !== source.width || sourceHeight !== height) {
      sourceWidth = source.width;
      sourceHeight = height;
      gallery.style.setProperty('--experience-ratio', `${source.width} / ${height}`);
      requestAnimationFrame(() => map.dispatchEvent(new Event('scene-map-resize')));
    }
    const controlsHeight = card.getBoundingClientRect().top - gallery.getBoundingClientRect().top;
    const chapterTop = Math.max(24, Math.min(100, innerHeight * 0.1));
    const sourceChapter = sourceHeading.getBoundingClientRect();
    const chapterHeight = Math.max(sourceHeading.offsetHeight, heading.offsetHeight);
    targetCardTop = Math.max(280, chapterTop + chapterHeight + controlsHeight + 24);
    const stickyTop = targetCardTop - controlsHeight;
    const holdDistance = motion.matches ? 0 : Math.min(720, Math.max(420, innerHeight * 0.75));
    stage.style.setProperty('--gallery-sticky-top', `${stickyTop}px`);
    stage.classList.toggle('is-held', !motion.matches);
    stage.style.height = holdDistance ? `${gallery.offsetHeight + holdDistance}px` : '';
    const target = card.getBoundingClientRect();
    const targetLeft = gallery.querySelector('.gallery-viewport').getBoundingClientRect().left;
    // Both endpoints come from normal document flow, so reverse scrolling and resizing agree.
    const start = scrollY + source.top - 80;
    const end = scrollY + stage.getBoundingClientRect().top - stickyTop;
    const rawProgress = scrollY <= start + 1 ? 0 : scrollY >= end - 1 ? 1
      : clamp((scrollY - start) / Math.max(1, end - start));
    if (rawProgress === 0) {
      completeOnRequest = false;
      if (gallery.dataset.activeIndex !== '0') gallery.dispatchEvent(new Event('galleryreset'));
    }
    const progress = completeOnRequest || (motion.matches && source.bottom <= 0) ? 1 : rawProgress;
    atlas.classList.toggle('scene-departed', progress > 0 && !motion.matches);
    const chapterOpacity = motion.matches || completeOnRequest ? 1 : clamp((progress - 0.82) / 0.18);
    controls.style.opacity = chapterOpacity;
    const release = Math.max(0, scrollY - end - holdDistance);
    chapter.hidden = motion.matches || progress <= 0 || release > chapterTop + chapterHeight;
    sourceHeading.style.opacity = !motion.matches && progress > 0 ? '0' : '';
    heading.style.opacity = chapter.hidden ? '' : '0';
    chapter.style.opacity = String(chapterOpacity);
    if (!chapter.hidden) {
      Object.assign(chapter.style, {
        top: `${chapterTop - release}px`, left: `${sourceChapter.left}px`, width: `${sourceChapter.width}px`, height: `${chapterHeight}px`,
      });
      // Preserve the source heading's responsive typography outside its section.
      incomingTitle.style.fontSize = getComputedStyle(heading.querySelector('h2')).fontSize;
    }
    if (progress <= 0 || (motion.matches && progress < 1)) {
      restore();
      return;
    }
    const eased = progress * progress * (3 - 2 * progress);
    const width = mix(source.width, target.width, eased);
    const shellHeight = mix(height, target.height, eased);
    const targetImageHeight = image.getBoundingClientRect().height;
    const mediaHeight = mix(height, targetImageHeight, eased);
    frame.inert = true;
    frame.classList.add('map-thumbnail');
    frame.style.width = `${source.width}px`;
    frame.style.height = `${height}px`;
    frame.style.setProperty('--map-chrome-opacity', String(1 - clamp(progress * 3)));
    if (progress >= 1) {
      if (location !== 'card') { image.append(frame); location = 'card'; }
      const scale = target.width / source.width;
      frame.style.transform = `translateY(${(targetImageHeight - height * scale) / 2}px) scale(${scale})`;
      transfer.hidden = true;
      card.style.visibility = '';
    } else {
      if (location !== 'transfer') { media.append(frame); location = 'transfer'; }
      const scale = width / source.width;
      frame.style.transform = `translateY(${(mediaHeight - height * scale) / 2}px) scale(${scale})`;
      transfer.hidden = false;
      card.style.visibility = 'hidden';
      Object.assign(transfer.style, {
        left: `${mix(source.left, targetLeft, eased)}px`,
        top: `${mix(80, targetCardTop, eased)}px`,
        width: `${width}px`, height: `${shellHeight}px`,
        borderColor: `rgba(120, 115, 107, ${eased * 0.65})`,
        boxShadow: `0 ${eased * 28}px ${eased * 80}px rgba(0, 0, 0, ${eased * 0.5})`,
      });
      media.style.height = `${mediaHeight}px`;
      caption.style.height = `${shellHeight - mediaHeight}px`;
      caption.style.opacity = String(clamp((progress - 0.45) / 0.45));
    }
  }
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(update);
  };
  const settleForInteraction = () => {
    completeOnRequest = true;
    const rect = card.getBoundingClientRect();
    // Keyboard focus can arrive before a smooth anchor scroll has reached the gallery.
    if (rect.top >= innerHeight || rect.bottom <= 0) {
      scrollTo({ top: scrollY + rect.top - targetCardTop, behavior: 'instant' });
    }
    schedule();
  };
  gallery.addEventListener('galleryadvance', settleForInteraction);
  gallery.addEventListener('focusin', settleForInteraction);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  motion.addEventListener('change', schedule);
  const resizeObserver = new ResizeObserver(schedule);
  resizeObserver.observe(slot);
  resizeObserver.observe(gallery);
  new MutationObserver(schedule).observe(map, { attributes: true, attributeFilter: ['data-state'] });
  document.fonts.ready.then(schedule);
  if (gallery.contains(document.activeElement)) settleForInteraction();
  update();
}
