/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        /*
         * Themed tokens read a CSS variable, so one palette serves both modes
         * (see the :root blocks in index.css). Only the brand red is a fixed
         * hex — it is the same colour in both themes, and keeping it literal
         * is what lets `accent/[.35]` and friends keep working, since Tailwind
         * cannot apply an opacity modifier to a var() colour.
         */
        accent: {
          // Single brand red. The old #FF2B2A differed by one hex digit and was
          // indistinguishable; unified so there is one value, not two.
          DEFAULT: '#FF2B20',
          hover: '#FF5347',
          2: '#FF7A18',
          print: '#E0201C',
          // These three sit on the page ground, so they darken in light mode
          // where the light-theme reds would fall under 4.5:1.
          // The brand red used AS TEXT. Identical to the brand red on dark;
          // on white #FF2B20 measures 3.74:1, so light takes it deeper.
          ink: 'var(--accent-ink)',
          bright: 'var(--accent-bright)',
          soft: 'var(--accent-soft)',
          link: 'var(--accent-link)',
        },
        // Page grounds, lightest to deepest section
        bg: {
          DEFAULT: 'var(--bg)',
          alt: 'var(--bg-alt)',
          deep: 'var(--bg-deep)',
          deepest: 'var(--bg-deepest)',
        },
        surface: {
          DEFAULT: 'var(--surface)',
          2: 'var(--surface-2)',
          3: 'var(--surface-3)',
        },
        ink: {
          DEFAULT: 'var(--ink)',
          2: 'var(--ink-2)',
          3: 'var(--ink-3)',
          4: 'var(--ink-4)',
          5: 'var(--ink-5)',
          6: 'var(--ink-6)',
        },
        /*
         * Hairlines and raised fills, in three steps each.
         *
         * These replace the 133 hardcoded `white/[.0x]` utilities. The point is
         * that they are relative, not absolute: one step of contrast away from
         * whatever the ground currently is. In dark that is a white wash, in
         * light a dark one, so every card, border and divider on the site
         * inverts correctly without being touched individually.
         */
        line: {
          DEFAULT: 'var(--line)',   // hairline: dividers, quiet card edges
          2: 'var(--line-2)',       // a border you are meant to notice
          3: 'var(--line-3)',       // hover and active edges
        },
        raise: {
          DEFAULT: 'var(--raise)',  // barely there: standard card fill
          2: 'var(--raise-2)',      // an inset panel, a field
          3: 'var(--raise-3)',      // a chip, a pressed state
        },
        // Receipt stock — a printed object, the same colour in both themes.
        paper: {
          DEFAULT: '#F7F5F0',
          ink: '#14161C',
          rule: '#C3BEB2',
          meta: '#6E6A61',
        },
        success: 'var(--success)',
      },
      // Outfit is the only typeface on the site. `display` is kept as an
      // alias so heading markup still reads as intentional.
      fontFamily: {
        sans: ['"Outfit Variable"', 'Outfit', 'system-ui', 'sans-serif'],
        display: ['"Outfit Variable"', 'Outfit', 'system-ui', 'sans-serif'],
        // Handwriting, used only for the notes pinned around the receipt.
        hand: ['"Caveat Variable"', 'Caveat', 'cursive'],
      },
      maxWidth: {
        shell: '1180px',
        wide: '1320px',
        nav: '1260px',
        narrow: '820px',
      },
      backgroundImage: {
        // The brand gradient. Horizontal for type, diagonal for small tiles and
        // buttons where a sideways fade has too little room to read.
        // Endpoints are variables: on a light ground the orange end measures
        // 2.61:1 and has to darken. See --grad-from / --grad-to.
        'accent-gradient': 'linear-gradient(90deg, var(--grad-from), var(--grad-to))',
        'accent-gradient-diag': 'linear-gradient(135deg, var(--grad-from), var(--grad-to))',
      },
      boxShadow: {
        'cta-sm': '0 6px 22px var(--shadow-cta-sm)',
        cta: '0 10px 32px var(--shadow-cta)',
        pill: '0 12px 40px var(--shadow-pill)',
        dropdown: '0 24px 60px var(--shadow-dropdown)',
      },
      // Marquee keyframes live in index.css — see the note there.
      keyframes: {
        pulseDot: {
          '0%,100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '.45', transform: 'scale(.82)' },
        },
      },
      animation: {
        'pulse-dot': 'pulseDot 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
