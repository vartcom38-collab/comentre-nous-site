(() => {
  if (!window.location.pathname.startsWith('/admin')) return;

  const OWNER = 'vartcom38-collab';
  const REPO = 'comentre-nous-site';
  const BRANCH = 'main';
  const PRODUCTS_PATH = 'content/products.json';

  const decodeBase64 = (value) => decodeURIComponent(escape(atob(value.replace(/\n/g, ''))));
  const encodeBase64 = (value) => btoa(unescape(encodeURIComponent(value)));

  async function github(path, token, init = {}) {
    const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/${path}`, {
      ...init,
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        Authorization: `Bearer ${token}`,
        ...(init.headers || {}),
      },
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`${response.status} ${response.statusText}${text ? ` — ${text}` : ''}`);
    }
    return response.json();
  }

  function getProductId(button) {
    const row = button.closest('.product-row');
    const editLink = row?.querySelector('a[href*="/admin/produit/?id="]');
    if (editLink) {
      const href = editLink.getAttribute('href') || '';
      return new URL(href, window.location.origin).searchParams.get('id');
    }
    return new URLSearchParams(window.location.search).get('id');
  }

  async function deleteProductById(productId, button) {
    const token = window.sessionStorage.getItem('comentre_admin_github_token') || '';
    if (!token) {
      alert('Reconnecte GitHub avant de supprimer cette fiche.');
      return;
    }
    if (!productId) {
      alert('Impossible d’identifier cette fiche produit. Recharge la page puis réessaie.');
      return;
    }
    if (!confirm('Supprimer définitivement cette fiche produit ?')) return;

    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = 'Suppression…';

    try {
      const current = await github(`contents/${PRODUCTS_PATH}?ref=${BRANCH}&t=${Date.now()}`, token);
      const products = JSON.parse(decodeBase64(current.content));
      const product = products.find((item) => item.id === productId);
      if (!product) {
        window.location.href = '/admin/?deleted=1';
        return;
      }
      const next = products.filter((item) => item.id !== productId);
      await github(`contents/${PRODUCTS_PATH}`, token, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Admin: delete product ${product.title || productId}`,
          content: encodeBase64(`${JSON.stringify(next, null, 2)}\n`),
          sha: current.sha,
          branch: BRANCH,
        }),
      });
      window.location.href = '/admin/?deleted=1';
    } catch (error) {
      alert(`La suppression n’a pas abouti : ${error.message}`);
      button.disabled = false;
      button.textContent = originalText || 'Supprimer';
    }
  }

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest('button.danger, button.delete');
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    deleteProductById(getProductId(button), button);
  }, true);
})();
