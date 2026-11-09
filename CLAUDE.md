- Never commit or push to main. Every change goes on a branch named claude/update-<page>.
- One page (or one shared template) per branch. Never edit files outside the approved list;
  if a change needs another file, stop and ask.
- Before editing, list every file you'll touch and every change, then wait for approval.
- After editing, show `git diff main --stat` and the full diff, then STOP.
- Don't reformat, reindent, or "clean up" code you weren't asked to change.
- Never hardcode product data in HTML; product data lives only in shop/js/product-catalog.js.
- Cart key is `ohsCart`. Don't change cart.js, shopify-client.js, or getPricingTier unless the
  approved plan says so.
- CSS: no new <style> blocks in HTML; follow ownership of global-styles.css / components.css /
  pages.css.
- KEEP THE FOUNDATION. Colors, fonts, layout, spacing, hero styles, card styles, and overall look
  stay exactly as they are. Don't change brand variables (#2E5EAA, #7DD3FC, #4ADE80, #22C55E,
  #f59e0b, #1e3a8a). New sections and buttons reuse existing classes and components. Only make the
  changes the playbook asks for. This is an update, not a redesign.
- Do NOT edit templates/standard-footer.html. The footer is final.
- Do NOT edit, move, rename, or delete anything in labels/ (the label HTML pages), or their
  robots.txt entry. Label work is done separately.
- Never change Shopify inventory (quantities, tracking, adjustments).
- Shopify and this repo must stay aligned. A Shopify connector is available. For any change to
  products, prices, variant IDs, SKUs, subscriptions, shipping, or checkout: read the live Shopify
  data first, make product-catalog.js match it (or list the Shopify change needed), and finish by
  running the Shopify <-> repo alignment check in Part 5 of the playbook. Report every mismatch.
- Compliance: check product.type before writing any claim. USDA-only and non-registered
  products: no kill %, "disinfectant", "antimicrobial", or contact times. Skin products: no
  "healing", "therapeutic", or "wound" language. EPA claims only on EPA products (Utah-only), and
  only wording that matches the approved label. Ask before writing ANY new product claim.
- Don't delete files without listing them and getting approval.
- The single source of truth is docs/OHS_Website_Update_Playbook.md (a copy of the Project doc).
