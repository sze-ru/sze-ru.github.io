document.documentElement.classList.add("js-enabled");

const menu = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#navigation");
function closeMenu() {
  menu.setAttribute("aria-expanded", "false");
  navigation.classList.remove("is-open");
  menu.querySelector("span").textContent = "+";
}
menu.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") !== "true";
  menu.setAttribute("aria-expanded", String(open));
  navigation.classList.toggle("is-open", open);
  menu.querySelector("span").textContent = open ? "−" : "+";
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true") {
    closeMenu();
    menu.focus();
  }
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".header")) closeMenu();
});
navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
matchMedia("(min-width:761px)").addEventListener("change", closeMenu);

const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
const ticker = document.querySelector(".ticker");
const tickerToggle = document.querySelector(".ticker-toggle");
if (tickerToggle) {
  tickerToggle.addEventListener("click", () => {
    const paused = ticker.classList.toggle("paused");
    tickerToggle.setAttribute("aria-pressed", String(paused));
    tickerToggle.setAttribute(
      "aria-label",
      paused ? "Resume moving text" : "Pause moving text",
    );
    tickerToggle.querySelector("span").textContent = paused ? "▷" : "Ⅱ";
  });
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
