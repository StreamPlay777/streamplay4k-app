/**
 * Header behaviour: the mobile drawer and the desktop Setup Guide dropdown.
 *
 * Both are disclosure patterns driven by `aria-expanded` on their trigger and
 * the `hidden` attribute on their content, so the markup is correct with
 * JavaScript switched off — nothing is hidden that cannot be re-shown.
 */

/* Must match the header's desktop breakpoint in components/header.css. */
const DESKTOP = "(min-width: 64em)";

/* ---------------------------------------------------------------------
 * Mobile drawer
 * ------------------------------------------------------------------ */
export function initDrawer() {
  const toggle = document.querySelector("[data-sp-nav-toggle]");
  const drawer = document.querySelector("[data-sp-nav-panel]");
  if (!toggle || !drawer) return;

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    drawer.hidden = !open;
    document.body.classList.toggle("sp-nav-open", open);
  };

  setOpen(false);

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  document.addEventListener("keydown", (evt) => {
    if (evt.key !== "Escape") return;
    if (toggle.getAttribute("aria-expanded") !== "true") return;
    setOpen(false);
    toggle.focus();
  });

  /* Following a link closes the drawer — including a hash link, which does
     not navigate away from the page. */
  drawer.addEventListener("click", (evt) => {
    if (evt.target.closest("a")) setOpen(false);
  });

  window.matchMedia(DESKTOP).addEventListener("change", (evt) => {
    if (evt.matches) setOpen(false);
  });
}

/* ---------------------------------------------------------------------
 * Desktop dropdown (Setup Guide devices)
 * ------------------------------------------------------------------ */
export function initMenus() {
  const items = document.querySelectorAll("[data-sp-menu]");
  if (!items.length) return;

  const desktop = window.matchMedia(DESKTOP);
  const open = new Set();

  const setOpen = (item, isOpen) => {
    const toggle = item.querySelector("[data-sp-menu-toggle]");
    const list = item.querySelector("[data-sp-menu-list]");
    if (!toggle || !list) return;

    toggle.setAttribute("aria-expanded", String(isOpen));
    list.hidden = !isOpen;
    isOpen ? open.add(item) : open.delete(item);
  };

  const closeAll = (except) => {
    for (const item of open) if (item !== except) setOpen(item, false);
  };

  for (const item of items) {
    const toggle = item.querySelector("[data-sp-menu-toggle]");
    const list = item.querySelector("[data-sp-menu-list]");
    if (!toggle || !list) continue;

    setOpen(item, false);

    toggle.addEventListener("click", (evt) => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      closeAll(item);

      /* A real pointer click arrives after mouseenter has already opened the
         menu, so toggling here would shut it again the moment it appeared.
         Keyboard activation reports detail === 0 and toggles as expected. */
      const fromPointer = evt.detail > 0;
      const hoverOpens = desktop.matches && window.matchMedia("(hover: hover)").matches;
      setOpen(item, fromPointer && hoverOpens ? true : !isOpen);
    });

    /* Pointer users get hover-to-open; this never runs for touch or keyboard. */
    item.addEventListener("mouseenter", () => {
      if (desktop.matches && window.matchMedia("(hover: hover)").matches) {
        closeAll(item);
        setOpen(item, true);
      }
    });

    item.addEventListener("mouseleave", () => {
      if (desktop.matches && window.matchMedia("(hover: hover)").matches) setOpen(item, false);
    });

    /* Focus leaving the item closes it, so tabbing past behaves predictably. */
    item.addEventListener("focusout", (evt) => {
      if (!item.contains(evt.relatedTarget)) setOpen(item, false);
    });

    /* Arrow keys move through the menu; Escape closes and restores focus. */
    item.addEventListener("keydown", (evt) => {
      const links = [...list.querySelectorAll("a")];

      if (evt.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(item, false);
        toggle.focus();
        return;
      }

      if (evt.key === "ArrowDown" || evt.key === "ArrowUp") {
        if (evt.target === toggle && evt.key === "ArrowDown") {
          evt.preventDefault();
          setOpen(item, true);
          links[0]?.focus();
          return;
        }

        const index = links.indexOf(evt.target);
        if (index === -1) return;

        evt.preventDefault();
        const next = evt.key === "ArrowDown" ? index + 1 : index - 1;
        if (next < 0) toggle.focus();
        else links[Math.min(next, links.length - 1)].focus();
      }
    });
  }

  document.addEventListener("click", (evt) => {
    if (!evt.target.closest("[data-sp-menu]")) closeAll();
  });

  desktop.addEventListener("change", () => closeAll());
}
