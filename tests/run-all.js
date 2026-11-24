// OHS test runner: serves the site from the repo root and runs every suite.
// Usage (from the repo root):  cd tests && npm install && npx playwright install chromium && cd .. && node tests/run-all.js
const { spawn, spawnSync } = require('child_process'); const path = require('path'); const http = require('http'); const fs = require('fs');
const ROOT = path.join(__dirname, '..'); const PORT = process.env.PORT || 8805;
const TYPES = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.webp': 'image/webp', '.xml': 'application/xml', '.txt': 'text/plain', '.pdf': 'application/pdf', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, path.normalize(p));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end('not found'); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f).toLowerCase()] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
}).listen(PORT, async () => {
  const env = { ...process.env, BASE_URL: `http://localhost:${PORT}`, SITE_ROOT: ROOT };
  const suites = ['inline-scripts', 'smoke', 'checkout', 'cartlines', 'qa', 'handoff', 'bookform', 'mcart', 'consent'];
  const failed = [];
  for (const s of suites) {
    console.log(`\n===== ${s}`);
    const r = spawnSync('node', [path.join(__dirname, `${s}.test.js`)], { env, stdio: 'inherit', cwd: __dirname });
    if (r.status !== 0) failed.push(s);
  }
  server.close();
  console.log(failed.length ? `\n${failed.length} suite(s) FAILED: ${failed.join(', ')}` : `\nAll ${suites.length} suites passed`);
  process.exit(failed.length ? 1 : 0);
});
