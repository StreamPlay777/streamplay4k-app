import { useEffect, useRef, useState } from 'react';

/**
 * Counts a numeric figure up when it first scrolls into view.
 *
 * Takes the string the site already publishes ("120,000+", "4.7", "Up to 5")
 * rather than a number, so no caller has to keep a parsed copy in step with the
 * displayed one. Anything that is not a plain figure — "24/7", "5–15 minutes",
 * "Up to 4K" — is returned untouched and never animates, because a number that
 * counts up to something which is not really a quantity is just noise.
 *
 * Prefix and suffix survive: "120,000+" counts to 120,000 and keeps its plus,
 * "$2,221" keeps its dollar sign. Decimals keep their places, so 4.7 counts
 * through 4.1, 4.2 … rather than 4.6999999.
 *
 * Still under prefers-reduced-motion, and it runs once — a figure that
 * re-animates every time it scrolls past is a distraction, not a flourish.
 */

/** Splits "≈ $2,221+" into its lead-in, its number and its trailing text. */
function parse(value: string): { pre: string; n: number; post: string; decimals: number } | null {
  const m = value.match(/^(\D*?)([\d][\d,.\s]*)(.*)$/s);
  if (!m) return null;
  const digits = m[2].replace(/[,\s]/g, '');
  // A second dot means it is not one number (a version, a date) — leave it be.
  if ((digits.match(/\./g) ?? []).length > 1) return null;
  const n = Number(digits);
  if (!Number.isFinite(n)) return null;
  return { pre: m[1], n, post: m[3], decimals: (digits.split('.')[1] ?? '').length };
}

const format = (n: number, decimals: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

export function useCountUp<T extends HTMLElement = HTMLElement>(value: string, ms = 1100) {
  const ref = useRef<T>(null);
  const [text, setText] = useState(value);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    const parsed = parse(value);
    if (!el || !parsed || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const { pre, n, post, decimals } = parsed;
    let raf = 0;

    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || done.current) return;
      done.current = true;
      io.disconnect();

      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / ms);
        // Ease-out cubic: fast first, settling into the real figure, which is
        // what makes it read as a count rather than a linear wipe.
        const eased = 1 - Math.pow(1 - t, 3);
        setText(`${pre}${format(n * eased, decimals)}${post}`);
        if (t < 1) raf = requestAnimationFrame(tick);
        else setText(value); // land on the published string exactly
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });

    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value, ms]);

  return { ref, text };
}
