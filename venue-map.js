const container = document.querySelector("#venue-map");
const status = document.querySelector(".map-status");
const reset = document.querySelector(".map-reset");
const panel = document.querySelector(".venue-panel");
const venues = JSON.parse(document.querySelector("#venue-data").textContent);
const iconTemplate = document.querySelector("#venue-icons").content;
const frame = document.querySelector(".venue-map-frame");
const filters = [...document.querySelectorAll(".map-filters button")];
const motion = matchMedia("(prefers-reduced-motion: reduce)");
let map;
let timeout;

function unavailable() {
  clearTimeout(timeout);
  map?.remove();
  map = null;
  container.dataset.state = "error";
  container.inert = true;
  status.hidden = false;
  status.textContent = "Map unavailable. Explore the venue links below.";
  reset.disabled = true;
  panel.hidden = true;
}

try {
  container.dataset.state = "loading";
  status.textContent = "Finding our places in the city…";
  const { Map, Marker, LngLatBounds, setWorkerUrl } = await import("/vendor/maplibre-gl.mjs");
  setWorkerUrl("/vendor/maplibre-gl-worker.mjs");
  map = new Map({
    container,
    style: "https://tiles.openfreemap.org/styles/dark",
    center: [103.852, 1.283],
    zoom: 12,
    minZoom: 11,
    maxZoom: 17,
    renderWorldCopies: false,
    maxBounds: [[103.6, 1.15], [104.1, 1.5]],
    scrollZoom: false,
    dragPan: false,
    dragRotate: false,
    touchZoomRotate: false,
    touchPitch: false,
    doubleClickZoom: false,
    keyboard: false,
    attributionControl: { compact: false },
    canvasContextAttributes: { antialias: true },
  });
  map.getCanvas().setAttribute("aria-label", "Central Singapore venue map");
  map.getCanvas().setAttribute("tabindex", "-1");
  const pins = [];
  const markers = [];
  const lines = [];
  const leaders = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  leaders.classList.add("venue-leaders");
  leaders.setAttribute("aria-hidden", "true");
  leaders.setAttribute("focusable", "false");
  let selected = null;
  let selectionTrigger;
  let previewTimer;
  let previewIndex = null;
  let previewDismissed = false;

  function hidePreview() {
    clearTimeout(previewTimer);
    previewIndex = null;
    if (selected === null) panel.hidden = true;
  }

  function populatePanel(index) {
    const { name, address, summary, year, category, role } = venues[index];
    const kind = category === "vip" ? "VIP hospitality" : category === "event" ? "Event" : "Selected venue";
    panel.dataset.category = category;
    panel.querySelector("h3").textContent = name;
    panel.querySelector(".venue-panel-meta").textContent = `${kind} / ${year}`;
    panel.querySelector(".venue-panel-summary").textContent = summary;
    panel.querySelector(".venue-panel-role").textContent = role || "";
    panel.querySelector(".venue-panel-role").hidden = !role;
    panel.querySelector(".venue-panel-address").textContent = address;
    panel.querySelector("a").href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${address} Singapore`)}`;
    panel.hidden = false;
  }

  function positionPreview(clientX, clientY) {
    const bounds = frame.getBoundingClientRect();
    const topLimit = Math.max(12, -bounds.top + 12);
    const bottomLimit = Math.min(bounds.height - 12, innerHeight - bounds.top - 12);
    panel.style.maxHeight = `${Math.max(0, bottomLimit - topLimit)}px`;
    const width = panel.offsetWidth, height = panel.offsetHeight;
    const x = clientX - bounds.left, y = clientY - bounds.top;
    // Flip at the edges, then clamp to both the map and the visible viewport.
    const left = x + width + 18 <= bounds.width - 12 ? x + 18 : x - width - 18;
    const top = y + height + 18 <= bottomLimit ? y + 18 : y - height - 18;
    panel.style.left = `${Math.max(12, Math.min(left, bounds.width - width - 12))}px`;
    panel.style.top = `${Math.max(topLimit, Math.min(top, bottomLimit - height))}px`;
  }

  function previewVenue(index, x, y) {
    if (selected !== null || previewDismissed) return;
    clearTimeout(previewTimer);
    previewIndex = index;
    selectionTrigger = pins[index];
    panel.classList.add("is-preview");
    populatePanel(index);
    positionPreview(x, y);
  }

  function schedulePreviewClose() {
    clearTimeout(previewTimer);
    previewTimer = setTimeout(() => {
      if (!panel.contains(document.activeElement) && !(document.activeElement === pins[previewIndex] && pins[previewIndex]?.matches(":focus-visible"))) hidePreview();
    }, 150);
  }
  const duration = () => motion.matches ? 0 : 1400;

  function drawLeader(index) {
    const point = map.project(markers[index].getLngLat());
    const { x, y } = markers[index].getOffset();
    const end = { x: point.x + x, y: point.y + y };
    const vip = venues[index].category === "vip";
    const points = `${point.x},${point.y} ${end.x},${end.y}`;
    lines[index].setAttribute("points", points);
    lines[index].style.display = pins[index].hidden || !vip ? "none" : "";
  }

  function offsetMarker(index, x = 0, y = venues[index].category === "vip" ? -(pins[index].offsetWidth + 4) : 0) {
    markers[index].setOffset([x, y]);
    drawLeader(index);
  }

  function arrangeOverview() {
    if (selected !== null) return;
    const placed = [];
    // Reserve the clocks' exact locations before spacing the remaining markers.
    markers.forEach((marker, index) => {
      if (pins[index].hidden || venues[index].category !== "event") return;
      offsetMarker(index, 0, 0);
      placed.push({ ...map.project(marker.getLngLat()), category: "event" });
    });
    markers.forEach((marker, index) => {
      if (pins[index].hidden || venues[index].category !== "venue") return;
      const point = map.project(marker.getLngLat());
      const offsets = [];
      for (let x = -16; x <= 16; x++) {
        for (let y = -16; y <= 16; y++) offsets.push([x * 16, y * 16]);
      }
      offsets.sort((a, b) => a[0] ** 2 + a[1] ** 2 - b[0] ** 2 - b[1] ** 2);
      const [dx, dy] = offsets.find(([x, y]) => {
        const px = point.x + x, py = point.y + y;
        return px >= 26 && px <= container.clientWidth - 26 && py >= 155 && py <= container.clientHeight - 85
          && placed.every(other => Math.abs(px - other.x) >= 32 || Math.abs(py - other.y) >= 32);
      }) || [0, 0];
      offsetMarker(index, dx, dy);
      placed.push({ x: point.x + dx, y: point.y + dy, category: venues[index].category });
    });
    // Lift crowded diamonds vertically, keeping each stem on its true map coordinate.
    const diamonds = markers.map((marker, index) => ({ index, point: map.project(marker.getLngLat()) }))
      .filter(({ index }) => !pins[index].hidden && venues[index].category === "vip")
      .sort((a, b) => a.point.y - b.point.y);
    diamonds.forEach(({ index, point }) => {
      const spacing = pins[index].offsetWidth + 4;
      let y = point.y - spacing;
      for (const other of [...placed].sort((a, b) => b.y - a.y)) {
        if (Math.abs(point.x - other.x) < spacing && Math.abs(y - other.y) < spacing) y = other.y - spacing;
      }
      offsetMarker(index, 0, y - point.y);
      placed.push({ x: point.x, y, category: "vip" });
    });
  }

  function showAll(animate = true) {
    selected = null;
    hidePreview();
    panel.classList.remove("is-preview");
    panel.style.left = panel.style.top = panel.style.maxHeight = "";
    pins.forEach(pin => pin.setAttribute("aria-pressed", "false"));
    markers.forEach((_, index) => offsetMarker(index));
    const bounds = new LngLatBounds();
    markers.forEach((marker, index) => { if (!pins[index].hidden) bounds.extend(marker.getLngLat()); });
    const side = container.clientWidth < 600 ? 48 : 135;
    const hasDiamonds = pins.some(pin => !pin.hidden && pin.dataset.category === "vip");
    const headroom = container.clientWidth < 900 && hasDiamonds ? (container.clientWidth < 600 ? 300 : 320) : 170;
    const top = headroom * Math.min(1, container.clientHeight / (container.clientWidth < 900 ? 640 : 560));
    map.fitBounds(bounds, {
      absolutePadding: true,
      padding: { top, bottom: 100, left: side, right: side },
      maxZoom: 14.6,
      duration: animate ? duration() : 0,
    });
  }

  function setCategory(value, animate = true) {
    filters.forEach(filter => filter.setAttribute("aria-pressed", String(filter.dataset.category === value)));
    venues.forEach((venue, index) => {
      const hidden = value !== "all" && venue.category !== value;
      pins[index].hidden = hidden;
    });
    showAll(animate);
  }

  function selectVenue(index, trigger) {
    selected = index;
    markers.forEach((_, i) => offsetMarker(i));
    selectionTrigger = trigger;
    clearTimeout(previewTimer);
    previewIndex = null;
    panel.classList.remove("is-preview");
    panel.style.left = panel.style.top = panel.style.maxHeight = "";
    pins.forEach((pin, i) => pin.setAttribute("aria-pressed", String(i === index)));
    populatePanel(index);
    focusSelected();
    container.scrollIntoView({ behavior: motion.matches ? "instant" : "smooth", block: "center" });
  }

  function focusSelected(animate = true) {
    const mobile = matchMedia("(max-width:760px)").matches;
    const center = venues[selected].coordinates;
    map.easeTo({ center, zoom: 15.5, padding: { top: mobile ? 60 : 100, bottom: mobile ? panel.offsetHeight + 50 : 0, left: 0, right: mobile ? 0 : panel.offsetWidth + 50 }, duration: animate ? duration() : 0 });
  }

  venues.forEach((venue, index) => {
    const coordinates = venue.coordinates;
    const pin = document.createElement("button");
    pin.type = "button";
    pin.className = `venue-pin venue-pin-${venue.id}`;
    pin.dataset.category = venue.category;
    pin.setAttribute("aria-label", `Explore ${venue.name}`);
    pin.setAttribute("aria-pressed", "false");
    pin.setAttribute("aria-controls", "venue-panel");
    const number = document.createElement("span");
    number.className = "pin-number";
    const icon = iconTemplate.querySelector(`[data-category="${venue.category}"] svg`);
    if (icon) number.append(icon.cloneNode(true));
    else number.textContent = String(index + 1).padStart(2, "0");
    pin.append(number);
    pin.addEventListener("click", () => selectVenue(index, pin));
    pin.addEventListener("pointerenter", event => {
      if (event.pointerType === "mouse") previewVenue(index, event.clientX, event.clientY);
    });
    pin.addEventListener("pointermove", event => {
      if (event.pointerType !== "mouse") return;
      previewDismissed = false;
      if (previewIndex === index && selected === null) positionPreview(event.clientX, event.clientY);
      else previewVenue(index, event.clientX, event.clientY);
    });
    pin.addEventListener("pointerleave", schedulePreviewClose);
    pin.addEventListener("focus", () => {
      if (!pin.matches(":focus-visible")) return;
      previewDismissed = false;
      const bounds = pin.getBoundingClientRect();
      previewVenue(index, bounds.right, bounds.top);
    });
    pin.addEventListener("blur", schedulePreviewClose);
    pins.push(pin);
    markers.push(new Marker({ element: pin, anchor: "center" }).setLngLat(coordinates).addTo(map));
    const line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    line.dataset.category = venue.category;
    line.style.display = "none";
    leaders.append(line);
    lines.push(line);
  });

  pins[0].parentElement.append(leaders);
  map.on("move", () => markers.forEach((_, index) => drawLeader(index)));
  map.on("moveend", arrangeOverview);
  const sourceSlot = document.querySelector(".scene-map-slot");
  let inView = false;
  let entrance;
  function enterMap() {
    if (!inView || container.dataset.state !== "ready" || frame.parentElement !== sourceSlot || motion.matches) return;
    entrance?.cancel();
    entrance = container.animate([
      { opacity: 0, transform: "scale(1.06)" },
      { opacity: 1, transform: "scale(1)" },
    ], { duration: 1200, easing: "cubic-bezier(.2,.7,.2,1)" });
    if (selected === null) {
      showAll(false);
      const zoom = map.getZoom();
      map.jumpTo({ zoom: Math.max(map.getMinZoom(), zoom - 0.75) });
      map.easeTo({ zoom, duration: 1200 });
    }
  }
  const entranceObserver = new IntersectionObserver(entries => {
    const visible = entries[0].isIntersecting && entries[0].intersectionRatio >= 0.35;
    if (visible && !inView) { inView = true; enterMap(); }
    else inView = visible;
  }, { threshold: 0.35 });
  entranceObserver.observe(sourceSlot);
  container.addEventListener("scene-map-enter", enterMap);
  container.addEventListener("scene-map-resize", () => map?.resize());
  timeout = setTimeout(unavailable, 15000);
  map.once("load", () => {
    clearTimeout(timeout);
    container.dataset.state = "ready";
    container.inert = false;
    status.hidden = true;
    filters.forEach(filter => { filter.disabled = false; });
    reset.disabled = false;
    setCategory("all", false);
    enterMap();
  });
  filters.forEach(filter => filter.addEventListener("click", () => setCategory(filter.dataset.category)));
  reset.addEventListener("click", () => setCategory("all"));
  function closePanel() {
    selectionTrigger?.focus({ preventScroll: true });
    previewDismissed = true;
    if (selected === null) hidePreview();
    else showAll();
  }
  panel.addEventListener("pointerenter", () => clearTimeout(previewTimer));
  panel.addEventListener("pointerleave", schedulePreviewClose);
  panel.addEventListener("focusin", () => clearTimeout(previewTimer));
  panel.addEventListener("focusout", schedulePreviewClose);
  panel.querySelector("button").addEventListener("click", closePanel);
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !panel.hidden && !document.querySelector("dialog[open]")) closePanel();
  });
  // Keep all pins in frame when a phone rotates or the window changes size.
  map.on("resize", () => {
    if (container.dataset.state !== "ready") return;
    if (selected === null) showAll(false);
    else focusSelected(false);
  });
  motion.addEventListener("change", () => { if (motion.matches && map) { entrance?.cancel(); map.stop(); } });
  map.on("error", () => { if (container.dataset.state === "loading") unavailable(); });
} catch {
  unavailable();
}
