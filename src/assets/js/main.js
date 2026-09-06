/**
 * Site-wide behaviour. Kept intentionally small — native ES modules, no
 * bundler, no framework. Feature modules live beside this file and are
 * imported only where they are needed.
 */
import { bindDeclarativeEvents } from "./analytics.js";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* -----------------------------------------------------------------------
 * Mobile navigation
 * -------------------------------------------------------------------- */
function initNav() {
  const toggle = document.querySelector("[data-sp-nav-toggle]");
  const panel = document.querySelector("[data-sp-nav-panel]");
  if (!toggle || !panel) return;

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    panel.hidden = !open;
    document.body.classList.toggle("sp-nav-open", open);
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  setOpen(false);

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  document.addEventListener("keydown", (evt) => {
    if (evt.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });

  /* Close when a link is followed, and when the desktop layout takes over. */
  panel.addEventListener("click", (evt) => {
    if (evt.target.closest("a")) setOpen(false);
  });

  window.matchMedia("(min-width: 64em)").addEventListener("change", (evt) => {
    if (evt.matches) setOpen(false);
  });
}

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
  initNav();
  initReveal();
  bindDeclarativeEvents();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
