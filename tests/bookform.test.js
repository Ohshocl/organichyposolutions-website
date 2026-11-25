// Part of the OHS browser test suite. Run all with: node tests/run-all.js
// Booking form validation tests (audit R16). Usage: node bookform.js <port>
const { chromium } = require('./engine'); const {route}=require('./lib');
const B = process.env.BASE_URL || 'http://localhost:8805';
(async () => {
  const b = await chromium.launch(); let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
  async function open() {
    const c = await b.newContext({ viewport: { width: 1280, height: 900 } }); await route(c);
    await c.addInitScript(() => localStorage.setItem('analytics_consent', 'denied'));
    const posts = []; c.on('request', r => { if (r.url().includes('web3forms.com')) posts.push(r.postData() || ''); });
    const p = await c.newPage(); const errs = [], dialogs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => { dialogs.push(d.message()); d.dismiss(); });
    await p.goto(B + '/book-service.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
    await p.evaluate(() => document.querySelectorAll('#intentModal,.state-modal').forEach(m => m.remove()));
    return [c, p, posts, errs, dialogs];
  }
  const submit = p => p.evaluate(() => { const f = document.getElementById('serviceBookingForm'); f.requestSubmit ? f.requestSubmit() : f.submit(); });
  // 1. empty form
  { const [c, p, posts, errs, dialogs] = await open();
    await submit(p); await p.waitForTimeout(500);
    const r = await p.evaluate(() => ({ sum: (document.getElementById('formErrors') || {}).textContent || '', visible: !!document.getElementById('formErrors') && !document.getElementById('formErrors').classList.contains('d-none'), invalid: [...document.querySelectorAll('[aria-invalid="true"]')].map(e => e.id), card: (document.getElementById('serviceTypeError') || {}).textContent || '', focus: document.activeElement && document.activeElement.id }));
    ok(posts.length === 0, 'empty form: nothing sent to Web3Forms');
    ok(dialogs.length === 0, `empty form: no pop-up alert${dialogs.length ? ' (got: ' + dialogs[0] + ')' : ''}`);
    ok(r.visible && /service type/.test(r.sum) && r.invalid.join(',') === 'firstName,lastName,email,address' && /service type/i.test(r.card), `empty form: summary + inline errors (${r.invalid.join(',')}), service-type message`);
    ok(r.focus === 'card-residential', `focus moves to the first problem (${r.focus})`);
    ok(!errs.length, 'no JS errors ' + errs.join('|'));
    await c.close(); }
  // 2. bad values
  { const [c, p, posts] = await open();
    await p.click('#card-residential');
    await p.fill('#firstName', 'Jane'); await p.fill('#lastName', 'Smith'); await p.fill('#email', 'jane@nowhere'); await p.fill('#phone', '12345'); await p.fill('#address', '123 Main St, Provo UT');
    await p.evaluate(() => { document.getElementById('preferredDate').value = '2020-01-01'; });
    await submit(p); await p.waitForTimeout(400);
    const r = await p.evaluate(() => ['email', 'phone', 'preferredDate'].map(id => { const e = document.getElementById(id); const fb = document.getElementById(e.getAttribute('aria-describedby') || 'none'); return [id, e.getAttribute('aria-invalid'), fb && fb.textContent]; }));
    ok(posts.length === 0 && r.every(x => x[1] === 'true' && x[2]), `bad email, short phone, past date each flagged and linked: ${JSON.stringify(r.map(x => [x[0], x[2]]))}`);
    // fixing a field clears its error
    await p.fill('#email', 'jane@example.com');
    const cleared = await p.evaluate(() => document.getElementById('email').getAttribute('aria-invalid') === null && !document.getElementById('email').classList.contains('is-invalid'));
    ok(cleared, 'typing a fix clears that field\'s error');
    await c.close(); }
  // 3. valid form is sent
  { const [c, p, posts] = await open();
    await p.click('#card-commercial');
    await p.fill('#firstName', 'Jane'); await p.fill('#lastName', 'Smith'); await p.fill('#email', 'jane@example.com'); await p.fill('#phone', '(801) 555-0100'); await p.fill('#address', '123 Main St, Provo UT 84601');
    const t = new Date(); t.setDate(t.getDate() + 7); const iso = t.toISOString().slice(0, 10);
    await p.evaluate(d => { document.getElementById('preferredDate').value = d; }, iso);
    await submit(p); await p.waitForTimeout(1500);
    const body = posts[0] || '';
    ok(posts.length === 1 && /first_name/.test(body) && /jane%40example\.com|jane@example\.com/.test(body) && !/botcheck=on/.test(body), `valid form is sent to Web3Forms once (fields present, spam trap unticked) [${posts.length} request]`);
    await c.close(); }
  // 4. keyboard selects a service card
  { const [c, p] = await open();
    await p.focus('#card-commercial'); await p.keyboard.press('Enter'); await p.waitForTimeout(200);
    const r = await p.evaluate(() => ({ v: document.getElementById('hiddenServiceType').value, pressed: document.getElementById('card-commercial').getAttribute('aria-pressed'), tab: document.getElementById('card-commercial').tabIndex }));
    ok(r.v === 'commercial' && r.pressed === 'true' && r.tab === 0, `keyboard: Enter on the Commercial card selects it (${JSON.stringify(r)})`);
    await c.close(); }
  // 5. phone rules (review follow-up)
  { const [c, p] = await open();
    const res = {};
    for (const v of ['abc-defg-hijk', '801555O100', '28015550100', '12345', '(801) 555-0100', '1-801-555-0100', '801.555.0100']) {
      await p.fill('#phone', v); await submit(p); await p.waitForTimeout(150);
      res[v] = await p.evaluate(() => document.getElementById('phone').getAttribute('aria-invalid') === 'true');
    }
    const wantBad = ['abc-defg-hijk', '801555O100', '28015550100', '12345'], wantGood = ['(801) 555-0100', '1-801-555-0100', '801.555.0100'];
    ok(wantBad.every(v => res[v]) && wantGood.every(v => !res[v]), `phone: letters and bad lengths rejected, 10 digits or 1+10 accepted ${JSON.stringify(res)}`);
    await c.close(); }
  // 6. summary updates as fields are fixed, without resubmitting (review follow-up)
  { const [c, p] = await open();
    await submit(p); await p.waitForTimeout(300);
    const count = () => p.evaluate(() => { const s = document.getElementById('formErrors'); return s.classList.contains('d-none') ? 0 : s.querySelectorAll('li').length; });
    const n0 = await count();
    await p.fill('#firstName', 'Jane'); await p.waitForTimeout(100);
    const n1 = await count();
    await p.click('#card-residential'); await p.waitForTimeout(100);
    const n2 = await count();
    const cardMsgGone = await p.evaluate(() => !document.getElementById('serviceTypeError'));
    await p.fill('#lastName', 'Smith'); await p.fill('#email', 'jane@example.com'); await p.fill('#address', '123 Main St, Provo UT'); await p.waitForTimeout(100);
    const n3 = await count();
    ok(n0 === 5 && n1 === 4 && n2 === 3 && cardMsgGone && n3 === 0, `summary updates live: 5 -> 4 (name) -> 3 (service card, its message gone: ${cardMsgGone}) -> ${n3} (all fixed, summary hidden)`);
    await c.close(); }
  // 7. service-type error is tied to the cards; existing descriptions are kept (review follow-up)
  { const [c, p] = await open();
    await p.evaluate(() => document.getElementById('email').setAttribute('aria-describedby', 'emailHelp'));
    await p.fill('#email', 'bad'); await submit(p); await p.waitForTimeout(300);
    const r1 = await p.evaluate(() => ({ card: document.getElementById('card-residential').getAttribute('aria-describedby'), email: document.getElementById('email').getAttribute('aria-describedby') }));
    await p.fill('#email', 'jane@example.com'); await p.click('#card-commercial'); await p.waitForTimeout(150);
    const r2 = await p.evaluate(() => ({ card: document.getElementById('card-residential').getAttribute('aria-describedby'), email: document.getElementById('email').getAttribute('aria-describedby') }));
    ok(/serviceTypeError/.test(r1.card || '') && !r2.card, `service cards point to the service-type error while it shows (${r1.card}), and not after (${r2.card})`);
    ok(r1.email === 'emailHelp email-error' && r2.email === 'emailHelp', `existing description kept: "${r1.email}" -> "${r2.email}"`);
    await c.close(); }
  console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exitCode = fails ? 1 : 0; await b.close();
})();
