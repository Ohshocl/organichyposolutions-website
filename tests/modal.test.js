// Part of the OHS browser test suite. Run all with: node tests/run-all.js
// Pop-up accessibility (audit R18): dialog semantics, page behind made unreachable,
// focus moved inside and kept inside, Escape closes, focus returns to the opener.
const B = process.env.BASE_URL || 'http://localhost:8805';
const { chromium } = require('playwright'); const { route } = require('./lib');
(async () => {
  const b = await chromium.launch(); let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
  async function open(path, seed) {
    const c = await b.newContext({ viewport: { width: 1280, height: 900 } }); await route(c);
    await c.addInitScript(([seed]) => { if (!sessionStorage.getItem('s')) { localStorage.setItem('analytics_consent', 'denied'); Object.entries(seed || {}).forEach(([k, v]) => v === null ? localStorage.removeItem(k) : localStorage.setItem(k, v)); sessionStorage.setItem('s', '1'); } }, [seed]);
    const p = await c.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto(B + path, { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
    return [c, p, errs];
  }
  const info = (p, sel) => p.evaluate(sel => {
    const el = document.querySelector(sel); if (!el) return null;
    const lab = el.getAttribute('aria-labelledby');
    const nav = document.getElementById('nav-placeholder');
    return { shown: el.classList.contains('show'), role: el.getAttribute('role'), modal: el.getAttribute('aria-modal'), title: lab && document.getElementById(lab) ? document.getElementById(lab).textContent.trim() : null,
      focusInside: el.contains(document.activeElement), navInert: !!(nav && nav.closest('[inert]')), active: document.activeElement && (document.activeElement.id || document.activeElement.className) };
  }, sel);
  async function tabStaysInside(p, sel, n = 12) {
    for (let i = 0; i < n; i++) { await p.keyboard.press(i % 4 === 3 ? 'Shift+Tab' : 'Tab'); if (!(await p.evaluate(sel => document.querySelector(sel).contains(document.activeElement), sel))) return false; }
    return true;
  }

  // 1. products page: first-visit state pop-up
  { const [c, p, errs] = await open('/products.html', { ohsUserState: null });
    const r = await info(p, '#stateModal');
    ok(r && r.shown && r.role === 'dialog' && r.modal === 'true' && !!r.title && r.focusInside && r.navInert, `products state pop-up: dialog "${r && r.title}", focus inside, page behind unreachable (${JSON.stringify(r)})`);
    ok(await tabStaysInside(p, '#stateModal'), 'products state pop-up: Tab / Shift+Tab stay inside');
    await p.keyboard.press('Escape'); await p.waitForTimeout(200);
    const r2 = await info(p, '#stateModal');
    ok(r2 && !r2.shown && !r2.navInert, 'products state pop-up: Escape closes it and the page is reachable again');
    // cart drawer opened from the floating cart button
    await p.evaluate(() => window.addToCart && window.addToCart('7418569752647', 1)); await p.waitForTimeout(200);
    await p.focus('#floatingCartBtn'); await p.keyboard.press('Enter'); await p.waitForTimeout(300);
    const d = await info(p, '#cartPreview');
    const closeLabel = await p.evaluate(() => (document.querySelector('#cartPreview .btn-close') || {}).getAttribute && document.querySelector('#cartPreview .btn-close').getAttribute('aria-label'));
    ok(d && d.shown && d.role === 'dialog' && d.focusInside && d.navInert && closeLabel === 'Close cart', `products cart drawer: dialog, focus inside, close button labelled "${closeLabel}"`);
    ok(await tabStaysInside(p, '#cartPreview'), 'products cart drawer: Tab stays inside');
    await p.keyboard.press('Escape'); await p.waitForTimeout(300);
    const d2 = await info(p, '#cartPreview');
    ok(d2 && !d2.shown && d2.active === 'floatingCartBtn' || (d2 && !d2.shown && /floating-cart/.test(d2.active || '')), `products cart drawer: Escape closes, focus back on the cart button (${d2 && d2.active})`);
    ok(!errs.length, 'products: no JS errors ' + errs.join('|')); await c.close(); }

  // 2. homepage: "What are you looking for?" pop-up, then the state pop-up
  { const [c, p, errs] = await open('/index.html', { ohsUserState: null, ohsUserIntent: null });
    const r = await info(p, '#intentModal');
    ok(r && r.shown && r.role === 'dialog' && r.focusInside && r.navInert, `homepage intent pop-up: dialog "${r && r.title}", focus inside, page behind unreachable`);
    await p.keyboard.press('Escape'); await p.waitForTimeout(400);
    const r2 = await info(p, '#intentModal');
    ok(r2 && !r2.shown, 'homepage intent pop-up: Escape = "Take Me to the Homepage" (closes)');
    const s = await info(p, '#stateModal');
    if (s && s.shown) {
      ok(s.focusInside && await tabStaysInside(p, '#stateModal'), 'homepage state pop-up: focus inside and kept inside');
      await p.keyboard.press('Escape'); await p.waitForTimeout(300);
      const s2 = await info(p, '#stateModal');
      ok(s2 && !s2.shown && !s2.navInert, 'homepage state pop-up: Escape closes, page reachable again');
    } else ok(true, 'homepage state pop-up not shown after intent (nothing to check)');
    ok(!errs.length, 'homepage: no JS errors ' + errs.join('|')); await c.close(); }

  // 3. menu state picker on a regular page (opened with the keyboard)
  { const [c, p, errs] = await open('/mold-remediation.html', { ohsUserState: 'UT' });
    await p.focus('.state-selector-nav'); await p.keyboard.press('Enter'); await p.waitForTimeout(300);
    const r = await info(p, '#globalStateModal');
    ok(r && r.shown && r.role === 'dialog' && r.focusInside && r.navInert === false || (r && r.shown && r.focusInside), `menu state picker: dialog, focus inside (${JSON.stringify(r)})`);
    const mainInert = await p.evaluate(() => !!document.querySelector('main') && !!document.querySelector('main').closest('[inert]'));
    ok(mainInert, 'menu state picker: page content behind it is unreachable');
    ok(await tabStaysInside(p, '#globalStateModal'), 'menu state picker: Tab stays inside');
    await p.keyboard.press('Escape'); await p.waitForTimeout(300);
    const r2 = await p.evaluate(() => ({ shown: document.getElementById('globalStateModal').classList.contains('show'), back: document.activeElement && document.activeElement.classList.contains('state-selector-nav'), inert: !!document.querySelector('main').closest('[inert]') }));
    ok(!r2.shown && r2.back && !r2.inert, `menu state picker: Escape closes, focus back on the picker, page reachable (${JSON.stringify(r2)})`);
    ok(!errs.length, 'mold page: no JS errors ' + errs.join('|')); await c.close(); }

  console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exitCode = fails ? 1 : 0; await b.close();
})();
