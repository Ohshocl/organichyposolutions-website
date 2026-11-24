# OHS website tests

Browser tests for the site, run automatically on every pull request (.github/workflows/tests.yml).
This folder is **not deployed** (deploy.yml excludes `tests/`).

Run locally from the repo root:

    cd tests && npm install && npx playwright install chromium && cd ..
    node tests/run-all.js

The runner serves the repo on http://localhost:8805 and runs every suite. Bootstrap and Font Awesome
are served from node_modules (same versions as the CDN links); all other outside requests
(Shopify, Google) are blocked, so results don't depend on the network.

| Suite | What it proves |
|---|---|
| inline-scripts | Every inline script and JSON-LD block in every page parses |
| smoke | Every page loads with no JavaScript errors or missing local files |
| checkout | Checkout opens Shopify in a new tab with the right cart link; Utah-only rules; cart labels |
| cartlines | Stable cart lines across wholesale thresholds; quantity checks; single-line edits (audit R01, R06–R08, R12, R13, R17) |
| qa | Homepage Quick Add goes through the one cart (Utah rule, wholesale price, clear) |
| handoff | Calculator to booking: same estimate and all details for every service mode (audit R11) |
| bookform | Booking form inline errors, field checks, spam trap, keyboard cards (audit R16) |
| mcart | Cart button stays visible in the phone menu bar |
| consent | Cookie banner: nothing sent to Google before Accept; Decline; Cookie settings |
