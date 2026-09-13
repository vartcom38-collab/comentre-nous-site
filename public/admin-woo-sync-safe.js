(() => {
  if (!location.pathname.startsWith('/admin/produit')) return;

  const OWNER = 'vartcom38-collab';
  const REPO = 'comentre-nous-site';
  const BRANCH = 'main';
  const TOKEN_KEY = 'comentre_admin_github_token';
  const PRODUCTS_PATH = 'content/products.json';
  const LINKS_PATH = 'content/woo-links.json';
  let running = false;

  const token = () => sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY) || '';
  const decode64 = (value) => decodeURIComponent(escape(atob(String(value || '').replace(/\n/g, ''))));
  const encode64 = (value) => btoa(unescape(encodeURIComponent(value)));
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function notice(text, mode = '') {
    let el = document.querySelector('[data-woo-safe-status]');
    if (!el) {
      el = document.createElement('div');
      el.setAttribute('data-woo-safe-status', '1');
      el.style.cssText = 'max-width:1500px;margin:0 auto 14px;padding:11px 14px;border-radius:14px;background:#eef9f7;font:800 11px Comfortaa,system-ui,sans-serif;color:#087f78';
      const anchor = document.querySelector('.completion');
      if (anchor && anchor.parentElement) anchor.parentElement.insertBefore(el, anchor.nextSibling);
    }
    if (!el) return;
    el.textContent = text;
    el.style.background = mode === 'error' ? '#fff0ef' : mode === 'working' ? '#fff3cf' : '#eef9f7';
    el.style.color = mode === 'error' ? '#b42318' : mode === 'working' ? '#946200' : '#087f78';
  }

  async function gh(path, init) {
    const t = token();
    if (!t) throw new Error('Reconnecte GitHub depuis le tableau de bord admin.');
    const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/${path}`, {
      ...(init || {}),
      cache: 'no-store',
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
    const file = await gh(`contents/${path}?ref=${BRANCH}&t=${Date.now()}`);
    return { data: JSON.parse(decode64(file.content)), sha: file.sha };
  }

  async function updateLinks(localId, wooId) {
    let lastError;
    for (let attempt = 0; attempt < 4; attempt += 1) {
      try {
        const current = await loadJson(LINKS_PATH);
        const next = { ...(current.data || {}), [localId]: Number(wooId) };
        await gh(`contents/${LINKS_PATH}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: 'Admin: link product to WooCommerce',
            content: encode64(`${JSON.stringify(next, null, 2)}\n`),
            sha: current.sha,
            branch: BRANCH,
          }),
        });
        return next;
      } catch (error) {
        lastError = error;
        if (!String(error.message || '').startsWith('409')) throw error;
        await sleep(450 + attempt * 300);
      }
    }
    throw lastError || new Error('Impossible d’enregistrer la liaison boutique.');
  }

  async function woo(action, payload) {
    const response = await fetch(`/woo-bridge.php?action=${encodeURIComponent(action)}`, {
      method: 'POST',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token()}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok) {
      const error = new Error(data.error || `Erreur boutique (${response.status})`);
      error.status = response.status;
      error.data = data;
      throw error;
    }
    return data;
  }

  function absolute(url) {
    if (!url) return '';
    return /^https?:\/\//i.test(url) ? url : `${location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
  }

  function productPayload(product) {
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
      image: absolute(product.image || ''),
    };
  }

  function waitForSaveCycle() {
    return new Promise((resolve, reject) => {
      const startedAt = Date.now();
      let sawSaving = false;
      const timer = window.setInterval(async () => {
        const status = (document.querySelector('.status')?.textContent || '').trim();
        if (/^Erreur\s*:/i.test(status)) {
          window.clearInterval(timer);
          reject(new Error(status));
          return;
        }
        if (/création de la fiche|enregistrement/i.test(status)) sawSaving = true;
        if (/fiche enregistrée|mis en ligne|retiré du site/i.test(status) && (sawSaving || Date.now() - startedAt > 700)) {
          window.clearInterval(timer);
          try {
            const id = new URLSearchParams(location.search).get('id') || '';
            if (!id) throw new Error('La fiche n’a pas encore d’identifiant après l’enregistrement.');
            const productsFile = await loadJson(PRODUCTS_PATH);
            const product = (productsFile.data || []).find((item) => item.id === id);
            if (!product) throw new Error('La fiche enregistrée n’a pas été retrouvée.');
            resolve(product);
          } catch (error) {
            reject(error);
          }
          return;
        }
        if (Date.now() - startedAt > 30000) {
          window.clearInterval(timer);
          reject(new Error('La synchronisation boutique a expiré. Réessaie simplement d’enregistrer.'));
        }
      }, 250);
    });
  }

  async function syncAfterSave() {
    if (running) return;
    running = true;
    try {
      const product = await waitForSaveCycle();
      if (product.purchaseChannel !== 'woo') return;
      if (!product.title || product.title === 'Nouveau produit') throw new Error('Donne un vrai nom au produit avant la synchronisation.');
      if (!product.price) throw new Error('Ajoute un prix avant la synchronisation.');

      notice('Synchronisation avec la boutique…', 'working');
      const linksFile = await loadJson(LINKS_PATH);
      const wooId = Number((linksFile.data || {})[product.id] || 0);

      if (wooId) {
        try {
          await woo('update-managed-product', { id: wooId, ...productPayload(product) });
          notice('Produit enregistré et synchronisé avec la boutique ✓');
        } catch (error) {
          if (error.status === 409) notice('Produit enregistré. Ancienne liaison protégée : aucun prix n’a été écrasé.', 'safe');
          else throw error;
        }
      } else {
        const result = await woo('create-product', productPayload(product));
        const createdId = Number(result.product && result.product.id);
        if (!createdId) throw new Error('La boutique n’a pas renvoyé d’identifiant produit.');
        await updateLinks(product.id, createdId);
        notice('Produit créé automatiquement dans la boutique ✓');
      }
    } catch (error) {
      notice(`Boutique : ${error.message || error}`, 'error');
    } finally {
      running = false;
    }
  }

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const button = target?.closest('button');
    if (!button || button.disabled) return;
    const text = (button.textContent || '').trim();
    if (!['Enregistrer', 'Enregistrer la fiche', 'Mettre en ligne', 'Retirer du site'].some((label) => text === label || text.startsWith(label))) return;
    const saleSelect = Array.from(document.querySelectorAll('.form-card label')).find((label) => /canal de vente|mode de vente/i.test((label.textContent || '').trim()))?.querySelector('select');
    if (!saleSelect || saleSelect.value !== 'woo') return;
    window.setTimeout(syncAfterSave, 20);
  }, true);
})();
