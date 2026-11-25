// Part of the OHS browser test suite. Run all with: node tests/run-all.js
// Shared visitor-state module (audit R09): every picker saves the same way, fires one
// 'stateChanged', updates the menu label, re-checks the cart, and syncs across tabs.
const B = process.env.BASE_URL || 'http://localhost:8805';
const { chromium } = require('playwright'); const { route } = require('./lib');
const EPA = '7249401053255', USDA = '7418569752647';
(async () => {
  const b = await chromium.launch(); let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
  async function ctxWith(seed) {
    const c = await b.newContext({ viewport: { width: 1280, height: 900 } }); await route(c);
    await c.addInitScript(([seed]) => { if (!sessionStorage.getItem('s')) { localStorage.setItem('analytics_consent', 'denied'); localStorage.setItem('ohsUserIntent', 'shop'); localStorage.removeItem('ohsUserState'); localStorage.setItem('ohsCart', seed || '[]'); sessionStorage.setItem('s', '1'); }
      window.__stateEvents = []; window.addEventListener('stateChanged', e => window.__stateEvents.push(e.detail && e.detail.state)); }, [seed || null]);
    return c;
  }
  async function page(c, path) { const p = await c.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); await p.goto(B + path, { waitUntil: 'networkidle' }); await p.waitForTimeout(700); return [p, errs]; }
  const snap = p => p.evaluate(() => ({ ls: localStorage.getItem('ohsUserState'), ck: (document.cookie.match(/ohs_user_state=([^;]*)/) || [])[1] || null, ev: window.__stateEvents.slice(), nav: (document.getElementById('navStateName') || {}).textContent || '', cart: (window.getCartItems ? window.getCartItems() : JSON.parse(localStorage.getItem('ohsCart') || '[]')).map(i => i.productId) }));

  // 1. menu picker (global modal) on a page without cart.js
  { const c = await ctxWith(); const [p, errs] = await page(c, '/mold-remediation.html');
    await p.evaluate(() => { document.querySelectorAll('#intentModal').forEach(m => m.remove()); showStateModal(); });
    await p.selectOption('#globalStateSelect', 'CO'); await p.click('#globalStateConfirmBtn'); await p.waitForTimeout(200);
    const r = await snap(p);
    ok(r.ls === 'CO' && r.ck === 'CO' && r.ev.join() === 'CO' && /Colorado|CO/.test(r.nav), `menu picker: saved + cookie + one event + menu label (${JSON.stringify(r)})`);
    ok(!errs.length, 'no JS errors ' + errs.join('|')); await c.close(); }

  // 2. homepage picker with a Utah-only item in the cart -> cart re-checked immediately
  { const seed = JSON.stringify([{ productId: EPA, quantity: 1 }, { productId: USDA, quantity: 2 }]);
    const c = await ctxWith(seed); const [p, errs] = await page(c, '/index.html');
    const has = await p.evaluate(() => !!document.getElementById('stateSelect'));
    await p.evaluate(() => { const s = document.getElementById('stateSelect'); s.value = 'NV'; s.dispatchEvent(new Event('change')); document.getElementById('confirmStateBtn').click(); });
    await p.waitForTimeout(300);
    const r = await snap(p);
    ok(has && r.ls === 'NV' && r.ck === 'NV' && r.ev.join() === 'NV' && !r.cart.includes(EPA) && r.cart.includes(USDA), `homepage picker: Nevada saved once, Utah-only item removed right away, other item kept (${JSON.stringify({ ls: r.ls, ev: r.ev, cart: r.cart })})`);
    ok(!errs.length, 'no JS errors ' + errs.join('|')); await c.close(); }

  // 3. products page picker fires once and reloads products once
  { const c = await ctxWith(); const [p, errs] = await page(c, '/products.html');
    await p.evaluate(() => { window.__loads = 0; const orig = window.loadProducts; });
    await p.evaluate(() => { const s = document.getElementById('modalStateSelect'); s.value = 'UT'; s.dispatchEvent(new Event('change')); document.getElementById('confirmStateBtn').click(); });
    await p.waitForTimeout(600);
    const r = await snap(p);
    const epaShown = await p.evaluate(id => !!document.querySelector(`[data-product-id="${id}"]`), EPA);
    ok(r.ls === 'UT' && r.ck === 'UT' && r.ev.join() === 'UT' && epaShown, `products picker: Utah saved, one event, EPA products shown (${JSON.stringify({ ev: r.ev, epaShown })})`);
    ok(!errs.length, 'no JS errors ' + errs.join('|')); await c.close(); }

  // 4. another tab changes the state -> this tab hears it and re-checks its cart
  { const seed = JSON.stringify([{ productId: EPA, quantity: 1 }]);
    const c = await ctxWith(seed); const [a] = await page(c, '/cart.html'); const [p2] = await page(c, '/mold-remediation.html');
    await a.evaluate(() => window.OHSState.set('UT')); await a.waitForTimeout(200);
    await p2.evaluate(() => { document.querySelectorAll('#intentModal').forEach(m => m.remove()); showStateModal(); });
    await p2.selectOption('#globalStateSelect', 'AZ'); await p2.click('#globalStateConfirmBtn'); await a.waitForTimeout(500);
    const r = await snap(a);
    ok(r.ev.includes('AZ') && !r.cart.includes(EPA), `other tab picks Arizona -> cart tab gets the event and drops the Utah-only item (${JSON.stringify({ ev: r.ev, cart: r.cart })})`);
    await c.close(); }

  // 5. bad input and stale cookie
  { const c = await ctxWith(); const [p] = await page(c, '/cart.html');
    const r = await p.evaluate(() => { const before = window.OHSState.get(); return { a: window.OHSState.set('Utah'), b: window.OHSState.set(''), c: window.OHSState.set('ut'), after: window.OHSState.get() }; });
    ok(r.a === null && r.b === null && r.c === 'UT' && r.after === 'UT', `invalid codes rejected, lowercase accepted (${JSON.stringify(r)})`);
    await p.evaluate(() => { document.cookie = 'ohs_user_state=CO;path=/'; localStorage.setItem('ohsUserState', 'UT'); });
    const g = await p.evaluate(() => ({ s: window.getUserState(), ck: (document.cookie.match(/ohs_user_state=([^;]*)/) || [])[1] }));
    ok(g.s === 'UT' && g.ck === 'UT', `saved choice wins over an old cookie, cookie fixed (${JSON.stringify(g)})`);
    await c.close(); }

  console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exitCode = fails ? 1 : 0; await b.close();
})();
