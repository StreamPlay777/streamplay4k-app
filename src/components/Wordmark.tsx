import logoOnDark from '../assets/logo-light.png';
import logoOnLight from '../assets/logo-dark.png';
import { site } from '../data/site';

/**
 * The StreamPlay wordmark, in whichever version the current theme can show.
 *
 * The two files are the same mark drawn for opposite grounds: logo-light.png
 * is the pale one, meant for a dark page, and logo-dark.png the ink one. The
 * navbar used the pale one unconditionally, which on the light theme left a
 * red chevron floating beside nothing.
 *
 * Both are in the markup and CSS picks one, for the same reason the theme
 * toggle does: the pages are pre-rendered, so choosing in JavaScript would
 * bake the build's guess into the HTML and show the wrong mark until
 * hydration. Only one is ever painted, and the pair is a few KB.
 */
export default function Wordmark({ className = '' }: { className?: string }) {
  return (
    <>
      <img src={logoOnDark} alt={site.name} width={960} height={280}
           className={`mark-on-dark ${className}`} />
      <img src={logoOnLight} alt="" aria-hidden="true" width={960} height={280}
           className={`mark-on-light ${className}`} />
    </>
  );
}
