// Part of the OHS browser test suite. Run all with: node tests/run-all.js
const { chromium } = require('./engine'); const {route}=require('./lib'); const fs=require('fs'); const OUT=(process.env.TEST_OUT||require('os').tmpdir()), ROOT=(process.env.SITE_ROOT||'.');
const B = process.env.BASE_URL || 'http://localhost:8805';
(async () => { const b=await chromium.launch(); let fails=0; const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c)fails++;};
 const mk=async(w=1280,h=900)=>{ const ctx=await b.newContext({viewport:{width:w,height:h}}); await route(ctx); const g=[]; ctx.on('request',r=>{ if(/googletagmanager\.com|google-analytics\.com/.test(r.url())) g.push(r.url()); }); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); return [ctx,p,g,errs]; };
 const banner=p=>p.evaluate(()=>!!document.getElementById('cookieBanner'));
 const closeModals=p=>p.evaluate(()=>document.querySelectorAll('#intentModal,.state-modal').forEach(m=>{m.classList.remove('show'); m.style.display='none';}));
 // 1. first visit, every page with analytics: banner shows, nothing sent to Google
 const pages=fs.readdirSync(ROOT).filter(f=>f.endsWith('.html')&&!f.startsWith('google'));
 { const [ctx,p,g,errs]=await mk(); const noBanner=[];
   for (const f of pages) { await p.goto(`${B}/${f}`,{waitUntil:'networkidle'}).catch(()=>{}); await p.waitForTimeout(250); const has=await p.evaluate(()=>!!window.OHSConsent); if (has && !(await banner(p))) noBanner.push(f); }
   ok(g.length===0, `first visit across ${pages.length} pages: zero requests to Google (${g.length})`);
   ok(!noBanner.length, 'banner shows on every page that has analytics '+noBanner.join(' '));
   ok(!errs.length, 'no JS errors on any page '+errs.slice(0,3).join(' | ')); await ctx.close(); }
 // 2. Accept
 { const [ctx,p,g]=await mk(); await p.goto(B+'/products.html',{waitUntil:'networkidle'}); await p.waitForTimeout(500); await closeModals(p);
   await p.screenshot({path:OUT+'/cookie_desktop.png'});
   await p.click('#cookieBanner .btn-success'); await p.waitForTimeout(800);
   ok(!(await banner(p)) && g.some(u=>u.includes('gtag/js?id=G-HEKE217WEY')), 'Accept: banner closes and Google Analytics loads');
   const dl=await p.evaluate(()=>window.dataLayer.map(a=>Array.from(a||[]).slice(0,2).join(':')).filter(x=>/^(config|event:page_view|consent)/.test(x)));
   ok(dl.filter(x=>x.startsWith('config')).length===1 && !dl.some(x=>x==='event:page_view'), 'products page: one GA config, no extra manual page_view ('+dl.join(', ')+')');
   g.length=0; await p.reload({waitUntil:'networkidle'}); await p.waitForTimeout(500);
   ok(!(await banner(p)) && g.some(u=>u.includes('gtag/js')), 'after Accept, next page: no banner, GA loads right away');
   await ctx.close(); }
 // 3. Decline
 { const [ctx,p,g]=await mk(); await p.goto(B+'/index.html',{waitUntil:'networkidle'}); await p.waitForTimeout(500); await closeModals(p);
   await p.click('#cookieBanner .btn-outline-secondary'); await p.waitForTimeout(500);
   for (const f of ['about.html','contact.html','cart.html']) { await p.goto(`${B}/${f}`,{waitUntil:'networkidle'}); await p.waitForTimeout(300); }
   ok(g.length===0 && !(await banner(p)), 'Decline: banner gone and zero requests to Google on later pages');
   // footer Cookie settings reopens it; then accept works
   await p.evaluate(()=>{ const a=[...document.querySelectorAll('footer a')].find(x=>x.textContent.includes('Cookie settings')); a.click(); }); await p.waitForTimeout(300); await closeModals(p);
   ok(await banner(p), 'footer "Cookie settings" reopens the banner');
   await p.click('#cookieBanner .btn-success'); await p.waitForTimeout(800);
   ok(g.some(u=>u.includes('gtag/js')), 'changing mind to Accept loads GA');
   await ctx.close(); }
 // 4. old opt-out value respected
 { const [ctx,p,g]=await mk(); await ctx.addInitScript(()=>localStorage.setItem('analytics_consent','false')); await p.goto(B+'/index.html',{waitUntil:'networkidle'}); await p.waitForTimeout(400);
   ok(g.length===0 && !(await banner(p)), 'visitors who opted out before stay opted out, no banner'); await ctx.close(); }
 // 5. phone: banner fits, doesn't cover menu cart button
 { const [ctx,p]=await mk(375,812); await p.goto(B+'/index.html',{waitUntil:'networkidle'}); await p.waitForTimeout(600); await closeModals(p);
   const r=await p.evaluate(()=>{const bnr=document.getElementById('cookieBanner').getBoundingClientRect(); return {w:Math.round(bnr.width), h:Math.round(bnr.height), bottom:Math.round(innerHeight-bnr.bottom), over:document.documentElement.scrollWidth-document.documentElement.clientWidth};});
   ok(r.w<=375 && r.over<=0 && r.h<160, `phone: banner ${r.w}x${r.h}px at the bottom, no sideways scroll`);
   await p.screenshot({path:OUT+'/cookie_phone.png'}); await ctx.close(); }
 console.log(fails?fails+' FAILED':'ALL PASSED'); process.exitCode = fails ? 1 : 0; await b.close(); })();
