// Part of the OHS browser test suite. Run all with: node tests/run-all.js
const { chromium } = require('playwright'); const {route}=require('./lib');
const B = process.env.BASE_URL || 'http://localhost:8805';
const EPA='7249401053255', SERUM='7249401348167', USDA='7418569752647';
(async () => { const b=await chromium.launch(); let fails=0; const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c)fails++;};
 async function setup({ls=null, cookie=null, items=[], blockPopups=false}) {
   const ctx=await b.newContext({viewport:{width:1280,height:900}}); await route(ctx);
   await ctx.addInitScript(([ls,cookie,bp])=>{ try{ if(ls) localStorage.setItem('ohsUserState',ls); if(cookie) document.cookie='ohs_user_state='+cookie+';path=/'; }catch(e){} if(bp) window.open=()=>null; }, [ls,cookie,blockPopups]);
   const pg=await ctx.newPage(); const errs=[]; pg.on('pageerror',e=>errs.push(e.message));
   await pg.goto(B+'/cart.html',{waitUntil:'networkidle'}); await pg.waitForTimeout(800);
   await pg.evaluate(()=>{ localStorage.setItem('ohsCart','[]'); });
   await pg.reload({waitUntil:'networkidle'}); await pg.waitForTimeout(800);
   for (const [id,q] of items) await pg.evaluate(([id,q])=>window.addToCart(id,q,false),[id,q]);
   await pg.evaluate(()=>{ document.querySelectorAll('#stateModal,#globalStateModal,.state-modal').forEach(m=>m.classList.remove('show')); if (typeof updateCartDisplay==='function') updateCartDisplay(); });
   await pg.waitForTimeout(400);
   return [ctx,pg,errs];
 }
 async function clickCheckout(ctx,pg){ let popup=null; ctx.on('page',p=>{popup=p;}); const shopReq=[]; ctx.on('request',r=>{ if(r.url().includes('myshopify.com/cart/')) shopReq.push(r.url()); });
   await pg.click('#checkoutBtn'); await pg.waitForTimeout(2500); return {popup, shopReq}; }

 // 1. Utah, EPA + serum -> new tab to Shopify cart link, cart page stays
 { const [ctx,pg,errs]=await setup({ls:'UT', items:[[EPA,2],[SERUM,1]]});
   const {popup,shopReq}=await clickCheckout(ctx,pg);
   ok(!!popup && shopReq.some(u=>/\/cart\/\d+:2,\d+:1$/.test(u)), `Utah: checkout opens a NEW TAB to Shopify (${shopReq[0]||'none'})`);
   ok(pg.url().endsWith('/cart.html'), 'Utah: OHS cart page stays open in the original tab');
   ok((await pg.evaluate(()=>window.getCartItems().length))===2, 'Utah: cart still has its 2 items');
   ok(!errs.length, 'no JS errors '+errs.join('|')); await ctx.close(); }
 // 2. No state + EPA item -> blocked, tab closed, state picker shown
 { const [ctx,pg]=await setup({items:[[SERUM,1]]}); await pg.evaluate(id=>{ const c=JSON.parse(localStorage.getItem('ohsCart')); },EPA);
   // add EPA directly (addToCart allows when no state)
   await pg.evaluate(id=>window.addToCart(id,1,false),EPA); await pg.waitForTimeout(300);
   const {popup,shopReq}=await clickCheckout(ctx,pg);
   const modal=await pg.evaluate(()=>!!document.querySelector('#globalStateModal.show, #stateModal.show, .state-modal.show'));
   ok(!shopReq.length && (!popup || popup.isClosed()) && modal, `No state + Utah-only item: checkout blocked, extra tab closed, state picker shown (modal=${modal})`);
   await ctx.close(); }
 // 3. No state, serum only -> allowed
 { const [ctx,pg]=await setup({items:[[SERUM,3]]}); const {shopReq}=await clickCheckout(ctx,pg);
   ok(shopReq.some(u=>/:3$/.test(u)), 'No state + nationwide item only: checkout allowed'); await ctx.close(); }
 // 4. Colorado with EPA item -> EPA removed / blocked
 { const [ctx,pg]=await setup({items:[[EPA,1],[USDA,1]]}); await pg.evaluate(()=>localStorage.setItem('ohsUserState','CO'));
   const {shopReq,popup}=await clickCheckout(ctx,pg);
   const left=await pg.evaluate(()=>window.getCartItems().map(i=>i.productId));
   ok(!shopReq.length && !left.includes(EPA) && (!popup||popup.isClosed()), `Colorado: EPA item removed and checkout stopped for review (left: ${left})`); await ctx.close(); }
 // 5. stale cookie vs menu choice
 { const [ctx,pg]=await setup({ls:'CO', cookie:'UT'}); const st=await pg.evaluate(()=>window.getUserState()); const ck=await pg.evaluate(()=>document.cookie);
   ok(st==='CO' && ck.includes('ohs_user_state=CO'), `Old cookie UT + menu choice CO -> cart uses CO and fixes the cookie (${st}; ${ck})`); await ctx.close(); }
 // 6. badges + EPA warning
 { const [ctx,pg]=await setup({ls:'UT', items:[[EPA,1],[SERUM,1],[USDA,1]]});
   const badges=await pg.$$eval('.cart-item .badge',x=>x.map(e=>e.textContent.trim()));
   ok(badges.includes('EPA Registered') && badges.includes('Skin Care') && badges.includes('USDA Organic') && !badges.includes('EPA + USDA'), 'cart badges: '+JSON.stringify(badges));
   await ctx.close(); }
 { const [ctx,pg]=await setup({ls:'UT', items:[[EPA,1]]}); await pg.evaluate(()=>{ localStorage.setItem('ohsUserState','NV'); updateCartDisplay(); }); await pg.waitForTimeout(300);
   ok(await pg.isVisible('#epaWarning'), 'Utah-only warning now appears when state is not Utah and cart has an EPA item'); await ctx.close(); }
 // 7. notifications are plain text
 { const [ctx,pg]=await setup({}); await pg.evaluate(()=>window.showNotification('<i class="x"></i> Hello <img src=x onerror="window.__x=1">there','info')); await pg.waitForTimeout(300);
   const r=await pg.evaluate(()=>({img:!!document.querySelector('#notificationContainer img'), x:window.__x||0, t:document.querySelector('#notificationContainer').textContent.trim()}));
   ok(!r.img && !r.x && /Hello\s*there/.test(r.t), 'notification shows text only, no injected HTML ('+r.t+')'); await ctx.close(); }
 // 8. pop-ups blocked -> falls back to same tab
 { const [ctx,pg]=await setup({ls:'UT', items:[[SERUM,1]], blockPopups:true}); const {shopReq}=await clickCheckout(ctx,pg);
   ok(shopReq.length>0, 'pop-ups blocked: falls back to opening checkout in the same tab'); await ctx.close(); }
 console.log(fails?fails+' FAILED':'ALL PASSED'); process.exitCode = fails ? 1 : 0; await b.close(); })();
