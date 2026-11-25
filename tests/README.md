# OHS website tests

Browser tests for the site, run automatically on every pull request (.github/workflows/tests.yml).
This folder is **not deployed** (deploy.yml excludes `tests/`).

Run locally from the repo root:

    cd tests && npm ci && npx playwright install chromium && cd ..
    node tests/run-all.js            # all suites
    node tests/run-all.js cartlines  # just one

The runner serves the repo on http://127.0.0.1:8805 (localhost only, files inside the repo only) and runs every `tests/*.test.js` file it finds, so a new suite runs automatically. A suite that can't start, crashes or takes over 5 minutes fails the run. Bootstrap and Font Awesome
are served from node_modules (same versions as the CDN links); all other outside requests
(Shopify, Google) are blocked, so results don't depend on the network.

| Suite | What it proves |
|---|---|
| inline-scripts | Every inline script and JSON-LD block in every page parses |
| a11y | axe-core WCAG 2.1 A/AA check on every page; existing serious/critical problems listed per page in a11y-baseline.json (may only shrink), new ones fail |
| links | Every local link/image/script in every page exists; pre-existing ones are listed in known-broken-links.json and may only shrink |
| smoke | Every page loads with no JavaScript errors or missing local files |
| checkout | Checkout opens Shopify in a new tab with the right cart link; Utah-only rules; cart labels |
| cartlines | Stable cart lines across wholesale thresholds; quantity checks; single-line edits (audit R01, R06–R08, R12, R13, R17) |
| qa | Homepage Quick Add goes through the one cart (Utah rule, wholesale price, clear) |
| handoff | Calculator to booking: same estimate and all details for every service mode (audit R11) |
| bookform | Booking form inline errors, field checks, spam trap, keyboard cards (audit R16) |
| mcart | Cart button stays visible in the phone menu bar |
| consent | Cookie banner: nothing sent to Google before Accept; Decline; Cookie settings |

## Rules

- Every confirmed defect gets a regression test here where practical.
- Install with `npm ci` (exact versions from package-lock.json). CI also runs `npm audit`.
- These are mocked browser tests: they block Shopify and Google, so they don't prove real inventory, subscriptions, shipping rules or Web3Forms delivery end to end.
