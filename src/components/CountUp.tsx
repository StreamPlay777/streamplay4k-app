import type { ElementType } from 'react';
import { createElement } from 'react';
import { useCountUp } from '../hooks/useCountUp';

/**
 * A published figure that counts up the first time it is seen.
 *
 * Renders the final value into the markup and only animates after mount, so
 * the pre-rendered HTML always carries the real number — a crawler, or anyone
 * without JavaScript, sees "120,000+", not "0".
 */
export default function CountUp({
  value, as = 'span', className = '', style,
}: {
  value: string;
  as?: ElementType;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { ref, text } = useCountUp(value);
  return createElement(as, { ref, className, style }, text);
}
