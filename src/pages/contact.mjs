import { profile } from "../content.mjs";
import { eyebrow, image, socialLinks } from "../layout.mjs";
export default {
  title: "Let’s connect",
  path: "/contact/",
  description:
    "Connect with Jade Ong for opportunities in hospitality, creative marketing, events and international work.",
  body: `<section class="contact-hero wrap"><div>${eyebrow("04", "Contact")}<h1>A conversation.<br>A connection.<br><em>A possibility.</em></h1><p class="page-lead">Have an opportunity in mind?<br>I’d love to see where it could lead.</p><div class="contact-links">${socialLinks(true)}${!profile.email && !profile.linkedin ? '<div class="contact-pending"><span class="status-dot"></span><div><h2>Contact details coming soon</h2><p>My direct email and LinkedIn links will be available here shortly.</p></div></div>' : ""}</div></div><figure class="contact-photo">${image("jade-evening.webp", "Jade standing by the Singapore waterfront in the evening")}<figcaption>Singapore based. Open to what’s next.</figcaption></figure></section>
  <section class="contact-interests wrap section"><p class="eyebrow">Let’s talk about</p><div class="contact-topics"><span>Hospitality & guest experience</span><span>Creative marketing & content</span><span>Events & brand collaborations</span><span>International opportunities</span></div><p class="relocation">Available for international relocation from February 2027.</p></section>`,
};
