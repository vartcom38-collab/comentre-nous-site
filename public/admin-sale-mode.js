(() => {
  if (!location.pathname.startsWith('/admin/produit')) return;

  function saleLabel() {
    return Array.from(document.querySelectorAll('.form-card label')).find((node) => /canal de vente|mode de vente/i.test((node.textContent || '').trim())) || null;
  }

  function ensureWooOption() {
    const label = saleLabel();
    const select = label?.querySelector('select');
    if (!label || !select) return null;

    if (!Array.from(select.options).some((option) => option.value === 'woo')) {
      const option = document.createElement('option');
      option.value = 'woo';
      option.textContent = 'WooCommerce — vente sur le site';
      select.insertBefore(option, select.options[1] || null);
    }

    const textNode = Array.from(label.childNodes).find((node) => node.nodeType === Node.TEXT_NODE);
    if (textNode) textNode.textContent = 'Mode de vente';
    return select;
  }

  function updateUi() {
    const select = ensureWooOption();
    if (!select) return;

    const card = select.closest('.form-card');
    if (!card) return;
    const mode = select.value || 'none';

    const help = card.querySelector('.payment-help');
    if (help) {
      help.innerHTML = '<b>Choisis simplement où le produit est vendu.</b> WooCommerce = vente directement sur ton site avec panier, paiement, commandes et livraison. Amazon = le bouton envoie directement vers ton lien Amazon.';
    }

    let note = card.querySelector('[data-sale-mode-note]');
    if (!note) {
      note = document.createElement('div');
      note.setAttribute('data-sale-mode-note', '1');
      note.style.cssText = 'margin:-4px 0 16px;padding:12px 14px;border-radius:14px;background:#eef9f7;font:800 11px/1.5 Comfortaa,system-ui,sans-serif;color:#087f78';
      help?.insertAdjacentElement('afterend', note);
    }

    if (mode === 'woo') {
      note.textContent = 'Vente sur le site activée : en enregistrant la fiche, le produit boutique est créé automatiquement puis synchronisé à chaque modification.';
    } else if (mode === 'amazon') {
      note.textContent = 'Vente Amazon activée : aucun produit boutique n’est créé. Le client sera envoyé vers ton lien Amazon.';
    } else if (mode === 'none') {
      note.textContent = 'Aucun mode de vente choisi pour le moment.';
    } else {
      note.textContent = 'Ancien mode de vente conservé pour cette fiche.';
    }
  }

  document.addEventListener('DOMContentLoaded', updateUi);
  document.addEventListener('click', () => window.setTimeout(updateUi, 0), true);
  document.addEventListener('change', (event) => {
    const target = event.target;
    if (target instanceof HTMLSelectElement && target.closest('label') === saleLabel()) {
      window.setTimeout(updateUi, 0);
    }
  }, true);
  window.setTimeout(updateUi, 250);
})();
