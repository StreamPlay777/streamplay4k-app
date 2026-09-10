import { useEffect, useRef } from 'react';

/**
 * Scroll reveal, driven by a single shared IntersectionObserver.
 *
 * One observer for the whole page rather than one per element: dozens of
 * observers is the usual way this pattern gets expensive, and there is no
 * reason for it — the callback only needs to know which entries crossed.
 *
 * Reveal is one-way. Once an element has been seen it stays visible and is
 * unobserved, so scrolling back up never re-animates anything.
 *
 * Styling lives in index.css (.reveal / .is-in). Under prefers-reduced-motion
 * the CSS shows content immediately; this hook still runs and still adds the
 * class, so nothing depends on motion to become readable.
 */

type Target = Element;

let observer: IntersectionObserver | null = null;

function shared(): IntersectionObserver | null {
  if (typeof IntersectionObserver === 'undefined') return null;
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        observer?.unobserve(entry.target);
      }
    },
    // Fire a little before the element reaches the fold, so the transition has
    // finished by the time it is properly in view.
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
  );
  return observer;
}

export function observeReveal(el: Target | null): () => void {
  if (!el) return () => {};
  const io = shared();
  if (!io) {
    // No IntersectionObserver (very old browser, or a server render that
    // somehow reached here): show the content rather than hiding it forever.
    el.classList.add('is-in');
    return () => {};
  }
  io.observe(el);
  return () => io.unobserve(el);
}

/** Ref to attach to any element carrying the `reveal` class. */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  useEffect(() => observeReveal(ref.current), []);
  return ref;
}
