/**
 * Copies server/api/ into dist/api/ so a deploy is one upload.
 *
 * Without this, "deploy" means remembering to upload two unrelated trees, and
 * the day someone uploads only dist/ the site takes orders that go nowhere.
 *
 * config.php is deliberately never copied: it holds the Mailgun key, lives
 * only on the server, and is created once from config.example.php. If it were
 * in the bundle, every deploy would risk overwriting the live key with a blank
 * one — the failure that looks like "orders stopped arriving" a week later.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Before copying anything, check the two price tables still agree.
 *
 * server/api/lib/pricing.php is a hand-written mirror of src/data/pricing.ts,
 * because the server must never take the browser's word for a total. A mirror
 * drifts the first time someone changes a price in one file and not the other,
 * and the symptom is quiet: every order logs a PRICE MISMATCH and gets invoiced
 * for the old amount. Failing the build here is the only cheap way to catch it.
 */

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
/* Both server trees. server/admin is the dashboard; it reads ../api/config.php
   and the order files, so the two have to land as siblings under the web root
   for the relative require to resolve. */
const TREES = [
  { from: path.join(root, 'server', 'api'),   to: path.join(root, 'dist', 'api') },
  { from: path.join(root, 'server', 'admin'), to: path.join(root, 'dist', 'admin') },
];
const src = TREES[0].from;

const SKIP = new Set(['config.php']);

function numbersFrom(text, re, label) {
  const found = [...text.matchAll(re)].map((m) => m[1]);
  if (!found.length) throw new Error(`bundle-api: could not read ${label} — the file's shape changed`);
  return found;
}

async function assertPricesAgree() {
  const ts = await fs.readFile(path.join(root, 'src', 'data', 'pricing.ts'), 'utf8');
  const php = await fs.readFile(path.join(src, 'lib', 'pricing.php'), 'utf8');

  // { id: '3m', months: 3, label: '3 Months', baseCents: 3999 }
  const tsTerms = [...ts.matchAll(/id:\s*'([^']+)',\s*months:\s*(\d+),[^}]*?baseCents:\s*(\d+)/g)]
    .map((m) => `${m[1]}/${m[2]}/${m[3]}`);
  // '3m' => ['id' => '3m', 'months' => 3, ..., 'baseCents' => 3999]
  const phpTerms = [...php.matchAll(/'id'\s*=>\s*'([^']+)',\s*'months'\s*=>\s*(\d+),[^\]]*?'baseCents'\s*=>\s*(\d+)/g)]
    .map((m) => `${m[1]}/${m[2]}/${m[3]}`);

  const problems = [];
  if (!tsTerms.length || !phpTerms.length) {
    problems.push('could not parse the term tables out of one of the files');
  } else if (tsTerms.join(' ') !== phpTerms.join(' ')) {
    problems.push(`terms differ\n    pricing.ts : ${tsTerms.join('  ')}\n    pricing.php: ${phpTerms.join('  ')}`);
  }

  // Both languages happen to declare these the same way: NAME = value.
  for (const name of ['EXTRA_DEVICE_RATE', 'MAX_DEVICES', 'MIN_DEVICES']) {
    const re = () => new RegExp(`${name}\\s*=\\s*([\\d.]+)\\s*;`, 'g');
    const a = numbersFrom(ts, re(), `${name} in pricing.ts`)[0];
    const b = numbersFrom(php, re(), `${name} in pricing.php`)[0];
    if (Number(a) !== Number(b)) problems.push(`${name}: pricing.ts has ${a}, pricing.php has ${b}`);
  }

  if (problems.length) {
    console.error('\nPRICE MIRROR OUT OF SYNC — build stopped.\n');
    for (const p of problems) console.error(`  - ${p}`);
    console.error('\n  src/data/pricing.ts and server/api/lib/pricing.php must state the');
    console.error('  same prices. The server recalculates every order from the PHP file,');
    console.error('  so shipping them out of step charges customers the wrong amount.\n');
    process.exit(1);
  }
}

await assertPricesAgree();

let copied = 0;

async function walk(from, to) {
  await fs.mkdir(to, { recursive: true });
  for (const entry of await fs.readdir(from, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const a = path.join(from, entry.name);
    const b = path.join(to, entry.name);
    if (entry.isDirectory()) await walk(a, b);
    else { await fs.copyFile(a, b); copied += 1; }
  }
}

for (const t of TREES) {
  await fs.rm(t.to, { recursive: true, force: true });
  await walk(t.from, t.to);
}

console.log(`\nBundled ${copied} server files into dist/api/ and dist/admin/ (config.php excluded).`);
