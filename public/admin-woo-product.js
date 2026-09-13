(() => {
  if (!location.pathname.startsWith('/admin/produit')) return;

  const OWNER = 'vartcom38-collab';
  const REPO = 'comentre-nous-site';
  const BRANCH = 'main';
  const TOKEN_KEY = 'comentre_admin_github_token';
  const PRODUCTS_PATH = 'content/products.json';
  const LINKS_PATH = 'content/woo-links.json';
  const startedAsNew = new URLSearchParams(location.search).has('new');
  let wooProducts = [];
  let links = {};
  let panel;
  let messageEl;
  let selectEl;
  let busy = false;
  let lastSavedMarker = '';

  const token = () => sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY) || '';
  const productId = () => new URLSearchParams(location.search).get('id') || '';
  const decode64 = (value) => decodeURIComponent(escape(atob(String(value || '').replace(/\n/g, ''))));
  const encode64 = (value) => btoa(unescape(encodeURIComponent(value)));

  async function gh(path, init) {
    const t = token();
    if (!t) throw new Error('Reconnecte GitHub depuis le tableau de bord admin.');
    const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/${path}`, {
      ...(init || {}),
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        Authorization: `Bearer ${t}`,
        ...((init && init.headers) || {}),
      },
    });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return response.json();
  }

  async function loadJson(path) {
    const file = await gh(`contents/${path}?ref=${BRANCH}`);
    return { data: JSON.parse(decode64(file.content)), sha: file.sha };
  }

  async function updateLinks(mutator) {
    let lastError;
    for (let attempt = 0; attempt < 4; attempt += 1) {
      try {
        const current = await loadJson(LINKS_PATH);
        const next = mutator(current.data || {});
        await gh(`contents/${LINKS_PATH}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: 'Admin: update WooCommerce product link',
            content: encode64(`${JSON.stringify(next, null, 2)}\n`),
            sha: current.sha,
            branch: BRANCH,
          }),
        });
        links = next;
        return next;
      } catch (error) {
        lastError = error;
        if (!String(error.message || '').startsWith('409')) throw error;
        await new Promise((resolve) => setTimeout(resolve, 450 + attempt * 350));
      }
    }
    throw lastError || new Error('Impossible d’enregistrer la liaison.');
  }

  async function woo(action, payload) {
    const response = await fetch(`/woo-bridge.php?action=${encodeURIComponent(action)}`, {
      method: payload ? 'POST' : 'GET',
      cache: 'no-store',
      headers: payload ? {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token()}`,
      } : undefined,
      body: payload ? JSON.stringify(payload) : undefined,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok) {
      const error = new Error(data.error || `WooCommerce : erreur ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }
    return data;
  }

  function toAbsolute(url) {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    return `${location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
  }

  function payloadFromProduct(product) {
    return {
      local_id: product.id,
      name: product.title,
      slug: product.slug,
      short_description: product.shortDescription || product.tagline || '',
      description: product.longDescription || '',
      sku: product.sku || '',
      featured: Boolean(product.featured),
      status: product.published ? 'publish' : 'draft',
      regular_price: product.price || '',
      stock_status: product.stockStatus === 'out' ? 'outofstock' : product.stockStatus === 'preorder' ? 'onbackorder' : 'instock',
      stock_quantity: Number.isFinite(Number(product.stockQuantity)) ? Number(product.stockQuantity) : 0,
      delivery_type: product.deliveryType || 'physical',
      image: toAbsolute(product.image || ''),
    };
  }

  async function latestProduct() {
    const id = productId();
    if (!id) throw new Error('Enregistre d’abord la fiche produit.');
    const current = await loadJson(PRODUCTS_PATH);
    const product = (current.data || []).find((item) => item.id === id);
    if (!product) throw new Error('La fiche produit n’est pas encore disponible dans GitHub.');
    return product;
  }

  function linkedWoo() {
    const id = productId();
    const wooId = id ? Number(links[id]) : 0;
    return wooProducts.find((product) => Number(product.id) === wooId) || null;
  }

  function setMessage(text, mode = '') {
    if (!messageEl) return;
    messageEl.textContent = text;
    messageEl.dataset.mode = mode;
  }

  function renderState() {
    if (!panel) return;
    const id = productId();
    const linkedId = id ? Number(links[id] || 0) : 0;
    const linked = linkedWoo();
    const state = panel.querySelector('[data-woo-state]');
    const actions = panel.querySelector('[data-woo-actions]');
    if (!state || !actions) return;

    if (!id) {
      state.innerHTML = '<b>WooCommerce : en attente</b><span>Enregistre d’abord cette nouvelle fiche. WooCommerce sera créé automatiquement juste après.</span>';
      actions.innerHTML = '';
      return;
    }

    if (linkedId) {
      const managed = linked && linked.managed && linked.managed_local_id === id;
      state.innerHTML = `<b>WooCommerce : relié${managed ? ' et géré ici' : ''}</b><span>${linked ? `${linked.name} · Woo #${linked.id} · ${linked.price || '—'} €` : `Woo #${linkedId}`}${managed ? ' · les prochaines modifications commerciales partiront automatiquement vers WooCommerce.' : ' · liaison protégée : aucun prix n’est écrasé automatiquement.'}</span>`;
      actions.innerHTML = `<button type="button" data-woo-sync>${managed ? 'Synchroniser maintenant' : 'Tester la liaison'}</button><button type="button" class="light" data-woo-unlink>Délier</button>`;
      actions.querySelector('[data-woo-sync]')?.addEventListener('click', () => syncCurrent(false));
      actions.querySelector('[data-woo-unlink]')?.addEventListener('click', unlinkCurrent);
    } else {
      state.innerHTML = '<b>WooCommerce : non relié</b><span>Tu peux créer automatiquement un nouveau produit Woo ou relier une fiche Woo existante sans rien modifier.</span>';
      actions.innerHTML = '<button type="button" data-woo-create>Créer dans WooCommerce</button><button type="button" class="light" data-woo-link>Relier le produit choisi</button>';
      actions.querySelector('[data-woo-create]')?.addEventListener('click', () => createCurrent(false));
      actions.querySelector('[data-woo-link]')?.addEventListener('click', linkSelected);
    }
  }

  async function refreshData() {
    try {
      const [linkFile, wooData] = await Promise.all([loadJson(LINKS_PATH), woo('products')]);
      links = linkFile.data || {};
      wooProducts = wooData.products || [];
      if (selectEl) {
        const selected = selectEl.value;
        selectEl.innerHTML = '<option value="">Choisir un produit WooCommerce…</option>' + wooProducts.map((p) => `<option value="${p.id}">${String(p.name).replace(/</g, '&lt;')} · ${p.price || '—'} € · #${p.id}</option>`).join('');
        if (selected) selectEl.value = selected;
      }
      renderState();
    } catch (error) {
      setMessage(`WooCommerce : ${error.message}`, 'error');
    }
  }

  async function createCurrent(auto) {
    if (busy) return;
    busy = true;
    setMessage(auto ? 'Création automatique du produit WooCommerce…' : 'Création du produit WooCommerce…', 'working');
    try {
      const product = await latestProduct();
      if (!product.title || product.title === 'Nouveau produit') throw new Error('Donne d’abord un vrai nom au produit.');
      const data = await woo('create-product', payloadFromProduct(product));
      const wooId = Number(data.product && data.product.id);
      if (!wooId) throw new Error('WooCommerce n’a pas renvoyé d’identifiant produit.');
      await updateLinks((current) => ({ ...current, [product.id]: wooId }));
      setMessage(`WooCommerce créé et relié ✓ Produit #${wooId}`, 'success');
      await refreshData();
    } catch (error) {
      setMessage(`WooCommerce : ${error.message}`, 'error');
    } finally {
      busy = false;
    }
  }

  async function syncCurrent(auto) {
    if (busy) return;
    const id = productId();
    const wooId = Number(links[id] || 0);
    if (!id || !wooId) return;
    busy = true;
    setMessage(auto ? 'Synchronisation WooCommerce…' : 'Synchronisation en cours…', 'working');
    try {
      const product = await latestProduct();
      await woo('update-managed-product', { id: wooId, ...payloadFromProduct(product) });
      setMessage('WooCommerce synchronisé ✓', 'success');
      await refreshData();
    } catch (error) {
      if (error.status === 409) setMessage('Liaison protégée ✓ Ce produit existait déjà dans WooCommerce : son prix n’a pas été modifié.', 'safe');
      else setMessage(`WooCommerce : ${error.message}`, 'error');
    } finally {
      busy = false;
    }
  }

  async function linkSelected() {
    const id = productId();
    const wooId = Number(selectEl && selectEl.value);
    if (!id || !wooId) return setMessage('Choisis d’abord un produit WooCommerce.', 'error');
    if (!confirm('Relier ces deux fiches ? Cette action ne modifie ni le prix ni le stock WooCommerce.')) return;
    try {
      await updateLinks((current) => ({ ...current, [id]: wooId }));
      setMessage('Liaison enregistrée ✓ Aucun prix n’a été modifié.', 'success');
      renderState();
    } catch (error) {
      setMessage(`Erreur liaison : ${error.message}`, 'error');
    }
  }

  async function unlinkCurrent() {
    const id = productId();
    if (!id || !links[id]) return;
    if (!confirm('Délier cette fiche de WooCommerce ? Le produit WooCommerce ne sera pas supprimé.')) return;
    try {
      await updateLinks((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      });
      setMessage('Liaison supprimée ✓ Le produit WooCommerce est intact.', 'success');
      renderState();
    } catch (error) {
      setMessage(`Erreur : ${error.message}`, 'error');
    }
  }

  function ensurePanel() {
    if (document.querySelector('.admin-woo-product-panel')) return;
    const shell = document.querySelector('.product-editor-shell');
    const anchor = document.querySelector('.completion') || document.querySelector('.status');
    if (!shell || !anchor || !anchor.parentElement) return;

    panel = document.createElement('section');
    panel.className = 'admin-woo-product-panel';
    panel.innerHTML = `
      <div class="admin-woo-head"><div><small>BOUTIQUE & PAIEMENT</small><h2>WooCommerce</h2></div><span>Connecté au moteur e-commerce</span></div>
      <div class="admin-woo-state" data-woo-state><b>Connexion…</b><span>Chargement de la liaison produit.</span></div>
      <div class="admin-woo-link-select"><select data-woo-select><option value="">Choisir un produit WooCommerce…</option></select></div>
      <div class="admin-woo-actions" data-woo-actions></div>
      <p class="admin-woo-message" data-woo-message></p>
    `;
    anchor.parentElement.insertBefore(panel, anchor.nextSibling);
    messageEl = panel.querySelector('[data-woo-message]');
    selectEl = panel.querySelector('[data-woo-select]');
    refreshData();
  }

  function handleSavedStatus() {
    const status = document.querySelector('.status');
    const text = (status && status.textContent || '').trim();
    if (!text || text === lastSavedMarker || !/fiche enregistrée|mis en ligne|retiré du site/i.test(text)) return;
    lastSavedMarker = text;
    setTimeout(async () => {
      await refreshData();
      const id = productId();
      if (!id) return;
      if (links[id]) await syncCurrent(true);
      else if (startedAsNew) await createCurrent(true);
    }, 900);
  }

  const style = document.createElement('style');
  style.textContent = `
    .admin-woo-product-panel{max-width:1500px;margin:0 auto 16px;background:#fff;border:1px solid #dceee9;border-radius:20px;padding:16px 18px;box-shadow:0 10px 28px rgba(48,30,18,.05);font-family:Comfortaa,system-ui,sans-serif}
    .admin-woo-head{display:flex;justify-content:space-between;gap:14px;align-items:center}.admin-woo-head small{font-size:9px;letter-spacing:.12em;color:#0b8f84;font-weight:900}.admin-woo-head h2{margin:2px 0 0;font:700 28px/1 'Patrick Hand',cursive}.admin-woo-head>span{font-size:10px;font-weight:900;background:#e9faf6;color:#087f78;padding:7px 10px;border-radius:999px}
    .admin-woo-state{display:grid;gap:4px;margin-top:12px;padding:12px 14px;border-radius:14px;background:#f8fbfa}.admin-woo-state b{font-size:12px}.admin-woo-state span{font-size:10px;color:#697181;line-height:1.5}
    .admin-woo-link-select{margin-top:10px}.admin-woo-link-select select{width:100%;border:1px solid #e4ddd7;border-radius:12px;background:#fffdf9;padding:10px 12px;font:700 11px Comfortaa,system-ui,sans-serif}
    .admin-woo-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}.admin-woo-actions button{border:0;border-radius:999px;background:#0fa399;color:white;padding:9px 12px;font:900 10px Comfortaa,system-ui,sans-serif;cursor:pointer}.admin-woo-actions button.light{background:#f1ece7;color:#171b2a}
    .admin-woo-message{min-height:0;margin:8px 0 0;font-size:10px;font-weight:800;color:#677080}.admin-woo-message[data-mode="error"]{color:#b42318}.admin-woo-message[data-mode="success"],.admin-woo-message[data-mode="safe"]{color:#087f78}.admin-woo-message[data-mode="working"]{color:#946200}
    @media(max-width:650px){.admin-woo-head{align-items:flex-start;flex-direction:column}.admin-woo-product-panel{padding:14px}}
  `;
  document.head.appendChild(style);

  const observer = new MutationObserver(() => {
    ensurePanel();
    handleSavedStatus();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  document.addEventListener('DOMContentLoaded', ensurePanel);
  setTimeout(ensurePanel, 500);
})();
