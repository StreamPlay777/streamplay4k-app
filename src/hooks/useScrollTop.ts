import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Every navigation lands at the top of the new page, as the handoff specifies. */
export function useScrollTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
}
