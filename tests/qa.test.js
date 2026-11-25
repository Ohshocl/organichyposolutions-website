// Part of the OHS browser test suite. Run all with: node tests/run-all.js
const B = process.env.BASE_URL || 'http://localhost:8805';
const { chromium } = require('./engine'); const {route}=require('./lib'); 
const EPA='7249401053255', SERUM='7249401348167', USDA='7418569752647';
(async () => { const b=await chromium.launch(); let fails=0; const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c)fails++;};
 const mk=async(state)=>{ const c=await b.newContext({viewport:{width:1280,height:900}}); await route(c); await c.addInitScript(([st])=>{ if(!sessionStorage.getItem('s')){ localStorage.setItem('analytics_consent','denied'); if(st) localStorage.setItem('ohsUserState',st); localStorage.setItem('ohsCart','[]'); sessionStorage.setItem('s','1'); } },[state]); const p=await c.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.goto(`${B}/index.html`,{waitUntil:'networkidle'}); await p.waitForTimeout(800); await p.evaluate(()=>document.querySelectorAll('#intentModal,.state-modal').forEach(m=>m.remove())); return [c,p,errs]; };
 const ls=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('ohsCart')||'[]').map(i=>i.name.split(' ').slice(0,3).join(' ')+' x'+i.quantity));
 // A: quick-add item survives a later cart.js save
 { const [c,p,errs]=await mk('UT'); const qa=await p.evaluate(()=>[...document.querySelectorAll('[id^="qa-btn-"]')].map(b=>b.id.replace('qa-btn-','')));
   const first=qa[0];
   await p.evaluate(id=>window.ohsQuickAdd(id), first); await p.waitForTimeout(300);
   await p.evaluate(id=>window.addToCart(id,1,false), USDA); await p.waitForTimeout(300);
   const cart=await ls(p);
   ok(cart.length===2, `quick-added item is still in the cart after another add (${JSON.stringify(cart)})`);
   ok(!errs.length,'no JS errors '+errs.join('|')); await c.close(); }
 // B: Utah-only respected by quick add
 { const [c,p]=await mk('CO'); const qa=await p.evaluate(()=>[...document.querySelectorAll('[id^="qa-btn-"]')].map(b=>b.id.replace('qa-btn-','')));
   if (qa.includes(EPA)) { await p.evaluate(id=>window.ohsQuickAdd(id), EPA); await p.waitForTimeout(300); const cart=await ls(p); ok(cart.length===0, `Colorado: quick add refuses Utah-only EPA product (${JSON.stringify(cart)})`); }
   else { await p.evaluate(id=>window.ohsQuickAdd(id), EPA); await p.waitForTimeout(300); const cart=await ls(p); ok(cart.length===0, `Colorado: EPA not in quick-add list; forced call adds nothing (${JSON.stringify(cart)})`); }
   await c.close(); }
 // C: wholesale repricing when quantities merge
 { const [c,p]=await mk('UT'); const th=await p.evaluate(id=>window.findProduct(id).wholesaleThreshold, SERUM);
   await p.evaluate(([id,th])=>{ window.ohsQuickAdd && (window.heroQuantities||{}); for(let i=0;i<th;i++) window.ohsQuickAdd(id); },[SERUM,th]); await p.waitForTimeout(300);
   const it=await p.evaluate(()=>JSON.parse(localStorage.getItem('ohsCart'))); 
   ok(it.length===1 && it[0].quantity===th && it[0].tier==='wholesale', `${th} quick adds of serum -> one line at wholesale price (got ${JSON.stringify(it.map(i=>[i.quantity,i.tier,i.price]))})`); await c.close(); }
 // D: clear cart from preview really clears
 { const [c,p]=await mk('UT'); await p.evaluate(id=>window.addToCart(id,2,false), USDA); p.on('dialog',d=>d.accept()); await p.evaluate(()=>window.clearCartLocal()); await p.waitForTimeout(200);
   await p.evaluate(id=>window.addToCart(id,1,false), SERUM); await p.waitForTimeout(200); const cart=await ls(p);
   ok(cart.length===1 && cart[0].startsWith('OHS Pure Skin'), `"Clear" then add: only the new item (${JSON.stringify(cart)})`); await c.close(); }
 console.log(fails?fails+' FAILED':'ALL PASSED'); process.exitCode = fails ? 1 : 0; await b.close(); })();
