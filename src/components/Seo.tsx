import { useEffect } from 'react';
import { applyHead, type PageSeo } from '../data/seo';

/**
 * Applies page metadata to the live document head.
 *
 * On a pre-rendered page the build has already written the same tags, so the
 * first paint is correct without JavaScript. This keeps them correct after a
 * client-side navigation, where the browser never fetches new HTML.
 *
 * Renders nothing. Effects do not run during server rendering, which is what we
 * want — scripts/prerender.mjs writes the head itself from the same source.
 */
export default function Seo({ seo }: { seo: PageSeo }) {
  useEffect(() => {
    applyHead(seo);
    // Serialising is cheap here and covers nested jsonLd changing on blog posts.
  }, [JSON.stringify(seo)]);
  return null;
}
