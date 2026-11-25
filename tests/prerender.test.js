// Part of the OHS browser test suite. Run all with: node tests/run-all.js
// Build-time nav/footer (.github/scripts/prerender-templates.js, run by deploy.yml)
//  - the build step fills each page's placeholders once, exactly, and is safe to re-run
//  - a pre-rendered page looks the same as the runtime-loaded page (nav + footer pixels)
//  - a pre-rendered page doesn't fetch the templates, has its nav without JavaScript,
//    and doesn't jump when the nav appears
//  - regression: the saved state name and a closed promo banner are applied in BOTH
//    modes (before, they ran on DOMContentLoaded, usually before the fetched nav existed)
const B = process.env.BASE_URL || 'http://localhost:8805';
const fs = require('fs'), path = require('path'), os = require('os');
const { chromium } = require('./engine'); const { route } = require('./lib');
const ROOT = process.env.SITE_ROOT || path.join(__dirname, '..');
const { prerenderPage, prerenderSite, rewriteForDepth } = require(path.join(ROOT, '.github/scripts/prerender-templates.js'));

let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };

// ---------------------------------------------------------------- build step, no browser
{
  const T = { 'standard-nav.html': '<nav><a href="/about.html">A</a> $1 $&</nav>', 'standard-footer.html': '<footer><img src="/x.png"></footer>' };
  const page = '<body>\n<div id="nav-placeholder"></div>\n<main>hi</main>\n<div id="footer-placeholder"></div>\n</body>';
  const r = prerenderPage(page, T, 0);
  ok(r.filled.length === 2 && r.html.includes('<div id="nav-placeholder" data-prerendered="true"><nav><a href="/about.html">A</a> $1 $&</nav></div>'), 'fills nav and footer once, template text inserted literally');
  ok(prerenderPage(r.html, T, 0).filled.length === 0, 'running it again changes nothing');
  ok(prerenderPage(page, T, 1).html.includes('href="../about.html"') && prerenderPage(page, T, 1).html.includes('src="../x.png"'), 'sub-folder pages get the same ../ path rewrite as the runtime loader');
  ok(rewriteForDepth('href="/a"', 0) === 'href="/a"', 'root pages keep their paths');
  ok(prerenderPage('<div id="nav-placeholder"></div><div id="nav-placeholder"></div>', T, 0).problems.length === 1, 'a page with two nav placeholders is reported as a problem');
  ok(prerenderPage('<div id="nav-placeholder"><p>custom</p></div>', T, 0).filled.length === 0, 'a placeholder that already has content is left alone');
}

// ---------------------------------------------------------------- build a pre-rendered copy of the site
const OUT = fs.mkdtempSync(path.join(os.tmpdir(), 'ohs-prerender-'));
for (const name of fs.readdirSync(ROOT)) {
  if (name.startsWith('.') || ['tests', 'node_modules', 'api', 'docs'].includes(name)) continue;
  fs.cpSync(path.join(ROOT, name), path.join(OUT, name), { recursive: true });
}
const report = prerenderSite(OUT);
const pagesWithSlots = fs.readdirSync(ROOT).filter(f => f.endsWith('.html') && /id="nav-placeholder"/.test(fs.readFileSync(path.join(ROOT, f), 'utf8')));
ok(report.nav === pagesWithSlots.length && report.footer === pagesWithSlots.length && !report.problems.length,
   `every page with placeholders pre-rendered (${report.nav} nav, ${report.footer} footer, ${pagesWithSlots.length} pages)` + (report.problems.length ? ': ' + report.problems.join('; ') : ''));

const TYPES = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain' };
async function servePrerendered(ctx, templateRequests) {
  await ctx.route(u => u.href.startsWith(B + '/'), async r => {
    let p = decodeURIComponent(new URL(r.request().url()).pathname); if (p.endsWith('/')) p += 'index.html';
    if (/^\/templates\//.test(p)) templateRequests.push(p);
    const file = path.join(OUT, p);
    if (!file.startsWith(OUT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return r.fulfill({ status: 404, body: 'not found' });
    return r.fulfill({ status: 200, body: fs.readFileSync(file), headers: { 'content-type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream' } });
  });
}
const seed = () => { localStorage.setItem('analytics_consent', 'denied'); localStorage.setItem('ohsUserState', 'UT'); localStorage.setItem('ohsUserIntent', 'shop'); localStorage.setItem('promoBannerClosed', 'true'); };
const clsProbe = () => { window.__cls = 0; new PerformanceObserver(l => { l.getEntries().forEach(e => { if (!e.hadRecentInput) window.__cls += e.value; }); }).observe({ type: 'layout-shift', buffered: true }); };

(async () => {
  const b = await chromium.launch();
  const PAGES = ['index.html', 'about.html', 'products.html', 'cart.html', 'calculator.html', 'book-service.html'];
  const mk = async (prerendered, js = true) => {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, javaScriptEnabled: js, reducedMotion: 'reduce' });
    await route(ctx); const reqs = [];
    if (prerendered) await servePrerendered(ctx, reqs);
    await ctx.addInitScript(seed); await ctx.addInitScript(clsProbe);
    return { ctx, reqs };
  };
  const live = await mk(false), pre = await mk(true), nojs = await mk(true, false);
  const pl = await live.ctx.newPage(), pp = await pre.ctx.newPage(), pn = await nojs.ctx.newPage();

  const differ = [], stateWrong = [], bannerShown = [], activeMissing = [], noJsMissing = [];
  let clsLive = 0, clsPre = 0;
  for (const f of PAGES) {
    for (const [p, mode] of [[pl, 'runtime'], [pp, 'pre-rendered']]) {
      await p.goto(`${B}/${f}`, { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
      const s = await p.evaluate(() => ({
        state: (document.getElementById('navStateName') || {}).textContent,
        banner: (b => !!b && getComputedStyle(b).display !== 'none')(document.getElementById('promoBanner')),
        // only pages that have their own nav item (data-page) get one marked active
        active: (pg => !document.querySelector(`#nav-placeholder [data-page="${pg}"]`) || document.querySelector(`#nav-placeholder [data-page="${pg}"]`).classList.contains('active'))(location.pathname.split('/').pop().replace('.html', '') || 'index'),
        cls: window.__cls
      }));
      if (s.state !== 'Utah') stateWrong.push(`${f} (${mode}): "${s.state}"`);
      if (s.banner) bannerShown.push(`${f} (${mode})`);
      if (!s.active) activeMissing.push(`${f} (${mode})`);
      if (mode === 'runtime') clsLive += s.cls; else clsPre += s.cls;
    }
    for (const id of ['nav-placeholder', 'footer-placeholder']) {
      const a = await pl.locator('#' + id).screenshot({ animations: 'disabled' }).catch(() => null);
      const c = await pp.locator('#' + id).screenshot({ animations: 'disabled' }).catch(() => null);
      if (!a || !c || !a.equals(c)) differ.push(`${f} #${id}`);
    }
    await pn.goto(`${B}/${f}`, { waitUntil: 'load' });
    const n = await pn.evaluate(() => ({ links: document.querySelectorAll('#nav-placeholder a[href]').length, foot: document.querySelectorAll('#footer-placeholder a[href]').length }));
    if (n.links < 5 || n.foot < 5) noJsMissing.push(`${f} (${n.links} nav links, ${n.foot} footer links)`);
  }
  ok(!differ.length, `nav and footer look identical pre-rendered vs runtime on ${PAGES.length} pages` + (differ.length ? ': ' + differ.join(', ') : ''));
  ok(!pre.reqs.length, 'pre-rendered pages never fetch templates/' + (pre.reqs.length ? ' (fetched: ' + [...new Set(pre.reqs)].join(', ') + ')' : ''));
  ok(!noJsMissing.length, 'pre-rendered nav and footer are in the HTML itself (work with JavaScript off)' + (noJsMissing.length ? ': ' + noJsMissing.join(', ') : ''));
  ok(!stateWrong.length, 'saved state shows in the nav ("Utah") in both modes' + (stateWrong.length ? ': ' + stateWrong.join(', ') : ''));
  ok(!bannerShown.length, 'a closed promo banner stays closed in both modes' + (bannerShown.length ? ': ' + bannerShown.join(', ') : ''));
  ok(!activeMissing.length, 'current page is marked active in the nav in both modes' + (activeMissing.length ? ': ' + activeMissing.join(', ') : ''));
  ok(clsPre <= clsLive + 0.001, `layout shift not worse when pre-rendered (total ${clsPre.toFixed(3)} vs ${clsLive.toFixed(3)} runtime)`);
  console.log(`INFO layout shift over ${PAGES.length} pages: runtime ${clsLive.toFixed(3)}, pre-rendered ${clsPre.toFixed(3)}`);

  await b.close();
  fs.rmSync(OUT, { recursive: true, force: true });
  console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exitCode = fails ? 1 : 0;
})();
