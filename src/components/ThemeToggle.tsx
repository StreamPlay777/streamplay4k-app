import { useTheme } from '../hooks/useTheme';

/**
 * Light / dark switch.
 *
 * One button, not a three-way menu: there are two themes, and a control with
 * a hidden third state ("system") is a thing people have to open to understand.
 * The icon shows what you will GET, not what you are in — the convention every
 * major site settled on, and the reason the label says "Switch to…".
 *
 * Sized to the same 38px box as the burger beside it so the mobile control row
 * stays on one baseline.
 */
export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const next = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className={`grid h-[38px] w-[38px] flex-none place-items-center rounded-xl border border-line-2
                  bg-raise text-ink-2 transition-colors duration-200 hover:border-line-3 hover:text-ink
                  ${className}`}
    >
      {/* Both glyphs are in the markup and CSS picks one, keyed off the
          data-theme attribute the pre-paint script sets. Choosing in JS would
          mean the pre-rendered HTML carries whichever icon the build guessed,
          and a light-mode visitor would see the wrong one until hydration. */}
      <svg viewBox="0 0 20 20" width="17" height="17" aria-hidden="true"
           fill="none" stroke="currentColor" strokeWidth="1.7"
           strokeLinecap="round" strokeLinejoin="round">
        {/* Sun — shown in dark mode, offering the light theme */}
        <g className="ico-sun">
          <circle cx="10" cy="10" r="3.6" />
          <path d="M10 1.8v1.9M10 16.3v1.9M18.2 10h-1.9M3.7 10H1.8M15.8 4.2l-1.3 1.3M5.5 14.5l-1.3 1.3M15.8 15.8l-1.3-1.3M5.5 5.5 4.2 4.2" />
        </g>
        {/* Moon — shown in light mode, offering the dark theme */}
        <path className="ico-moon" d="M16.5 11.7A7 7 0 0 1 8.3 3.5a7 7 0 1 0 8.2 8.2Z" />
      </svg>
    </button>
  );
}
