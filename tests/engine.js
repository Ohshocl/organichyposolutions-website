// Which browser engine the browser suites use. Default Chromium.
//   OHS_BROWSER=firefox node tests/run-all.js smoke checkout
//   OHS_BROWSER=webkit  node tests/run-all.js smoke checkout
// Exported as `chromium` so the suites keep their `chromium.launch()` lines;
// it is whichever engine OHS_BROWSER names.
const pw = require('playwright');
const name = (process.env.OHS_BROWSER || 'chromium').toLowerCase();
if (!['chromium', 'firefox', 'webkit'].includes(name)) throw new Error('OHS_BROWSER must be chromium, firefox or webkit (got ' + name + ')');
module.exports = { chromium: pw[name], engine: name };
