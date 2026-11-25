// Part of the OHS test suite. Run all with: node tests/run-all.js
// Internal links: every local href/src in every page points to a file that exists.
// Links that were already broken are listed in known-broken-links.json; they are
// reported but don't fail the run. A NEW broken link fails it, and a listed link
// that has been fixed must be removed from the list (so the list only shrinks).
const fs = require('fs'), path = require('path');
const ROOT = process.env.SITE_ROOT || path.join(__dirname, '..');
const known = new Set(JSON.parse(fs.readFileSync(path.join(__dirname, 'known-broken-links.json'), 'utf8')).links);

const pages = [];
(function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    if (['node_modules', '.git', 'tests', '_site', 'labels'].includes(f)) continue;   // labels/ are print files, never touched
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p); else if (f.endsWith('.html')) pages.push(p);
  }
})(ROOT);

const broken = new Map();   // "page -> target" => true
for (const page of pages) {
  const rel = path.relative(ROOT, page);
  // Template HTML is injected into pages at the site root, so its relative links resolve from the root
  const baseDir = rel.startsWith('templates' + path.sep) ? ROOT : path.dirname(page);
  const html = fs.readFileSync(page, 'utf8')
    .replace(/<!--[\s\S]*?-->/g, '')                         // ignore commented-out markup
    .replace(/<script\b[\s\S]*?<\/script>/gi, m => /\bsrc=/.test(m.slice(0, m.indexOf('>'))) ? m.slice(0, m.indexOf('>') + 1) : '');  // ignore links built inside JS
  const re = /\b(?:href|src)\s*=\s*["']([^"']+)["']/gi; let m;
  while ((m = re.exec(html))) {
    let url = m[1].trim();
    if (!url || /^(https?:|mailto:|tel:|sms:|data:|javascript:|#|\/\/)/i.test(url) || url.includes('${') || url.includes("' +")) continue;
    url = url.split('#')[0].split('?')[0];
    if (!url) continue;
    let target;
    try { target = url.startsWith('/') ? path.join(ROOT, decodeURIComponent(url)) : path.join(baseDir, decodeURIComponent(url)); } catch (e) { target = ''; }
    if (target && target.endsWith(path.sep)) target = path.join(target, 'index.html');
    if (!target || !fs.existsSync(target)) broken.set(`${rel} -> ${m[1].trim()}`, true);
  }
}

let fails = 0; const ok = (c, msg) => { console.log((c ? 'PASS ' : 'FAIL ') + msg); if (!c) fails++; };
const now = [...broken.keys()].sort();
const added = now.filter(l => !known.has(l));
const fixed = [...known].filter(l => !broken.has(l));
ok(!added.length, `no new broken internal links across ${pages.length} pages` + (added.length ? ':\n   ' + added.join('\n   ') : ''));
ok(!fixed.length, `known-broken-links.json is up to date` + (fixed.length ? ' — these are fixed now, remove them from the list:\n   ' + fixed.join('\n   ') : ''));
if (known.size) console.log(`INFO ${known.size} known pre-existing broken link(s) still to fix (tests/known-broken-links.json)`);
console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exitCode = fails ? 1 : 0;
