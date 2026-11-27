// Part of the OHS test suite. Run all with: node tests/run-all.js
// UNIT TESTS for business logic, in plain Node (no browser, no server):
//  1. Catalog pricing tiers (shop/js/product-catalog.js getPricingTier, state rules)
//  2. Service pricing (calculator.html and book-service.html largeFacilityPricing + PRICING)
//     checked against hand-worked numbers, and the two pages checked against each other
//  3. Cart rules (shop/js/cart.js): one line per product + mode, wholesale at the
//     threshold, quantity limits, state removal, totals
// Expected numbers are worked out by hand from the approved rules, not copied from code.
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = process.env.SITE_ROOT || path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
const near = (a, b) => Math.abs(a - b) < 1e-6;

// ---------------------------------------------------------------- page sandbox
function sandbox(state) {
  const store = new Map(Object.entries(state || {}));
  const el = () => ({ style: {}, classList: { add() {}, remove() {} }, appendChild() {}, remove() {}, setAttribute() {}, addEventListener() {}, querySelector() { return null; } });
  const w = {
    console: { log() {}, warn() {}, info() {}, error() {} },
    localStorage: { getItem: k => store.has(k) ? store.get(k) : null, setItem: (k, v) => store.set(k, String(v)), removeItem: k => store.delete(k) },
    document: { readyState: 'complete', cookie: '', addEventListener() {}, getElementById: () => null, querySelectorAll: () => [], querySelector: () => null, createElement: el, body: el() },
    addEventListener() {}, removeEventListener() {}, dispatchEvent() { return true },
    Event: class { constructor(t) { this.type = t; } }, CustomEvent: class { constructor(t, o) { this.type = t; this.detail = o && o.detail; } },
    setTimeout, clearTimeout, Date, Math, JSON, Number, String, Array, Object, Map, Set, Promise, Error, isFinite, parseInt, parseFloat
  };
  w.window = w; w.self = w;
  return { ctx: vm.createContext(w), store };
}
function loadCatalog(state) {
  const s = sandbox(state);
  vm.runInContext(read('shop/js/product-catalog.js'), s.ctx, { filename: 'product-catalog.js' });
  return s;
}

// ================================================================ 1. CATALOG
{
  const { ctx } = loadCatalog();
  const W = ctx.window;
  const products = Object.values(W.PRODUCT_CATALOG);
  const active = products.filter(p => p.id && p.status !== 'coming-soon');
  ok(active.length > 0, `catalog loads (${active.length} active products)`);

  const tierProblems = [], priceProblems = [], variantProblems = [];
  const allVariants = [];
  for (const p of active) {
    const t = p.wholesaleThreshold || 25;
    const cases = [[1, false, 'retail'], [t - 1, false, 'retail'], [t, false, 'wholesale'], [t + 1, false, 'wholesale'],
                   [1, true, 'retailSubscription'], [t, true, 'wholesaleSubscription']];
    for (const [q, sub, key] of cases) {
      const r = W.getPricingTier(p.id, q, sub);
      if (r.tierKey !== key || r.price !== p.pricing[key] || String(r.variantId) !== String(p.shopifyVariants[key]) || r.isWholesale !== key.startsWith('wholesale'))
        tierProblems.push(`${p.name} qty ${q}${sub ? ' sub' : ''}: got ${r.tierKey} $${r.price}`);
    }
    const pr = p.pricing;
    if (!(pr.wholesale < pr.retail && pr.retailSubscription <= pr.retail && pr.wholesaleSubscription <= pr.wholesale && pr.wholesaleSubscription > 0))
      priceProblems.push(`${p.name}: ${JSON.stringify(pr)}`);
    const v = ['retail', 'retailSubscription', 'wholesale', 'wholesaleSubscription'].map(k => String(p.shopifyVariants[k] || ''));
    if (v.some(x => !/^\d{6,}$/.test(x)) || new Set(v).size !== 4) variantProblems.push(`${p.name}: ${v.join(',')}`);
    allVariants.push(...v);
  }
  ok(!tierProblems.length, 'getPricingTier: right tier, price and variant at 1, threshold-1, threshold, threshold+1, and subscriptions' + (tierProblems.length ? ':\n   ' + tierProblems.join('\n   ') : ''));
  ok(!priceProblems.length, 'every product: wholesale < retail, subscription <= one-time, all > 0' + (priceProblems.length ? ':\n   ' + priceProblems.join('\n   ') : ''));
  ok(!variantProblems.length, 'every product has 4 different numeric Shopify variant IDs' + (variantProblems.length ? ':\n   ' + variantProblems.join('\n   ') : ''));
  ok(new Set(allVariants).size === allVariants.length, 'no variant ID is shared between two products');

  const unknown = W.getPricingTier('no-such-product', 5, false);
  ok(unknown.price === 0 && unknown.variantId === null, 'unknown product: price 0, no variant (never sold)');

  const epa = active.filter(p => p.type === 'epa');
  const other = active.filter(p => p.type !== 'epa');
  ok(epa.length > 0 && epa.every(p => W.isProductAvailableInState(p.id, 'UT') && W.isProductAvailableInState(p.id, 'ut') && !W.isProductAvailableInState(p.id, 'CA') && !W.isProductAvailableInState(p.id, '')),
     `EPA products (${epa.length}): Utah only (any letter case), not CA, not blank`);
  ok(other.every(p => W.isProductAvailableInState(p.id, 'CA') && W.isProductAvailableInState(p.id, 'UT')), `non-EPA products (${other.length}): available in every state`);
  ok(W.getAvailableProducts('CA').every(p => p.type !== 'epa'), 'getAvailableProducts("CA") has no EPA products');
}

// ================================================================ 2. SERVICE PRICING
// One engine: shop/js/service-pricing.js. Both pages must use it (no copies).
{
  const ctx = vm.createContext({ Math, Number }); ctx.window = ctx;
  vm.runInContext(read('shop/js/service-pricing.js'), ctx, { filename: 'service-pricing.js' });
  const SP = ctx.OHSServicePricing, P = SP.PRICING;
  ok(!!SP && typeof SP.foggingEstimate === 'function' && typeof SP.moldEstimate === 'function', 'shared pricing engine loads');
  for (const page of ['calculator.html', 'book-service.html']) {
    const src = read(page);
    const usesEngine = src.includes('<script src="shop/js/service-pricing.js"></script>') && /PRICING = window\.OHSServicePricing\.PRICING/.test(src);
    const ownTable = /(?:const|var|let) PRICING = \{/.test(src) || /baseRates:\s*\{/.test(src);
    const ownMath = /rate \* \(1 - lf\.discountBeyond\)/.test(src) || /estimatedDistance - PRICING\.baseTravelRadius/.test(src);
    ok(usesEngine && !ownTable && !ownMath, `${page}: uses the shared engine, no pricing table or math of its own`);
  }
  // Approved rates and minimums (Anthony 2026-11-24; residential $0.10 / $125 min)
  const approved = { commercial: [0.125, 200], residential: [0.10, 125], healthcare: [0.14, 300], education: [0.12, 200], food: [0.135, 200], fitness: [0.13, 175] };
  const bad = Object.entries(approved).filter(([k, [r, m]]) => P.baseRates[k] !== r || P.minimums[k] !== m).map(([k]) => k);
  ok(!bad.length, 'approved rate and minimum for every service' + (bad.length ? ' (wrong: ' + bad.join(', ') + ')' : ''));
  ok(P.volumeRate === 0.08 && P.largeFacility.threshold === 20000 && P.largeFacility.discountBeyond === 0.20 && P.travelRate === 0.70 && P.baseTravelRadius === 25 && P.estimatedDistance === 30,
     'large-facility rules (20,000 sq ft, 20% off beyond, $0.08 floor) and travel ($0.70/mi past 25 mi, 30 mi assumed)');
  ok(JSON.stringify(P.contractDiscounts) === JSON.stringify({ payPerService: 0, monthlyContract: 0.15, bimonthlyContract: 0.10, annualContract: 0.20 }), 'contract discounts 0 / 15% / 10% / 20%');
  const total = (s, q, cx) => SP.foggingEstimate(s, q, cx).totalPrice;

  // Hand-worked examples (standard complexity; travel = 5 mi x $0.70 = $3.50)
  const cases = [
    ['commercial', 1000, 200 + 3.5, 'below minimum -> $200 minimum'],
    ['residential', 1000, 125 + 3.5, 'residential below minimum -> $125 minimum'],
    ['residential', 2000, 200 + 3.5, 'residential 2,000 sq ft x $0.10'],
    ['commercial', 10000, 1250 + 3.5, 'commercial 10,000 sq ft x $0.125'],
    ['commercial', 20000, 2500 + 3.5, 'exactly 20,000 sq ft: no discount, no 2nd machine'],
    ['commercial', 20001, 2500 + 0.1 + 200 + 3.5, '20,001 sq ft: extra foot at $0.10 + $200 2nd machine'],
    ['commercial', 40000, 2500 + 20000 * 0.10 + 200 + 3.5, 'commercial 40,000 sq ft: 20,000 at $0.125 + 20,000 at $0.10 + $200'],
    ['residential', 30000, 2000 + 10000 * 0.08 + 125 + 3.5, 'residential 30,000: beyond rate 20% off $0.10 = $0.08 (at the floor) + $125'],
    ['healthcare', 50000, 2800 + 30000 * 0.112 + 300 + 3.5, 'healthcare 50,000: beyond rate $0.112 + $300 2nd machine']
  ];
  const wrong = cases.filter(([s, q, want]) => !near(total(s, q), want)).map(([s, q, want, d]) => `${d}: want $${want}, got $${total(s, q)}`);
  ok(!wrong.length, `${cases.length} hand-worked fogging prices` + (wrong.length ? ':\n   ' + wrong.join('\n   ') : ''));
  ok(near(total('commercial', 10000, 'complex'), 1250 * 1.3 + 3.5), 'complex job: base x 1.3');
  const e40 = SP.foggingEstimate('commercial', 40000, 'standard');
  ok(near(e40.basePrice, 5000) && near(e40.volumeDiscount, 500) && near(e40.secondMachineFee, 200) && e40.isLarge, 'breakdown lines: base at normal rate $5,000, volume discount $500, 2nd machine $200');

  // Mold (hand-worked): residential 400 sq ft surface = max(400 x 4.50, 300) = 1,800; active moisture x1.15
  const m = SP.moldEstimate(400, 'residential', 'active', 'surface');
  ok(near(m.basePrice, 1800) && near(m.moistureAdjustment, 270) && near(m.totalPrice, 2070 + 3.5) && near(m.lowTotal, 920 + 3.5) && near(m.highTotal, 3220 + 3.5),
     `mold: 400 sq ft surface, active moisture -> $2,073.50 (range $923.50-$3,223.50); got ${m.totalPrice}`);
  ok(near(SP.moldEstimate(10, 'commercial', 'fixed', 'complex').totalPrice, 400 + 3.5), 'mold minimum: commercial $400');
  ok(near(SP.contractPrice(1000, 'annualContract').price, 800) && near(SP.contractPrice(1000, 'bogus').price, 1000), 'contract price: annual 20% off; unknown contract = no discount');

  // Properties over the whole range
  let rising = true, floorOk = true, jump = 0;
  for (const s of Object.keys(approved)) {
    let prev = 0;
    for (let q = 100; q <= 200000; q += 100) {
      const t = total(s, q);
      if (t < prev - 1e-9) rising = false;
      const r = SP.largeFacilityPricing(q, P.baseRates[s], P.minimums[s]);
      if (r.isLarge && (r.standardArea - r.savings) / q < P.volumeRate - 1e-12) floorOk = false;
      prev = t;
    }
    jump = Math.max(jump, total(s, 20001) - total(s, 20000) - P.minimums[s]);
  }
  ok(rising, 'price never goes down as square footage goes up (100 to 200,000 sq ft, every service)');
  ok(floorOk, 'average rate never below the $0.08 floor');
  ok(jump < 1, 'crossing 20,000 sq ft adds only the 2nd machine fee (no jump in the per-foot price)');
}

// ================================================================ 3. CART RULES
{
  const s = loadCatalog({});
  vm.runInContext(read('shop/js/cart.js'), s.ctx, { filename: 'cart.js' });
  const W = s.ctx.window;
  const notes = []; W.showNotification = (m, t) => notes.push([t, m]);
  const active = Object.values(W.PRODUCT_CATALOG).filter(p => p.id && p.status !== 'coming-soon');
  const p = active.find(x => x.type !== 'epa'), epa = active.find(x => x.type === 'epa');
  const t = p.wholesaleThreshold || 25;
  const lines = () => JSON.parse(s.store.get('ohsCart') || '[]');

  W.addToCart(p.id, t - 1); W.addToCart(p.id, 1);
  let L = lines();
  ok(L.length === 1 && L[0].quantity === t && L[0].tierKey === 'wholesale' && L[0].price === p.pricing.wholesale && String(L[0].variantId) === String(p.shopifyVariants.wholesale),
     `${t - 1} + 1 of one product -> ONE line of ${t} at wholesale price and variant`);
  ok(L[0].lineId === p.id + ':once', 'line id is product + purchase mode');
  W.addToCart(p.id, 2, true);
  L = lines();
  ok(L.length === 2 && L.find(x => x.lineId === p.id + ':sub').tierKey === 'retailSubscription', 'same product as subscription is its own line (retail subscription)');
  ok(near(W.getCartTotal(), t * p.pricing.wholesale + 2 * p.pricing.retailSubscription), 'cart total = sum of line price x quantity');
  ok(near(W.getCartWholesaleSavings(), t * (p.pricing.retail - p.pricing.wholesale)), 'wholesale savings counted on the wholesale line only');
  ok(W.getCartItemCount() === t + 2, 'item count is the sum of quantities');

  W.updateCartItemQuantity(p.id + ':once', t - 1);
  ok(lines().find(x => x.lineId === p.id + ':once').tierKey === 'retail', 'lowering below the threshold goes back to retail price');

  const before = JSON.stringify(lines());
  const bad = [0, -1, 1.5, NaN, Infinity, '', 'abc', 1000];
  const accepted = bad.filter(q => W.addToCart(p.id, q) !== false);
  ok(!accepted.length && JSON.stringify(lines()) === before, 'bad quantities (0, -1, 1.5, NaN, Infinity, "", text, 1000) are refused and change nothing' + (accepted.length ? ' (accepted: ' + accepted.join(', ') + ')' : ''));
  ok(W.addToCart(p.id, 999 - (t - 1) + 1) === false, 'a line can never go above 999');

  W.clearCart();
  ok(lines().length === 0 && W.getCartTotal() === 0, 'clearCart empties the cart');

  // State rules
  s.store.set('ohsUserState', 'CA');
  ok(W.addToCart(epa.id, 1) === false && lines().length === 0, 'EPA product cannot be added when shipping state is CA');
  s.store.set('ohsUserState', 'UT');
  ok(W.addToCart(epa.id, 1) === true && W.addToCart(p.id, 1) === true && lines().length === 2, 'EPA product can be added in Utah');
  W.validateCartForState('CA');
  L = lines();
  ok(L.length === 1 && L[0].productId === p.id, 'switching to CA removes only the EPA line');

  // Stored carts are cleaned up on load
  const s2 = loadCatalog({ ohsCart: JSON.stringify([
    { productId: p.id, quantity: 3 }, { productId: p.id, quantity: t }, { productId: 'gone', quantity: 1 },
    { productId: p.id, quantity: -4, isSubscription: true }, { productId: p.id, quantity: 5000, isSubscription: false }
  ]) });
  vm.runInContext(read('shop/js/cart.js'), s2.ctx, { filename: 'cart.js' });
  const L2 = JSON.parse(s2.store.get('ohsCart'));
  const once = L2.find(x => x.lineId === p.id + ':once'), sub = L2.find(x => x.lineId === p.id + ':sub');
  ok(L2.length === 2 && once && once.quantity === 999 && once.tierKey === 'wholesale' && sub && sub.quantity === 1,
     'saved cart on load: split lines rejoined, capped at 999, bad quantity -> 1, unknown products dropped');
}

// ================================================================ 4. GOOGLE MERCHANT FEED
// One row per product for sale; nothing that isn't sold (e.g. 500 ppm retail,
// removed 2026-11-25: "We don't sell 500 ppm retail").
{
  const { ctx } = loadCatalog();
  const forSale = Object.values(ctx.window.PRODUCT_CATALOG).filter(p => p.status === 'active');
  const rows = read('google-merchant-feed.txt').split('\n').slice(1).filter(l => l.trim());
  ok(rows.length === forSale.length, `merchant feed: one row per product for sale (${rows.length} rows, ${forSale.length} products)`);
  ok(!rows.some(r => /500\s*ppm/i.test(r)), 'merchant feed: no 500 ppm products');
}

// ================================================================ 5. SITE FACTS
// Facts on the pages must match reality (fixed 2026-11-27).
{
  const { ctx } = loadCatalog();
  const forSale = Object.values(ctx.window.PRODUCT_CATALOG).filter(p => ctx.window.isProductActive ? ctx.window.isProductActive(p) : p.status === 'active');
  const m = read('index.html').match(/(\d+) professional-grade solutions/);
  ok(!m || Number(m[1]) === forSale.length, `homepage product count matches the products for sale (${m ? m[1] : 'no number'} vs ${forSale.length})`);
  // FCN 1811 is an FDA Food Contact Notification, not an "approval" (SDS page excluded: kept as issued)
  const pages = require('fs').readdirSync(ROOT).filter(f => f.endsWith('.html') && f !== 'hoclsds.html');
  const bad = [];
  for (const f of pages) read(f).split('\n').forEach((line, i) => {
    if (/FCN/.test(line) && /approv/i.test(line)) bad.push(`${f}:${i + 1}`);
    if (/FDA approved(,|\.|\s*<\/li>|, USDA)/.test(line) && !/wound/i.test(line)) bad.push(`${f}:${i + 1}`);
  });
  ok(!bad.length, 'food-contact FCN 1811 is described as a Notification, never "FDA approved"' + (bad.length ? ': ' + bad.join(', ') : ''));
}

console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exitCode = fails ? 1 : 0;
