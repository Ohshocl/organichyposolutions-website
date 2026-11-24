// Part of the OHS browser test suite. Run all with: node tests/run-all.js
// Cart regression tests for audit R01, R06, R07, R08, R12, R13, R17 (section 6 scenarios).
// Usage: node cartlines.js <port>
const { chromium } = require('playwright'); const {route}=require('./lib');
const B = process.env.BASE_URL || 'http://localhost:8805';
const USDA = '7418569752647';   // 32oz USDA cleaner
const SERUM = '7249401348167';
(async () => {
  const b = await chromium.launch(); let fails = 0;
  const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
  async function page(path, seed) {
    const c = await b.newContext({ viewport: { width: 1280, height: 900 } }); await route(c);
    await c.addInitScript(([seed]) => { if (!sessionStorage.getItem('s')) { localStorage.setItem('analytics_consent','denied'); localStorage.setItem('ohsUserState','UT'); localStorage.setItem('ohsCart', seed || '[]'); sessionStorage.setItem('s','1'); } }, [seed || null]);
    const p = await c.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => d.accept());
    await p.goto(B + path, { waitUntil: 'networkidle' }); await p.waitForTimeout(700);
    await p.evaluate(() => document.querySelectorAll('#intentModal,.state-modal').forEach(m => m.remove()));
    return [c, p, errs];
  }
  const lines = p => p.evaluate(() => window.getCartItems().map(i => ({ id: i.productId, q: i.quantity, tier: i.tier, sub: !!i.isSubscription, v: String(i.variantId), w: i.isWholesale, line: i.lineId })));

  // 1. Threshold crossing by repeated additions (R01)
  { const [c, p] = await page('/cart.html');
    const th = await p.evaluate(id => window.findProduct(id).wholesaleThreshold, USDA);
    await p.evaluate(([id, th]) => { window.addToCart(id, th - 4); window.addToCart(id, 4); window.addToCart(id, 1); }, [USDA, th]);
    const L = await lines(p);
    ok(L.length === 1 && L[0].q === th + 1 && L[0].tier === 'wholesale', `add ${th - 4} + 4 + 1 (threshold ${th}) -> one line of ${th + 1} at wholesale: ${JSON.stringify(L.map(x => [x.q, x.tier]))}`);
    await c.close(); }
  { const [c, p] = await page('/cart.html');
    const th = await p.evaluate(id => window.findProduct(id).wholesaleThreshold, USDA);
    await p.evaluate(([id, th]) => { window.addToCart(id, 3); window.addToCart(id, th); }, [USDA, th]);
    const L = await lines(p);
    ok(L.length === 1 && L[0].q === th + 3 && L[0].tier === 'wholesale', `3 retail, then add ${th} -> one line of ${th + 3} at wholesale: ${JSON.stringify(L.map(x => [x.q, x.tier]))}`);
    // back down below the threshold reprices to retail, still one line
    await p.evaluate(([id, th]) => { const l = window.getCartItems()[0]; window.updateCartItemQuantity(l.lineId || l.variantId, th - 1); }, [USDA, th]);
    const L2 = await lines(p);
    ok(L2.length === 1 && L2[0].q === th - 1 && L2[0].tier === 'retail', `lowering to ${th - 1} -> retail, one line: ${JSON.stringify(L2.map(x => [x.q, x.tier]))}`);
    await c.close(); }

  // 2. Mixed one-time + subscription lines: independent update and removal (R13)
  { const [c, p] = await page('/cart.html');
    await p.evaluate(id => { window.addToCart(id, 2, false); window.addToCart(id, 3, true); }, SERUM);
    let L = await lines(p);
    const once = L.find(x => !x.sub), sub = L.find(x => x.sub);
    await p.evaluate(v => window.updateCartItemQuantity(v, 5), sub ? (sub.line || sub.v) : 'x');
    L = await lines(p);
    ok(L.length === 2 && L.find(x => !x.sub).q === 2 && L.find(x => x.sub).q === 5, `update subscription line only: ${JSON.stringify(L.map(x => [x.sub ? 'sub' : 'once', x.q]))}`);
    // remove via the cart page trash button of the one-time line
    await p.evaluate(() => updateCartDisplay && updateCartDisplay()); await p.waitForTimeout(200);
    const btns = await p.$$('.cart-item .btn-outline-danger');
    const onceRow = await p.$$eval('.cart-item', rows => rows.findIndex(r => !/sub/i.test(r.getAttribute('data-line-id') || '')));
    if (btns[onceRow]) { await btns[onceRow].click(); await p.waitForTimeout(300); }
    L = await lines(p);
    ok(L.length === 1 && L[0].sub === true && L[0].q === 5, `remove one-time line on cart page keeps the subscription line: ${JSON.stringify(L.map(x => [x.sub ? 'sub' : 'once', x.q]))}`);
    await c.close(); }

  // 3. Reload keeps complete metadata; savings correct after reload (R07)
  { const [c, p] = await page('/cart.html');
    const th = await p.evaluate(id => window.findProduct(id).wholesaleThreshold, USDA);
    await p.evaluate(([id, th]) => window.addToCart(id, th), [USDA, th]);
    await p.reload({ waitUntil: 'networkidle' }); await p.waitForTimeout(600);
    const r = await p.evaluate(() => ({ l: window.getCartItems()[0], s: window.getCartWholesaleSavings() }));
    ok(r.l && r.l.isWholesale === true && !!r.l.tierKey && r.s > 0, `after reload: isWholesale=${r.l && r.l.isWholesale}, tierKey=${r.l && r.l.tierKey}, savings $${r.s.toFixed(2)}`);
    await c.close(); }
  // old split cart in storage is rejoined into one wholesale line
  { const th = 24;
    const seed = JSON.stringify([{ productId: USDA, variantId: 'x', quantity: 20, tier: 'wholesale', isSubscription: false }, { productId: USDA, variantId: 'y', quantity: 5, tier: 'retail', isSubscription: false }]);
    const [c, p] = await page('/cart.html', seed);
    const L = await lines(p);
    ok(L.length === 1 && L[0].q === 25, `stored cart split across tiers is rejoined: ${JSON.stringify(L.map(x => [x.q, x.tier]))}`);
    await c.close(); }

  // 4. Invalid quantities rejected; malformed storage recovered (R08)
  { const [c, p, errs] = await page('/cart.html');
    const res = await p.evaluate(id => [0, -1, 1.5, NaN, Infinity, 'abc', '', 100000].map(q => window.addToCart(id, q)), SERUM);
    const L = await lines(p);
    ok(L.length === 0 && res.every(r => r === false), `addToCart rejects 0, -1, 1.5, NaN, Infinity, 'abc', '', 100000 (cart lines: ${L.length}; results ${JSON.stringify(res)})`);
    await p.evaluate(id => window.addToCart(id, 2), SERUM);
    const lid = (await lines(p))[0].line || (await lines(p))[0].v;
    const up = await p.evaluate(lid => [1.5, NaN, 'x', 5000].map(q => window.updateCartItemQuantity(lid, q)), lid);
    const L2 = await lines(p);
    ok(L2[0].q === 2 && up.every(r => r === false), `updateCartItemQuantity rejects 1.5, NaN, 'x', 5000 (qty stays ${L2[0].q})`);
    ok(!errs.length, 'no JS errors ' + errs.join('|'));
    await c.close(); }
  { const [c, p, errs] = await page('/cart.html', '{"broken": tru');
    const L = await lines(p);
    ok(L.length === 0 && !errs.length, 'malformed cart storage recovers to an empty cart without errors');
    await c.close(); }
  { const seed = JSON.stringify([{ productId: SERUM, quantity: -4 }, { productId: USDA, quantity: 'lots' }, { productId: 'nope', quantity: 1 }]);
    const [c, p] = await page('/cart.html', seed);
    const L = await lines(p);
    ok(L.length === 2 && L.every(x => x.q === 1), `bad stored quantities recover to 1; unknown product dropped: ${JSON.stringify(L.map(x => x.q))}`);
    await c.close(); }

  // 5. Products drawer controls (R12)
  { const [c, p, errs] = await page('/products.html');
    await p.evaluate(id => window.addToCart(id, 2), SERUM);
    await p.evaluate(() => { if (window.toggleCart) toggleCart(); }); await p.waitForTimeout(400);
    const plus = await p.$('#cartItemsPreview .cart-qty-btn:last-of-type');
    const btns = await p.$$('#cartItemsPreview .cart-qty-btn');
    if (btns[1]) { await btns[1].click({ force: true }); await p.waitForTimeout(200); }
    let L = await lines(p);
    ok(L.length === 1 && L[0].q === 3, `drawer + button: 2 -> ${L[0] && L[0].q}`);
    const btns2 = await p.$$('#cartItemsPreview .cart-qty-btn');
    if (btns2[0]) { await btns2[0].click({ force: true }); await p.waitForTimeout(200); }
    L = await lines(p);
    ok(L.length === 1 && L[0].q === 2, `drawer - button: 3 -> ${L[0] && L[0].q}`);
    ok(!errs.length, 'products page no JS errors ' + errs.join('|'));
    await c.close(); }

  // 6. Rapid edits on two lines on the cart page (R17)
  { const [c, p] = await page('/cart.html');
    await p.evaluate(([a, b]) => { window.addToCart(a, 1); window.addToCart(b, 1); updateCartDisplay(); }, [SERUM, USDA]);
    await p.waitForTimeout(200);
    const ids = await p.$$eval('.cart-item', r => r.map(x => x.getAttribute('data-line-id') || x.getAttribute('data-index')));
    await p.evaluate(([a, b]) => { handleMobileQty(a, '4'); handleMobileQty(b, '6'); }, ids.length === 2 && isNaN(Number(ids[0])) ? ids : [0, 1]);
    await p.waitForTimeout(1200);
    const L = await lines(p);
    ok(L.map(x => x.q).sort().join(',') === '4,6', `two quick edits on different lines both apply: ${JSON.stringify(L.map(x => x.q))}`);
    await c.close(); }

  // 7. Checkout link after merges + opener cut (R06)
  { const [c, p] = await page('/cart.html');
    const th = await p.evaluate(id => window.findProduct(id).wholesaleThreshold, USDA);
    await p.evaluate(([id, th]) => { window.addToCart(id, th - 4); window.addToCart(id, 4); window.addToCart(id, 1); }, [USDA, th]);
    const expectV = await p.evaluate(([id, th]) => String(window.getPricingTier(id, th + 1, false).variantId), [USDA, th]);
    const reqs = []; c.on('request', r => { if (r.url().includes('myshopify.com/cart/')) reqs.push(r.url()); });
    let popup = null; c.on('page', pg => popup = pg);
    await p.click('#checkoutBtn'); await p.waitForTimeout(2500);
    ok(reqs.some(u => u.endsWith(`/cart/${expectV}:${th + 1}`)), `checkout link is one wholesale line ${expectV}:${th + 1} (${reqs[0] || 'none'})`);
    const opener = popup ? await popup.evaluate(() => window.opener === null).catch(() => 'n/a') : 'no popup';
    ok(opener === true || opener === 'n/a', `checkout tab has no link back to the OHS page (opener null: ${opener})`);
    await c.close(); }

  console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exitCode = fails ? 1 : 0; await b.close();
})();
