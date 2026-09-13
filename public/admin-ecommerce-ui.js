(() => {
  if (!location.pathname.startsWith('/admin/produit')) return;

  function textOf(el) {
    return (el && el.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function enhanceSaleSection() {
    const headings = [...document.querySelectorAll('.form-card h2')];
    const heading = headings.find((node) => /Vente, stock & paiement/i.test(textOf(node)));
    if (!heading) return;

    const card = heading.closest('.form-card');
    if (!card) return;

    const help = card.querySelector('.payment-help');
    if (help && help.dataset.wooCopy !== '1') {
      help.dataset.wooCopy = '1';
      help.innerHTML = '<b>Tu gères tout ici.</b> Renseigne le prix, le stock, le SKU et le type de produit dans cette fiche. À l’enregistrement, ces informations sont envoyées automatiquement au produit WooCommerce créé ou relié. Les moyens de paiement, commandes, taxes, livraison et e-mails restent gérés par WooCommerce avec ta configuration existante.';
    }

    const labels = [...card.querySelectorAll('label')];
    labels.forEach((label) => {
      const text = textOf(label);
      if (/^(Canal de vente|Texte du bouton|Lien Amazon|Lien Stripe Payment Link|Lien d’achat externe|Note interne sur le paiement \/ l’envoi)/i.test(text)) {
        label.style.display = 'none';
        label.setAttribute('data-legacy-payment-field', 'hidden');
      }
    });

    const preview = card.querySelector('.payment-preview');
    if (preview) preview.style.display = 'none';

    if (!card.querySelector('[data-woo-payment-note]')) {
      const note = document.createElement('div');
      note.setAttribute('data-woo-payment-note', '1');
      note.className = 'woo-payment-note-admin';
      note.innerHTML = '<strong>Paiement WooCommerce actif</strong><span>Aucun lien Stripe, Amazon ou autre n’est à saisir ici. Pour un nouveau produit, la fiche WooCommerce est créée automatiquement au premier enregistrement.</span>';
      const actions = card.querySelector('.bottom-actions');
      card.insertBefore(note, actions || null);
    }
  }

  const style = document.createElement('style');
  style.textContent = '.woo-payment-note-admin{display:grid;gap:5px;margin:12px 0 18px;padding:14px 16px;border-radius:16px;background:#eaf8f5;border:1px solid #ccece5}.woo-payment-note-admin strong{font-size:12px;color:#087f78}.woo-payment-note-admin span{font-size:11px;line-height:1.55;color:#596272}';
  document.head.appendChild(style);

  const observer = new MutationObserver(enhanceSaleSection);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', enhanceSaleSection);
  setTimeout(enhanceSaleSection, 400);
})();
