import { galleryPhotos, galleryStrip, photoGroups, photoGrid, interestPhotos } from "../gallery.mjs";
import { projects, aboutCopy } from "../content.mjs";
import { tepSection } from "../tep.mjs";
import { experienceCards } from "../projects.mjs";
import { socialLinks } from "../layout.mjs";

function layeredPhoto(name, alt, width, height) {
  return `<figure class="layered-photo photo-${name}" data-photo-layers style="--photo-ratio:${width}/${height}"><img class="photo-background" src="/assets/jade-${name}-background.webp" alt="" width="${width}" height="${height}" loading="lazy" decoding="async"><img class="photo-subject" src="/assets/jade-${name}-subject.webp" alt="${alt}" width="${width}" height="${height}" loading="lazy" decoding="async"></figure>`;
}

export default {
  title: "Hospitality, people & creative ideas",
  path: "/",
  className: "home",
  description:
    "Jade Ong — connecting people, hospitality and creative marketing in Singapore. Explore my experience, projects and ideas in action.",
  body: `<section id="home" class="hero">
    <div class="hero-film" aria-hidden="true">
      <video class="is-active" data-specialty="video-production" src="/media/jade-production-reel-v2.mp4" muted loop playsinline preload="none" poster="/media/jade-production-reel-v2-poster.jpg" tabindex="-1" disablepictureinpicture></video>
      <video data-specialty="marketing" src="/media/watersource-marketing-reel-v2.mp4" muted loop playsinline preload="none" poster="/media/watersource-marketing-reel-v2-poster.jpg" tabindex="-1" disablepictureinpicture></video>
    </div>
    <div class="hero-topline wrap"><p class="micro"><span class="status-dot"></span>Based in Singapore · Open to opportunities</p></div>
    <div class="hero-composition wrap">

    <div class="hero-copy"><h1><small class="section-number">01</small>JADE<br><span>ONG</span></h1><p class="hero-tagline"><span data-specialty="hospitality" data-position="previous">Hospitality</span><span data-specialty="video-production" data-position="active" class="is-active">Video Production</span><span data-specialty="marketing" data-position="next">Marketing</span></p></div>

    </div><div class="hero-bottom wrap"><a class="micro" href="#introduction">Scroll to discover <span aria-hidden="true">↓</span></a>${socialLinks(true)}</div>
  </section>
  <section id="introduction" class="intro section wrap"><div class="intro-layout"><figure class="intro-portrait"><img src="/assets/jade-night-original.jpg" alt="Jade beside the waterfront lights at night" width="505" height="758" loading="lazy" decoding="async"></figure><div class="intro-copy"><h2><small class="section-number">02</small>About <em>Me</em></h2><div class="intro-bottom">${aboutCopy}</div></div></div></section>
  <section id="experiences" class="selected section wrap"><div class="section-heading"><div><h2><small class="section-number">03</small>Experience</h2><div class="scene-skills"><h3 class="micro">Skills</h3><div class="interest-tags" aria-label="Skills"><span>Connection</span><span>Adaptability</span><span>Initiative</span></div></div></div></div>${experienceCards(projects, tepSection(true))}</section>
  <div class="personal-grid section wrap">
    <section id="personal-interests"><a class="category-card interests-opener" href="#dialog-interests" data-dialog="dialog-interests" aria-haspopup="dialog">${galleryStrip(true, interestPhotos, 'interests-preview')}<div class="category-caption"><span class="micro">04</span><h2>Personal <em>Interests</em></h2><span>Figure skating, urbex &amp; travelling ↗</span></div></a></section>
    <section id="gallery"><a class="category-card gallery-opener" href="#dialog-gallery" data-dialog="dialog-gallery" aria-haspopup="dialog">${galleryStrip(true)}<div class="category-caption"><span class="micro">05</span><h2>Gallery</h2><span>View all ${galleryPhotos.length} images ↗</span></div></a></section>
  </div>
  <dialog class="category-modal personal-modal" id="dialog-interests" aria-labelledby="interests-title"><button class="modal-close" type="button" aria-label="Close personal interests" autofocus>×</button><h2 id="interests-title">Personal Interests</h2><div class="interest-grid"><article class="interest-card skating"><div class="interest-art" aria-hidden="true"><svg viewBox="0 0 600 320" fill="none"><ellipse cx="300" cy="170" rx="210" ry="70" transform="rotate(-20 300 170)"/><ellipse cx="300" cy="170" rx="150" ry="45" transform="rotate(25 300 170)"/><path d="M120 260C220 280 430 180 470 70"/></svg><span>01 / On the ice</span></div><div class="interest-copy"><h3>Figure skating</h3><p>Movement, balance and expression.</p></div></article><article class="interest-card urbex"><div class="interest-copy"><h3>Urbex</h3><p>Urban exploration. A different perspective on familiar places.</p></div>${photoGrid(photoGroups.urbex)}</article><article class="interest-card travelling"><div class="interest-copy"><h3>Travelling</h3><p>New places. A different view.</p></div>${photoGrid(photoGroups.travelling)}<figure class="travel-film"><video controls playsinline preload="none" width="720" height="1280" poster="/media/travelling-coast-poster.jpg" aria-label="Waves rolling onto a rocky coastline"><source src="/media/travelling-coast.mp4" type="video/mp4">Your browser does not support this video. <a href="/media/travelling-coast.mp4">Watch the coastal travel clip</a>.</video><figcaption>A moment by the coast.</figcaption></figure></article></div></dialog>
  <dialog class="category-modal personal-modal" id="dialog-gallery" aria-labelledby="gallery-title"><button class="modal-close" type="button" aria-label="Close gallery" autofocus>×</button><h2 id="gallery-title">Gallery</h2>${galleryStrip()}</dialog>
  <section id="connect" class="invitation invitation-portrait wrap" data-reveal><div class="invitation-copy"><h2 class="invitation-link"><small class="section-number">06 / Contact</small>Don’t Be A Stranger—<br><em>Say Hello.</em></h2><div class="contact-links">${socialLinks(true)}</div></div><a class="resume-download" href="/downloads/Jade-Ong-Resume.pdf" download="Jade-Ong-Resume.pdf" aria-label="Download Jade’s résumé (PDF)">${layeredPhoto("waterfront", "Jade by the ship railing in daylight", 505, 759)}<span class="resume-label">Download résumé <span aria-hidden="true">↓</span><small>PDF</small></span></a></section>`,
};
