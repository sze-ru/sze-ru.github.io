import { venues } from "./venues.mjs";
import { arrow, icons, escape } from "./layout.mjs";
import { experienceList } from "./experience-list.mjs";

export const scene = () => `<section id="occasions" class="events"><h3 class="map-section-title">Places &amp; experience</h3><div class="venue-atlas">
      <div class="map-filters" role="group" aria-label="Experience categories">
        <button type="button" data-category="all" aria-pressed="true" disabled>All experience</button>
        <button id="vip-hospitality" type="button" data-category="vip" aria-pressed="false" disabled>${icons.diamond}Long-term hospitality</button>
        <button type="button" data-category="event" aria-pressed="false" disabled>${icons.clock}Events &amp; Ad-hoc</button>
      </div>
      <div class="scene-map-slot"><div class="venue-map-frame">
        <div id="venue-map" class="venue-map" role="region" aria-label="Map of hospitality venues in central Singapore" data-state="idle" inert></div>
        <div class="map-heading"><span class="micro">Singapore / Hospitality & events</span><h3>The city.<br>After hours.</h3></div>
        <span class="map-north" aria-hidden="true">↑<small>N</small></span>
        <p class="map-status" role="status">Explore the places behind the experience.</p>
        <button class="map-reset" type="button" disabled>Show all venues <span aria-hidden="true">↗</span></button>
        <aside id="venue-panel" class="venue-panel" aria-labelledby="venue-panel-title" hidden>
          <button class="venue-panel-close" type="button" aria-label="Close place details">×</button>
          <div aria-live="polite" aria-atomic="true"><p class="micro venue-panel-meta"></p><h3 id="venue-panel-title"></h3><p class="venue-panel-role" hidden></p><p class="venue-panel-summary"></p><p class="venue-panel-address"></p></div>
          <a class="venue-panel-link text-link" target="_blank" rel="noopener noreferrer">View location ${arrow}</a>
        </aside>
      </div>
      </div>
      <script id="venue-data" type="application/json">${JSON.stringify(venues).replaceAll("<", "\\u003c")}</script>
      <template id="venue-icons"><span data-category="vip">${icons.diamond}</span><span data-category="event">${icons.clock}</span></template>
      <div class="venue-fallback experience-directory" data-experience-directory>
        <h3>Experience directory</h3><p>Explore each role, assignment and location.</p>
        <div class="experience-filter" hidden><label for="experience-role">Filter list by role</label><select id="experience-role"><option value="">All roles</option>${[...new Set(venues.flatMap(venue => venue.roles))].sort().map(role => `<option value="${escape(role)}">${escape(role)}</option>`).join('')}</select><p class="experience-count" role="status"></p></div>
        <section data-experience-group><h4>Long-term hospitality</h4>${experienceList(venues.filter(venue => venue.category === 'vip'))}</section>
        <section data-experience-group><h4>Events &amp; Ad-hoc</h4>${experienceList(venues.filter(venue => venue.category === 'event'))}</section>
      </div>
    </div>
  </section>`;
