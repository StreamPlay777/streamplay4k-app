import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'

/**
 * Client entry.
 *
 * Pages are pre-rendered to real HTML at build time (scripts/prerender.mjs), so
 * the container normally already holds markup and we hydrate it rather than
 * throwing it away and re-rendering. The createRoot branch covers the dev
 * server and any route that was not pre-rendered.
 */
const container = document.getElementById('root')!

const tree = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

if (container.hasChildNodes()) {
  hydrateRoot(container, tree)
} else {
  createRoot(container).render(tree)
}
