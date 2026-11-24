// Part of the OHS test suite. Every inline <script> in every page parses (audit, CI section).
// The deploy only checks .js files; a syntax error inside a page would otherwise go live.
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = process.env.SITE_ROOT || path.join(__dirname, '..');
const files = [];
(function walk(dir) { for (const f of fs.readdirSync(dir)) { const p = path.join(dir, f);
  if (['node_modules', '.git', 'tests', '_site'].includes(f)) continue;
  if (fs.statSync(p).isDirectory()) walk(p); else if (f.endsWith('.html')) files.push(p); } })(ROOT);
let bad = 0, count = 0;
for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  const re = /<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi; let m;
  while ((m = re.exec(html))) {
    if (/application\/ld\+json/i.test(m[1])) { try { JSON.parse(m[2]); } catch (e) { bad++; console.log(`FAIL ${path.relative(ROOT, f)}: invalid JSON-LD: ${e.message}`); } continue; }
    if (/type=["'](?!text\/javascript|module)/i.test(m[1])) continue;
    count++;
    try { new vm.Script(m[2], { filename: path.relative(ROOT, f) }); }
    catch (e) { bad++; console.log(`FAIL ${path.relative(ROOT, f)}: ${e.message}`); }
  }
}
console.log((bad ? 'FAIL ' : 'PASS ') + `${count} inline scripts and all JSON-LD blocks in ${files.length} HTML files parse`);
console.log(bad ? bad + ' FAILED' : 'ALL PASSED'); process.exitCode = bad ? 1 : 0;
