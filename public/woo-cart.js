(() => {
  if (location.pathname.startsWith('/admin')) return;

  // Panier WooCommerce de la même origine. La session se poursuit vers /commerce/commander/.
  // Tant que WooPayments est en mode test, seul l'ebook #14 peut être ajouté via notre interface.
  // Ne pas afficher d'autres boutons d'achat avant l'ouverture commerciale.
  const TEST_PRODUCT_ID = 14;
  const STORE_API = '/commerce/wp-json/wc/store/v1/cart';
  let cart = null;
  let drawer = null;
  let backdrop = null;
  let busy = false;
  let storeNonce = '';
  // Réparer un verrouillage de défilement laissé par une ancienne version.
  function restorePageScroll() {
    if (document.documentElement.style.overflow === 'hidden') {
      document.documentElement.style.removeProperty('overflow');
    }
  }
  restorePageScroll();
  window.addEventListener('pageshow', restorePageScroll);


  async function api(action, payload) {
    const route = action === 'cart' ? '' :
      action === 'cart-add' ? '/add-item' :
      action === 'cart-update' ? '/update-item' :
      action === 'cart-remove' ? '/remove-item' : null;
    if (route === null) throw new Error('Action non autorisée.');
    if (action === 'cart-add' && Number(payload?.id) !== TEST_PRODUCT_ID) {
      throw new Error('Seul le produit test est autorisé.');
    }
    const request = async () => {
      const isPost = action !== 'cart';
      const response = await fetch(STORE_API + route, {
        method: isPost ? 'POST' : 'GET',
        credentials: 'same-origin',
        cache: 'no-store',
        headers: {
          'Accept': 'application/json',
          ...(isPost ? {'Content-Type': 'application/json', 'Nonce': storeNonce} : {}),
        },
        body: isPost ? JSON.stringify(payload) : undefined,
      });
      const nextNonce = response.headers.get('Nonce');
      if (nextNonce) storeNonce = nextNonce;
      const data = await response.json().catch(() => ({}));
      return {response, data};
    };
    if (action !== 'cart' && !storeNonce) await api('cart');
    let result = await request();
    // Re-synchroniser le nonce expiré une seule fois, sans retenter le paiement.
    if (result.response.status === 403 && action !== 'cart') {
      await api('cart');
      result = await request();
    }
    if (!result.response.ok || !result.data || !Array.isArray(result.data.items)) {
      throw new Error(result.data?.message || 'Le panier WooCommerce est momentanément indisponible.');
    }
    cart = result.data;
    render();
    return {ok:true,cart};
  }

  function money(raw, prices) {
    const minor = Number(prices?.currency_minor_unit ?? 2);
    const amount = Number(raw || 0) / Math.pow(10, minor);
    try {
      return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: prices?.currency_code || 'EUR' }).format(amount);
    } catch (_) {
      return `${amount.toFixed(2)} €`;
    }
  }

  function quantity() {
    return (cart?.items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  }

  function ensureUi() {
    if (drawer) return;
    backdrop = document.createElement('button');
    backdrop.type = 'button';
    backdrop.className = 'woo-cart-backdrop';
    backdrop.setAttribute('aria-label', 'Fermer le panier');
    backdrop.addEventListener('click', close);

    drawer = document.createElement('aside');
    drawer.className = 'woo-cart-drawer';
    drawer.setAttribute('aria-label', 'Panier');
    drawer.innerHTML = `
      <div class="woo-cart-head"><div><small>COM’ ENTRE NOUS · PAIEMENT TEST</small><h2>Mon panier</h2></div><button type="button" data-cart-close aria-label="Fermer">×</button></div>
      <div class="woo-cart-message" data-cart-message></div>
      <div class="woo-cart-items" data-cart-items></div>
      <div class="woo-cart-summary" data-cart-summary></div>
      <div class="woo-cart-foot"><a class="woo-cart-checkout" href="/commerce/commander/">Passer la commande test →</a><button type="button" class="woo-cart-continue" data-cart-close>Continuer mes achats</button><p>Commande de démonstration · WooPayments en mode test.</p></div>
    `;
    drawer.querySelectorAll('[data-cart-close]').forEach((button) => button.addEventListener('click', close));
    document.body.append(backdrop, drawer);

    const style = document.createElement('style');
    style.textContent = `
      .site-header-actions{display:flex;align-items:center;gap:8px}.cart-pill{border:0;cursor:pointer;font:inherit}.cart-pill [data-woo-cart-count]{display:inline-grid;place-items:center;min-width:20px;height:20px;margin-left:5px;padding:0 5px;border-radius:999px;background:#171b2a;color:#fff;font-size:10px}.woo-cart-backdrop{position:fixed;inset:0;z-index:199990;border:0;background:rgba(23,27,42,.35);opacity:0;pointer-events:none;transition:.2s}.woo-cart-drawer{position:fixed;top:0;right:0;bottom:0;z-index:200000;width:min(430px,100vw);background:#fff8f1;box-shadow:-22px 0 60px rgba(23,27,42,.16);transform:translateX(105%);transition:.25s ease;display:flex;flex-direction:column;font-family:Comfortaa,system-ui,sans-serif;color:#171b2a}.woo-cart-drawer.open{transform:translateX(0)}.woo-cart-backdrop.open{opacity:1;pointer-events:auto}.woo-cart-head{display:flex;justify-content:space-between;align-items:flex-start;padding:24px 22px 16px;border-bottom:1px solid #eadfd6}.woo-cart-head small{font-size:9px;letter-spacing:.14em;color:#ff5d62;font-weight:900}.woo-cart-head h2{margin:3px 0 0;font:700 38px/1 'Patrick Hand',cursive}.woo-cart-head button{border:0;background:#171b2a;color:#fff;border-radius:999px;width:36px;height:36px;font-size:22px;cursor:pointer}.woo-cart-message{padding:0 22px;color:#8f2018;font-size:11px;font-weight:800}.woo-cart-items{padding:14px 18px;display:grid;gap:10px;overflow:auto;flex:1}.woo-cart-empty{padding:42px 18px;text-align:center;color:#747987;font-size:13px}.woo-cart-item{display:grid;grid-template-columns:72px 1fr auto;gap:11px;align-items:center;background:#fff;border-radius:18px;padding:10px;box-shadow:0 9px 25px rgba(48,30,18,.05)}.woo-cart-item img{width:72px;height:72px;object-fit:cover;border-radius:13px;background:#f1ece7}.woo-cart-item h3{margin:0 0 5px;font-size:12px}.woo-cart-item strong{font-size:12px}.woo-cart-qty{display:flex;gap:4px;align-items:center;margin-top:7px}.woo-cart-qty button,.woo-cart-remove{border:0;border-radius:999px;background:#f1ece7;cursor:pointer}.woo-cart-qty button{width:25px;height:25px}.woo-cart-qty span{min-width:22px;text-align:center;font-size:11px;font-weight:900}.woo-cart-remove{align-self:start;width:28px;height:28px;color:#8f2018}.woo-cart-summary{padding:16px 22px;border-top:1px solid #eadfd6;background:#fff}.woo-cart-summary>div{display:flex;justify-content:space-between;gap:12px}.woo-cart-summary small{font-size:11px;color:#727887}.woo-cart-summary strong{font-size:19px}.woo-cart-foot{padding:14px 22px 22px;background:#fff}.woo-cart-checkout[hidden]{display:none!important}.woo-cart-checkout{display:block;text-align:center;margin-bottom:9px;border-radius:999px;background:#171b2a;color:#fff!important;text-decoration:none;padding:13px 16px;font-weight:900;font-size:12px}.woo-cart-continue{width:100%;border:1px solid #eadfd6;border-radius:999px;background:#fff;color:#171b2a;padding:13px 16px;font-weight:900;cursor:pointer}.woo-cart-foot p{margin:9px 0 0;text-align:center;font-size:9px;color:#7d828f}.woo-add-toast{position:fixed;right:18px;bottom:18px;z-index:210000;background:#171b2a;color:#fff;border-radius:999px;padding:11px 15px;font:800 11px Comfortaa,system-ui,sans-serif;box-shadow:0 12px 32px rgba(23,27,42,.22)}@media(max-width:720px){.site-header-actions{gap:4px}.cart-pill{padding-inline:10px!important}.cart-pill{font-size:0!important}.cart-pill:before{content:'Panier';font-size:10px}.woo-cart-drawer{width:100vw}}
    `;
    document.head.appendChild(style);
  }

  function render() {
    ensureUi();
    document.querySelectorAll('[data-woo-cart-count]').forEach((node) => { node.textContent = String(quantity()); });
    const itemsEl = drawer.querySelector('[data-cart-items]');
    const summaryEl = drawer.querySelector('[data-cart-summary]');
    const messageEl = drawer.querySelector('[data-cart-message]');
    if (messageEl) messageEl.textContent = '';
    const items = cart?.items || [];
    const checkout = drawer.querySelector('.woo-cart-checkout');
    if (checkout) checkout.hidden = !items.length;
    if (!items.length) {
      itemsEl.innerHTML = '<div class="woo-cart-empty">Ton panier est vide pour le moment.</div>';
      summaryEl.innerHTML = '';
      return;
    }
    itemsEl.innerHTML = items.map((item) => {
      const image = item.images?.[0]?.thumbnail || item.images?.[0]?.src || '';
      const price = money(item.prices?.price, item.prices);
      return `<article class="woo-cart-item" data-cart-key="${item.key}">${image ? `<img src="${image}" alt="">` : '<div></div>'}<div><h3>${String(item.name || '').replace(/</g,'&lt;')}</h3><strong>${price}</strong><div class="woo-cart-qty"><button type="button" data-cart-minus>−</button><span>${item.quantity}</span><button type="button" data-cart-plus>+</button></div></div><button type="button" class="woo-cart-remove" data-cart-remove aria-label="Supprimer">×</button></article>`;
    }).join('');
    itemsEl.querySelectorAll('[data-cart-key]').forEach((row) => {
      const key = row.getAttribute('data-cart-key');
      const current = items.find((item) => item.key === key);
      row.querySelector('[data-cart-minus]')?.addEventListener('click', () => updateItem(key, Math.max(1, Number(current?.quantity || 1) - 1)));
      row.querySelector('[data-cart-plus]')?.addEventListener('click', () => updateItem(key, Number(current?.quantity || 1) + 1));
      row.querySelector('[data-cart-remove]')?.addEventListener('click', () => removeItem(key));
    });
    const totals = cart?.totals || {};
    summaryEl.innerHTML = `<div><small>Total du panier</small><strong>${money(totals.total_price, totals)}</strong></div>`;
  }

  async function load() {
    try { await api('cart'); }
    catch (error) { showError(error instanceof Error ? error.message : 'Impossible de charger le panier.'); }
  }

  async function add(productId, button) {
    if (busy) return;
    if (Number(productId) !== TEST_PRODUCT_ID) { showError('Seul notre ebook de démonstration peut être ajouté pendant les tests.'); return; }
    busy = true;
    const previous = button?.textContent;
    if (button) { button.disabled = true; button.textContent = 'Ajout au panier…'; }
    try {
      await api('cart-add', { id: Number(productId), quantity: 1 });
      open();
      if (button) button.textContent = 'Ajouté ✓';
      setTimeout(() => { if (button) { button.disabled = false; button.textContent = previous; } }, 1100);
    } catch (error) {
      if (button) { button.disabled = false; button.textContent = previous; }
      showError(error.message);
    } finally { busy = false; }
  }

  async function updateItem(key, qty) {
    if (busy) return;
    busy = true;
    try { await api('cart-update', { key, quantity: qty }); }
    catch (error) { showError(error.message); }
    finally { busy = false; }
  }

  async function removeItem(key) {
    if (busy) return;
    busy = true;
    try { await api('cart-remove', { key }); }
    catch (error) { showError(error.message); }
    finally { busy = false; }
  }

  function showError(text) {
    ensureUi();
    const message = drawer.querySelector('[data-cart-message]');
    if (message) message.textContent = text || 'Le panier est momentanément indisponible.';
    open();
  }

  function open() {
    ensureUi();
    restorePageScroll();
    drawer.classList.add('open');
    backdrop.classList.add('open');
    // Ne jamais verrouiller le défilement du document : cela fait
    // disparaître la barre de défilement du navigateur et peut la laisser
    // bloquée lors des transitions entre les pages Next.js.
  }

  function close() {
    if (!drawer) return;
    restorePageScroll();
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
  }

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    const addButton = target.closest('[data-woo-add]');
    if (addButton) {
      event.preventDefault();
      add(addButton.getAttribute('data-woo-add'), addButton);
      return;
    }
    if (target.closest('[data-woo-cart-toggle]')) {
      event.preventDefault();
      open();
    }
  });

  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });
  ensureUi();
  load();
})();
