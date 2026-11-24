// OHS test runner: serves the site from the repo root and runs every suite.
// Usage (from the repo root):
//   cd tests && npm ci && npx playwright install chromium && cd ..
//   node tests/run-all.js
//
// - Suites are discovered automatically: every tests/*.test.js file runs, so a
//   new suite can't be forgotten.
// - The built-in web server listens on 127.0.0.1 only and only serves files
//   inside the repo (no path tricks like /../ or symlinks out of the repo).
// - A suite that can't start, crashes, or runs over 5 minutes fails the run;
//   a server error stops the run with a clear message.

const { spawn } = require('child_process');
const path = require('path');
const http = require('http');
const fs = require('fs');

const ROOT = fs.realpathSync(path.join(__dirname, '..'));
const HOST = '127.0.0.1';
const PORT = Number(process.env.PORT) || 8805;
const SUITE_TIMEOUT_MS = 5 * 60 * 1000;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.webp': 'image/webp',
  '.xml': 'application/xml', '.txt': 'text/plain', '.pdf': 'application/pdf',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.mp4': 'video/mp4'
};

/** Resolve a request path to a real file inside ROOT, or null. */
function resolveInsideRoot(urlPath) {
  let p;
  try { p = decodeURIComponent(urlPath.split('?')[0].split('#')[0]); } catch (e) { return null; }
  if (p.includes('\0')) return null;
  if (p.endsWith('/')) p += 'index.html';
  const candidate = path.resolve(ROOT, '.' + path.posix.normalize('/' + p));
  let real;
  try { real = fs.realpathSync(candidate); } catch (e) { return null; }   // missing file
  if (real !== ROOT && !real.startsWith(ROOT + path.sep)) return null;    // outside the repo
  if (real.split(path.sep).includes('node_modules') || real.split(path.sep).includes('.git')) return null;
  if (!fs.statSync(real).isFile()) return null;
  return real;
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }
  const file = resolveInsideRoot(req.url);
  if (!file) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('not found'); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream' });
  if (req.method === 'HEAD') return res.end();
  const stream = fs.createReadStream(file);
  stream.on('error', () => { res.destroy(); });
  stream.pipe(res);
});

server.on('error', err => {
  console.error(`Test server could not start on ${HOST}:${PORT}: ${err.message}`);
  process.exit(2);
});

function runSuite(name, env) {
  return new Promise(resolve => {
    let settled = false;
    const done = (ok, why) => { if (settled) return; settled = true; clearTimeout(timer); if (!ok && why) console.log(`FAIL ${name}: ${why}`); resolve(ok); };
    let child;
    try {
      child = spawn(process.execPath, [path.join(__dirname, `${name}.test.js`)], { env, stdio: 'inherit', cwd: __dirname });
    } catch (err) { return done(false, `could not start (${err.message})`); }
    const timer = setTimeout(() => { child.kill('SIGKILL'); done(false, `timed out after ${SUITE_TIMEOUT_MS / 60000} minutes`); }, SUITE_TIMEOUT_MS);
    child.on('error', err => done(false, `could not start (${err.message})`));
    child.on('exit', (code, signal) => done(code === 0, signal ? `stopped by ${signal}` : (code !== 0 ? `exit code ${code}` : '')));
  });
}

server.listen(PORT, HOST, async () => {
  const env = { ...process.env, BASE_URL: `http://localhost:${PORT}`, SITE_ROOT: ROOT };
  const only = process.argv.slice(2);
  const suites = fs.readdirSync(__dirname)
    .filter(f => f.endsWith('.test.js'))
    .map(f => f.replace(/\.test\.js$/, ''))
    .filter(s => !only.length || only.includes(s))
    .sort((a, b) => (a === 'inline-scripts' ? -1 : b === 'inline-scripts' ? 1 : a.localeCompare(b)));
  if (!suites.length) { console.error('No test suites found.'); server.close(); process.exit(1); }

  const failed = [];
  for (const s of suites) {
    console.log(`\n===== ${s}`);
    if (!(await runSuite(s, env))) failed.push(s);
  }
  server.close();
  console.log(failed.length ? `\n${failed.length} of ${suites.length} suite(s) FAILED: ${failed.join(', ')}` : `\nAll ${suites.length} suites passed`);
  process.exit(failed.length ? 1 : 0);
});
