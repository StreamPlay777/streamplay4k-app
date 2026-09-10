import { createElement, type ElementType, type ReactNode } from 'react';
import { useReveal } from '../hooks/useReveal';

/**
 * Wraps children in a scroll-revealed element.
 *
 * `delay` is a stagger index, not milliseconds — pass the array index and the
 * component converts it, so a group of cards reveals in sequence from one
 * observer. Kept small on purpose: 70ms steps, capped at 6 so a long list never
 * leaves the last item waiting.
 *
 * Renders a real element with the content inside it, so pre-rendered HTML
 * carries the text whether or not JavaScript ever runs.
 */
export default function Reveal({
  children,
  as = 'div',
  delay = 0,
  shift,
  className = '',
}: {
  children: ReactNode;
  as?: ElementType;
  /** Stagger index (0, 1, 2 …), not milliseconds. */
  delay?: number;
  /** Travel distance in px. Smaller for dense rows, larger for whole sections. */
  shift?: number;
  className?: string;
}) {
  const ref = useReveal<HTMLElement>();
  const style: Record<string, string> = {};
  if (delay) style['--reveal-delay'] = `${Math.min(delay, 6) * 70}ms`;
  if (shift !== undefined) style['--reveal-shift'] = `${shift}px`;

  return createElement(
    as,
    { ref, className: `reveal ${className}`.trim(), style },
    children,
  );
}
