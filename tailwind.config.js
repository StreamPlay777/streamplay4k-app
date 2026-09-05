/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand pair — sampled from the client logo
        accent: {
          DEFAULT: '#FF2B2A',
          hover: '#FF5347',
          bright: '#FF6A5A',
          soft: '#FF7A63',
          link: '#FF8A72',
          2: '#FF9A3E',
          print: '#E0201C',
        },
        // Dark navy ground
        bg: {
          DEFAULT: '#06080F',
          alt: '#080B16',
          deep: '#05070D',
          deepest: '#04060B',
        },
        surface: {
          DEFAULT: '#0A0E1B',
          2: '#0B1020',
          3: '#0F1526',
        },
        ink: {
          DEFAULT: '#E8ECF5',
          2: '#C4CCDC',
          3: '#97A2B8',
          4: '#6B7689',
          5: '#5C6680',
          6: '#465066',
        },
        // Receipt stock
        paper: {
          DEFAULT: '#F7F5F0',
          ink: '#14161C',
          rule: '#C3BEB2',
          meta: '#6E6A61',
        },
        success: '#35C86A',
      },
      // Outfit is the only typeface on the site. `display` is kept as an
      // alias so heading markup still reads as intentional.
      fontFamily: {
        sans: ['"Outfit Variable"', 'Outfit', 'system-ui', 'sans-serif'],
        display: ['"Outfit Variable"', 'Outfit', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        shell: '1180px',
        wide: '1320px',
        nav: '1260px',
        narrow: '820px',
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(100deg, #FF2B2A, #FF9A3E)',
      },
      boxShadow: {
        'cta-sm': '0 6px 22px rgba(255,43,42,.35)',
        cta: '0 10px 32px rgba(255,43,42,.33)',
        pill: '0 12px 40px rgba(0,0,0,.45)',
        dropdown: '0 24px 60px rgba(0,0,0,.6)',
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
