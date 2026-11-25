// Part of the OHS browser test suite. Run all with: node tests/run-all.js
// Calculator -> booking handoff tests (audit R11). Usage: node handoff.js <port>
const { chromium } = require('./engine'); const {route}=require('./lib');
const B = process.env.BASE_URL || 'http://localhost:8805';
(async () => {
  const b = await chromium.launch(); let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } }); await route(ctx);
  await ctx.addInitScript(() => localStorage.setItem('analytics_consent', 'denied'));
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  const num = t => Number(String(t || '').replace(/[^0-9.]/g, '')) || 0;
  async function fromCalc(setup, button) {
    await p.goto(B + '/calculator.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(400);
    const calc = await p.evaluate(setup);
    await Promise.all([p.waitForNavigation({ waitUntil: 'networkidle' }), p.evaluate(btn => window[btn](), button)]);
    await p.waitForTimeout(700);
    const book = await p.evaluate(() => ({
      est: document.getElementById('estimateDisplay').textContent,
      fac: (document.getElementById('facilityType') || {}).value,
      cx: (document.getElementById('complexity') || {}).value,
      notes: (document.getElementById('notes') || {}).value || '',
      svc: (document.getElementById('hiddenServiceType') || {}).value,
      contract: (document.getElementById('hiddenContract') || {}).value }));
    return [calc, book];
  }
  // fogging: every service type, two complexities, three sizes
  const want = { residential: 'residential_home', commercial: 'commercial_office', healthcare: 'commercial_healthcare', education: 'commercial_education', food: 'commercial_food', fitness: 'commercial_gym' };
  let allMatch = true; const miss = [];
  for (const st of Object.keys(want)) for (const cx of ['standard', 'complex']) for (const sq of [3500, 20000, 35000]) {
    const [calc, book] = await fromCalc(new Function(`setServiceMode('fogging'); document.getElementById('serviceType').value='${st}'; document.getElementById('complexity').value='${cx}'; document.getElementById('frequency').value='weekly'; document.getElementById('squareFootageFogging').value=${sq}; updateCalculator(); return lastCalculation.totalPrice;`), 'requestQuote');
    const good = Math.abs(num(book.est) - calc) <= 1 && book.fac === want[st] && book.cx === cx && /Weekly service/.test(book.notes);
    if (!good) { allMatch = false; miss.push(`${st}/${cx}/${sq}: calc $${calc} vs booking ${book.est}, facility ${book.fac}, complexity ${book.cx}`); }
  }
  ok(allMatch, 'fogging, all 6 service types x 2 complexities x 3 sizes: booking estimate = calculator, right facility, complexity and frequency carried' + (miss.length ? ' | ' + miss.slice(0, 4).join(' | ') : ''));
  // mold
  { const [calc, book] = await fromCalc(() => { setServiceMode('mold'); selectMoldComplexity('moderate'); document.getElementById('moldPropertyType').value = 'healthcare'; document.getElementById('moistureStatus').value = 'flood'; document.getElementById('squareFootage').value = 800; updateCalculator(); return lastCalculation.totalPrice; }, 'requestQuote');
    ok(/Mold remediation/.test(book.notes) && /800 sq ft/.test(book.notes) && /Healthcare/.test(book.notes) && /Moderate severity/.test(book.notes) && /Post-flood/.test(book.notes) && book.notes.includes('$' + calc.toLocaleString()) && book.svc === 'mold_remediation' && !/\$/.test(book.est),
      `mold: notes carry size, property, severity, moisture and estimate; no fogging price shown (notes: "${book.notes}", estimate box: "${book.est}")`); }
  // contract quote keeps complexity and frequency
  { const [calc, book] = await fromCalc(() => { setServiceMode('fogging'); document.getElementById('serviceType').value = 'food'; document.getElementById('complexity').value = 'moderate'; document.getElementById('frequency').value = 'biweekly'; document.getElementById('squareFootageFogging').value = 6000; selectSubscription ? selectSubscription('monthlyContract') : null; updateCalculator(); return lastCalculation.contractPrice; }, 'requestContractQuote');
    ok(book.contract === 'monthlyContract' && book.cx === 'moderate' && book.fac === 'commercial_food' && /Bi-weekly/.test(book.notes) && Math.abs(num(book.est) - calc) <= 1,
      `contract quote: monthly contract, food, moderate, bi-weekly carried; booking $${num(book.est)} vs calculator contract $${calc}`); }
  // tampered link
  { await p.goto(B + '/book-service.html?source=calculator&serviceType=%3Cimg%20src%3Dx%3E&sqft=999999&complexity=evil&estimate=1', { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
    const r = await p.evaluate(() => ({ est: document.getElementById('estimateDisplay').textContent, img: !!document.querySelector('.form-content img[src="x"]'), sq: document.getElementById('squareFootage').value, cx: document.getElementById('complexity').value }));
    ok(!r.img && r.cx !== 'evil' && !/\$1$/.test(r.est.trim()), `tampered link ignored: no injected HTML, bad complexity ignored, estimate not taken from link ("${r.est}")`); }
  ok(!errs.length, 'no JS errors ' + errs.join(' | '));
  console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exitCode = fails ? 1 : 0; await b.close();
})();
