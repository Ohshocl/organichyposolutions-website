// Part of the OHS browser test suite. Run all with: node tests/run-all.js
// Calculator choice cards (Job Complexity, Service Option, Contract Options) work
// from the keyboard and tell screen readers which one is chosen (radio groups).
// Regression: they used to be mouse-only <div>s.
const B = process.env.BASE_URL || 'http://localhost:8805';
const { chromium } = require('./engine'); const { route } = require('./lib');

(async () => {
  const b = await chromium.launch(); let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } }); await route(ctx);
  await ctx.addInitScript(() => { localStorage.setItem('analytics_consent', 'denied'); localStorage.setItem('ohsUserState', 'UT'); localStorage.setItem('ohsUserIntent', 'shop'); });
  const p = await ctx.newPage(); const errors = []; p.on('pageerror', e => errors.push(e.message));
  await p.goto(`${B}/calculator.html`, { waitUntil: 'networkidle' }); await p.waitForTimeout(300);

  const groups = await p.evaluate(() => Array.from(document.querySelectorAll('[role="radiogroup"]')).map(g => ({
    name: (document.getElementById(g.getAttribute('aria-labelledby')) || {}).textContent || '',
    radios: g.querySelectorAll('[role="radio"]').length,
    checked: g.querySelectorAll('[role="radio"][aria-checked="true"]').length,
    tabbable: g.querySelectorAll('[role="radio"][tabindex="0"]').length
  })));
  ok(groups.length === 3, `3 card groups are radio groups (got ${groups.length})`);
  ok(groups.every(g => g.name.trim() && g.radios >= 3 && g.checked === 1 && g.tabbable === 1), 'each group is named by its label, has one checked card, and one Tab stop');

  const price = () => p.locator('#totalPrice').textContent();
  const surface = p.locator('#mold-surface');
  await surface.focus();
  const before = await price();
  await p.keyboard.press('ArrowRight'); await p.waitForTimeout(150);
  const s1 = await p.evaluate(() => ({ focus: document.activeElement.id, moderate: document.getElementById('mold-moderate').getAttribute('aria-checked'), selected: document.getElementById('mold-moderate').classList.contains('selected'), surface: document.getElementById('mold-surface').getAttribute('aria-checked') }));
  ok(s1.focus === 'mold-moderate' && s1.moderate === 'true' && s1.selected && s1.surface === 'false', 'Arrow Right moves to and selects "Moderate" (aria-checked follows)');
  ok((await price()) !== before, `estimate updates from the keyboard (${before} -> ${await price()})`);
  await p.keyboard.press('ArrowLeft'); await p.keyboard.press('ArrowLeft'); await p.waitForTimeout(150);
  ok(await p.evaluate(() => document.activeElement.id === 'mold-complex' && document.getElementById('mold-complex').getAttribute('aria-checked') === 'true'), 'Arrow Left wraps around to "Complex"');

  await p.locator('#annualContract').focus(); await p.keyboard.press(' '); await p.waitForTimeout(150);
  ok(await p.evaluate(() => document.getElementById('annualContract').getAttribute('aria-checked') === 'true' && document.getElementById('payPerService').getAttribute('tabindex') === '-1'), 'Space selects a service option; the old one leaves the Tab order');

  await p.click('#mold-surface'); await p.waitForTimeout(150);
  ok(await p.evaluate(() => document.getElementById('mold-surface').getAttribute('aria-checked') === 'true' && document.getElementById('mold-complex').getAttribute('aria-checked') === 'false'), 'mouse clicks still work and keep aria-checked in sync');

  await p.click('#tab-fogging'); await p.waitForTimeout(200);
  await p.locator('#monthlyContractFogging').focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(150);
  ok(await p.evaluate(() => document.getElementById('monthlyContractFogging').getAttribute('aria-checked') === 'true'), 'fogging contract cards work from the keyboard (Enter)');
  ok(!errors.length, 'no page errors' + (errors.length ? ': ' + errors.join('; ') : ''));

  await b.close();
  console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exitCode = fails ? 1 : 0;
})();
