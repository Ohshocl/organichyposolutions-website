# Rules for working on the Organic HypoSolutions website

These rules apply to every session. The full reference is the "OHS Website — Playbook" and the
"Instructions" document in the project's Google Drive folder ("OHS Website Update 2026"). Never
commit the Playbook or any internal document to this repo: the repo is PUBLIC.

## Process
- Never commit or push to main. Every change goes on its own branch named claude/update-<short-name>
  and becomes one focused pull request (PR).
- Before editing, list every file you'll touch and every change in plain words, then wait for
  approval. Never edit files outside the approved list; if a change needs another file, stop and ask.
- Never merge a PR until the person explicitly says "approved" (or "merge") for that PR.
- Before opening the PR, run the full test suite (`node tests/run-all.js`; first time:
  `cd tests && npm ci && npx playwright install chromium`) and report the result. All suites must pass.
- Every bug fix includes a regression test that fails on the old code and passes on the new code.
  New features get tests too. Tests are auto-discovered (tests/*.test.js).
- Only merge when the PR's "Browser tests" and "Cross-browser tests (webkit)" checks are green.
  ("Cross-browser tests (firefox)" is report-only for now. "Lighthouse (this PR vs base)" fails if a
  key page gets more than 10 points worse: treat that as a blocker unless explained and approved.)
- In the PR: what changed in plain English, files changed, test results, how to undo it.
- After merging: confirm the deploy succeeded, re-run the tests on main, and add a change log entry
  to the Drive folder (PR, merge commit, what changed, tests, deploy status, limitations, undo).
- Don't reformat, reindent, or "clean up" code you weren't asked to change.
- Don't delete files or pages, or change page URLs, without listing them and getting approval.

## Never touch (without explicit approval from Anthony)
- labels/ — the label HTML pages print the physical product labels. Never edit, move, rename, or
  delete anything there, or their robots.txt entry.
- Shopify inventory (quantities, tracking, "continue selling when out of stock") — never.
- Prices, product data, wholesale thresholds, SKUs, variant IDs, subscriptions, shipping, checkout.
- Product claims and regulated wording (see Compliance).

## Design: keep the foundation
- Colors, fonts, layout, spacing, hero styles, card styles, and overall look stay exactly as they
  are. Don't change brand variables (#2E5EAA, #7DD3FC, #4ADE80, #22C55E, #f59e0b, #1e3a8a).
  New sections and buttons reuse existing classes and components (Bootstrap 5.3 + site CSS).
  This is an update, not a redesign.
- CSS: no new <style> blocks in HTML. Site-wide -> assets/css/global-styles.css, reusable
  components -> components.css, page-specific -> pages.css (scoped with the page's body class).
- Pages must work on phones (no sideways scroll at 320-414px), by keyboard, with labelled controls.
- Nav and footer: edit ONLY templates/standard-nav.html and templates/standard-footer.html. The
  deploy builds them into every page (.github/scripts/prerender-templates.js); pages keep the empty
  #nav-placeholder / #footer-placeholder divs.

## One implementation each (never duplicate)
- Product data: only shop/js/product-catalog.js. Never hardcode products, prices or variant IDs in
  HTML. "Is it for sale" = window.isProductActive (status 'active' + fully set up).
- Cart: only shop/js/cart.js (localStorage key `ohsCart`). Shipping state: OHSState in
  assets/js/global-scripts.js. Stock: only shop/js/shopify-client.js (unknown stock never blocks a
  purchase). Service prices and their math: only shop/js/service-pricing.js. Product filters:
  shop/js/catalog-filters.js. Don't change cart.js, shopify-client.js, getPricingTier or
  service-pricing.js unless the approved plan says so.

## Shopify alignment
- Shopify and this repo must stay aligned. A Shopify connector may be available. For any change to
  products, prices, variant IDs, SKUs, subscriptions, shipping, or checkout: read the live Shopify
  data first, make product-catalog.js match it (or list the Shopify change needed), and report every
  mismatch. Shopify settings are changed only with Anthony's explicit approval.
- Don't call anything Shopify-dependent "done" until it's verified in the real store.

## Compliance (Change Request Part G)
- Check product.type before writing any claim. EPA claims only on EPA products (Utah-only), and only
  wording that matches the approved label (EPA Reg. No. 97801-1-105539).
- USDA-only and non-registered products: no kill %, "disinfectant", "antimicrobial", or contact times.
- Skin and pet products: no "healing", "therapeutic", "wound", treat or cure language; keep the FDA
  statement. No "safe/non-toxic" claims on EPA products or services. Mold: "works against mold",
  never "kills".
- Ask before writing ANY new product claim. New claim wording comes only from Brandon's approved text.
- Keep Safety Data Sheet and regulatory lines (manufacturer, registrant, emergency numbers) exactly
  as they are.

## Privacy and secrets
- Refer to the product chemist only as "our chemist". Never add a name, contact details, education,
  employers, ownership or locations for them (tests/privacy.test.js enforces this).
- No passwords, API keys, private documents or personal information in the repo (tests/secrets.test.js
  scans for them; only the public-by-design Shopify Storefront token and Web3Forms key are allowed).
