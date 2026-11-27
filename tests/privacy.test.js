// Part of the OHS test suite. Run all with: node tests/run-all.js
// Privacy: the chemist is referred to only as "our chemist" (Anthony, 2026-11-27).
// No page, script or template may contain his name, contact details, education,
// employers, or describe him as owner of the manufacturer. labels/ (physical
// product labels) is excluded; it is maintained separately.
// The terms below are written split so this file doesn't match itself.
const { execSync } = require('child_process');
const fs = require('fs'), path = require('path');
const ROOT = process.env.SITE_ROOT || path.join(__dirname, '..');
const T = (...p) => p.join('');
const FORBIDDEN = [
  [T('Sco', 'tt An', 'derson'), 'name'],
  [T('\\bSco', 'tt\\b'), 'first name'],
  [T('\\bAnder', 'son\\b'), 'surname'],
  [T('sco', 'tt\\.and'), 'personal email'],
  [T('267\\)? ?-?3', '37-?5416'), 'personal phone'],
  [T('Brigham ', 'Young'), 'education'],
  [T('Pepper', 'dine'), 'education'],
  [T('Exxon', 'Mobil'), 'employer'],
  [T('Hunts', 'man International'), 'employer'],
  [T('Pioneer ', 'Chemical'), 'employer'],
  [T('Specialty ', 'Gases'), 'employer'],
  [T('owner (?:and chemist )?(?:of|at) Sani', '-TEST'), 'owner of the manufacturer'],
  [T('job in Ida', 'ho|project in Ida', 'ho'), 'job location']
];
let files = [];
try { files = execSync('git ls-files', { cwd: ROOT, encoding: 'utf8' }).split('\n').filter(Boolean); } catch (e) {}
files = files.filter(f => /\.(html|js|json|xml|txt|md)$/i.test(f) && !f.startsWith('labels/') && !f.startsWith('tests/') && !f.includes('node_modules/'));
const hits = [];
for (const f of files) {
  let text; try { text = fs.readFileSync(path.join(ROOT, f), 'utf8'); } catch (e) { continue; }
  text.split('\n').forEach((line, i) => {
    for (const [re, what] of FORBIDDEN) if (new RegExp(re, 'i').test(line)) hits.push(`${f}:${i + 1} (${what})`);
  });
}
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
ok(files.length > 0, `checked ${files.length} site files (labels/ excluded)`);
ok(!hits.length, 'no identifying information about the chemist' + (hits.length ? ':\n   ' + hits.join('\n   ') : ''));
console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exitCode = fails ? 1 : 0;
