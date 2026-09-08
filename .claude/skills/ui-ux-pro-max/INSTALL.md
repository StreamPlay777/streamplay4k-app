# Vendored: UI/UX Pro Max

- Source: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- Version installed: 2.13.0
- Licence: MIT (see LICENSE)
- Installed: 2026-09-08

Vendored into `.claude/skills/` to match the other skills in this project, so
it is versioned with the repo and does not depend on a marketplace fetch at
runtime.

The upstream repository ships seven skills; only `ui-ux-pro-max` was requested
and installed. `scripts/tests/` was left out — those test the upstream data set
rather than doing anything the skill uses.

To update, re-clone the repo and copy `.claude/skills/ui-ux-pro-max/` over this
directory, keeping this file.
