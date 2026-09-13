(() => {
  if (!location.pathname.startsWith('/admin/produit')) return;

  const textOf = (el) => (el && el.textContent || '').replace(/\s+/g, ' ').trim();

  function enhanceSaleSection() {
    const heading = [...document.querySelectorAll('.form-card h2')].find((node) => /Vente, stock & paiement/i.test(textOf(node)));
    if (!heading) return;
    const card = heading.closest('.form-card');
    if (!card) return;

    const help = card.querySelector('.payment-help');
    if (help) help.innerHTML = '<b>Tu gères tout ici.</b> Choisis <b>WooCommerce</b> pour vendre directement sur le site avec le paiement, les commandes et la livraison déjà configurés. Choisis <b>Amazon</b> quand le produit doit être acheté directement sur Amazon.';

    const labels = [...card.querySelectorAll('label')];
    const channelLabel = labels.find((label) => /Canal de vente|Mode de vente/i.test(textOf(label)));
    const channel = channelLabel?.querySelector('select');
    if (channel) {
      if (!Array.from(channel.options).some((option) => option.value === 'woo')) {
        const option = document.createElement('option');
        option.value = 'woo';
        option.textContent = 'WooCommerce — vente sur le site';
        channel.insertBefore(option, channel.options[1] || null);
      }
      const textNode = [...channelLabel.childNodes].find((node) => node.nodeType === Node.TEXT_NODE);
      if (textNode) textNode.textContent = 'Mode de vente';
    }

    labels.forEach((label) => {
      const text = textOf(label);
      if (/^(Lien Stripe Payment Link|Lien d’achat externe)/i.test(text)) label.style.display = 'none';
      if (/^Texte du bouton/i.test(text)) label.style.display = channel?.value === 'amazon' ? '' : 'none';
      if (/^Note interne sur le paiement \/ l’envoi/i.test(text)) label.style.display = '';
    });

    const preview = card.querySelector('.payment-preview');
    if (preview) preview.style.display = channel?.value === 'amazon' ? '' : 'none';

    let note = card.querySelector('[data-sale-mode-note]');
    if (!note) {
      note = document.createElement('div');
      note.setAttribute('data-sale-mode-note', '1');
      note.className = 'woo-payment-note-admin';
      const actions = card.querySelector('.bottom-actions');
      card.insertBefore(note, actions || null);
    }
    const mode = channel?.value || 'none';
    note.innerHTML = mode === 'woo'
      ? '<strong>WooCommerce actif</strong><span>À l’enregistrement, le produit WooCommerce est créé automatiquement s’il n’existe pas encore. Prix, stock, SKU et type de produit viennent de cette fiche. WooCommerce garde ta configuration de paiement, commandes, taxes, livraison et e-mails.</span>'
      : mode === 'amazon'
        ? '<strong>Vente Amazon</strong><span>Aucun produit WooCommerce ne sera créé pour cette fiche. Le bouton client utilisera simplement le lien Amazon renseigné ci-dessus.</span>'
        : '<strong>Choisis le mode de vente</strong><span>WooCommerce pour vendre sur le site, Amazon pour envoyer directement la cliente vers Amazon.</span>';
  }

  const style = document.createElement('style');
  style.textContent = '.woo-payment-note-admin{display:grid;gap:5px;margin:12px 0 18px;padding:14px 16px;border-radius:16px;background:#eaf8f5;border:1px solid #ccece5}.woo-payment-note-admin strong{font-size:12px;color:#087f78}.woo-payment-note-admin span{font-size:11px;line-height:1.55;color:#596272}';
  document.head.appendChild(style);

  const observer = new MutationObserver(enhanceSaleSection);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', enhanceSaleSection);
  document.addEventListener('change', (event) => {
    if (event.target instanceof HTMLSelectElement) setTimeout(enhanceSaleSection, 0);
  });
  setTimeout(enhanceSaleSection, 400);
})();
