// Part of the OHS test suite. Run all with: node tests/run-all.js
// CLAIMS SCAN: keeps product claims within the EPA registration (Sani-TEST, EPA
// Reg. No. 97801-1) and the Change Request Part G rules. See docs/approved-claims.md
// for the wording that IS allowed.
//
// Each rule below is a kind of claim that is not allowed on the site. Problems that
// existed when the scan was added are recorded per page in claims-baseline.json;
// they are reported but don't fail. A NEW occurrence fails, and a page/rule that has
// been fixed must be removed from the baseline (the list only shrinks).
// Re-record after a deliberate fix:  CLAIMS_WRITE_BASELINE=1 node tests/run-all.js claims
// Print every matching sentence:     CLAIMS_SHOW=1 node tests/claims.test.js
//
// Not scanned: labels/ (physical labels), hoclsds.html (the Safety Data Sheet page,
// kept as issued), tests/, docs/.
const fs = require('fs'), path = require('path');
const ROOT = process.env.SITE_ROOT || path.join(__dirname, '..');
const BASELINE_FILE = path.join(__dirname, 'claims-baseline.json');

const RULES = {
  'kill-time': {
    why: 'EPA label: 10-minute wet contact time. No seconds-long kill or disinfection times.',
    re: /\b(?:10|ten)[- ]second|\b\d+\s?[-–]\s?\d+\s?sec(?:ond)?s?\b|under 30 seconds|within \d+[- ]?seconds?|seconds? (?:kill|contact)|instant(?:ly)? (?:kill|disinfect)/i
  },
  'unlisted-organism': {
    why: 'EPA label organisms: Staphylococcus aureus, Pseudomonas aeruginosa, Human Coronavirus 229E only.',
    re: /\b(?:MRSA|VRE|C\.? ?diff(?:icile)?|noroviru\w*|influenza|avian flu|bird flu|hepatitis|E\.? ?coli|salmonella|listeria|superbugs?|(?<!insecticide, )fung(?:i|al)\b|(?<!insecticide, )fungicid\w*|sporicid\w*|aspergillus|penicillium|fusarium|ringworm|dermatophytes?|SARS-CoV-2|COVID(?:-19)?|mycotoxins?|aflatoxins?|RSV|strep(?:tococc\w*)?|campylobacter|toxoplasma|pasteurella|giardia|enterococc\w*|botrytis|pythium|powdery mildew|fire blight|newcastle disease|mastitis|BRD|tuberculosis|legionella|klebsiella|acinetobacter|candida|rhinovirus|rotavirus|measles|HPAI|PEDv|parvo\w*|biofilms?|wild yeast)\b|\bspores?\b/i
  },
  'kills-mold': {
    why: 'No mold-killing claims. Allowed: "cleans mold and mildew stains" (EPA label cleaning directions).',
    re: /\b(?:kill\w*|eliminat\w*|destroy\w*|eradicat\w*|prevent\w*)\b[^.]{0,30}\bmo(?:u)?ld\b/i
  },
  'fda-medical': {
    why: 'No FDA approval / wound / eye / medical-device claims (not covered by the EPA registration; no FDA clearance for this product).',
    re: /FDA[- ](?:approv\w*|cleared)|cleared for|\bwounds?\b|eye (?:drops|irrigation|cleaning)|medical device disinfection/i
  },
  'safety-absolute': {
    why: '40 CFR 156.10(a)(5): no "safe", "non-toxic", "harmless" claims. Use label phrases: "Contains no toxic chemicals", "No harsh fumes", "Mild", "Use without gloves", "Worry free use in baby rooms and nurseries".',
    re: /\b100% safe|completely safe|\bsafe (?:for|to|around|in)\b(?! surfaces? (?:of|that))|\bnon-?toxic\b|zero risk|\bno (?:health )?risk\b|chemical-free|(?:food|pet|family|child|baby|kid)[- ]safe\b|safety rating|safe for inhalation|food[- ]contact[- ]safe/i
  },
  'comparison': {
    why: 'No efficacy comparisons with bleach or other products, star ratings, or resistance claims (not on the EPA label).',
    re: /\b\d+\s?[-–]?\s?\d*\s?x (?:more|faster|stronger|superior|better)\b|\b\d+ times (?:more|faster|stronger)|(?:more effective|faster|stronger|safer) than (?:bleach|traditional|conventional)|cannot develop resistance|no (?:antimicrobial )?resistance|resistance development|growing resistance|cannot adapt|★/i
  },
  'organic-pesticidal': {
    why: 'The USDA Certified Organic line is not EPA-registered: no disinfectant / antimicrobial / sanitizer / germ-killing claims for it.',
    re: /\borganic (?:disinfect\w*|antimicrobial\w*|sanitiz\w*|germ\w*)|USDA (?:Certified )?Organic (?:HOCl )?(?:disinfect\w*|antimicrobial\w*|sanitiz\w*)/i
  },
  'dual-certification': {
    why: 'EPA registration and USDA organic certification belong to different product lines; never present one product as both.',
    re: /both EPA registration AND USDA|dual[- ]certified|EPA \+ USDA|triple[- ]certif\w*|only disinfectant with both/i
  },
  'unverified-badge': {
    why: 'WHO, FSIS and FCN 1811 credentials pending verification (FCN 1811 belongs to IET/EcoloxTech; FSIS use depends on conditions).',
    re: /WHO Essential Medicine|FSIS (?:compliant|approved|compliance)|FCN\s?(?:No\.\s?)?1811/i
  }
};

function textOf(file) {
  let s = fs.readFileSync(path.join(ROOT, file), 'utf8');
  if (file.endsWith('.html')) {
    // Text search engines and social cards show: <title>, meta descriptions, alt text, JSON-LD.
    const extra = [];
    s.replace(/<meta\b[^>]*\bcontent="([^"]*)"[^>]*>/gi, (m, c) => { if (/name="(?:description|keywords|twitter:[a-z]+)"|property="og:[a-z]+"/i.test(m)) extra.push(c + '.'); return m; });
    s.replace(/\balt="([^"]+)"/gi, (m, c) => { extra.push(c + '.'); return m; });
    s.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi, (m, c) => { extra.push(c.replace(/[{}\[\]"]/g, ' ').replace(/,\s/g, '. ')); return m; });
    s = s.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
         .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#8217;|&rsquo;/g, "'").replace(/&mdash;/g, '—');
    s += ' ' + extra.join(' ').replace(/&amp;/g, '&').replace(/&mdash;/g, '—');
  }
  return s.replace(/\s+/g, ' ');
}
const FILES = fs.readdirSync(ROOT).filter(f => f.endsWith('.html') && f !== 'hoclsds.html').sort()
  .concat(['templates/standard-nav.html', 'templates/standard-footer.html', 'shop/js/product-catalog.js', 'google-merchant-feed.txt'])
  .filter(f => fs.existsSync(path.join(ROOT, f)));

// Reviewed exceptions (tests/claims-allow.json): sentences that look like a claim but aren't
const ALLOW_FILE = path.join(__dirname, 'claims-allow.json');
const ALLOW = fs.existsSync(ALLOW_FILE) ? JSON.parse(fs.readFileSync(ALLOW_FILE, 'utf8')).allow || [] : [];
const allowed = (rule, sentence) => ALLOW.some(a => a.rule === rule && sentence.includes(a.contains));

const found = {};   // file -> rule -> [sentences]
for (const f of FILES) {
  const sentences = textOf(f).split(/(?<=[.!?|])\s+/);
  for (const [rule, { re }] of Object.entries(RULES)) {
    const hits = sentences.filter(x => re.test(x) && !allowed(rule, x)).map(x => x.trim().slice(0, 200));
    if (hits.length) (found[f] = found[f] || {})[rule] = hits;
  }
}

if (process.env.CLAIMS_SHOW) {
  for (const [f, rules] of Object.entries(found)) for (const [r, hits] of Object.entries(rules)) hits.forEach(h => console.log(`${f} [${r}] ${h}`));
}
if (process.env.CLAIMS_WRITE_BASELINE) {
  const pages = {}; for (const [f, rules] of Object.entries(found)) pages[f] = Object.fromEntries(Object.entries(rules).map(([r, h]) => [r, h.length]).sort());
  fs.writeFileSync(BASELINE_FILE, JSON.stringify({ note: 'Claims that existed when recorded (count of sentences per page and rule). The test fails on any increase and on counts that dropped without updating this file. Re-record only after a deliberate fix: CLAIMS_WRITE_BASELINE=1 node tests/run-all.js claims', recorded: new Date().toISOString().slice(0, 10), pages }, null, 2) + '\n');
  console.log('Baseline written: ' + BASELINE_FILE);
}
const base = fs.existsSync(BASELINE_FILE) ? (JSON.parse(fs.readFileSync(BASELINE_FILE, 'utf8')).pages || {}) : {};
const added = [], fixed = [];
for (const f of new Set([...Object.keys(found), ...Object.keys(base)])) {
  for (const r of Object.keys(RULES)) {
    const now = (found[f] && found[f][r] || []).length, was = (base[f] && base[f][r]) || 0;
    if (now > was) added.push(`${f} [${r}] ${now - was} new — ${RULES[r].why}\n      e.g. "${found[f][r][found[f][r].length - 1]}"`);
    if (now < was) fixed.push(`${f} [${r}] ${was} -> ${now}`);
  }
}
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
ok(FILES.length > 30, `scanned ${FILES.length} files`);
ok(ALLOW.every(a => a.rule in RULES && a.contains && a.reason), `every reviewed exception names a rule, a sentence and a reason (${ALLOW.length})`);
ok(!added.length, 'no new disallowed claims' + (added.length ? ':\n   ' + added.join('\n   ') : ''));
ok(!fixed.length, 'claims-baseline.json is up to date' + (fixed.length ? ' — fixed now, re-record the baseline:\n   ' + fixed.join('\n   ') : ''));
const remaining = {}; for (const rules of Object.values(base)) for (const [r, n] of Object.entries(rules)) remaining[r] = (remaining[r] || 0) + n;
console.log('INFO known claims still to fix: ' + (Object.entries(remaining).map(([r, n]) => `${r} ${n}`).join(', ') || 'none'));
console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exitCode = fails ? 1 : 0;
