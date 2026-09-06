/**
 * Site-wide behaviour. Kept intentionally small — native ES modules, no
 * bundler, no framework. Feature modules live beside this file and are
 * imported only where they are needed.
 */
import { bindDeclarativeEvents } from "./analytics.js";
import { initDrawer, initMenus } from "./nav.js";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* -----------------------------------------------------------------------
 * Scroll reveal — decorative only, skipped entirely for reduced motion.
 * -------------------------------------------------------------------- */
function initReveal() {
  const items = document.querySelectorAll(".sp-reveal");
  if (!items.length) return;

  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
  );

  items.forEach((el) => observer.observe(el));
}

function init() {
  document.documentElement.classList.remove("no-js");
  initDrawer();
  initMenus();
  initReveal();
  bindDeclarativeEvents();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
