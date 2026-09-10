import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    /**
     * Keep SVGs as separate files rather than inlining them as data URIs.
     *
     * The network wall globs ~100 logo SVGs; most are under Vite's default 4 KB
     * inline threshold, which pushed them all into the main JS bundle and grew
     * it by ~170 KB of render-blocking payload. As separate files they are
     * lazy-loaded by the <img> tags, cached individually, and cost nothing
     * until the wall scrolls into view.
     */
    assetsInlineLimit: (filePath) => (filePath.endsWith('.svg') ? false : undefined),
  },
})
