// Part of the OHS browser test suite. Run all with: node tests/run-all.js
// Every public page loads with no JavaScript errors and no missing local files.
const { chromium } = require('./engine'); const {route}=require('./lib'); const fs=require('fs'); const path=require('path');
const B = process.env.BASE_URL || 'http://localhost:8805';
const ROOT = process.env.SITE_ROOT || path.join(__dirname, '..');
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext(); await route(ctx); const pg = await ctx.newPage();
  const errs = [], missing = []; let cur = '';
  pg.on('pageerror', e => errs.push(cur + ': ' + e.message.slice(0, 120)));
  pg.on('response', r => { if (r.url().startsWith(B) && r.status() === 404) missing.push(cur + ' -> ' + r.url().replace(B, '')); });
  const pages = fs.readdirSync(ROOT).filter(f => f.endsWith('.html') && !f.startsWith('google'));
  for (const p of pages) { cur = p; await pg.goto(`${B}/${p}`, { waitUntil: 'networkidle' }).catch(() => {}); await pg.waitForTimeout(200); }
  let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
  ok(!errs.length, `${pages.length} pages load with no JavaScript errors ` + errs.slice(0, 5).join(' | '));
  ok(!missing.length, `no missing local files ` + [...new Set(missing)].slice(0, 5).join(' | '));
  console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exitCode = fails ? 1 : 0; await b.close();
})();
