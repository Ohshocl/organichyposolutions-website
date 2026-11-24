// Part of the OHS browser test suite. Run all with: node tests/run-all.js
// Shared test helper: serve CDN assets locally, block other external hosts.
const path=require('path'), fs=require('fs');
const NM=path.join(__dirname,'node_modules');
module.exports.route = async (ctx) => {
  await ctx.route(/^https?:\/\/(?!localhost)/, async (r) => {
    const u=r.request().url(); let f=null, ct='text/plain';
    if (u.includes('bootstrap.min.css')) {f=NM+'/bootstrap/dist/css/bootstrap.min.css';ct='text/css';}
    else if (u.includes('bootstrap.bundle.min.js')) {f=NM+'/bootstrap/dist/js/bootstrap.bundle.min.js';ct='application/javascript';}
    else if (u.includes('font-awesome') && u.endsWith('all.min.css')) {f=NM+'/@fortawesome/fontawesome-free/css/all.min.css';ct='text/css';}
    else if (u.includes('/webfonts/')) {f=NM+'/@fortawesome/fontawesome-free/webfonts/'+u.split('/webfonts/')[1].split('?')[0];ct='font/woff2';}
    if (f && fs.existsSync(f)) return r.fulfill({path:f, contentType:ct});
    return r.abort();
  });
};
