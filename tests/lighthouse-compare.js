// OHS performance check for PROPOSED changes (pull requests). NOT part of
// run-all.js. .github/workflows/lighthouse.yml builds the site twice on the same
// machine, the PR and its base branch, exactly as deploy.yml does (nav/footer
// built into the pages), serves both, and runs this:
//   SITE_URL=http://127.0.0.1:8101 SITE_URL_BASE=http://127.0.0.1:8102 node tests/lighthouse-compare.js
// Each page is measured on both (mobile, median of PERF_RUNS runs, default 3).
// Fails if the PR scores more than PERF_TOLERANCE points (default 10) below the
// base in any category, or makes a page fail to load. Same machine, same server
// for both, so the comparison is fair even though a local server is slower than
// GitHub Pages; absolute numbers here are not comparable to the live baseline.
const { execFileSync } = require('child_process');
const fs = require('fs'), path = require('path'), os = require('os');
const PR = (process.env.SITE_URL || '').replace(/\/$/, '');
const BASE = (process.env.SITE_URL_BASE || '').replace(/\/$/, '');
const RUNS = Number(process.env.PERF_RUNS || 3);
const TOLERANCE = Number(process.env.PERF_TOLERANCE || 10);
const PAGES = ['/', '/products.html', '/cart.html', '/calculator.html', '/book-service.html', '/commercial-residential-disinfection.html'];
const CATS = ['performance', 'accessibility', 'best-practices', 'seo'];
const SHORT = { performance: 'Perf', accessibility: 'A11y', 'best-practices': 'Best pr.', seo: 'SEO' };
const LH = process.env.LIGHTHOUSE_BIN || 'lighthouse';
const median = a => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
if (!PR || !BASE) { console.error('Set SITE_URL (the PR build) and SITE_URL_BASE (the base build)'); process.exit(2); }

function measure(site, pg) {
  const runs = [];
  for (let i = 0; i < RUNS; i++) {
    const out = path.join(os.tmpdir(), `lhc-${process.pid}-${Date.now()}.json`);
    try {
      execFileSync(LH, [site + pg, '--quiet', '--output=json', `--output-path=${out}`, `--only-categories=${CATS.join(',')}`,
        '--chrome-flags=--headless=new --no-sandbox'], { stdio: ['ignore', 'ignore', 'pipe'], timeout: 180000 });
      runs.push(JSON.parse(fs.readFileSync(out, 'utf8')));
    } catch (e) { console.log(`WARN ${site}${pg} run ${i + 1} failed: ${String(e.stderr || e.message).slice(0, 200)}`); }
  }
  if (!runs.length) return null;
  const r = { scores: {}, lcp: null, cls: null };
  for (const c of CATS) r.scores[c] = median(runs.map(x => Math.round(((x.categories[c] && x.categories[c].score) || 0) * 100)));
  r.lcp = median(runs.map(x => x.audits['largest-contentful-paint'] ? Math.round(x.audits['largest-contentful-paint'].numericValue) : 0));
  r.cls = median(runs.map(x => x.audits['cumulative-layout-shift'] ? Number(x.audits['cumulative-layout-shift'].numericValue.toFixed(3)) : 0));
  return r;
}

let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
const rows = ['| Page | ' + CATS.map(c => SHORT[c] + ' (base → PR)').join(' | ') + ' | LCP ms | CLS |', '|' + '---|'.repeat(CATS.length + 3)];
const drops = [], broken = [];
for (const pg of PAGES) {
  const base = measure(BASE, pg), pr = measure(PR, pg);
  if (!pr) { broken.push(pg); rows.push(`| ${pg} | PR build failed to load |`); continue; }
  if (!base) { rows.push(`| ${pg} | (new page) ${CATS.map(c => pr.scores[c]).join(' / ')} |`); continue; }
  const cells = CATS.map(c => {
    const d = pr.scores[c] - base.scores[c];
    if (d < -TOLERANCE) drops.push(`${pg} ${c}: ${base.scores[c]} -> ${pr.scores[c]}`);
    return `${base.scores[c]} → ${pr.scores[c]}${d ? ` (${d > 0 ? '+' : ''}${d})` : ''}`;
  });
  rows.push(`| ${pg} | ${cells.join(' | ')} | ${base.lcp} → ${pr.lcp} | ${base.cls} → ${pr.cls} |`);
}
const table = rows.join('\n');
console.log(`Lighthouse, this PR vs its base (mobile, median of ${RUNS}, same machine)\n` + table);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### Lighthouse: this PR vs its base (mobile, median of ${RUNS})\n\n${table}\n`);
ok(!broken.length, 'every page loads in the PR build' + (broken.length ? ': ' + broken.join(', ') : ''));
ok(!drops.length, `no score more than ${TOLERANCE} points below the base` + (drops.length ? ':\n   ' + drops.join('\n   ') : ''));
console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exitCode = fails ? 1 : 0;
