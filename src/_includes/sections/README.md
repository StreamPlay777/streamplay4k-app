# Homepage & page sections

One file per approved section. A section is added to a source template (see
`src/_includes/templates/`) only once its design has been approved, so later
work never reopens a finished section.

Conventions:

- One top-level `<section>` per file, with `aria-labelledby` pointing at its heading.
- Layout comes from `.sp-container` / `.sp-section`; never set page padding inline.
- All copy, prices and figures come from `src/_data/`, never hardcoded.
- Section-specific CSS goes in `src/assets/css/components/<section>.css` and is
  imported from `main.css`.
