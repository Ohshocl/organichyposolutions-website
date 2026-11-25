// Part of the OHS browser test suite. Run all with: node tests/run-all.js
// Stock checks (audit R04/R05) against SIMULATED Shopify Storefront responses.
// Proves the logic (one shared client, per-variant stock, backorder, per-request cache,
// stale/unknown handling, checkout behaviour). It does NOT prove the live store's real
// stock - that needs a check against Shopify itself.
const B = process.env.BASE_URL || 'http://localhost:8805';
const path = require('path');
const { chromium } = require('./engine'); const { route } = require('./lib');
global.window = {}; const _log = console.log; console.log = () => {};
require(path.join(process.env.SITE_ROOT || path.join(__dirname, '..'), 'shop/js/product-catalog.js'));
console.log = _log;
const CATALOG = global.window.PRODUCT_CATALOG; delete global.window;
const USDA = '7418569752647', SERUM = '7249401348167', WIPES = '7249401315399', EPA = '7249401053255';
const v = (id, tier) => String(CATALOG[id].shopifyVariants[tier]);

// scenario: { [variantId]: { available, quantity } } ; anything not listed: available, 100 in stock
function mockShopify(ctx, scenario, opts = {}) {
  const calls = [];
  return ctx.route('**/api/*/graphql.json', async r => {
    let body = {}; try { body = JSON.parse(r.request().postData() || '{}'); } catch (e) {}
    const ids = (body.variables && body.variables.ids) || [];
    calls.push(ids.map(g => g.split('/').pop()));
    if (opts.fail && opts.fail(calls.length)) return r.fulfill({ status: 503, body: 'down' });
    const nodes = ids.map(gid => {
      const id = gid.split('/').pop(); const p = CATALOG[id]; if (!p || (opts.omit || []).includes(id)) return null;
      const edges = Object.values(p.shopifyVariants).map(vid => { const s = scenario[String(vid)] || { available: true, quantity: 100 };
        return { node: { id: 'gid://shopify/ProductVariant/' + vid, title: 'x', availableForSale: s.available, quantityAvailable: s.quantity, currentlyNotInStock: false, sku: '' } }; });
      return { id: gid, title: p.name, availableForSale: edges.some(e => e.node.availableForSale), totalInventory: 0, variants: { pageInfo: { hasNextPage: false }, edges } };
    });
    return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: { nodes } }) });
  }).then(() => calls);
}

(async () => {
  const b = await chromium.launch(); let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
  async function ctxFor(seedCart, state) {
    const c = await b.newContext({ viewport: { width: 1280, height: 900 } }); await route(c);
    await c.addInitScript(([cart, st]) => { if (!sessionStorage.getItem('s')) { localStorage.setItem('analytics_consent', 'denied'); localStorage.setItem('ohsUserState', st || 'UT'); localStorage.setItem('ohsCart', cart || '[]'); sessionStorage.setItem('s', '1'); } }, [seedCart || null, state || null]);
    return c;
  }
  const badge = (p, id) => p.evaluate(id => { const c = document.querySelector(`[data-product-id="${id}"]`); if (!c) return null; const b = c.querySelector('.inventory-badge'); const btn = c.querySelector('button[onclick^="addToCartLocal"]'); return { badge: b ? b.textContent.trim() : '', addEnabled: !!btn && !btn.disabled }; }, id);

  // 1. products page badges from the ONE shared client (per retail variant, backorder aware)
  { const c = await ctxFor(); const calls = await mockShopify(c, { [v(SERUM, 'retail')]: { available: false, quantity: 0 }, [v(WIPES, 'retail')]: { available: true, quantity: -3 }, [v(USDA, 'retail')]: { available: true, quantity: 3 } }, { omit: [EPA] });
    const p = await c.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto(B + '/products.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(900);
    const r = { usda: await badge(p, USDA), serum: await badge(p, SERUM), wipes: await badge(p, WIPES), epa: await badge(p, EPA) };
    const sameFn = await p.evaluate(() => typeof window.getVariantStatus === 'function' && !/inventoryCache\[productId\]/.test(String(window.getInventoryStatus)));
    ok(sameFn, 'products page uses the shared stock client (no second copy overriding it)');
    ok(r.usda && /Only 3 left/.test(r.usda.badge) && r.usda.addEnabled, `low stock: "${r.usda && r.usda.badge}", can add`);
    ok(r.serum && /Out of Stock/.test(r.serum.badge) && !r.serum.addEnabled, `retail variant sold out: "${r.serum && r.serum.badge}", add disabled`);
    ok(r.wipes && /Available to order/.test(r.wipes.badge) && r.wipes.addEnabled, `backorder (keep selling at 0): "${r.wipes && r.wipes.badge}", can add`);
    ok(r.epa && r.epa.badge === '' && r.epa.addEnabled, `product Shopify didn't return: no badge, not blocked (unknown, not "in stock")`);
    ok(calls.length >= 1 && !errs.length, `one stock request on load (${calls.length}); no JS errors ${errs.join('|')}`);
    // 2. cache is per requested product
    const before = calls.length;
    await p.evaluate(async id => { await window.fetchInventory([id]); }, USDA);
    const afterCached = calls.length;
    await p.evaluate(async id => { await window.refreshInventory([id]); }, SERUM);
    const last = calls[calls.length - 1] || [];
    ok(afterCached === before && calls.length === before + 1 && last.length === 1 && last[0] === SERUM,
      `cache per product: cached product -> no request; refreshing one product asks for just that one (${JSON.stringify(last)})`);
    await c.close(); }

  // 3. Shopify unreachable: page still works, nothing blocked, error recorded
  { const c = await ctxFor(); await mockShopify(c, {}, { fail: () => true });
    const p = await c.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto(B + '/products.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(900);
    const r = await badge(p, USDA); const err = await p.evaluate(() => window.getInventoryError && window.getInventoryError());
    ok(r && r.badge === '' && r.addEnabled && !!err && !errs.length, `Shopify down: no badges, buying still works, error noted ("${err}")`);
    await c.close(); }

  // 4. stale data: last good answer kept but not trusted
  { const c = await ctxFor(); await mockShopify(c, { [v(USDA, 'retail')]: { available: false, quantity: 0 } }, { fail: n => n >= 2 });
    const p = await c.newPage(); await p.goto(B + '/products.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
    const s = await p.evaluate(async ([id, vid]) => { window.OHS_INVENTORY_TTL_MS = 0; await window.fetchInventory([id]); return window.getVariantStatus(id, vid, 1); }, [USDA, v(USDA, 'retail')]);
    ok(s.state === 'stale' && s.known === false && s.lastKnown === 'unavailable', `refresh failed: state stale, not trusted, last known kept (${JSON.stringify(s)})`);
    await c.close(); }

  // 5. checkout: the line's OWN variant is short -> blocked, explained, cart unchanged
  { const th = CATALOG[USDA].wholesaleThreshold; const qty = th + 6;
    const c = await ctxFor(JSON.stringify([{ productId: USDA, quantity: qty }]));
    await mockShopify(c, { [v(USDA, 'wholesale')]: { available: true, quantity: th - 4 }, [v(USDA, 'retail')]: { available: true, quantity: 500 } });
    const shop = []; c.on('request', r => { if (r.url().includes('myshopify.com/cart/')) shop.push(r.url()); });
    const p = await c.newPage(); await p.goto(B + '/cart.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(700);
    await p.click('#checkoutBtn'); await p.waitForTimeout(1500);
    const r = await p.evaluate(() => ({ q: window.getCartItems()[0].quantity, note: (document.getElementById('notificationContainer') || {}).textContent || '' }));
    ok(shop.length === 0 && r.q === qty && new RegExp('only ' + (th - 4) + ' available').test(r.note), `wholesale variant has ${th - 4}, cart has ${qty}: checkout stopped, cart unchanged, told why ("${r.note.slice(0, 120)}")`);
    await c.close(); }
  // 6. checkout: line sold out -> blocked
  { const c = await ctxFor(JSON.stringify([{ productId: SERUM, quantity: 1 }]));
    await mockShopify(c, { [v(SERUM, 'retail')]: { available: false, quantity: 0 } });
    const shop = []; c.on('request', r => { if (r.url().includes('myshopify.com/cart/')) shop.push(r.url()); });
    const p = await c.newPage(); await p.goto(B + '/cart.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(700);
    await p.click('#checkoutBtn'); await p.waitForTimeout(1500);
    const note = await p.evaluate(() => (document.getElementById('notificationContainer') || {}).textContent || '');
    ok(shop.length === 0 && /out of stock/.test(note), `sold-out line: checkout stopped with a clear message`);
    await c.close(); }
  // 7. checkout: Shopify unreachable -> proceeds, customer told stock is unconfirmed
  { const c = await ctxFor(JSON.stringify([{ productId: SERUM, quantity: 2 }]));
    await mockShopify(c, {}, { fail: () => true });
    const shop = []; c.on('request', r => { if (r.url().includes('myshopify.com/cart/')) shop.push(r.url()); });
    const p = await c.newPage(); await p.goto(B + '/cart.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(700);
    await p.click('#checkoutBtn'); await p.waitForTimeout(2500);
    const note = await p.evaluate(() => (document.getElementById('notificationContainer') || {}).textContent || '');
    ok(shop.length === 1 && /couldn't confirm stock/.test(note), `stock unknown: checkout still opens, with "couldn't confirm stock... Shopify will confirm" (${shop.length} checkout request)`);
    await c.close(); }
  // 8. backorder line goes through
  { const c = await ctxFor(JSON.stringify([{ productId: WIPES, quantity: 3 }]));
    await mockShopify(c, { [v(WIPES, 'retail')]: { available: true, quantity: -10 } });
    const shop = []; c.on('request', r => { if (r.url().includes('myshopify.com/cart/')) shop.push(r.url()); });
    const p = await c.newPage(); await p.goto(B + '/cart.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(700);
    await p.click('#checkoutBtn'); await p.waitForTimeout(2500);
    ok(shop.length === 1, 'backorder ("continue selling when out of stock") line: checkout goes through');
    await c.close(); }

  console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exitCode = fails ? 1 : 0; await b.close();
})();
