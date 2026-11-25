// Part of the OHS browser test suite. Run all with: node tests/run-all.js
// Catalog visibility (sprint 2026-11-24, Priority 1): only products that are for
// sale (status 'active' + fully set up) are shown, counted, added to carts or sent
// to Shopify. Coming-soon products stay defined in product-catalog.js but are
// never shown. A fully set-up product appears on its own once it is activated.
const B = process.env.BASE_URL || 'http://localhost:8805';
const fs = require('fs'), path = require('path'), vm = require('vm');
const { chromium } = require('playwright'); const { route } = require('./lib');
const ROOT = process.env.SITE_ROOT || path.join(__dirname, '..');
const CATALOG_SRC = fs.readFileSync(path.join(ROOT, 'shop/js/product-catalog.js'), 'utf8');

let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };

// ---------------------------------------------------------------- the rule itself (no browser)
const W = { console: { log() {}, warn() {}, error() {} } }; W.window = W; vm.createContext(W);
vm.runInContext(CATALOG_SRC, W);
const all = Object.values(W.PRODUCT_CATALOG);
const active = all.filter(p => W.isProductActive(p));
const SERUM = '7249401348167';
ok(active.length === all.filter(p => p.status === 'active').length && active.length > 0, `isProductActive: every configured active product counts (${active.length})`);
const base = JSON.parse(JSON.stringify(W.PRODUCT_CATALOG[SERUM]));
const variants = [
  ['coming-soon', { status: 'coming-soon' }], ['draft', { status: 'draft' }], ['discontinued', { status: 'discontinued' }],
  ['no status', { status: undefined }], ['no price', { pricing: Object.assign({}, base.pricing, { retail: null }) }],
  ['no retail variant', { shopifyVariants: Object.assign({}, base.shopifyVariants, { retail: '' }) }], ['no id', { id: '' }]
];
const leaked = variants.filter(([, ch]) => W.isProductActive(Object.assign({}, base, ch))).map(([n]) => n);
ok(!leaked.length, 'not for sale: coming-soon, draft, discontinued, no status, no price, no retail variant, no id' + (leaked.length ? ' (leaked: ' + leaked.join(', ') + ')' : ''));
// Activation: a fully set-up product becomes eligible just by changing its status
W.PRODUCT_CATALOG['9999999999991'] = Object.assign({}, base, { id: '9999999999991', name: 'Test Future Product', status: 'coming-soon' });
const before = W.getActiveProducts().some(p => p.id === '9999999999991');
W.PRODUCT_CATALOG['9999999999991'].status = 'active';
const after = W.getActiveProducts().some(p => p.id === '9999999999991') && W.getAvailableProducts('CA').some(p => p.id === '9999999999991');
ok(!before && after, 'a fully set-up product becomes eligible as soon as its status is "active"');
delete W.PRODUCT_CATALOG['9999999999991'];
ok(['getEPAProducts', 'getUSDAOnlyProducts', 'getNonRegisteredProducts', 'getActiveProducts'].every(fn => W[fn]().every(p => W.isProductActive(p))), 'every catalog list helper returns only active products');
ok((W.COMING_SOON_PRODUCTS || []).length > 0, `coming-soon definitions are kept in product-catalog.js (${(W.COMING_SOON_PRODUCTS || []).length}), just not shown`);

// ---------------------------------------------------------------- the shop pages
// Extra products injected into the catalog file as served, to prove the rule end to end
const EXTRA = `
;(function(){ var s = window.PRODUCT_CATALOG['${SERUM}'];
  function copy(id, name, status) { var p = JSON.parse(JSON.stringify(s)); p.id = id; p.shopifyProductId = id; p.name = name; p.status = status;
    p.shopifyVariants = { retail: id + '1', retailSubscription: id + '2', wholesale: id + '3', wholesaleSubscription: id + '4' }; return p; }
  if (window.__extraActive) window.PRODUCT_CATALOG['8888888888881'] = copy('8888888888881', 'Activated Future Serum', 'active');
  window.PRODUCT_CATALOG['8888888888882'] = copy('8888888888882', 'Unreleased Draft Serum', 'draft');
})();`;

(async () => {
  const b = await chromium.launch();
  async function ctxFor(state, opts = {}) {
    const c = await b.newContext({ viewport: { width: 1280, height: 900 } }); await route(c);
    const gql = [];
    await c.route('**/api/*/graphql.json', r => { try { gql.push(...((JSON.parse(r.request().postData() || '{}').variables || {}).ids || []).map(g => g.split('/').pop())); } catch (e) {} return r.fulfill({ status: 503, body: 'test' }); });
    await c.route('**/shop/js/product-catalog.js', r => r.fulfill({ status: 200, contentType: 'application/javascript', body: CATALOG_SRC + EXTRA }));
    await c.addInitScript(([st, extra, cart]) => { if (sessionStorage.getItem('seeded')) return; sessionStorage.setItem('seeded', '1');
      localStorage.setItem('analytics_consent', 'denied'); localStorage.setItem('ohsUserIntent', 'shop'); localStorage.setItem('ohsUserState', st);
      localStorage.setItem('ohsCart', cart || '[]'); if (extra) window.__extraActive = true; }, [state, !!opts.extraActive, opts.cart]);
    if (opts.extraActive) await c.addInitScript(() => { window.__extraActive = true; });
    return [c, gql];
  }
  async function shop(c) {
    const p = await c.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto(`${B}/products.html`, { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
    return [p, errs];
  }
  const cards = p => p.evaluate(() => Array.from(document.querySelectorAll('#productSections [data-product-id]')).map(c => c.getAttribute('data-product-id')));

  // Utah: every active product, nothing else
  { const [c, gql] = await ctxFor('UT'); const [p, errs] = await shop(c);
    const ids = await cards(p);
    const want = active.map(x => x.id).sort();
    ok(JSON.stringify([...ids].sort()) === JSON.stringify(want), `Utah: exactly the ${want.length} active products are shown (got ${ids.length})`);
    const r = await p.evaluate(() => ({ soon: document.querySelectorAll('.coming-soon, [data-coming-soon]').length, pet: !!document.getElementById('pet-care'), skin: !!document.getElementById('skin-care'),
      text: document.getElementById('productSections').textContent, total: document.getElementById('totalProductCount').textContent }));
    ok(r.soon === 0 && !/coming soon/i.test(r.text), 'no coming-soon cards or "Coming soon" text in the shop');
    ok(!r.pet, 'Pet Care section is not shown (no pet products for sale yet)');
    ok(r.skin && ids.includes(SERUM), 'Skin Care section stays, with the active serum');
    ok(!ids.includes('8888888888882') && !/Unreleased Draft Serum/.test(r.text), 'a draft product in the catalog gets no card');
    ok(r.total === String(want.length), `hero "Total Products" counts only products for sale (${r.total})`);
    ok(!gql.includes('8888888888882') && gql.every(id => active.some(a => a.id === id)), `stock is requested only for active products (${new Set(gql).size} ids)`);
    const added = await p.evaluate(() => window.addToCart('8888888888882', 1));
    const cart = await p.evaluate(() => JSON.parse(localStorage.getItem('ohsCart') || '[]').length);
    ok(added === false && cart === 0, 'an inactive product cannot be added to the cart (addToCart refuses it)');
    ok(!errs.length, 'no page errors' + (errs.length ? ': ' + errs.join('; ') : ''));
    await c.close(); }

  // California: active products minus Utah-only EPA (state rule still applies)
  { const [c] = await ctxFor('CA'); const [p] = await shop(c);
    const ids = await cards(p); const want = active.filter(x => x.type !== 'epa').map(x => x.id).sort();
    ok(JSON.stringify([...ids].sort()) === JSON.stringify(want), `California: the ${want.length} active non-EPA products (Utah-only rule intact)`);
    await c.close(); }

  // Activation end to end: a fully set-up product marked active shows up with no page changes
  { const [c] = await ctxFor('UT', { extraActive: true }); const [p] = await shop(c);
    const ids = await cards(p);
    ok(ids.includes('8888888888881'), 'a newly activated, fully set-up product appears in the shop automatically');
    await c.close(); }

  // Saved cart with an item that is no longer for sale
  { const cart = JSON.stringify([{ productId: SERUM, quantity: 2 }, { productId: '8888888888882', quantity: 1 }]);
    const [c] = await ctxFor('UT', { cart }); const p = await c.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto(`${B}/cart.html`, { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
    const r = await p.evaluate(() => ({ lines: JSON.parse(localStorage.getItem('ohsCart') || '[]').map(l => l.productId), note: (document.getElementById('notificationContainer') || {}).textContent || '' }));
    ok(r.lines.length === 1 && r.lines[0] === SERUM && /Unreleased Draft Serum is not available right now/.test(r.note) && !errs.length,
       `saved cart: the unavailable item is removed with a message, the rest is kept (${JSON.stringify(r.lines)})`);
    await c.close(); }

  // No link anywhere sends people to a products section that isn't there
  { const [c] = await ctxFor('UT'); const [p] = await shop(c);
    const sections = await p.evaluate(() => Array.from(document.querySelectorAll('[id]')).map(e => e.id));
    const files = fs.readdirSync(ROOT).filter(f => f.endsWith('.html')).concat(['templates/standard-nav.html', 'templates/standard-footer.html']);
    const bad = [];
    for (const f of files) { const t = fs.readFileSync(path.join(ROOT, f), 'utf8'); for (const m of t.matchAll(/href="\/?products\.html#([^"]+)"/g)) if (!sections.includes(m[1])) bad.push(`${f} -> #${m[1]}`); }
    ok(!bad.length, 'every link to a products.html section points to a section that is shown' + (bad.length ? ': ' + bad.join(', ') : ''));
    await c.close(); }

  await b.close();
  console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exitCode = fails ? 1 : 0;
})();
