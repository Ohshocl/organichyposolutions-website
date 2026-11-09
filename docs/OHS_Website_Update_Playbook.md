# OHS Website Update Playbook — the single source of truth
*Built from the OHS Website Requirements Questionnaire (Nov 5, 2026; answered by Brandon/Bob). Last updated Nov 9, 2026.*

This document holds **every questionnaire answer** (Part 6), the status of each answer, the Shopify work, and the Claude Code prompts for each page. You don't need to look at the questionnaire PDF again. If an answer changes, change it here.

---

## Standing rules (apply to every session: Claude chat, Claude Code, Shopify)
1. **This is an update, not a redesign.** Colors, fonts, layout, spacing, and the overall look stay the same (Q11, Q13). New sections reuse existing classes and components.
2. **The footer is final.** Don't edit `templates/standard-footer.html`. It already has Contact, Legal, the phone number, and the social links.
3. **One page per branch, with a dry run first.** Claude Code plans, waits for approval, builds on a `claude/update-<page>` branch, shows the diff, and stops. Anthony QCs. Only Anthony merges to `main`, and a merge is what goes live.
4. **Never update inventory in Shopify.** No quantities, tracking settings, or adjustments, ever. Inventory belongs to Brandon/Bob.
5. **Shopify changes are listed here before or right after they're made.** Product copy changes must pass the compliance rules below.
6. **Compliance:**
   - EPA products (Utah only) may make claims only if they match the approved label exactly.
   - USDA-only and non-registered products: no kill %, no "disinfectant", no "antimicrobial", no contact times.
   - Skin products: cosmetic language only. No "healing", "therapeutic", or "wound".
   - Pet products: claims have to be cleared with Anthony first.
7. **Approvals:** Brandon and Bob approve website changes before they go live (Q9). Send them screenshots or a preview before each merge.
8. **Label files are off-limits.** Never edit, move, or delete anything in `labels/` (all 11 label HTML pages), and don't remove their links from robots.txt or the sitemap. Label updates happen in a separate chat.
9. **Shopify and the repo must stay aligned.** Claude has a Shopify connector (store npmv1h-8e.myshopify.com) that can read the live store and make approved changes. Any work that touches products, prices, variants, SKUs, subscriptions, shipping, or checkout must end with Shopify and `shop/js/product-catalog.js` matching. A change in one gets the matching change in the other in the same work session, or it's logged in Part 5 as pending. Run the **Shopify ↔ repo alignment check** (Part 5) before and after any such change. Inventory is still never touched (rule 4).
10. **Phone number for the nav:** (801) 712-5663, the same number as the footer. Anthony confirmed it on Nov 9 to use for now.

---

## Status dashboard

| Area | Status |
|---|---|
| Backup branch `claude/backup-pre-questionnaire-2026-11` (commit e1e0e36) | ✅ Done Nov 9 |
| Release tag + offline ZIP + protect `main` | ⏳ Anthony, on the GitHub website (Part 1) |
| Phase 0: CLAUDE.md rules + update plan | ⏳ Next |
| Phase 1: remove internal pages (business plan is public!) | ⏳ Do right after Phase 0 |
| Phases 2–8 (website pages) | ⏳ Not started |
| Shopify: serum rename and clean-up, compliance copy on 5 non-EPA products, weights | ✅ Done Nov 9 |
| Shopify: shipping rate gaps | 🔴 Needs a decision (Part 5) |
| Shopify: real subscriptions | ⏳ Needs the subscription app installed (Part 5) |
| Shopify: EPA product copy matches the label | ⏳ Anthony to confirm wording (Part 5) |
| Open questions Q10, Q43, Q44, Q45 | ⏳ Brandon/Bob |

---

## Part 1 — Backup and restore

### ✅ Done Nov 9, 2026
Claude created the backup branch **`claude/backup-pre-questionnaire-2026-11`**. It is a frozen copy of `main` at commit `e1e0e36`, the site as it was before any questionnaire changes. Don't edit or delete it.

### Still for Anthony (GitHub website, about 2 minutes)
1. **Tag it.** Go to **Releases → Draft a new release → Choose a tag**, type `v-pre-questionnaire-2026-11`, and choose **Create new tag on publish**. Set **Target** to `claude/backup-pre-questionnaire-2026-11`, then **Publish**. Cloud sessions can't push tags, so this has to be done by hand. The release also gives you a ZIP of the whole site.
2. **Keep an offline copy.** Download that ZIP and store it outside GitHub.
3. **Protect `main` (recommended).** Go to **Settings → Branches → Add rule** for `main`, then turn on "Require a pull request before merging". Leave bypass allowed for emergencies.

> Cloud Claude Code sessions can only push branches named `claude/...`. They can never push to `main`.

### Restoring when something breaks
**Put one page back the way it was:**
```bash
git checkout main && git pull
git checkout origin/claude/backup-pre-questionnaire-2026-11 -- index.html   # any file path
git commit -m "Restore index.html to pre-update version"
git push   # live in ~1–2 min
```
On the GitHub website: open the file on the backup branch and copy the raw contents. Then edit the same file on `main`, paste over it, and commit.

**Undo a whole merged page update:** open the merged pull request on GitHub and click **Revert**, then merge the revert pull request. From the command line instead: `git revert -m 1 <merge-sha> && git push`.

**Whole site back to the backup (last resort):** `git checkout main && git reset --hard origin/claude/backup-pre-questionnaire-2026-11 && git push --force`. This throws away every update made since the backup.

**Checkpoints:** after each page passes QC and is merged, add a Release tag such as `v-after-<page>`, or ask Claude Code for a branch such as `claude/checkpoint-after-<page>`.

---

## Part 2 — How to work with Claude Code
- **The master copy of this playbook lives in the Project** (`claude/OHS_Website_Update_Playbook.md`). Claude Code may not be able to read Project docs, so attach the file to the Phase 0 session. Phase 0 saves a copy to `docs/OHS_Website_Update_Playbook.md` in the repo (excluded from deploy), and later sessions read it from there. When the Project copy changes, have Claude Code refresh the `docs/` copy at the start of the next session.
- **Each phase gets its own new Claude Code session.** Paste only that phase's prompt from Part 4.
- **CLAUDE.md in the repo** (created in Phase 0) holds the rules. Claude Code loads it automatically.

### The loop (every phase)
| Step | Who | What |
|---|---|---|
| 1. Plan | Claude Code | Plan mode (Shift+Tab): lists every file and change. No edits. |
| 2. Approve | Anthony | Cut anything out of scope, then say "go". |
| 3. Build | Claude Code | Works on the `claude/update-<page>` branch and edits only the approved files. Branches don't deploy. |
| 4. Diff | Claude Code | Shows `git diff main --stat` plus the full diff, then stops. |
| 5. Preview | Anthony | `python3 -m http.server 8000` from the repo root → `http://localhost:8000`. Check desktop and phone width. |
| 6. QC | Anthony | Go through the checklist below. Get Brandon/Bob's OK. |
| 7. Merge | Anthony | Open a PR and merge on GitHub. It's live in about 2 minutes, so recheck the live site. |
| 8. Checkpoint | Anthony / Claude Code | Release tag or `claude/checkpoint-after-<page>` branch. |

### QC checklist
- [ ] Nav and footer load, and the cart badge shows. No red errors in the console (F12).
- [ ] All links work. No 404s.
- [ ] Phone width: nothing overflows, and buttons are big enough to tap.
- [ ] If the page sells anything, add to cart and go through checkout. Shopify should show the right product, price, and quantity. Test retail, Subscribe, and a wholesale quantity.
- [ ] If the page has a form, send a test and confirm it reaches brandon.oneal@organichyposolutions.com.
- [ ] Compliance rules (Standing rule 6) are followed on every product mention.
- [ ] The look matches the rest of the site: same colors, fonts, and card styles.
- [ ] `git diff --stat` lists only the approved files.
- [ ] If the phase touched products, prices, the cart, or checkout: the Shopify ↔ repo alignment check (Part 5) shows no mismatches, or each one is logged in Part 5.

---

## Part 3 — CLAUDE.md ground rules (Phase 0 writes these into the repo)
> The deploy workflow copies everything to the live site, so Phase 0 also excludes `CLAUDE.md` and `docs/` from the deploy.

```
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
```

---

## Part 4 — Phase prompts (paste one per Claude Code session)

### Phase 0 — Setup and dry-run plan (no site changes)
```
Read the attached OHS_Website_Update_Playbook.md. It is the single source of truth and contains
every questionnaire answer in Part 6.
This session is SETUP AND PLANNING ONLY. Do not modify any HTML, CSS, or JS pages.

1. Confirm branch claude/backup-pre-questionnaire-2026-11 exists on origin (commit e1e0e36).
   Don't touch it.
2. On branch claude/setup-rules, create CLAUDE.md at the repo root containing the rules in Part 3
   of the playbook, word for word. Edit .github/workflows/deploy.yml so CLAUDE.md and docs/ are
   removed from _site (next to the README.md exclusion).
3. Save the attached playbook to docs/OHS_Website_Update_Playbook.md (unchanged) so later
   sessions can read it from the repo.
4. Create docs/update-plan.md: for every Part 6 answer marked with a phase, list the exact files
   and the current code that will change, with risk (low/med/high). Flag anything in the current
   code that conflicts with an answer, anything that needs a page that doesn't exist yet, and
   technical unknowns (Web3Forms file uploads; redirects on GitHub Pages; Shopify reviews and
   social feed on a static site).
Show me the diff and stop. I'll merge this PR myself.
```

### Phase 1 — Remove internal pages (Q97) — do first
```
Branch: claude/update-remove-internal-pages.
Remove from the public site: math1010sg.html, d470.html, studyguide.html, moldplan.html,
salesguide.html, pamphlets.html.
First search the whole repo (HTML, templates, sitemap.xml, robots.txt, JS) for links to them and
list every hit; remove those references too. Don't touch anything else. Do NOT touch the labels/
folder or any label page.
Plan first and wait for approval. After: show the diff stat and stop.
```
*Before merging:* save private copies of moldplan and salesguide. *After merging:* each old URL should return a 404.

### Phase 2 — Navigation (Q12, 33–36, 38–42, 59)
```
Branch: claude/update-nav. Files allowed: templates/standard-nav.html; only if needed
assets/css/global-styles.css and assets/js/global-scripts.js (ask first).
- Keep the OHS Brand Image logo (already in use) and the current nav colors.
- Solutions menu: Mold Remediation, HVAC & Air Duct Sanitization, Commercial & Residential
  Disinfection, White Label Products. For pages that don't exist yet, tell me; don't create them.
- Keep Home, Services, Products, Calculator, Shop, About, and the state selector, and keep
  Products and Shop separate.
- Add a highlighted "Get a Quote" button → book-service.html.
- Add phone (801) 712-5663 (tel:+18017125663), visible on every page.
- Contact and Legal: footer only. Remove them from the top menu if present. Do NOT edit the footer.
- Add Login / Account links to Shopify customer accounts
  (https://npmv1h-8e.myshopify.com/account/login).
- Phones: a tap-to-call button first with Get a Quote right beside it, visible without opening
  the menu.
Plan first, wait. After: preview home, a service page, a city page, and cart.html at desktop and
375px; report console errors; show the diff; stop.
```

### Phase 3 — Homepage (Q14, 21–32)
```
Branch: claude/update-homepage. Files allowed: index.html, assets/css/pages.css (scoped .page-home).
- Replace emoji icons (11 on the page) with Font Awesome 6 line icons (already loaded). Show me
  each pick.
- Add a 3-field form (name, phone, service needed) in the existing Quick Contact section at the
  bottom. It submits the same way as book-service.html, to brandon.oneal@organichyposolutions.com.
- Keep everything else unchanged: both banners, the "World's only organic hypochlorous company"
  badge, the headline "Utah's Trusted HOCl Sanitization & Organic Mold Remediation Partner", the
  Quick Add widget position, the pricing disclaimer, the Chief Chemist section, and all sections.
Plan first, wait. After: preview desktop + 375px; confirm Quick Add still adds to cart; show the
diff; stop.
```

### Phase 4 — Quote form (Q48, 49, 76–81)
```
Branch: claude/update-book-service. Files allowed: book-service.html (+ scoped pages.css).
- Required: name, phone, email, service needed, city. Optional: photo upload, message.
- All submissions → brandon.oneal@organichyposolutions.com.
- Request a call back (no appointment booking).
- Show "We respond within 1 business day" and free assessments for mold, HVAC/ducts, and
  commercial disinfection.
- Photo upload: first tell me whether our Web3Forms plan supports attachments. If it needs a
  paid plan, stop and give me the options.
Plan first, wait. Show the diff and stop. I'll send a test submission.
```

### Phase 4b — Contact page (Q49, 83, 84)
```
Branch: claude/update-contact. Files allowed: contact.html (+ scoped pages.css).
- The page currently says "We respond within 2 hours during business hours". Change it to
  "within 1 business day" (Q49).
- Keep the business hours as shown (Q83). Show the service area only; no physical address (Q84).
- Make any form on the page send to brandon.oneal@organichyposolutions.com.
Plan first, wait. Show the diff and stop.
```

### Phase 5 — Service pages (Q43–54), one branch each: mold → HVAC → disinfection
**Blocked until Q43–45 are answered.**
```
Branch: claude/update-mold-remediation. Files allowed: mold-remediation.html (+ scoped pages.css).
- Quote-only: no prices on the page. Link to calculator.html (calculator pricing stays public).
- Free assessment + "we respond within 1 business day".
- Utah only. Service area: Salt Lake, Utah, Summit (Park City), and Davis/Weber (Ogden) counties.
- Credentials: licensed & insured, Utah business license, EPA / USDA Organic product credentials.
  Confirm the FDA wording with me before adding it.
- What customers need to know (Q43) and the process steps (Q44): use ONLY the text I paste:
  [PASTE]. Use the Mold Champions reference docs in the Project for structure, not wording.
- Before/after case study section as a placeholder (no fake content; Brandon supplies jobs and
  permissions).
- Friendly tone for homeowners, professional for commercial (Q16).
Plan first, wait. Show the diff and stop.
```
The HVAC page follows the same pattern, using the Q45 process plus a **home builder program section on the same page** (Q46), not a separate page. If no HVAC page exists yet, Claude Code proposes one built from the standard shell and existing styles.

### Phase 5b — Real subscriptions (after the Shopify subscription app is installed; see Part 5)
```
Branch: claude/update-subscriptions. Files allowed: shop/js/cart.js, shop/js/shopify-client.js,
shop/js/product-catalog.js.
Run the Shopify <-> repo alignment check (playbook Part 5) before and after.
Shopify now has selling plans. Look up the selling plan IDs, add sellingPlanId to each product's
subscription tiers in the catalog, and make checkout pass sellingPlanId for subscription items so
Shopify creates a real recurring order. Change nothing else.
Plan first. After: test one retail and one wholesale subscription to the Shopify payment page
(don't pay) and show that it's labeled a subscription.
```

### Phase 6 — Products page + catalog (Q1, 2, 56, 58, 61, 63, 66, 68, 69). Highest risk: touches the cart.
```
Branch: claude/update-catalog-new-lines. Files allowed: shop/js/product-catalog.js ONLY.
- Run the Shopify <-> repo alignment check (playbook Part 5) first and last; fix every catalog-side
  mismatch (SKUs, names) and list any Shopify-side changes needed.
- Add Skin Care and Pet Care product entries with status 'coming-soon' (no Shopify IDs yet).
  Ask me for the product list and allowed claims before writing ANY description.
- Add an sdsUrl to each product pointing to documents/sds/; list the products with no SDS file.
- Update the SKUs for both EPA 200ppm products, 1 gal USDA, and wipes to match Shopify exactly
  (Shopify is the master copy). Read them from Shopify first.
- Do not change any IDs, prices, or variant IDs.
After: verify every product resolves via findProduct() and getPricingTier() returns the same
variant IDs as before for all 4 tiers. Show the results.
```
```
Branch: claude/update-products-page. Files allowed: products.html (+ scoped pages.css).
- Skin Care and Pet Care sections; 'coming-soon' products show "Coming soon" with no add-to-cart.
- SDS link on every product card.
- Show bulk pricing tiers on each card; no discount codes or first-order offers.
- One products page (no individual product pages); keep the state filter (EPA = Utah only).
- All retail sizes are sold online; add a "Bulk orders: request a quote" link for bulk.
Test retail, subscribe, and wholesale quantities through checkout and confirm the Shopify checkout
shows the same product, variant, and price as the card. Show the diff and stop.
```

### Phase 7 — FAQ split (Q86)
```
Branch: claude/update-faq-split. Files allowed: FAQ.html, new comparison-guide.html, sitemap.xml.
Split the current "Disinfectant Comparison Guide" into a real FAQ (FAQ.html) and a separate
comparison-guide.html. Move content; don't rewrite claims, but flag any claim that breaks the
compliance rules. Link to the guide from FAQ.html (don't touch the footer).
Plan first, show the diff, stop.
```

### Phase 8 — White Label page + form (Q69–75)
```
Branch: claude/update-white-label. New file white-label.html using the standard page shell and
existing styles.
- Lines: skin care, pet care, home & surface, wipes. Skin care and pet care are also sold under
  the OHS name.
- Quote only. Don't publish minimums or timelines.
- We design labels from the customer's logo, or they send finished artwork.
- Form, one screen. Required: name, company, email, phone, product lines (checkboxes: skin care,
  pet care, home & surface, wipes). Optional: estimated quantity (ranges), artwork (have it /
  need design help), target launch date, message. Sends to brandon.oneal@organichyposolutions.com.
Plan first, show the diff, stop.
```

### Later (after Phases 1–8)
| Item | Q | Notes |
|---|---|---|
| Add city pages: Sandy/Draper, Lehi/American Fork, West Jordan/South Jordan | 52 | Copy the existing city-page pattern |
| Fold food processing, agriculture, and commercial & healthcare into disinfection | 55 | Keep old URLs working with redirect pages (GitHub Pages has no server redirects) |
| Text-us button | 82 | Needs a number that can receive texts |
| Social media feed | 93 | Pick an embed widget the social contractor can manage |
| Newsletter signup (quarterly) | 95 | Pick an email tool |
| Product reviews | 67 | A Shopify reviews app plus an embed on the static products page |
| Downloads: pamphlets, product data sheets, SDS | 90 | Remove internal pricing and sales-only content from the pamphlets first |
| Videos | 19 | Embed once the social contractor delivers them |
| CRM / lead tracker hookup for forms | 78 | Pick a CRM |
| Ad landing pages | 94 | When ads start |
| SEO phrases in page titles and meta | 91 | Apply as each page is touched: mold remediation Utah, air duct sanitization Utah, commercial disinfection services Utah, white label HOCl |

---

## Part 5 — Shopify (store npmv1h-8e.myshopify.com)
**Rules:** never update inventory. Keep Shopify and the repo aligned (Standing rule 9).

### Shopify ↔ repo alignment check (run before and after any product, cart, or checkout change)
Claude reads the live store through the Shopify connector and compares it with `shop/js/product-catalog.js`:

| Check | Shopify field | Repo field | Must match? |
|---|---|---|---|
| Product exists and is active | `product.id`, `status` | catalog key / `id`, `status` | Yes |
| Product name | `title` | `name` | Yes (same wording; no "healing"-type drift) |
| 4 variant IDs per product | variant `legacyResourceId` by title (Retail, Retail Subscription, Wholesale, Wholesale Subscription) | `shopifyVariants.retail / retailSubscription / wholesale / wholesaleSubscription` | Yes, exact |
| 4 prices per product | variant `price` | `pricing.*` | Yes, exact |
| SKUs | variant `sku` | `skus.*` | Yes (Shopify is the master copy) |
| Weight | `inventoryItem.measurement.weight` | `weight` | Yes |
| Description and claims | `descriptionHtml` | `description` | Same claims; both pass the compliance rules |
| Subscription plans (after Phase 5b) | selling plan IDs on the product | `sellingPlanId` per subscription tier | Yes |
| Products in one place but not the other | | | Report. 'coming-soon' catalog entries are allowed to have no Shopify product |

Output: a short table of mismatches with the fix needed for each, and which side gets changed. **Inventory quantities are not compared and never changed.**

**Last run: Nov 9, 2026.** IDs, variant IDs, prices, and weights match. Mismatches still open: (1) SKUs on 4 products, fixed in Phase 6. (2) Product names differ for 5 products: both EPA products (Shopify adds "200 ppm"), both USDA products ("32oz Organic Ready-to-Use Cleaner - USDA Certified" vs "32oz USDA Certified Organic Ready-to-Use Cleaner"), and wipes ("...Organic Wipes" vs "...Acid Wipes"). Decide which wording wins, then align in Phase 6. (3) EPA product copy and EPA number, pending Anthony. The laundry boosters and the serum match.

The store has **8 active products**. Their product IDs, variant IDs, and prices match `product-catalog.js`. Each product has 4 variants: Retail, Retail Subscription, Wholesale, and Wholesale Subscription.

### ✅ Done Nov 9, 2026
- **Serum:** title changed from "OHS Pure Healing Skin Serum 100 ML" to **"OHS Pure Skin Serum 100ml"**. The description (which said "therapeutic", "promotes rapid healing", and "antimicrobial protection for wounds") was replaced with the website's skin-wellness copy. Tags `epa`, `healing`, and `therapeutic` were removed. SKUs changed from `OHS-HEALING-SERUM-*` to `OHS-SKIN-SERUM-100ML-*`. The URL handle `ohs-healing-skin-serum` was kept so links don't break.
- **Unregistered pesticide claims removed** from the 32oz USDA cleaner, the 1 gal USDA solution, the wipes, and both laundry boosters. They had said "disinfectant", "Kills 99.9%", and "antimicrobial protection" while shipping nationwide. They now use the website's approved copy, and the wrong `epa` tag was removed from the USDA cleaners and wipes.
- **Weights on all 32 variants:** 32oz = 2.5 lb, 1 gal = 9.0 lb, wipes = 1.125 lb, serum = 0.5 lb. These come from the site catalog. Every variant was 0 lb before.

### 🔴 Needs a decision: shipping rate gaps (Q64 says keep the current settings, so nothing was changed)
The General profile's rates are weight-based and only cover carts from **1 lb to about 12.4 lb** (West Coast and East Coast zones, $6.75–$11.11):
- **A cart with only one serum (0.5 lb) has no shipping rate** and can't check out.
- **Any cart over about 12.4 lb has no rate**: two or more gallons, and every wholesale quantity (10+ gallons, 25+ bottles). Q56 says bulk is by quote, but wholesale pricing still kicks in at the threshold on the site.
- The second profile, "OHS Online", has no shipping methods.
- **Decision for Brandon/Bob:** add a rate under 1 lb, plus rates (or a "contact us" message) above 12.4 lb. Claude can build the rates in Shopify once the numbers are approved.

### ⏳ Subscriptions (Q60)
The store has **zero selling plans**, so the "Subscription" variants are just cheaper one-time variants: the customer gets 10% off and no recurring order is ever created.
1. Anthony or Bob installs a subscription app in the Shopify admin (e.g. Shopify Subscriptions, which is free).
2. Claude creates the plans: delivery frequency TBD (e.g. every 30, 60, or 90 days) at 10% off.
3. Phase 5b wires the website checkout to pass `sellingPlanId`.

### ⏳ EPA product copy (needs Anthony's label check)
- The 32oz and 1 gal 200ppm descriptions say "Safe for food contact surfaces, toys, and skin", "No harsh chemicals, no toxic fumes", and "Kills 99.9% of pathogens including bacteria, viruses, and fungi". Every claim must match the approved label, and "safe"/"non-toxic" claims are generally not allowed on pesticide products.
- The EPA number is inconsistent: Shopify shows **97801-1**, but the site catalog shows **97801-1-105539**. Confirm which should be displayed.
- Claude updates both, in Shopify and the site catalog, once Anthony gives the exact wording.

### ⏳ SKU alignment
Shopify's SKUs are the master copy. Phase 6 updates the site catalog to match for both EPA 200ppm products, 1 gal USDA, and wipes. Checkout isn't affected because it uses variant IDs.

### Owner items (Claude does not touch these)
- **Inventory:** counts look like placeholders (about 2,500–5,000, and several are negative). Brandon/Bob manage these in Shopify.
- **Customer accounts (Q59):** confirm they're turned on in Shopify (Settings → Customer accounts).
- **Returns (Q65)** and shipping settings (Q64) stay as they are, except for the rate-gap decision above.

### Reference
- The 500ppm EPA products (IDs 7470030454855 and 7470030258247) **don't exist** in Shopify and aren't on the site. The 10-product table in the Project instructions is outdated; the real lineup is these 8:

| Product | Shopify ID | Type | Retail | Ret Sub | Wholesale | WS Sub | Threshold |
|---|---|---|---|---|---|---|---|
| 32oz EPA Registered RTU Cleaner 200 ppm | 7249401053255 | EPA (UT only) | 21.99 | 19.79 | 15.99 | 14.39 | 25 |
| 1 Gal EPA Registered RTU Solution 200 ppm | 7249401086023 | EPA (UT only) | 34.99 | 31.49 | 22.99 | 20.69 | 10 |
| 32oz Organic RTU Cleaner – USDA | 7418569752647 | USDA-only | 19.99 | 17.99 | 13.99 | 12.59 | 25 |
| 1 Gal Organic RTU Solution – USDA | 7418571685959 | USDA-only | 32.99 | 29.69 | 20.99 | 18.89 | 10 |
| All in One Hypochlorous Organic Wipes | 7249401315399 | Non-registered | 15.99 | 14.39 | 12.99 | 12.99 | 20 |
| 32oz Organic Laundry Booster | 7249400004679 | USDA-only | 15.99 | 14.39 | 10.99 | 9.89 | 25 |
| 1 Gal Organic Laundry Booster | 7249400037447 | USDA-only | 28.99 | 26.09 | 19.99 | 17.99 | 10 |
| OHS Pure Skin Serum 100ml | 7249401348167 | USDA-only (cosmetic) | 34.99 | 31.49 | 26.99 | 24.30 | 12 |

*Thresholds come from the site catalog. The wipes wholesale and wholesale-subscription prices are the same ($12.99). Confirm that's intended.*

---

## Part 6 — Every questionnaire answer, with its status
Key: **P#** = handled in that phase · **Keep** = no change needed · **Done** · **Later** · **Owner** = Brandon/Bob, not code · **OPEN** = unanswered

### 1. Goals and priorities
| # | Question | Answer | Status |
|---|---|---|---|
| 1 | Most important visitor action | Add our own Skin Care and Pet Care lines, sold under the OHS name and also as white label. Products not yet in Shopify show "Coming soon." | P6, P8 |
| 2 | Business lines to grow | Grow Skin Care and Pet Care, both retail under OHS and white label | P6, P8 |
| 3 | Most important visitor | No preference | — |
| 4 | Monthly leads target | No preference | — |
| 5 | Monthly online product revenue target | $1,000–$5,000/month | Goal |
| 6 | Utah service vs nationwide product | Both equally | — |
| 7 | Deadline | End of 2026 | Deadline |
| 8 | Budget | $2,500–$7,500 | Budget |
| 9 | Who approves changes | Brandon and Bob | Standing rule 7 |
| 10 | Competitor sites we like | **OPEN** | OPEN |

### 2. Brand and look
| # | Question | Answer | Status |
|---|---|---|---|
| 11 | Keep current colors | Keep them; minor tweaks OK | Keep (Standing rule 1) |
| 12 | Official logo | The OHS Brand Image (menu logo) | Keep; already in nav (P2 confirms) |
| 13 | Brand style guide | Keep as is; follow existing site styles | Keep |
| 14 | Emoji icons on service cards | Replace with Font Awesome line icons (already loaded; no added cost) | P3 (index: 11 emoji), services.html has 7 → include when that page is touched |
| 15 | Consistent company name | No preference | — |
| 16 | Tone | Mix by page: friendly for homeowners and products, professional for commercial | All copy phases |
| 17 | Real photos | Some, but not enough | Owner |
| 18 | Photo/video shoot | Ask the social media contractor to handle photos and video | Owner |
| 19 | Videos on site | Yes, in this update | Later (when delivered) |
| 20 | Colors, styles, or images to avoid | No preference | — |

### 3. Homepage
| # | Question | Answer | Status |
|---|---|---|---|
| 21 | Two banners | Keep both | Keep (P3) |
| 22 | Lead with services or products | N/A, keeping both | — |
| 23 | "World's only organic hypochlorous company — patent pending" badge | Keep it | Keep (P3). Company is responsible for backing up the claim |
| 24 | Headline | Keep "Utah's Trusted HOCl Sanitization & Organic Mold Remediation Partner." | Keep (P3) |
| 25 | Quick Add widget | Keep where it is | Keep (P3) |
| 26 | Quote form on homepage | Yes: 3 fields (name, phone, service needed) in the existing Quick Contact section at the bottom, sent to the same place as Book Service | P3 |
| 27 | Prices on homepage | No preference; keep current disclaimer | Keep |
| 28 | Testimonials | No preference | — |
| 29 | Client/partner logos | Not now | — |
| 30 | Stats (jobs, years, sq ft) | Not now | — |
| 31 | Chief Chemist section | Keep as is | Keep |
| 32 | Sections to remove | None; keep all | Keep |

### 4. Menu and navigation
| # | Question | Answer | Status |
|---|---|---|---|
| 33 | Solutions menu (Mold, HVAC & Air Duct, Commercial & Residential Disinfection, White Label) | Yes, final | P2 |
| 34 | Top menu items | Keep all (Home, Services, Products, Calculator, Shop, About, state selector) | P2 |
| 35 | Highlighted "Get a Quote" button | Yes | P2 |
| 36 | Phone number in menu on every page | Yes: (801) 712-5663 | P2 |
| 37 | Green promo banner "Bulk discounts as high as 42%" | Keep it; 42% is accurate | Keep |
| 38 | State selector | Keep in the menu as is | Keep |
| 39 | Combine Products and Shop | No, keep separate | Keep |
| 40 | Calculator in top menu | Keep in top menu | Keep |
| 41 | Contact and Legal | Footer only | P2 (footer already has them) |
| 42 | First thing on phones | Tap-to-call first, Get a Quote right beside it | P2 |

### 5. Service pages
| # | Question | Answer | Status |
|---|---|---|---|
| 43 | 3 things customers need to know per service | **OPEN** | OPEN — blocks P5 |
| 44 | Mold job process to publish | **OPEN** | OPEN — blocks P5 |
| 45 | HVAC/duct job process to publish | **OPEN** | OPEN — blocks P5 |
| 46 | Home builder HVAC program | A section on the HVAC page; no separate page | P5 |
| 47 | Prices on service pages | Keep calculator pricing; service pages stay quote-only and link to the calculator | P5 |
| 48 | Free assessments | Yes: mold, HVAC/ducts, and commercial disinfection | P4, P5 |
| 49 | Response time promise | Within 1 business day; OK to promise on the site | P4, P4b, P5 |
| 50 | Areas served | Working default: Salt Lake, Utah, Summit (Park City), and Davis/Weber (Ogden) counties. **Confirm before launch** | P5 (confirm) |
| 51 | Services outside Utah | Utah only | P5 |
| 52 | City pages | Keep the current 4 (SLC, Ogden, Provo, Park City); later add Sandy/Draper, Lehi/American Fork, West Jordan/South Jordan | Later |
| 53 | Case studies / before-after | Yes. Brandon picks the jobs and gets client permission | P5 placeholder; Owner content |
| 54 | Credentials on service pages | EPA / USDA Organic / FDA product credentials, licensed & insured, Utah business license | P5 (confirm FDA wording) |
| 55 | Food processing, agriculture, commercial & healthcare pages | Fold into disinfection over time; keep old URLs live and pointed at the new sections | Later |

### 6. Products and online store
| # | Question | Answer | Status |
|---|---|---|---|
| 56 | Online vs contact-only | All retail sizes online; bulk by quote | P6 |
| 57 | Stay on Shopify | Yes, for this update | Keep |
| 58 | Retail vs wholesale pricing display | Same page, with bulk pricing tiers shown | P6 |
| 59 | Customer accounts | Yes, through Shopify | P2 (login links); Owner: confirm enabled |
| 60 | Subscriptions / auto-reorder | Yes | Part 5 + P5b |
| 61 | Where each line can be sold | EPA line: Utah only. USDA Organic line ships nationwide | Keep (state filter) |
| 62 | Product data complete | "Yes, complete" (with a note to confirm in Shopify) | Part 5: copy, SKUs, and weights fixed; issues remain |
| 63 | Product pages | Stay on one products page | P6 |
| 64 | Shipping options | Keep current Shopify shipping settings | Part 5 — 🔴 rate gaps need a decision |
| 65 | Returns/refunds | Keep current policy | Keep |
| 66 | SDS links | Yes, link the SDS from every product | P6 |
| 67 | Product reviews | Yes, through Shopify | Later |
| 68 | Discounts and offers | Bulk pricing tiers only | P6 |

### 7. White label program
| # | Question | Answer | Status |
|---|---|---|---|
| 69 | White label lines | Skin care, pet care, home & surface, wipes. Skin care and pet care are also sold under the OHS name | P8 |
| 70 | Minimum order quantities | Quote only; don't publish minimums | P8 |
| 71 | What customers provide | Their logo, or finished artwork if they have it | P8 |
| 72 | Label design help | Both: we design from their logo, or they send finished artwork | P8 |
| 73 | Timeline | Don't publish a timeline | P8 |
| 74 | Inquiry form fields | Required: name, company, email, phone, product lines (checkboxes). Optional: quantity range, artwork (yes / need design help), target launch date, message. One screen | P8 |
| 75 | Show white label examples | No preference | — |

### 8. Forms, quotes, and contact
| # | Question | Answer | Status |
|---|---|---|---|
| 76 | Who receives Web3Forms submissions | All forms → brandon.oneal@organichyposolutions.com | P3, P4, P4b, P8 |
| 77 | Email for all forms | brandon.oneal@organichyposolutions.com | Same |
| 78 | Forms into a CRM | Yes | Later (pick a CRM) |
| 79 | Quote form fields | Required: name, phone, email, service needed, city. Optional: photo upload, message | P4 |
| 80 | Photo uploads | Yes | P4 (check the Web3Forms plan) |
| 81 | Online booking vs callback | Request a call back | P4 |
| 82 | Live chat / text-us | A text-us button | Later |
| 83 | Business hours | Keep what the site shows now (M–F 8–6, Sat 9–5, Sun closed) | Keep |
| 84 | Physical address vs service area | Service area only | P4b (footer already has no address) |

### 9. Calculator, resources, and content
| # | Question | Answer | Status |
|---|---|---|---|
| 85 | Calculator prices | Current; keep public calculator pricing | Keep |
| 86 | FAQ page | Split into a real FAQ page and a separate comparison guide | P7 |
| 87 | Blog | Undecided | — |
| 88 | Common customer topics | No preference | — |
| 89 | Science & Certifications page current | Yes, current | Keep |
| 90 | Downloadable pamphlets, data sheets, SDS | Yes, all of them. Check pamphlets for internal pricing or sales-only content first | Later |

### 10. Search, social, and marketing
| # | Question | Answer | Status |
|---|---|---|---|
| 91 | Search phrases | Working default: mold remediation Utah, air duct sanitization Utah, commercial disinfection services Utah, white label HOCl | All page phases |
| 92 | Google Business Profile | Set up, but needs updating | Owner |
| 93 | Social media on site | Yes, show a social media feed | Later |
| 94 | Paid ads | Planning to | Later |
| 95 | Newsletter | Yes, quarterly | Later |
| 96 | Who reviews analytics | The social media contractor | Owner (give GA access) |

### 11. Housekeeping, security, and maintenance
| # | Question | Answer | Status |
|---|---|---|---|
| 97 | Remove non-customer pages (math1010sg, d470, studyguide, moldplan, salesguide, pamphlets) | Remove all six. Keep internal docs private; post a customer-facing pamphlet instead | P1 |
| 98 | Logins in company accounts | Yes, all company accounts | — |
| 99 | Who updates the site after launch | No preference | — |
| 100 | Review cadence | No preference | — |

---

## Part 7 — Open items and owners
| Item | Owner | Blocks |
|---|---|---|
| Q10 competitor sites | Brandon/Bob | Nothing (nice to have) |
| Q43–45 service content and process steps | Brandon/Bob | Phase 5 |
| Q50 confirm service-area counties | Brandon/Bob | Phase 5 launch |
| Shipping rate gaps (<1 lb, >12.4 lb) | Brandon/Bob decide → Claude builds | Serum-only and bulk checkouts |
| Install subscription app + pick delivery frequencies | Anthony/Bob | Phase 5b |
| EPA label wording + correct EPA No. (97801-1 vs 97801-1-105539) | Anthony | EPA product copy |
| FDA wording for credentials (Q54) | Anthony | Phase 5 |
| Skin Care / Pet Care product list and allowed claims | Anthony/Bob | Phase 6 |
| Wipes: wholesale price = wholesale-subscription price ($12.99), intended? | Brandon/Bob | — |
| Product names: Shopify wording or site wording for the 5 mismatched products (Part 5 alignment check) | Anthony | Phase 6 alignment |
| Inventory counts | Brandon/Bob (Claude never touches) | — |
| GitHub Release tag + protect `main` | Anthony | — |
| Delete the stale playbook copy at the Project root (`OHS_Website_Update_Playbook.md`) | Anthony | — |
