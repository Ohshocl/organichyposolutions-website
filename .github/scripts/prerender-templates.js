#!/usr/bin/env node
// BUILD STEP (deploy.yml): put the shared nav and footer into every page.
//
// templates/standard-nav.html and templates/standard-footer.html stay the ONE
// place the nav and footer are edited. Before, every visitor's browser fetched
// them after the page loaded, so the page jumped when the nav appeared and the
// nav was missing for search engines and when JavaScript failed. Now the deploy
// copies them into each page's empty <div id="nav-placeholder"></div> /
// <div id="footer-placeholder"></div>, marked data-prerendered so
// global-scripts.js doesn't fetch them again.
//
// Pages served straight from the repo (Vercel previews, local testing) are not
// changed, so they keep loading the templates at runtime exactly as before.
//
//   node .github/scripts/prerender-templates.js <siteDir>
// Exits 1 if a template is missing or a page's placeholder couldn't be filled.
'use strict';
const fs = require('fs'), path = require('path');

const SLOTS = [
  { id: 'nav-placeholder', file: 'standard-nav.html' },
  { id: 'footer-placeholder', file: 'standard-footer.html' }
];
const SKIP_DIRS = new Set(['templates', 'labels', 'node_modules', 'tests', '.git', '.github']);

/** Same path rewrite global-scripts.js does for pages in sub-folders. */
function rewriteForDepth(html, depth) {
  if (!depth) return html;
  const base = '../'.repeat(depth);
  return html.replace(/href="\//g, 'href="' + base).replace(/src="\//g, 'src="' + base).replace(/action="\//g, 'action="' + base);
}

/** Returns the page with its empty placeholders filled; `filled` lists slot ids. */
function prerenderPage(pageHtml, templates, depth) {
  const filled = [], problems = [];
  let html = pageHtml;
  for (const slot of SLOTS) {
    const re = new RegExp('<div id="' + slot.id + '"([^>]*)>\\s*</div>');
    const matches = html.match(new RegExp(re.source, 'g')) || [];
    if (!matches.length) continue;
    if (matches.length > 1) { problems.push(slot.id + ' appears ' + matches.length + ' times'); continue; }
    const m = html.match(re);
    if (/data-prerendered/.test(m[1])) continue;
    const inner = rewriteForDepth(templates[slot.file], depth);
    // function replacement: template text is inserted literally ($ signs included)
    html = html.replace(re, () => '<div id="' + slot.id + '"' + m[1] + ' data-prerendered="true">' + inner + '</div>');
    filled.push(slot.id);
  }
  return { html, filled, problems };
}

function walk(dir, rel, out) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name), r = rel ? rel + '/' + name : name;
    const st = fs.statSync(full);
    if (st.isDirectory()) { if (!SKIP_DIRS.has(name) && !name.startsWith('.')) walk(full, r, out); }
    else if (name.endsWith('.html')) out.push(r);
  }
  return out;
}

function prerenderSite(siteDir) {
  const templates = {};
  for (const s of SLOTS) {
    const f = path.join(siteDir, 'templates', s.file);
    if (!fs.existsSync(f)) throw new Error('template missing: templates/' + s.file);
    templates[s.file] = fs.readFileSync(f, 'utf8');
  }
  const report = { pages: 0, nav: 0, footer: 0, problems: [] };
  for (const rel of walk(siteDir, '', [])) {
    const file = path.join(siteDir, rel);
    const before = fs.readFileSync(file, 'utf8');
    const depth = rel.split('/').length - 1;
    const { html, filled, problems } = prerenderPage(before, templates, depth);
    problems.forEach(p => report.problems.push(rel + ': ' + p));
    if (filled.length) {
      fs.writeFileSync(file, html);
      report.pages++;
      if (filled.includes('nav-placeholder')) report.nav++;
      if (filled.includes('footer-placeholder')) report.footer++;
    }
  }
  return report;
}

module.exports = { prerenderPage, prerenderSite, rewriteForDepth, SLOTS };

if (require.main === module) {
  const dir = process.argv[2];
  if (!dir) { console.error('usage: prerender-templates.js <siteDir>'); process.exit(2); }
  try {
    const r = prerenderSite(path.resolve(dir));
    console.log(`Pre-rendered nav on ${r.nav} pages and footer on ${r.footer} pages (${r.pages} files changed)`);
    if (r.problems.length) { console.error('FAIL:\n  ' + r.problems.join('\n  ')); process.exit(1); }
  } catch (e) { console.error('FAIL: ' + e.message); process.exit(1); }
}
