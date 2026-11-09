# OHS Website Update Plan (Phase 0 dry run)

*Written Nov 9, 2026 from `main` at commit `e1e0e36`. This is a plan only: nothing on the site has changed yet.*
*Source of truth: `docs/OHS_Website_Update_Playbook.md`. Q numbers refer to Part 6 of the playbook.*

**Risk key:** **Low** = text or markup on one page, easy to revert. **Med** = shared template, form handling, or several pages affected. **High** = touches the cart, checkout, product catalog, or Shopify, or a mistake would lose leads or sales.

---

## Summary: the things that need a decision before or during the phases

These came out of reading the current code. Each one is explained in the phase sections below.

| # | Finding | Affects | Severity |
|---|---|---|---|
| A | **Six pages don't use the shared nav or footer.** `about.html`, `contact.html`, `legal-information.html` and `science-certifications.html` have their own hard-coded nav and footer. `FAQ.html` and `hoclsds.html` have **no site nav at all**. Phase 2 nav changes (Get a Quote, phone, Solutions, Login) will **not** appear on these pages unless they're switched to `#nav-placeholder` / `#footer-placeholder`. That's outside the Phase 2 file list. | P2, P4b, P7, Q36 ("phone on every page") | **High** |
| B | **Checkout doesn't use the Storefront API.** `shopify-client.js` calls `checkoutCreate` on API version `2025-10`. Shopify retired the Storefront Checkout API, so (to verify with one test checkout) every checkout falls back to the `/cart/<variant>:<qty>` permalink in `cart.js`. Real subscriptions (Phase 5b) need the Cart API (`cartCreate` with `sellingPlanId`), so it's a rewrite of the checkout call, not just adding an ID. | P5b | **High** |
| C | **Wholesale thresholds don't match the playbook.** The catalog has **24** for all three 32oz products. The playbook's product table says **25**. The table says thresholds "come from the site catalog", so one of them is wrong. | P6, pricing on site | Med |
| D | **Serum product type.** The catalog has `type: 'non-registered'`. The playbook table says "USDA-only (cosmetic)". Compliance filters and the footer counts depend on this. | P6 | Med |
| E | **Mold page publishes prices** ($2/$8/$12 tiers and "$5–$15 per square foot"). Q47 says service pages are quote-only. The 4 mold city pages and the residential pages also show prices. | P5 | Med |
| F | **The FAQ page shows a street address** ("5842 Crest Flower Way, Salt Lake City, UT 84118"). Q84 says service area only. `contact.html` JSON-LD also has a `PostalAddress` (city only). | P7, P4b | Med |
| G | **The contact page has no form.** It uses `mailto:OHS@OrganicHypoSolutions.com` and a **Google Form link** ("Request Service"). Q76 says all forms go to brandon.oneal@. Decide: point those buttons to `book-service.html`, or change the email address too. | P4b | Med |
| H | **Web3Forms recipient isn't set in the code.** The recipient email is tied to the access key (`d2863ce3-…`) in the Web3Forms dashboard. Someone with the Web3Forms login must confirm it delivers to brandon.oneal@. If not, create a new key under that address. | P3, P4, P4b, P8 | Med |
| I | **The footer will go out of date.** It hard-codes "USDA Organic (4)" and "Wellness (2)", and links to `commercial-healthcare.html` and `residential-sanitization.html`. Adding Skin Care / Pet Care (P6) and folding service pages (Later, Q55) will make it wrong, but the footer is frozen (Standing rule 2). | P6, Later | Low (decide) |
| J | **Pages that don't exist yet:** HVAC & Air Duct page, combined "Commercial & Residential Disinfection" page, `white-label.html`, `comparison-guide.html`, and a customer-facing pamphlet. | P2, P5, P7, P8, Q97 | — |
| K | **Inline `<style>` blocks already exist** in `book-service.html`, `contact.html`, `FAQ.html` and `calculator.html` (and `index.html` uses many inline `style=""` attributes). CLAUDE.md says "no new `<style>` blocks". Existing ones stay unless a phase is approved to move them. | All | Low |
| L | **A Storefront API token is duplicated** in `products.html` (line ~250) and `shopify-client.js`. A Storefront token is public by design, but there are two copies to keep in sync. `contact.html` and `science-certifications.html` load `shop/js/shopify-config.js`, which is gitignored, so it 404s on the live site. | P6, cleanup | Low |
| M | **`book-service.html` is a booking form, not a quote form.** It has a date/time picker, priority +$50, contract tiers, add-ons, a live price estimate, and only "Residential / Commercial" service types (no Mold or HVAC). Q79–81 ask for a short callback quote form. That's a large rewrite of the page and its script. | P4 | **High** |

---

## Step 1 — Backup check

- `origin/claude/backup-pre-questionnaire-2026-11` exists and points to `e1e0e364e87b2bf4d7ad6b7f3f87eb77bb73d8a7` (`e1e0e36`), same as `main` today. ✅ Not touched.

---

## Phase 1 — Remove internal pages (Q97) · Risk: **Low**

**Files to delete:** `math1010sg.html`, `d470.html`, `studyguide.html`, `moldplan.html`, `salesguide.html`, `pamphlets.html`.

**References found (whole repo, excluding the six pages themselves):**

| File | Hit | Action |
|---|---|---|
| `sitemap.xml` | none | — |
| `robots.txt` | none | — |
| `templates/*.html`, other HTML, JS | none | — |
| `assets/css/pages.css` lines 25–26 | header comment lists `.page-pamphlets` and `.page-salesguide` | Remove the 2 comment lines |
| `assets/css/pages.css` lines ~2730–2750 | `PAMPHLETS / SALES GUIDE PAGES` block (dead CSS) | Remove the block |

**Conflict:** the Phase 1 prompt says "don't touch anything else". The only references are in `pages.css`, so Phase 1 needs `assets/css/pages.css` added to its allowed list, or the dead CSS is left behind (harmless).

**Note:** `labels/` isn't in the sitemap, and robots.txt only has `Disallow: /labels/`. Neither gets touched.

**Before merge:** save private copies of `moldplan.html` and `salesguide.html` (the backup branch also keeps them).
**Q97 follow-up:** "post a customer-facing pamphlet instead". No page exists for this yet; it's tracked under Later (Q90).

---

## Phase 2 — Navigation (Q12, 33–36, 38–42, 59) · Risk: **Med** (shared on 40+ pages)

**File:** `templates/standard-nav.html` (143 lines). It's loaded at runtime by `assets/js/global-scripts.js` (`loadTemplate('nav-placeholder', …)`).

| Q | Current code | Change |
|---|---|---|
| 12 | Logo `/assets/images/logos/OHS Brand Image.jpg` | Keep |
| 33 | "Services" dropdown: All Services, Mold Remediation, Food Processing & Manufacturing, Commercial & Healthcare, Agriculture & Livestock, Residential Sanitization | Add a "Solutions" menu: Mold Remediation (exists) · HVAC & Air Duct Sanitization (**no page**) · Commercial & Residential Disinfection (**no single page**; today it's `commercial-healthcare.html` + `residential-sanitization.html`) · White Label Products (**no page**). Decide: keep the Services dropdown as-is and add Solutions alongside it, or rename Services → Solutions. Q34 says keep "Services". |
| 34, 39, 40 | Home, Services, Products, Calculator, About, Shop, state selector | Keep. Products and Shop stay separate. |
| 35 | Not present. "Book Service" is buried in the Shop dropdown. | Add a highlighted "Get a Quote" button → `/book-service.html` (reuse an existing `.btn` class) |
| 36, 42 | No phone in the nav | Add `tel:+18017125663` "(801) 712-5663". On phones: tap-to-call + Get a Quote visible **outside** the collapsed menu (next to the hamburger). |
| 41 | About dropdown contains **Contact** and **Legal Information** | Remove both from the About dropdown. The footer already has them. |
| 59 | No login link | Add Login / Account → `https://npmv1h-8e.myshopify.com/account/login`. **Owner check:** customer accounts must be on in Shopify. New customer accounts use a different URL (`shopify.com/<id>/account`); the legacy `/account/login` redirects when they're on. Test it. |
| 37 | Green promo banner "💰 BULK DISCOUNTS AS HIGH AS 42%" | Keep (the 💰 emoji is not in Q14's scope) |

**Possibly also needed:** `assets/css/global-styles.css` for the mobile call/quote bar. If the nav needs the active-page highlight for new items, also `assets/js/global-scripts.js` (ask first).

**Conflict (finding A):** the nav won't change on `about.html`, `contact.html`, `legal-information.html` or `science-certifications.html` (hard-coded old navs; these even have a commented-out "Account – Coming Soon" block pointing to `auth/login.html`, which doesn't exist). `FAQ.html` and `hoclsds.html` have no nav at all. Q36 says the phone should be on **every** page. **Recommendation:** add a Phase 2b, "convert 6 pages to the shared nav/footer". That's one page per branch, replacing the hard-coded `<nav>`/`<footer>` with the placeholders. Risk Med: their page CSS may rely on the old markup.

---

## Phase 3 — Homepage (Q14, 21–32) · Risk: **Med**

**Files:** `index.html` (1,139 lines), `assets/css/pages.css` (`.page-home` scope).

**Emoji → Font Awesome 6 (Q14). 11 found, matching the playbook count:**

| Line | Emoji | Where | Suggested FA6 icon (confirm each) |
|---|---|---|---|
| 182 | 🏠 | stats strip | `fa-house` |
| 195 | 🦠 | stats strip | `fa-virus` |
| 208 | 🛡️ | stats strip | `fa-shield-halved` |
| 221 | 🌿 | stats strip | `fa-leaf` |
| 234 | ♻️ | stats strip | `fa-recycle` |
| 350 | 🛡️ | service card header | `fa-shield-halved` |
| 375 | 📋 | service card header | `fa-clipboard-list` |
| 399 | 🏠 | service card header | `fa-house` |
| 420 | 🏭 | service card header | `fa-industry` |
| 441 | 🌾 | service card header | `fa-wheat-awn` |
| 462 | 📅 | service card header | `fa-calendar-days` |

**Version caveat:** the site loads **Font Awesome 6.0.0** (cdnjs). Names like `fa-house` and `fa-shield-halved` exist in 6.0; check any newer names before use. The playbook says FA is "line" icons, but FA Free has very few outline (`fa-regular`) icons. Most will be solid. Confirm the look.

**Quote form (Q26):** the Quick Contact section (`<section class="contact-section" id="contact">`, line ~614) has 4 buttons, Service Area, and Business Hours, but **no form**. Add a 3-field form (name, phone, service needed) that posts to Web3Forms with the same access key as `book-service.html` (see finding H). It also needs the success redirect and honeypot/spam handling the same way.

**Keep unchanged:** both banners (`.intro-hero-section` line 99, `.hero-section` line 122), `.patent-badge` (line 126), the headline, the Quick Add widget (line 157), the pricing disclaimers (lines 343–476), the Chief Chemist section (line 583), and every section.

**Note:** the index service cards show "Pricing estimates only" disclaimers. Q27 = keep.

**Related:** `services.html` has 7 emoji icons (lines 308, 316, 324, 332, 398, 405, 412). Per the playbook, do these when `services.html` is next touched. That isn't in any current phase.

---

## Phase 4 — Quote form (Q48, 49, 76–81) · Risk: **High** (lead capture; finding M)

**File:** `book-service.html` (951 lines; inline `<style>` lines 20–59; ~400 lines of pricing script copied from the calculator).

| Q | Current | Required |
|---|---|---|
| 79 | Required: first name, last name, email, service address. Phone **optional**. No city field (address only). Service type = Residential / Commercial cards. | Required: **name, phone, email, service needed, city**. Optional: photo, message. "Service needed" options should cover Mold, HVAC/Ducts, Commercial disinfection, Residential disinfection, Other. |
| 81 | Preferred date, time window, urgency (+$50 priority), contract tiers (15/10/20% off), add-ons, live price estimate | Callback request. Remove the date/time picker, contracts, add-ons and the estimate panel, **or** leave the calculator as the pricing tool and link to it. Removing these also removes the copied pricing script. |
| 48 | Nothing about free assessments | Add "Free assessment" for mold, HVAC/ducts, commercial disinfection |
| 49 | Already says "We'll confirm your booking within 1 business day" (lines 87, 511) | Reword to "We respond within 1 business day" |
| 76/77 | Web3Forms key `d2863ce3-70c1-48cf-bd78-ba381aac2d83`, subject "New Service Booking Request" | Confirm the key delivers to brandon.oneal@ (finding H). Update the subject to "Quote request". |
| 80 | No file input | Photo upload — see **Technical unknowns: Web3Forms file uploads** |
| 84 | "Service Area: Salt Lake City & surrounding Utah counties. Travel fees may apply beyond 25 miles." | Align wording with the Q50 counties once confirmed |

**Also:** the page title and meta say "Book Service … book online". Update them to quote wording. The nav "Book Service" label and the homepage `intentServicesBtn` ("Book a Service") would then read oddly. Change those labels in P2 and P3.

---

## Phase 4b — Contact page (Q49, 83, 84) · Risk: **Low–Med**

**File:** `contact.html` (1,238 lines; inline `<style>` from line 69; hard-coded nav line 544 and footer line ~970; finding A).

| Q | Line(s) | Current | Change |
|---|---|---|---|
| 49 | 715 | "We respond within 2 hours during business hours" | "within 1 business day" |
| 49 | 876 | "We respond to emails and form submissions within 2 hours during business hours…" | "within 1 business day" |
| 49 | ~816 | "Standard Service — 24-48 Hours" / Priority card | Not a response promise; this is scheduling. Flag for Brandon/Bob: keep or remove? |
| 83 | 683–697, 953 | M–F 8–6, Sat 9–5, Sun closed | Keep |
| 84 | 1097–1102 JSON-LD `PostalAddress` (city only); 1047 "Salt Lake City, UT, USA" in the hard-coded footer | No street address shown. JSON-LD with city only is fine. |
| 76 | 655, 731 `mailto:OHS@OrganicHypoSolutions.com`; ~946 Google Forms "Request Service" link | **There's no form on the page.** Decide: change the Google Form button to `book-service.html` (recommended; that removes a form that bypasses brandon.oneal@), and keep or change the mailto address (finding G). |
| — | line 58 | `<script src="shop/js/shopify-config.js">` (gitignored → 404 in console) | Remove the tag (would fail the "no red console errors" QC item). Needs approval. |
| — | 958 | "Salt Lake City, Provo, Ogden & Throughout Utah" | Align with Q50 counties |

---

## Phase 5 — Service pages (Q43–54) · **Blocked on Q43–45** · Risk: **Med**

### Mold — `mold-remediation.html` (726 lines)
| Q | Current | Change |
|---|---|---|
| 47 | Price tiles at lines ~362/378/394 ($2–, $8–, $12– per sq ft) and FAQ text line ~594 "$5–$15 per square foot" | Remove all prices and link to `calculator.html` (**conflict E**) |
| 48, 49 | No free-assessment or response-time text found | Add both |
| 50, 51 | — | Utah only; counties per Q50 (confirm before launch) |
| 54 | Line 520: "Licensed General Contractor" partner (Jared Strang) — physical remediation by a partner. Line 548: "EPA Reg. #97801-1". | Add licensed & insured, Utah business license, EPA/USDA. **FDA wording needs Anthony.** Confirm whether the GC partner section stays, and whether "licensed & insured" applies to OHS or to the partner. |
| 43, 44 | — | Paste-only content (OPEN) |
| 53 | — | Case study placeholder (no fake content) |
| — | EPA number here is `97801-1`; the catalog uses `97801-1-105539` | Part 5 EPA number decision |

**City pages:** `mold-remediation-{slc,ogden,provo,parkcity}.html` (1,117 lines each) probably copy the prices too. They're not in the Phase 5 file list. Add a follow-up so Q47 is applied site-wide.

### HVAC & Air Duct — **page does not exist** (finding J)
HVAC is only mentioned inside other pages (the book-service "Air Treatment" add-on, mold, residential, commercial-healthcare, and their city pages). Phase 5 proposes a new `hvac-air-duct-sanitization.html` from the standard shell (nav/footer placeholders, `.page-hvac` scope in pages.css), including the **home builder program section** (Q46). Add it to `sitemap.xml` in the same branch.

### Commercial & Residential Disinfection — **page does not exist**
Today these are `commercial-healthcare.html` (819) and `residential-sanitization.html` (844, which publishes prices: "$150 — $0.15/sq ft" plus tier cards around lines 99 and 490–512 — conflicts with Q47). Q55 (Later) folds food processing, agriculture and commercial into disinfection. Decide whether Phase 5 builds a new combined page now or reuses `commercial-healthcare.html` until the Q55 merge.

---

## Phase 5b — Real subscriptions (Q60) · Risk: **High** (finding B)

**Files:** `shop/js/cart.js`, `shop/js/shopify-client.js`, `shop/js/product-catalog.js`.

- `shopify-client.js` line ~130: `checkoutCreate` mutation on `apiVersion: '2025-10'`. That mutation is gone, so `createCheckout()` returns nothing and `cart.js` line ~519 always uses the `/cart/<variant>:<qty>` permalink.
- Neither path sends a selling plan. Phase 5b needs to replace `checkoutCreate` with **`cartCreate`** (each line gets `merchandiseId` plus, for subscription items, `sellingPlanId`) and redirect to `cart.checkoutUrl`. Then the permalink fallback becomes the backup for non-subscription carts only.
- The catalog has no `sellingPlanId` fields yet.
- Prerequisite: subscription app installed and selling plans created (Part 5). Today the "Subscription" variants are just cheaper one-time variants.
- **Also check:** the 4-variant model (separate "Retail Subscription" variants) may be redundant once selling plans exist, because a selling plan normally applies its discount to the normal variant. Decide whether subscriptions use the Retail variant + plan (10% off via the plan) or the existing Subscription variant + plan (discount applied twice). This needs a decision before building.

---

## Phase 6a — Catalog (Q1, 2, 56, 61, 62, 66) · Risk: **High**

**File:** `shop/js/product-catalog.js` (738 lines, 8 products).

| Item | Current | Change |
|---|---|---|
| Skin Care / Pet Care entries | none | Add with `status: 'coming-soon'`. `products.html` already skips `coming-soon` items in its Shopify fetch (line ~430) and checks `isComingSoon` (line ~663). **Need product list + allowed claims first.** |
| `sdsUrl` (Q66) | Field doesn't exist | `documents/sds/` has **one** file: `HOCL - Safety Data Sheet.pdf` (plus a QR PNG). There's also an HTML SDS page, `hoclsds.html`. Every product would point to the same SDS unless more are supplied. **Missing product-specific SDS for all 8 products** (and for wipes/serum the general HOCl SDS may not apply). |
| SKUs | e.g. `OHS-32OZ-200PPM-RTU-RETAIL` | Match Shopify for the 2 EPA 200ppm products, 1 gal USDA, and wipes (read live first) |
| Names (Part 5 mismatch 2) | e.g. `All in One Hypochlorous Acid Wipes`, `32oz EPA Registered Ready-to-Use Cleaner` | Wait for Anthony's wording decision |
| Thresholds | 32oz EPA / 32oz USDA / 32oz Laundry = **24**; 1 gal = 10; wipes 20; serum 12 | Playbook says 25 for the 32oz products — **conflict C**. Changing this changes when wholesale pricing applies. Treat it as a pricing change (needs approval). |
| Serum `type` | `'non-registered'` | Playbook says USDA-only cosmetic — **conflict D** |
| EPA descriptions (lines ~53, ~103) | "Kills 99.9%… Safe for food contact surfaces, toys, and skin… No harsh chemicals, no toxic fumes" and EPA `97801-1-105539` | **Same claims Part 5 flags in Shopify.** They're on the website too. Hold for Anthony's label wording and EPA number. |
| `emoji` field | e.g. `🧴` | Used for card fallbacks; not in Q14 scope |

**Unchanged:** all IDs, `shopifyVariants`, `pricing`, `getPricingTier`. Verification per the prompt: `findProduct()` resolves everything, and `getPricingTier()` returns identical variant IDs for all 4 tiers before and after.

## Phase 6b — Products page (Q56, 58, 63, 66, 67, 68) · Risk: **High**

**File:** `products.html` (1,115 lines).

- It renders from the catalog (`#productSections`). The 3 sections are around lines 604/629/644 (EPA / USDA / non-registered). Add Skin Care and Pet Care sections. The grouping currently uses `type`, so the new lines need a `productLine` (exists: e.g. `'epa-registered'`) or a new `category` value to group by.
- Line ~250 has its **own** `SHOPIFY_CONFIG` with a Storefront token, and line ~286 has its **own** copy of the 50-state list. That duplicates the catalog's `US_STATES` (finding L). Leave it alone unless approved.
- The bulk pricing display exists (`wholesaleThreshold` logic around lines 551–560). Show all tiers on each card.
- The page reads live inventory from Shopify for stock badges (read-only, OK under rule 4).
- Add an SDS link and a "Bulk orders: request a quote" link (→ `book-service.html`, or the white-label/quote form).
- No discount codes are present ✅.

---

## Phase 7 — FAQ split (Q86) · Risk: **Med** (compliance)

**Files:** `FAQ.html` (1,706 lines, big inline `<style>` from line 8, **no shared nav/footer**), new `comparison-guide.html`, `sitemap.xml`.

- The current page **is** the comparison guide: `<title>Disinfectant Comparison Guide`, `<h1>` line 985. Sections: "Science Behind Effective Sanitization" (992), "At-A-Glance Comparison" (1081), "Understanding Your Sanitization Options" (1162), "Disinfectant Comparison" (1173–1550), "Business Owner Questions & Expert Answers" (1554; the only real FAQ content), contact/social block (1615+).
- **Plan:** move everything except the Q&A into `comparison-guide.html`. `FAQ.html` keeps the Q&A, gets a real FAQ structure, and links to the guide. Both new/kept pages should use the shared nav/footer placeholders (finding A).
- **Compliance flags:** about 30 lines with kill/disinfectant/"safe for"/hospital-type language. Examples: "Triple Certification Standard" (line 1051; the playbook knows of EPA + USDA, so check the third), "100x Faster: 15-30 seconds" (line 963, a contact-time claim), and comparison star ratings against competitors. EPA-backed claims may stay only if they match the label; claims about USDA-only products may not. Content is moved, not rewritten, but each flagged line gets listed for Anthony.
- **Q84 conflict F:** "🏢 Address — 5842 Crest Flower Way, Salt Lake City, UT 84118" at lines 1635–1638. Remove it, but this needs approval because Phase 7 says "move content; don't rewrite".
- Also "25-mile primary radius / Extended service to 60 miles" (around line 1631) vs Q50 counties.

---

## Phase 8 — White Label (Q69–75) · Risk: **Med**

**New file:** `white-label.html` (**doesn't exist**). Build it from the standard shell (nav/footer placeholders, `global-styles.css`, `components.css`, `pages.css` with a new `.page-white-label` scope).
- The form posts to Web3Forms (finding H). Required fields and checkboxes per Q74.
- "Artwork: have it / need design help" is a radio choice, **not** a file upload (avoids the upload question).
- It must also be added to `sitemap.xml` and linked from the Solutions menu (P2 links to it, so P2 either waits for P8 or links a page that 404s until P8 merges). **Order suggestion:** build P8 before P2 merges, or leave the White Label menu item out of P2 and add it in P8.

---

## Later items

| Item | Q | Files likely touched | Note |
|---|---|---|---|
| New city pages | 52 | 3 new HTML files + sitemap | Copy the existing 4-city pattern; the mold city pages are 1,117 lines each |
| Fold food/agriculture/commercial into disinfection | 55 | 15 pages + nav + **footer** (finding I) | See redirects below |
| Text-us button | 82 | nav or global | Needs an SMS-capable number |
| Social feed | 93 | one page | See unknowns |
| Newsletter | 95 | footer or page | Footer is frozen. Put the signup on a page instead, or get a footer exception. |
| Product reviews | 67 | products.html | See unknowns |
| Downloads (pamphlets, data sheets, SDS) | 90 | new page | Only 1 SDS PDF exists today |
| Videos | 19 | — | When delivered |
| CRM | 78 | all forms | Web3Forms → CRM via webhook/Zapier, or switch form provider |
| SEO titles and meta | 91 | each page as touched | — |

---

## Technical unknowns

### 1. Web3Forms file uploads (Q80)
- To our knowledge, Web3Forms **file attachments are a paid (Pro) feature**. On the free plan, a `<input type="file">` is ignored or rejected. **Verify in the Web3Forms dashboard** under whatever account owns key `d2863ce3-…`. That same check confirms the recipient email (finding H).
- Forms with files must use `enctype="multipart/form-data"`. The current form also uses a `redirect` field and native POST, which works with multipart.
- **Options if it's paid:** (a) upgrade Web3Forms; (b) drop the upload and say "you can reply to our email with photos"; (c) a separate free upload service (e.g. a Google Form with file upload — that requires a Google sign-in for the uploader); (d) a different form provider with free uploads (check limits). Recommended default: (b) until the plan is confirmed.

### 2. Redirects on GitHub Pages (Q55)
- GitHub Pages has **no server-side redirects** (no `_redirects`, no `.htaccess`). Since the site deploys with a custom Actions workflow (not Jekyll), the `jekyll-redirect-from` plugin isn't available either.
- **Approach:** keep each old URL as a small stub page with `<meta http-equiv="refresh" content="0; url=/new-page.html#section">`, a `<link rel="canonical">` to the new page, and a visible "this page moved" link. Remove the stubs from `sitemap.xml`. Search engines treat an instant meta refresh roughly like a redirect. This covers 15 URLs (the 3 service hubs plus 12 city pages).
- The footer links to `commercial-healthcare.html` and would hit the stub until the footer gets an exception (finding I).

### 3. Shopify product reviews on a static site (Q67)
- Shopify review apps (Shopify Product Reviews is retired; Judge.me, Yotpo, etc.) normally inject widgets into a **Shopify theme**. This site is static on GitHub Pages and only uses the Storefront API.
- Possible routes: the review app's **headless/JS widget or public API** (Judge.me offers a widget script and API for headless stores; check whether its free plan allows it), or store reviews in Shopify **metafields** and read them through the Storefront API (needs metafield storefront access and someone to manage them).
- Unknown: which app the owners want, and whether its static/headless embed is on the free tier. Decide before planning that phase.

### 4. Social media feed (Q93)
- No native static embed exists for an Instagram/TikTok/Facebook combined feed. Options: a third-party widget (e.g. Elfsight, Behold, SnapWidget, Juicer). Most need a script tag plus an account the social contractor controls. Free tiers usually have view limits or branding.
- Each adds a third-party script, so check console errors, page weight, and that it doesn't break the nav loader.

### 5. Other technical notes
- **Shopify customer account URL** (Q59): confirm whether the store uses classic or new customer accounts; the login URL differs.
- **Checkout path** (finding B): until Phase 5b, the cart permalink is the real checkout path. QC "test checkout" in every phase is really testing `/cart/<variant>:<qty>`.
- **Sitemap dates:** `deploy.yml` rewrites every `<lastmod>` to the deploy date. No action needed; just so it's not surprising.

---

## Setup changes made in this branch (Phase 0)

| File | Change |
|---|---|
| `CLAUDE.md` (new) | Part 3 rules, word for word |
| `docs/OHS_Website_Update_Playbook.md` (new) | Playbook copy, unchanged |
| `docs/update-plan.md` (new) | This plan |
| `.github/workflows/deploy.yml` | `rm -rf _site/CLAUDE.md` and `rm -rf _site/docs` added next to the README.md exclusion, plus a matching line in the header comment |
