import { projects } from "../content.mjs";
import { eyebrow, projectCard, invitation, arrow } from "../layout.mjs";

export default {
  title: "Hospitality, people & creative ideas",
  path: "/",
  className: "home",
  description:
    "Jade Ong — connecting people, hospitality and creative marketing in Singapore. Explore my experience, projects and ideas in action.",
  body: `<section class="hero wrap">
    <div class="hero-topline"><p class="micro"><span class="status-dot"></span>Based in Singapore · Open to opportunities</p></div>
    <div class="hero-composition"><div class="hero-copy"><h1>JADE<br><span>ONG<span class="red-period">.</span></span></h1><p class="hero-tagline">People first.<br><em>Ideas into action.</em></p><div class="hero-description"><p>I bring guest-facing hospitality experience and practical skills in content production, talent coordination and live events.</p><a class="button button-light" href="/work/">Explore my work ${arrow}</a></div></div>
    <figure class="hero-photo"><img src="/assets/jade-portrait.webp" alt="Jade Ong in a black evening outfit, standing beside a railing with warm lights behind her" width="505" height="758" fetchpriority="high"><figcaption>Jade Ong · Singapore</figcaption></figure>
    </div><div class="hero-bottom"><span class="micro">VIP hospitality &nbsp; / &nbsp; Events &nbsp; / &nbsp; Creative marketing</span><a class="micro" href="#introduction">Scroll to discover <span aria-hidden="true">↓</span></a></div>
  </section>
  <div class="ticker"><div class="ticker-window" aria-hidden="true"><div class="ticker-track">${Array(4).fill("<span>CONNECT THROUGH PEOPLE</span><i>✳</i><span>ADAPT & EXPLORE</span><i>✳</i><span>GROW WITH PURPOSE</span><i>✳</i>").join("")}</div></div><button class="ticker-toggle" aria-label="Pause moving text" aria-pressed="false"><span aria-hidden="true">Ⅱ</span></button></div>
  <section id="introduction" class="intro section wrap" data-reveal>${eyebrow("01", "A little about me")}<div><h2>Different worlds.<br>The same <em>people-first</em> approach.</h2><div class="intro-bottom"><p>I’m Jade, a Business Management student with experience across VIP hospitality, nightlife operations and creative marketing. I’m at my best when I’m connecting with people, adapting to something new and turning plans into action.</p><a class="text-link" href="/about/">Get to know me ${arrow}</a></div></div></section>
  <section class="selected section wrap"><div class="section-heading" data-reveal><div>${eyebrow("02", "Selected work")}<h2>Ideas, <em>in action.</em></h2></div><a class="text-link" href="/work/">View all work ${arrow}</a></div><div class="project-grid">${projects.map(projectCard).join("")}</div></section>
  <section class="approach section wrap" data-reveal>${eyebrow("03", "What I bring")}<div class="approach-grid"><h2>Good with people.<br><em>Ready to get stuck in.</em></h2><div class="trait-list"><div><span>01</span><h3>Connection</h3><p>Listening first. Building genuine relationships.</p></div><div><span>02</span><h3>Adaptability</h3><p>New environments. Different perspectives. An open mind.</p></div><div><span>03</span><h3>Follow-through</h3><p>Taking initiative and seeing ideas through to execution.</p></div></div></div></section>${invitation()}`,
};
