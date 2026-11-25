// Part of the OHS test suite. Run all with: node tests/run-all.js
// Secret scan: no private keys or tokens in any tracked file (the repo is PUBLIC).
// Values that are public by design are allowed by exact value only:
//  - Shopify Storefront token (made for browsers, read-only storefront access)
//  - Web3Forms form access keys (made to sit in public HTML forms)
// Anything else matching a secret pattern fails. To allow a new public-by-design
// value, add it to ALLOWED with a reason.
const { execSync } = require('child_process');
const fs = require('fs'), path = require('path');
const ROOT = process.env.SITE_ROOT || path.join(__dirname, '..');

const ALLOWED = {
  'e12e77295aa67c71613b6c8fb8a64bcd': 'Shopify Storefront API token (public by design)',
  'd2863ce3-70c1-48cf-bd78-ba381aac2d83': 'Web3Forms access key, booking form (public by design)'
};
const PATTERNS = [
  ['Private key block', /-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP |ENCRYPTED )?PRIVATE KEY-----/],
  ['Shopify Admin API token', /\bshp(?:at|ss|ca|pa)_[0-9a-fA-F]{32}\b/],
  ['GitHub token', /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36}\b|\bgithub_pat_[A-Za-z0-9_]{60,}\b/],
  ['AWS access key', /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/],
  ['Stripe secret key', /\b(?:sk|rk)_live_[0-9a-zA-Z]{20,}\b/],
  ['Slack token', /\bxox[abposr]-[0-9A-Za-z-]{10,}\b/],
  ['Anthropic / OpenAI key', /\bsk-(?:ant-)?[A-Za-z0-9_-]{30,}\b/],
  ['Google API key', /\bAIza[0-9A-Za-z_-]{35}\b/],
  ['Generic secret assignment', /\b(?:password|passwd|secret|api[_-]?secret|client[_-]?secret|private[_-]?key)\b\s*[:=]\s*["'][^"'\s]{8,}["']/i],
  ['Storefront / access token value', /(?:storefrontAccessToken|accessToken|access_key|X-Shopify-Storefront-Access-Token)["']?\s*[:=,]\s*["']([^"']{16,})["']/],
  ['Web3Forms key', /name=["']access_key["'][^>]*value=["']([^"']+)["']/]
];

let files;
try { files = execSync('git ls-files', { cwd: ROOT, encoding: 'utf8' }).split('\n').filter(Boolean); }
catch (e) { files = []; }
files = files.filter(f => !f.includes('node_modules/') && !/\.(png|jpe?g|gif|webp|ico|pdf|zip|mp4|woff2?|ttf|eot)$/i.test(f) && !f.endsWith('package-lock.json'));

const hits = [];
for (const f of files) {
  let text; try { text = fs.readFileSync(path.join(ROOT, f), 'utf8'); } catch (e) { continue; }
  if (text.includes('\0')) continue;
  text.split('\n').forEach((line, i) => {
    for (const [name, re] of PATTERNS) {
      const m = line.match(re); if (!m) continue;
      const value = m[1] || m[0];
      if (Object.keys(ALLOWED).some(a => value.includes(a) || line.includes(a) && !m[1])) continue;
      if (/tests\/secrets\.test\.js$/.test(f)) continue;   // this file lists the patterns
      hits.push(`${f}:${i + 1}  ${name}: ${line.trim().slice(0, 100)}`);
    }
  });
}
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
ok(files.length > 0, `scanned ${files.length} tracked text files`);
ok(!hits.length, 'no secrets found (public-by-design values allowed by exact value)' + (hits.length ? ':\n   ' + hits.join('\n   ') : ''));
console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exitCode = fails ? 1 : 0;
