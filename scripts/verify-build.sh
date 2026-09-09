#!/usr/bin/env bash
#
# Refuses to let a build ship if it contains something it must not.
#
# THIS FILE IS THE ONLY IMPLEMENTATION. The GitHub workflow runs it, and so do
# you, locally, with the same command. The first version of this check lived
# inline in the workflow and separately in a local test script; the two
# drifted, the local one was correct, the workflow one was not, and the
# difference only surfaced in CI. One script cannot disagree with itself.
#
#   npm run verify        after a build
#
# Exit 0 = safe to ship. Exit 1 = do not ship, with the reason printed.

set -uo pipefail

DIST="${1:-dist}"
fail=0

say()  { printf '  %s\n' "$*"; }
bad()  { printf '\n  ✗ %s\n' "$*"; fail=1; }
good() { printf '  ✓ %s\n' "$*"; }

# GitHub renders ::error:: lines as annotations on the run. Harmless locally.
annotate() { [ -n "${GITHUB_ACTIONS:-}" ] && printf '::error::%s\n' "$*"; return 0; }

printf '\nChecking %s\n\n' "$DIST"

# ── 1. Files that must never be in a build ───────────────────────────────
#
# config.php holds every production secret and belongs only on the server. If
# a build carried one, a deploy would overwrite the live key with whatever was
# in the repository.
if [ -f "$DIST/api/config.php" ]; then
  bad "api/config.php is in the build — that file holds live secrets and must exist only on the server"
  annotate "api/config.php is in the build"
else
  good "no config.php in the build"
fi

# check.php prints no keys, but it describes the server's setup and has a
# button that sends mail. Not for a live site.
if [ -f "$DIST/api/check.php" ]; then
  bad "api/check.php is in the build — the diagnostic page must not ship to production"
  annotate "api/check.php is in the build"
else
  good "no check.php in the build"
fi

# ── 2. The file without which nothing routes ─────────────────────────────
if [ ! -f "$DIST/.htaccess" ]; then
  bad ".htaccess is missing — every page and the order endpoint would break"
  annotate ".htaccess missing from the build"
else
  good ".htaccess present"
fi

# ── 3. Real credentials, anywhere in the build ───────────────────────────
#
# Lengths are deliberate. A real Stripe key is sk_live_ plus 20+ characters;
# the documentation writes sk_live_… with an ellipsis, which cannot match. That
# is what keeps this precise rather than merely loud — a scanner that cries
# wolf over its own instructions gets switched off.
CRED_RE='sk_(live|test)_[A-Za-z0-9]{20,}|rk_live_[A-Za-z0-9]{20,}|whsec_[A-Za-z0-9]{24,}|key-[0-9a-f]{32}|[0-9a-f]{32}-[0-9a-f]{8}-[0-9a-f]{8}|AKfycb[A-Za-z0-9_-]{40,}|ghp_[A-Za-z0-9]{30,}|-----BEGIN [A-Z ]*PRIVATE KEY-----'

# grep alone, no pipe. A pipeline reports its LAST command's status, so
# `grep ... | head` is always true — the exact bug this file replaces.
if hits=$(grep -rIanE "$CRED_RE" "$DIST" 2>/dev/null); then
  bad "a real credential is in the build output:"
  while IFS= read -r line; do
    # Show where it is; show only the first 12 characters of what matched.
    file=${line%%:*}; rest=${line#*:}; lineno=${rest%%:*}
    match=$(printf '%s' "$line" | grep -oE "$CRED_RE" | head -1 | cut -c1-12)
    say "    $file:$lineno  →  ${match}…"
    annotate "credential in $file line $lineno"
  done <<< "$hits"
else
  good "no credentials found"
fi

# ── 4. Server-only names in anything a browser downloads ─────────────────
#
# Scoped to files the browser actually receives. These names appear
# legitimately in the PHP under api/ and in config.example.php, which is the
# whole point of that template — flagging those would be a false alarm, and a
# scanner people learn to ignore protects nothing.
SERVER_RE='mailgun_key|mailgun_base|sheets_token|admin_password_hash|admin_user|stripe_secret|stripe_webhook_secret|orders_dir|orders_inbox'

browser_files=$(find "$DIST" -type f \
  \( -name '*.js' -o -name '*.mjs' -o -name '*.css' -o -name '*.html' -o -name '*.json' -o -name '*.map' \) \
  -not -path "$DIST/api/*" -not -path "$DIST/admin/*" 2>/dev/null)

if [ -n "$browser_files" ]; then
  if hits=$(printf '%s\n' "$browser_files" | xargs grep -IanE "$SERVER_RE" 2>/dev/null); then
    bad "a server-only setting name reached a file the browser downloads:"
    printf '%s\n' "$hits" | head -20 | while IFS= read -r line; do
      say "    ${line:0:160}"
      annotate "server-only name in ${line%%:*}"
    done
  else
    good "no server-only names in anything the browser downloads"
  fi
fi

# ── 5. Order and customer data ───────────────────────────────────────────
if found=$(find "$DIST" -type f \( -name 'SP-*.json' -o -name 'orders-*.ndjson' -o -name 'leads.json' -o -name '*.log' \) 2>/dev/null | grep .); then
  bad "customer or order data is in the build:"
  printf '%s\n' "$found" | while IFS= read -r f; do say "    $f"; annotate "order data in build: $f"; done
else
  good "no order or customer data"
fi

printf '\n'
if [ "$fail" -eq 0 ]; then
  printf '  BUILD IS SAFE TO SHIP — %s files, %s\n\n' \
    "$(find "$DIST" -type f | wc -l | tr -d ' ')" "$(du -sh "$DIST" | cut -f1)"
else
  printf '  BUILD REFUSED. Fix the causes above; do not weaken this check.\n\n'
fi
exit $fail
