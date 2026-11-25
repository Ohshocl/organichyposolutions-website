// Part of the OHS browser test suite. Run all with: node tests/run-all.js
// Phone menu: open it, open each dropdown (Solutions, About, Shop) and tap a
// link inside. Run on the page as DEPLOYED (nav built into the page by
// .github/scripts/prerender-templates.js) and as served from the repo (nav
// loaded at runtime), because the two behaved differently.
// Regression: after #504 tapping "Solutions" on a phone closed the whole menu,
// so no solution page could be reached.
const B = process.env.BASE_URL || 'http://localhost:8805';
const fs = require('fs'), path = require('path'), os = require('os');
const { chromium } = require('playwright');
const { route } = require('./lib');
const ROOT = process.env.SITE_ROOT || path.join(__dirname, '..');
const { prerenderSite } = require(path.join(ROOT, '.github/scripts/prerender-templates.js'));

const OUT = fs.mkdtempSync(path.join(os.tmpdir(), 'ohs-mnav-'));
for (const name of fs.readdirSync(ROOT)) {
  if (name.startsWith('.') || ['tests', 'node_modules', 'api', 'docs'].includes(name)) continue;
  fs.cpSync(path.join(ROOT, name), path.join(OUT, name), { recursive: true });
}
prerenderSite(OUT);
const TYPES = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.ico': 'image/x-icon' };
async function serveDeployed(ctx) {
  await ctx.route(u => u.href.startsWith(B + '/'), async r => {
    let p = decodeURIComponent(new URL(r.request().url()).pathname); if (p.endsWith('/')) p += 'index.html';
    const file = path.join(OUT, p);
    if (!file.startsWith(OUT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return r.fulfill({ status: 404, body: 'not found' });
    return r.fulfill({ status: 200, body: fs.readFileSync(file), headers: { 'content-type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream' } });
  });
}

(async () => {
  const b = await chromium.launch(); let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
  const device = { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: (process.env.OHS_BROWSER || 'chromium') !== 'firefox' };
  const CASES = [
    ['Solutions', '.nav-item.dropdown > [data-page="services"]', 'a.dropdown-item[href="/mold-remediation.html"]', '/mold-remediation.html'],
    ['Solutions', '.nav-item.dropdown > [data-page="services"]', 'a.dropdown-item[href="/commercial-residential-disinfection.html"]', '/commercial-residential-disinfection.html'],
    ['About', '.nav-item.dropdown > [data-page="about"]', 'a.dropdown-item[href="/science-certifications.html"]', '/science-certifications.html'],
    ['Shop', '.nav-item.dropdown > [data-page="shop"]', 'a.dropdown-item[href="/book-service.html"]', '/book-service.html']
  ];
  for (const mode of ['deployed', 'runtime']) {
    for (const page of ['index.html', 'products.html']) {
      for (const [name, toggle, item, dest] of CASES) {
        const ctx = await b.newContext(device); await route(ctx);
        if (mode === 'deployed') await serveDeployed(ctx);
        await ctx.addInitScript(() => { localStorage.setItem('ohsUserState', 'UT'); localStorage.setItem('ohsUserIntent', 'shop'); localStorage.setItem('analytics_consent', 'denied'); });
        const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
        await p.goto(`${B}/${page}`, { waitUntil: 'load' }); await p.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {}); await p.waitForTimeout(500);
        let step = 'open menu';
        try {
          await p.tap('.navbar-toggler'); await p.waitForTimeout(500);
          step = `tap ${name}`; await p.tap(toggle); await p.waitForTimeout(500);
          const open = await p.evaluate(() => document.getElementById('navbarNav').classList.contains('show'));
          if (!open) throw new Error('menu closed when the dropdown was tapped');
          step = `tap ${dest}`; await Promise.all([p.waitForURL('**' + dest, { timeout: 6000 }), p.tap(item, { timeout: 4000 })]);
          step = 'done';
        } catch (e) { step += ' -> ' + e.message.split('\n')[0]; }
        ok(step === 'done' && !errs.length, `${mode}, ${page}: phone menu -> ${name} -> ${dest}` + (step === 'done' ? '' : ` (failed at: ${step})`) + (errs.length ? ' errors: ' + errs.join('; ') : ''));
        await ctx.close();
      }
    }
  }
  await b.close(); fs.rmSync(OUT, { recursive: true, force: true });
  console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exitCode = fails ? 1 : 0;
})();
