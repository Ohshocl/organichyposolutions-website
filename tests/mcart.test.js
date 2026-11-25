// Part of the OHS browser test suite. Run all with: node tests/run-all.js
const { chromium } = require('playwright'); const {route}=require('./lib'); const OUT=(process.env.TEST_OUT||require('os').tmpdir());
(async () => { const b=await chromium.launch(); let fails=0; const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c)fails++;};
 for (const w of [320,360,375,414,768,1024,1199,1280]) {
  const c=await b.newContext({viewport:{width:w,height:800}}); await route(c);
  await c.addInitScript(()=>{ if(!sessionStorage.getItem('seeded')){ localStorage.setItem('ohsUserState','UT'); localStorage.setItem('ohsCart', JSON.stringify([{productId:'7249401348167',variantId:'41829069750343',name:'OHS Pure Skin Serum 100ml',price:34.99,quantity:3,tier:'retail',type:'non-registered',isSubscription:false}])); sessionStorage.setItem('seeded','1'); } });
  const p=await c.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto((process.env.BASE_URL||'http://localhost:8805')+'/mold-remediation.html',{waitUntil:'networkidle'}); await p.waitForTimeout(800);
  await p.evaluate(()=>document.querySelectorAll('#intentModal,.state-modal').forEach(m=>m.remove()));
  await p.mouse.wheel(0,2500); await p.waitForTimeout(500);
  const r=await p.evaluate(()=>{ const a=document.querySelector('.nav-mobile-actions a[href="/cart.html"]'); if(!a) return null; const bx=a.getBoundingClientRect(); const cs=getComputedStyle(a); const badge=a.querySelector('.cart-badge');
     return {vis: cs.display!=='none' && a.offsetParent!==null && bx.width>0, inView: bx.top>=0 && bx.bottom<=innerHeight && bx.right<=innerWidth, badge: badge && getComputedStyle(badge).display!=='none' ? badge.textContent : '(hidden)', over: document.documentElement.scrollWidth-document.documentElement.clientWidth, scrollY: Math.round(scrollY)}; });
  if (w<1200) {
    ok(r && r.vis && r.inView && r.badge==='3' && r.over<=0 && r.scrollY>500, `${w}px: cart button visible after scrolling ${r&&r.scrollY}px, count ${r&&r.badge}, no sideways scroll`);
    if ([320,375].includes(w)) { await p.screenshot({path:`${OUT}/mcart_${w}.png`, clip:{x:0,y:0,width:w,height:190}}); }
    if (w===375) { await Promise.all([p.waitForNavigation(), p.click('.nav-mobile-actions a[href="/cart.html"]')]); ok(p.url().endsWith('/cart.html'),'tapping it opens the cart page'); }
  } else ok(r && !r.vis, `${w}px: desktop keeps its existing menu (mobile button hidden)`);
  ok(!errs.length, `${w}px no JS errors`); await c.close(); }
 // Regression: a phone whose system font is wider than ours must not get sideways
 // scrolling from the brand name (Firefox/WebKit showed 26px at 320px). Simulate it
 // with a wide font on the brand.
 for (const w of [320,360,375,414]) {
  const c=await b.newContext({viewport:{width:w,height:800}}); await route(c);
  await c.addInitScript(()=>{ localStorage.setItem('ohsUserState','UT'); localStorage.setItem('ohsUserIntent','shop'); localStorage.setItem('analytics_consent','denied'); });
  const p=await c.newPage(); await p.goto((process.env.BASE_URL||'http://localhost:8805')+'/index.html',{waitUntil:'networkidle'}); await p.waitForTimeout(400);
  await p.addStyleTag({content:'.navbar-brand{font-family:"DejaVu Sans Mono","Courier New",monospace !important; letter-spacing:0.04em !important;}'}); await p.waitForTimeout(150);
  const over=await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  ok(over<=0, `${w}px with a wide phone font: brand name doesn't cause sideways scroll (overflow ${over}px)`); await c.close(); }
 console.log(fails?fails+' FAILED':'ALL PASSED'); process.exitCode = fails ? 1 : 0; await b.close(); })();
