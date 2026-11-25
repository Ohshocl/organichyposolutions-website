// Part of the OHS browser test suite. Run all with: node tests/run-all.js
// Service estimate parity: calculator.html and book-service.html show exactly the
// price the shared engine (shop/js/service-pricing.js) calculates, for every
// service type, small and large facilities and each complexity; and the
// calculator's mold estimate matches it too.
const B = process.env.BASE_URL || 'http://localhost:8805';
const fs = require('fs'), path = require('path'), vm = require('vm');
const { chromium } = require('./engine'); const { route } = require('./lib');
const ROOT = process.env.SITE_ROOT || path.join(__dirname, '..');

// Expected numbers: from the engine file if this tree has it, else from the
// hand-worked unit cases (so the same test can check an older page too)
const ctx = vm.createContext({ Math, Number }); ctx.window = ctx;
vm.runInContext(fs.readFileSync(path.join(ROOT, 'shop/js/service-pricing.js'), 'utf8'), ctx);
const SP = ctx.OHSServicePricing;
const money = n => Math.round(n).toLocaleString('en-US');

// [booking facility value, engine service key, sq ft, complexity]
const CASES = [
  ['commercial_office', 'commercial', 10000, 'standard'],
  ['residential_home', 'residential', 2000, 'standard'],
  ['residential_home', 'residential', 30000, 'moderate'],
  ['commercial_healthcare', 'healthcare', 50000, 'complex'],
  ['commercial_food', 'food', 4500, 'moderate'],
  ['commercial_education', 'education', 21000, 'standard'],
  ['commercial_gym', 'fitness', 500, 'standard']
];

(async () => {
  const b = await chromium.launch(); let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
  const c = await b.newContext({ viewport: { width: 1280, height: 900 } }); await route(c);
  await c.addInitScript(() => { localStorage.setItem('analytics_consent', 'denied'); localStorage.setItem('ohsUserIntent', 'shop'); localStorage.setItem('ohsUserState', 'UT'); });
  const errs = [];

  // Calculator, fogging mode
  const calc = await c.newPage(); calc.on('pageerror', e => errs.push('calculator: ' + e.message));
  await calc.goto(`${B}/calculator.html`, { waitUntil: 'networkidle' }); await calc.waitForTimeout(300);
  await calc.evaluate(() => window.setServiceMode ? setServiceMode('fogging') : document.getElementById('tab-fogging').click());
  const calcBad = [];
  for (const [, service, sqft, cx] of CASES) {
    if (sqft < 500 || sqft > 50000) continue;   // the calculator slider's range
    const shown = await calc.evaluate(([service, sqft, cx]) => {
      const set = (id, v) => { const e = document.getElementById(id); e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); };
      set('serviceType', service); set('complexity', cx); set('squareFootageFogging', sqft);
      return document.getElementById('totalPrice').textContent.trim();
    }, [service, sqft, cx]);
    const want = '$' + money(SP.foggingEstimate(service, sqft, cx).totalPrice);
    if (shown !== want) calcBad.push(`${service} ${sqft} ${cx}: shows ${shown}, engine ${want}`);
  }
  ok(!calcBad.length, `calculator shows the engine's price for ${CASES.filter(x => x[2] >= 500).length} fogging cases` + (calcBad.length ? ':\n   ' + calcBad.join('\n   ') : ''));

  // Calculator, mold mode
  await calc.evaluate(() => window.setServiceMode ? setServiceMode('mold') : document.getElementById('tab-mold').click());
  const moldBad = [];
  for (const [ptype, moisture, cplx, sqft] of [['residential', 'active', 'surface', 400], ['commercial', 'flood', 'complex', 1200], ['multi-family', 'fixed', 'moderate', 50]]) {
    const shown = await calc.evaluate(([ptype, moisture, cplx, sqft]) => {
      const set = (id, v) => { const e = document.getElementById(id); e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); };
      if (window.selectMoldComplexity) selectMoldComplexity(cplx);
      set('moldPropertyType', ptype); set('moistureStatus', moisture); set('squareFootage', sqft);
      return { range: document.getElementById('totalPrice').textContent.trim(), mid: document.getElementById('breakdownTotal').textContent.trim() };
    }, [ptype, moisture, cplx, sqft]);
    const e = SP.moldEstimate(sqft, ptype, moisture, cplx);
    const want = { range: '$' + money(e.lowTotal) + '–$' + money(e.highTotal), mid: '$' + money(e.totalPrice) + ' mid-estimate' };
    if (shown.range !== want.range || shown.mid !== want.mid) moldBad.push(`${ptype} ${moisture} ${cplx} ${sqft}: shows ${shown.range} / ${shown.mid}, engine ${want.range} / ${want.mid}`);
  }
  ok(!moldBad.length, 'calculator mold estimate (range and mid) matches the engine for 3 cases' + (moldBad.length ? ':\n   ' + moldBad.join('\n   ') : ''));

  // Booking page
  const book = await c.newPage(); book.on('pageerror', e => errs.push('book-service: ' + e.message));
  await book.goto(`${B}/book-service.html`, { waitUntil: 'networkidle' }); await book.waitForTimeout(300);
  const bookBad = [];
  for (const [facility, service, sqft, cx] of CASES) {
    const step = Math.round(sqft / 500) * 500; if (step !== sqft) continue;   // the booking slider moves in 500s
    const shown = await book.evaluate(([facility, sqft, cx]) => {
      const set = (id, v) => { const e = document.getElementById(id); e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); };
      document.getElementById(facility.startsWith('residential') ? 'card-residential' : 'card-commercial').click();
      set('facilityType', facility); set('complexity', cx); set('squareFootage', sqft);
      const pr = document.querySelector('input[name="urgency"][value="priority"]'); if (pr && pr.checked) pr.click();
      return document.getElementById('breakdownTotal').textContent.trim();
    }, [facility, sqft, cx]);
    const want = '~$' + money(SP.foggingEstimate(service, sqft, cx).totalPrice);
    if (shown !== want) bookBad.push(`${facility} ${sqft} ${cx}: shows ${shown}, engine ${want}`);
  }
  ok(!bookBad.length, `booking page shows the engine's price for ${CASES.filter(x => x[2] % 500 === 0).length} cases (every service type)` + (bookBad.length ? ':\n   ' + bookBad.join('\n   ') : ''));
  ok(!errs.length, 'no page errors' + (errs.length ? ': ' + errs.join('; ') : ''));

  await b.close();
  console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exitCode = fails ? 1 : 0;
})();
