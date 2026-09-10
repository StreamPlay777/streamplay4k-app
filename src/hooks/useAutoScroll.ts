import { useEffect, type RefObject } from 'react';

/**
 * Drifts a horizontal rail sideways on its own, and gets out of the way the
 * moment the visitor takes hold of it.
 *
 * Why not the CSS Marquee we use elsewhere: a marquee is a moving strip you
 * cannot stop, which is fine for logos and posters but wrong for anything a
 * person needs to read or tap. This keeps the rail a real scroll container —
 * swipe, drag, wheel and keyboard all still work — and simply nudges its
 * scroll position between interactions.
 *
 * The rail's children MUST be rendered twice, the second pass aria-hidden.
 * The drift wraps at the halfway point, which lands on the identical frame of
 * the first pass, so the loop is seamless instead of snapping back to zero.
 *
 * It stands still when it should: reduced motion, off screen, tab in the
 * background, pointer over it, or for a few seconds after any touch, drag or
 * wheel. Nothing moves under a finger that is trying to read.
 */
export function useAutoScroll(
  ref: RefObject<HTMLElement>,
  { speed = 26, resumeAfter = 3500 }: { speed?: number; resumeAfter?: number } = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const motionOk = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (motionOk?.matches) return;

    let raf = 0;
    let last = 0;
    // The rail's true position, kept as a float. Browsers floor a fractional
    // scrollLeft, so writing 0.7px per frame and reading it back as 0 would
    // leave the rail standing still forever — the drift has to accumulate
    // here and reach the element in whole pixels.
    let pos = el.scrollLeft;
    let onScreen = false;
    let heldUntil = 0;
    let pointerOver = false;

    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; }, { threshold: 0 });
    io.observe(el);

    const hold = () => { heldUntil = performance.now() + resumeAfter; };
    const enter = () => { pointerOver = true; };
    const leave = () => { pointerOver = false; };

    // Fires for touch, mouse drag and pen alike; wheel covers trackpads.
    el.addEventListener('pointerdown', hold, { passive: true });
    el.addEventListener('wheel', hold, { passive: true });
    el.addEventListener('touchmove', hold, { passive: true });
    el.addEventListener('keydown', hold);
    el.addEventListener('focusin', hold);
    el.addEventListener('pointerenter', enter, { passive: true });
    el.addEventListener('pointerleave', leave, { passive: true });

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = last ? Math.min(now - last, 64) : 0;
      last = now;

      if (!onScreen || pointerOver || document.hidden || now < heldUntil) return;

      // One lap is the distance between the two passes. Measured from their
      // positions rather than halving scrollWidth, which would also halve the
      // rail's own padding and let the loop drift out of register.
      const passes = el.children;
      const lap = passes.length >= 2
        ? (passes[1] as HTMLElement).offsetLeft - (passes[0] as HTMLElement).offsetLeft
        : el.scrollWidth / 2;
      if (lap < 1) return;

      // Someone scrolled it by hand: adopt where they left it.
      if (Math.abs(el.scrollLeft - Math.round(pos)) > 1) pos = el.scrollLeft;

      pos += (speed * dt) / 1000;
      if (pos >= lap) pos -= lap;
      el.scrollLeft = Math.round(pos);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener('pointerdown', hold);
      el.removeEventListener('wheel', hold);
      el.removeEventListener('touchmove', hold);
      el.removeEventListener('keydown', hold);
      el.removeEventListener('focusin', hold);
      el.removeEventListener('pointerenter', enter);
      el.removeEventListener('pointerleave', leave);
    };
  }, [ref, speed, resumeAfter]);
}
