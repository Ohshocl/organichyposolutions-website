// Part of the OHS browser test suite. Run all with: node tests/run-all.js
// Products page search / filter / sort (sprint 2026-11-24, Priority 1-2).
// Part 1: the filter logic (shop/js/catalog-filters.js) in plain Node.
// Part 2: the products page in a browser: controls, URL, Back/Forward, empty
// results, shipping state, quantities kept, no extra Shopify requests, cart.
const B = process.env.BASE_URL || 'http://localhost:8805';
const fs = require('fs'), path = require('path'), vm = require('vm');
const { chromium } = require('playwright'); const { route } = require('./lib');
const ROOT = process.env.SITE_ROOT || path.join(__dirname, '..');

let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };

// ================================================================ Part 1: logic
const W = { console: { log() {}, warn() {}, error() {} }, URLSearchParams }; W.window = W; vm.createContext(W);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'shop/js/product-catalog.js'), 'utf8'), W);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'shop/js/catalog-filters.js'), 'utf8'), W);
const CF = W.OHSCatalogFilters, ACTIVE = W.getActiveProducts();
const names = list => list.map(p => p.shortName);
const run = f => CF.apply(ACTIVE, f);
ok(run({}).length === ACTIVE.length && JSON.stringify(names(run({}))) === JSON.stringify(names(ACTIVE)), `no filters: all ${ACTIVE.length} products, catalog ("Featured") order`);
ok(run({ category: 'cleaners' }).every(p => p.category === 'Cleaners') && run({ category: 'cleaners' }).length === 4, 'category: Cleaners -> the 4 cleaners');
ok(run({ cert: 'epa' }).every(p => p.type === 'epa') && run({ cert: 'epa' }).length === 2, 'certification: EPA Registered -> 2');
ok(run({ cert: 'usda' }).every(p => (p.certifications || []).some(c => /USDA/.test(c))) && run({ cert: 'usda' }).length === 4, 'certification: USDA Certified Organic -> 4');
ok(run({ size: '1gal' }).every(p => p.size === '1gal') && run({ size: '1gal' }).length === ACTIVE.filter(p => p.size === '1gal').length && run({ size: '1gal' }).length > 0, `size: 1 gallon -> the ${ACTIVE.filter(p => p.size === '1gal').length} gallon products`);
ok(run({ q: 'odor' }).some(p => p.shortName === '32oz Laundry Booster'), 'search also matches intended uses (useCase), e.g. "odor"');
ok(JSON.stringify(names(run({ category: 'cleaners', cert: 'usda', size: '1gal' }))) === JSON.stringify(['1 Gal Organic Solution']), 'combined: Cleaners + USDA + 1 gallon -> exactly the gallon organic cleaner');
ok(run({ q: 'LAUNDRY' }).length === 2 && run({ q: 'laundry' }).length === 2 && run({ q: '  Laundry   gallon ' }).length === 1, 'search is case-insensitive; several words must all match');
ok(run({ q: 'zzzz-nothing' }).length === 0, 'search with no match -> empty');
const asc = run({ sort: 'price-asc' }).map(p => p.pricing.retail), desc = run({ sort: 'price-desc' }).map(p => p.pricing.retail);
ok(asc.every((v, i) => !i || asc[i - 1] <= v) && desc.every((v, i) => !i || desc[i - 1] >= v), 'price sorts use the one-time retail price, both directions');
ok(String(CF.apply.toString()).indexOf('wholesale') === -1 && String(CF.apply.toString()).indexOf('Subscription') === -1, 'sorting never looks at wholesale or subscription prices');
const az = names(run({ sort: 'name' })).map((_, i) => run({ sort: 'name' })[i].name);
ok(az.every((v, i) => !i || az[i - 1].localeCompare(v, 'en', { sensitivity: 'base' }) <= 0), 'name A-Z');
const fc = CF.facets(ACTIVE, { cert: 'usda' });
const cat = Object.fromEntries(fc.category.map(o => [o.value, o.count]));
ok(cat.cleaners === 2 && cat.laundry === 2 && !cat.skincare, `option counts follow the other filters (USDA: Cleaners 2, Laundry 2, Skincare 0) ${JSON.stringify(cat)}`);
ok(JSON.stringify(fc.size.map(o => o.label)) === JSON.stringify(['100 ml', '32 oz', '1 gallon']), `sizes come from the products, sorted, readable labels (${fc.size.map(o => o.label).join(', ')})`);
ok(CF.facets(ACTIVE.filter(p => p.type !== 'epa'), {}).cert.every(o => o.value !== 'epa'), 'options are built only from eligible products (no EPA option outside Utah)');
ok(CF.toQuery({ category: 'laundry', sort: 'featured', q: '' }) === '?category=laundry' && CF.toQuery(CF.DEFAULTS) === '', 'URL holds only non-default filters');
const bad = CF.sanitize(CF.parse('?category=xyz&cert=bogus&size=<b>&sort=evil&q=' + 'a'.repeat(200)), ACTIVE);
ok(bad.category === '' && bad.cert === '' && bad.size === '' && bad.sort === 'featured' && bad.q.length === 80, 'unknown / tampered URL values are dropped; search capped at 80 characters');

// ================================================================ Part 2: the page
const SERUM = '7249401348167', LAUNDRY32 = '7249400004679', USDA32 = '7418569752647';
(async () => {
  const b = await chromium.launch();
  async function ctxFor(state, stock) {
    const c = await b.newContext({ viewport: { width: 1280, height: 900 } }); await route(c);
    const gql = [];
    await c.route('**/api/*/graphql.json', r => {
      let ids = []; try { ids = (JSON.parse(r.request().postData() || '{}').variables || {}).ids || []; } catch (e) {}
      gql.push(ids.length);
      if (!stock) return r.fulfill({ status: 503, body: 'test: stock unavailable' });
      const nodes = ids.map(gid => { const id = gid.split('/').pop(); const p = W.PRODUCT_CATALOG[id]; if (!p) return null;
        return { id: gid, title: p.name, availableForSale: true, totalInventory: 0, variants: { pageInfo: { hasNextPage: false }, edges: Object.values(p.shopifyVariants).map(v => ({ node: { id: 'gid://shopify/ProductVariant/' + v, title: 'x', availableForSale: !(stock.soldOut || []).includes(String(v)), quantityAvailable: (stock.soldOut || []).includes(String(v)) ? 0 : 50, currentlyNotInStock: false, sku: '' } })) } }; });
      return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: { nodes } }) });
    });
    await c.addInitScript(st => { if (sessionStorage.getItem('seeded')) return; sessionStorage.setItem('seeded', '1');
      localStorage.setItem('analytics_consent', 'denied'); localStorage.setItem('ohsUserIntent', 'shop'); localStorage.setItem('ohsUserState', st); localStorage.setItem('ohsCart', '[]'); }, state);
    return [c, gql];
  }
  async function open(c, query) {
    const p = await c.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto(`${B}/products.html${query || ''}`, { waitUntil: 'networkidle' }); await p.waitForTimeout(400);
    return [p, errs];
  }
  const shown = p => p.evaluate(() => Array.from(document.querySelectorAll('#productSections [data-card-for]')).filter(c => !c.hidden && !c.closest('section[hidden]')).map(c => c.getAttribute('data-card-for')));
  const status = p => p.locator('#filterStatus').textContent();

  // Stock check fails: catalog still drawn, filters still work
  { const [c, gql] = await ctxFor('UT'); const [p, errs] = await open(c);
    ok((await shown(p)).length === ACTIVE.length, `Shopify stock unavailable: all ${ACTIVE.length} products still shown`);
    const before = gql.length;
    await p.selectOption('#filterCategory', 'laundry'); await p.waitForTimeout(150);
    const ids = await shown(p);
    ok(ids.length === 2 && ids.every(id => W.PRODUCT_CATALOG[id].category === 'Laundry'), 'Category select: only Laundry shown');
    ok(/category=laundry/.test(p.url()) && /Showing 2 of 8/.test(await status(p)), `URL and live result count update ("${await status(p)}")`);
    ok(await p.evaluate(() => Array.from(document.querySelectorAll('#productSections section')).filter(s => !s.hidden).length === 1), 'sections with no matching products are hidden');
    await p.selectOption('#filterCategory', ''); await p.selectOption('#filterCert', 'usda'); await p.selectOption('#filterSize', '1gal'); await p.waitForTimeout(150);
    ok(JSON.stringify(await shown(p)) === JSON.stringify(['7418571685959', '7249400037447']), 'USDA + 1 gallon: the two gallon USDA products');
    await p.selectOption('#filterCert', ''); await p.selectOption('#filterSize', '');
    await p.selectOption('#filterSort', 'price-asc'); await p.waitForTimeout(150);
    const usdaOrder = await p.evaluate(() => { const sec = Array.from(document.querySelectorAll('#productSections section')).find(s => /USDA/.test(s.textContent)); return Array.from(sec.querySelectorAll('[data-card-for]')).map(c => c.getAttribute('data-card-for')); });
    const prices = usdaOrder.map(id => W.PRODUCT_CATALOG[id].pricing.retail);
    ok(prices.every((v, i) => !i || prices[i - 1] <= v), `price low-high sorts by retail price within each product line (USDA: ${prices.join(', ')})`);
    await p.selectOption('#filterSort', 'featured'); await p.waitForTimeout(100);
    ok(gql.length === before, `filtering and sorting make no Shopify requests (${gql.length - before} extra)`);

    // Search from the keyboard, result announced
    await p.focus('#filterSearch'); await p.keyboard.type('Laundry Gallon'); await p.waitForTimeout(400);
    ok(JSON.stringify(await shown(p)) === JSON.stringify(['7249400037447']) && /matching “Laundry Gallon”/.test(await status(p)), `typing in search filters as you type and announces it ("${await status(p)}")`);
    ok(await p.evaluate(() => document.getElementById('filterStatus').getAttribute('aria-live') === 'polite' && document.getElementById('filterStatus').getAttribute('role') === 'status'), 'result count is a polite live region');
    const labelled = await p.evaluate(() => ['filterSearch', 'filterCategory', 'filterCert', 'filterSize', 'filterSort'].every(id => document.querySelector(`label[for="${id}"]`)));
    ok(labelled, 'every filter control has a visible label');

    // Empty results -> message + reset
    await p.fill('#filterSearch', 'zzzz'); await p.waitForTimeout(400);
    ok(await p.locator('#filterEmpty').isVisible() && (await shown(p)).length === 0, 'no matches: "No products match" with a reset button');
    await p.click('#filterEmptyReset'); await p.waitForTimeout(200);
    ok((await shown(p)).length === ACTIVE.length && !/\?/.test(p.url().replace(/#.*/, '')) && await p.evaluate(() => document.activeElement.id === 'filterSearch'), 'reset brings back every product, clears the URL, focus back in search');
    ok(!errs.length, 'no page errors' + (errs.length ? ': ' + errs.join('; ') : ''));
    await c.close(); }

  // URL: shareable, survives refresh, Back/Forward, bad values safe
  { const [c] = await ctxFor('UT'); const [p, errs] = await open(c, '?cert=epa&sort=price-desc');
    ok(JSON.stringify(await shown(p)) === JSON.stringify(['7249401086023', '7249401053255']) && await p.inputValue('#filterCert') === 'epa', 'opening a shared link (?cert=epa&sort=price-desc) shows that view, controls set');
    await p.reload({ waitUntil: 'networkidle' }); await p.waitForTimeout(300);
    ok((await shown(p)).length === 2 && await p.inputValue('#filterSort') === 'price-desc', 'refresh keeps the filters');
    await p.selectOption('#filterCert', 'usda'); await p.waitForTimeout(150);
    await p.goBack(); await p.waitForTimeout(300);
    ok(await p.inputValue('#filterCert') === 'epa' && (await shown(p)).length === 2, 'Back returns to the previous filters');
    await p.goForward(); await p.waitForTimeout(300);
    ok(await p.inputValue('#filterCert') === 'usda' && (await shown(p)).length === 4, 'Forward re-applies them');
    await p.goto(`${B}/products.html?category=xyz&cert=bogus&size=%3Cscript%3E&sort=evil#skin-care`, { waitUntil: 'networkidle' }); await p.waitForTimeout(300);
    ok((await shown(p)).length === ACTIVE.length && !/category|cert|size|sort/.test(new URL(p.url()).search) && p.url().endsWith('#skin-care'), 'bad URL values: everything shown, address cleaned, #section kept');
    ok(!errs.length, 'no page errors' + (errs.length ? ': ' + errs.join('; ') : ''));
    await c.close(); }

  // Quantity kept through filters, sorting and stock arriving; correct cart price + variant
  { const [c] = await ctxFor('UT', { soldOut: [String(W.PRODUCT_CATALOG[SERUM].shopifyVariants.retail)] }); const [p, errs] = await open(c);
    await p.waitForTimeout(600);
    ok(await p.evaluate(id => !!document.querySelector(`[data-card-for="${id}"] .out-of-stock, [data-card-for="${id}"].out-of-stock`) || /Out of Stock/.test(document.querySelector(`[data-card-for="${id}"]`).textContent), SERUM),
       'stock arrives after the page is drawn and updates just that card (serum sold out)');
    await p.fill(`#qty-${LAUNDRY32}`, '30'); await p.dispatchEvent(`#qty-${LAUNDRY32}`, 'change'); await p.waitForTimeout(100);
    await p.selectOption('#filterCategory', 'cleaners'); await p.selectOption('#filterSort', 'name'); await p.waitForTimeout(100);
    await p.selectOption('#filterCategory', ''); await p.selectOption('#filterSort', 'featured'); await p.waitForTimeout(100);
    ok(await p.inputValue(`#qty-${LAUNDRY32}`) === '30', 'a quantity typed in a card survives filtering and sorting');
    await p.evaluate(() => window.refreshInventory && window.refreshInventory()); await p.evaluate(() => typeof updateStockOnCards === 'function' && updateStockOnCards());
    ok(await p.inputValue(`#qty-${LAUNDRY32}`) === '30', 'and survives a stock refresh');
    await p.click(`[data-card-for="${LAUNDRY32}"] button.btn-success`); await p.waitForTimeout(200);
    const line = await p.evaluate(() => JSON.parse(localStorage.getItem('ohsCart'))[0]);
    const want = W.getPricingTier(LAUNDRY32, 30, false);
    ok(line && line.quantity === 30 && line.price === want.price && String(line.variantId) === String(want.variantId), `added after filtering: 30 at wholesale $${want.price}, variant ${want.variantId}`);
    ok(!errs.length, 'no page errors' + (errs.length ? ': ' + errs.join('; ') : ''));
    await c.close(); }

  // Shipping state comes first: options and results follow it
  { const [c] = await ctxFor('CA'); const [p] = await open(c, '?cert=epa');
    ok((await shown(p)).length === 0 && await p.locator('#filterEmpty').isVisible() && /Utah addresses only/.test(await p.locator('#filterEmptyHint').textContent()), 'California + EPA filter: nothing shown, told EPA ships to Utah only');
    ok(await p.evaluate(() => Array.from(document.getElementById('filterCert').options).map(o => o.value).join(',')) === ',epa,usda', 'the selected EPA option stays visible (at 0) so it can be changed');
    await p.evaluate(() => window.OHSState ? window.OHSState.set('UT') : window.setUserStateLocal('UT')); await p.waitForTimeout(500);
    ok((await shown(p)).length === 2, 'switching to Utah: the EPA filter now shows the 2 EPA products');
    await c.close(); }

  // Phone
  { const c = await b.newContext({ viewport: { width: 375, height: 800 }, isMobile: true, hasTouch: true }); await route(c);
    await c.route('**/api/*/graphql.json', r => r.fulfill({ status: 503, body: 'x' }));
    await c.addInitScript(() => { localStorage.setItem('analytics_consent', 'denied'); localStorage.setItem('ohsUserIntent', 'shop'); localStorage.setItem('ohsUserState', 'UT'); });
    const p = await c.newPage(); await p.goto(`${B}/products.html`, { waitUntil: 'networkidle' }); await p.waitForTimeout(300);
    const r = await p.evaluate(() => { const s = document.getElementById('filterSearch').getBoundingClientRect(); const sel = document.getElementById('filterCategory').getBoundingClientRect();
      return { searchW: s.width, selH: sel.height, over: document.documentElement.scrollWidth - document.documentElement.clientWidth }; });
    ok(r.searchW > 280 && r.selH >= 38 && r.over <= 0, `phone: full-width search (${Math.round(r.searchW)}px), touch-size selects (${Math.round(r.selH)}px tall), no sideways scroll`);
    await p.tap('#filterSearch'); await p.keyboard.type('serum'); await p.waitForTimeout(400);
    ok(JSON.stringify(await shown(p)) === JSON.stringify([SERUM]), 'phone: search "serum" finds the serum');
    await c.close(); }

  await b.close();
  console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exitCode = fails ? 1 : 0;
})();
