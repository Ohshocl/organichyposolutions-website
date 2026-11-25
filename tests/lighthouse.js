// OHS performance check (Lighthouse). NOT part of run-all.js: it measures the
// LIVE site over the real network, so it runs in .github/workflows/lighthouse.yml.
//   node tests/lighthouse.js                 compare to tests/perf-baseline.json
//   PERF_WRITE_BASELINE=1 node tests/lighthouse.js   record a new baseline
// Needs lighthouse installed (the workflow installs a pinned version) and Chrome.
// Each page is measured 3 times (mobile, Lighthouse default throttling) and the
// median is used, because single runs vary a lot.
// A category score more than TOLERANCE points below the baseline fails.
const { execFileSync } = require('child_process');
const fs = require('fs'), path = require('path'), os = require('os');
const SITE = (process.env.SITE_URL || 'https://organichyposolutions.com').replace(/\/$/, '');
const RUNS = Number(process.env.PERF_RUNS || 3);
const TOLERANCE = Number(process.env.PERF_TOLERANCE || 10);
const BASELINE_FILE = path.join(__dirname, 'perf-baseline.json');
const PAGES = ['/', '/products.html', '/cart.html', '/calculator.html', '/book-service.html', '/commercial-residential-disinfection.html'];
const CATS = ['performance', 'accessibility', 'best-practices', 'seo'];
const METRICS = { 'first-contentful-paint': 'FCP ms', 'largest-contentful-paint': 'LCP ms', 'total-blocking-time': 'TBT ms', 'cumulative-layout-shift': 'CLS', 'speed-index': 'SI ms' };
const LH = process.env.LIGHTHOUSE_BIN || 'lighthouse';
const median = a => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };

const results = {};
for (const pg of PAGES) {
  const runs = [];
  for (let i = 0; i < RUNS; i++) {
    const out = path.join(os.tmpdir(), `lh-${Date.now()}.json`);
    try {
      execFileSync(LH, [SITE + pg, '--quiet', '--output=json', `--output-path=${out}`, `--only-categories=${CATS.join(',')}`,
        '--chrome-flags=--headless=new --no-sandbox'], { stdio: ['ignore', 'ignore', 'pipe'], timeout: 180000 });
      runs.push(JSON.parse(fs.readFileSync(out, 'utf8')));
    } catch (e) { console.log(`WARN ${pg} run ${i + 1} failed: ${String(e.stderr || e.message).slice(0, 200)}`); }
  }
  if (!runs.length) { results[pg] = null; continue; }
  const r = { scores: {}, metrics: {} };
  for (const c of CATS) r.scores[c] = median(runs.map(x => Math.round((x.categories[c] && x.categories[c].score || 0) * 100)));
  for (const m of Object.keys(METRICS)) r.metrics[METRICS[m]] = median(runs.map(x => x.audits[m] ? Number(x.audits[m].numericValue.toFixed(m === 'cumulative-layout-shift' ? 3 : 0)) : null));
  results[pg] = r;
}

// Table for the log / job summary
const rows = ['| Page | Perf | A11y | Best pr. | SEO | ' + Object.values(METRICS).join(' | ') + ' |', '|' + '---|'.repeat(5 + Object.keys(METRICS).length)];
for (const pg of PAGES) {
  const r = results[pg];
  rows.push(r ? `| ${pg} | ${CATS.map(c => r.scores[c]).join(' | ')} | ${Object.values(METRICS).map(m => r.metrics[m]).join(' | ')} |` : `| ${pg} | failed |`);
}
const table = rows.join('\n');
console.log(`Lighthouse (mobile, median of ${RUNS}) for ${SITE}\n` + table);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### Lighthouse (mobile, median of ${RUNS})\n${SITE}\n\n${table}\n`);
console.log('RESULTS_JSON ' + JSON.stringify(results));

let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
ok(PAGES.every(p => results[p]), 'every page measured');
if (process.env.PERF_WRITE_BASELINE) {
  fs.writeFileSync(BASELINE_FILE, JSON.stringify({ note: 'Lighthouse mobile scores of the live site (median of 3). The weekly check fails if a category drops more than 10 points. Re-record after a deliberate change: PERF_WRITE_BASELINE=1 node tests/lighthouse.js', site: SITE, lighthouse: process.env.LIGHTHOUSE_VERSION || '', recorded: new Date().toISOString().slice(0, 10), pages: results }, null, 2) + '\n');
  console.log('Baseline written: ' + BASELINE_FILE);
} else if (fs.existsSync(BASELINE_FILE)) {
  const base = JSON.parse(fs.readFileSync(BASELINE_FILE, 'utf8')).pages || {};
  const drops = [];
  for (const pg of PAGES) for (const c of CATS) {
    const was = base[pg] && base[pg].scores[c], now = results[pg] && results[pg].scores[c];
    if (typeof was === 'number' && typeof now === 'number' && now < was - TOLERANCE) drops.push(`${pg} ${c}: ${was} -> ${now}`);
  }
  ok(!drops.length, `no score dropped more than ${TOLERANCE} points below the baseline` + (drops.length ? ':\n   ' + drops.join('\n   ') : ''));
} else console.log('INFO no baseline yet (tests/perf-baseline.json); this run is the first measurement');
console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exitCode = fails ? 1 : 0;
