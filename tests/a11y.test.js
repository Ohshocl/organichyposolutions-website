// Part of the OHS browser test suite. Run all with: node tests/run-all.js
// Automated accessibility check (axe-core, WCAG 2.1 A/AA rules) on every page.
// Serious and critical problems that already existed are recorded per page in
// a11y-baseline.json; they're reported but don't fail. A NEW one fails, and one
// that has been fixed must be removed from the baseline (the list only shrinks).
// Regenerate after a deliberate fix:  A11Y_WRITE_BASELINE=1 node tests/run-all.js a11y
const B = process.env.BASE_URL || 'http://localhost:8805';
const fs = require('fs'), path = require('path');
const { chromium } = require('./engine'); const { route } = require('./lib');
const ROOT = process.env.SITE_ROOT || path.join(__dirname, '..');
const BASELINE_FILE = path.join(__dirname, 'a11y-baseline.json');
const AXE = require.resolve('axe-core/axe.min.js');

(async () => {
  const b = await chromium.launch(); let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
  const pages = fs.readdirSync(ROOT).filter(f => f.endsWith('.html') && !f.startsWith('google')).sort();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } }); await route(ctx);
  // Returning visitor (state chosen, cookie choice made): check the page itself, not first-visit pop-ups
  await ctx.addInitScript(() => { localStorage.setItem('analytics_consent', 'denied'); localStorage.setItem('ohsUserState', 'UT'); localStorage.setItem('ohsUserIntent', 'shop'); });
  const p = await ctx.newPage();
  const found = {};   // page -> { ruleId: count }
  for (const f of pages) {
    await p.goto(`${B}/${f}`, { waitUntil: 'networkidle' }).catch(() => {});
    await p.waitForTimeout(400);
    await p.addScriptTag({ path: AXE });
    const res = await p.evaluate(async () => {
      const r = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] }, resultTypes: ['violations'] });
      return r.violations.filter(v => v.impact === 'serious' || v.impact === 'critical').map(v => ({ id: v.id, n: v.nodes.length }));
    });
    found[f] = {}; res.forEach(v => { found[f][v.id] = v.n; });
  }

  // Keyboard: the "Safety Data Sheet" panels open and close with Enter / Space
  // (they were mouse-only <div>s; regression check for the a11y fixes)
  const sdsPages = pages.filter(f => /data-bs-target="#sds-embed-/.test(fs.readFileSync(path.join(ROOT, f), 'utf8')));
  const sdsBad = [];
  for (const f of sdsPages) {
    await p.goto(`${B}/${f}`, { waitUntil: 'networkidle' }).catch(() => {});
    const h = p.locator('[data-bs-target^="#sds-embed-"]').first();
    const target = await h.getAttribute('data-bs-target');
    await h.focus();
    const focused = await h.evaluate(el => el === document.activeElement);
    await p.keyboard.press('Enter'); await p.waitForTimeout(500);
    const opened = await p.locator(target).evaluate(el => el.classList.contains('show'));
    const expanded = await h.getAttribute('aria-expanded');
    await p.keyboard.press(' '); await p.waitForTimeout(500);
    const closed = await p.locator(target).evaluate(el => !el.classList.contains('show'));
    if (!(focused && opened && expanded === 'true' && closed)) sdsBad.push(`${f} (focus ${focused}, Enter opens ${opened}, aria-expanded ${expanded}, Space closes ${closed})`);
  }
  ok(sdsPages.length > 0 && !sdsBad.length, `Safety Data Sheet panel opens/closes from the keyboard on ${sdsPages.length} pages` + (sdsBad.length ? ':\n   ' + sdsBad.join('\n   ') : ''));
  await b.close();

  if (process.env.A11Y_WRITE_BASELINE) {
    fs.writeFileSync(BASELINE_FILE, JSON.stringify({ note: 'Serious/critical axe-core (WCAG 2.1 AA) problems that existed when recorded. Each page lists rule ids; the test fails on any rule not listed and on listed rules that are now fixed. Re-record only after a deliberate fix: A11Y_WRITE_BASELINE=1 node tests/run-all.js a11y', recorded: new Date().toISOString().slice(0, 10), pages: Object.fromEntries(Object.entries(found).map(([pg, rules]) => [pg, Object.keys(rules).sort()])) }, null, 2) + '\n');
    console.log('Baseline written: ' + BASELINE_FILE);
  }
  const base = JSON.parse(fs.readFileSync(BASELINE_FILE, 'utf8')).pages || {};
  const added = [], fixed = [];
  for (const pg of pages) {
    const now = Object.keys(found[pg] || {}), was = base[pg] || [];
    now.filter(r => !was.includes(r)).forEach(r => added.push(`${pg}: ${r} (${found[pg][r]} element${found[pg][r] > 1 ? 's' : ''})`));
    was.filter(r => !now.includes(r)).forEach(r => fixed.push(`${pg}: ${r}`));
  }
  const totalKnown = Object.values(base).reduce((n, a) => n + a.length, 0);
  ok(!added.length, `no new serious/critical accessibility problems on ${pages.length} pages` + (added.length ? ':\n   ' + added.join('\n   ') : ''));
  ok(!fixed.length, 'a11y-baseline.json is up to date' + (fixed.length ? ' - fixed now, remove from the baseline:\n   ' + fixed.join('\n   ') : ''));
  const byRule = {}; Object.values(base).forEach(a => a.forEach(r => { byRule[r] = (byRule[r] || 0) + 1; }));
  console.log(`INFO ${totalKnown} known page/rule problems still to fix: ` + Object.entries(byRule).sort((a, b) => b[1] - a[1]).map(([r, n]) => `${r} (${n} pages)`).join(', '));
  console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exitCode = fails ? 1 : 0;
})();
