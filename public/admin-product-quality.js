(() => {
  if (!location.pathname.startsWith('/admin/')) return;

  const PRODUCT_PATH = '/admin/produit';
  let dirty = false;
  let saving = false;
  let lastStatus = '';
  let statusObserver = null;
  let observedStatus = null;

  const isProductEditor = () => location.pathname.startsWith(PRODUCT_PATH);

  function ensureStyles() {
    if (document.getElementById('admin-quality-style')) return;
    const style = document.createElement('style');
    style.id = 'admin-quality-style';
    style.textContent = `
      .admin-unsaved-status{display:none!important}
      .admin-unsaved-status-v2{position:fixed;left:18px;bottom:62px;z-index:100003;display:flex;align-items:center;gap:8px;border-radius:999px;padding:9px 13px;background:#fff7df;color:#6f5200;border:1px solid #f2d68b;box-shadow:0 12px 30px rgba(23,27,42,.12);font:800 10px Comfortaa,system-ui,sans-serif;opacity:0;transform:translateY(8px);pointer-events:none;transition:.2s}
      .admin-unsaved-status-v2.visible{opacity:1;transform:translateY(0)}
      .admin-unsaved-status-v2.saving{background:#eef4ff;color:#31527c;border-color:#ccdafa}
      .admin-unsaved-status-v2 span{width:8px;height:8px;border-radius:50%;background:#f1a52b}
      .admin-unsaved-status-v2.saving span{background:#4f76b8;animation:adminQualityPulse 1s infinite}
      @keyframes adminQualityPulse{50%{opacity:.35}}
      .woo-preview-button{display:block;width:100%;text-align:center;border:0;border-radius:999px;background:#171b2a;color:#fff;padding:11px;font-weight:900;font-family:Comfortaa,system-ui,sans-serif}
      .payment-preview .woo-preview-button{width:auto;padding:10px 14px}
      @media(max-width:650px){.admin-unsaved-status-v2{left:10px;bottom:104px}}
    `;
    document.head.appendChild(style);
  }

  function getBadge() {
    let badge = document.querySelector('.admin-unsaved-status-v2');
    if (!badge) {
      badge = document.createElement('div');
      badge.className = 'admin-unsaved-status-v2';
      badge.innerHTML = '<span></span><b>Modifications non enregistrées</b>';
      document.body.appendChild(badge);
    }
    return badge;
  }

  function renderDirty() {
    const badge = getBadge();
    badge.classList.toggle('visible', dirty || saving);
    badge.classList.toggle('saving', saving);
    const text = badge.querySelector('b');
    if (text) text.textContent = saving ? 'Enregistrement en cours…' : 'Modifications non enregistrées';
  }

  function markDirty() {
    dirty = true;
    saving = false;
    renderDirty();
  }

  function markSaving() {
    if (!dirty) return;
    saving = true;
    renderDirty();
  }

  function markSaved() {
    dirty = false;
    saving = false;
    renderDirty();
    document.dispatchEvent(new CustomEvent('admin:saved'));
  }

  function rearmLegacyDirtyGuard() {
    let dummy = document.querySelector('[data-unsaved-rearm]');
    if (!dummy) {
      dummy = document.createElement('input');
      dummy.type = 'text';
      dummy.setAttribute('data-unsaved-rearm', '1');
      dummy.setAttribute('aria-hidden', 'true');
      dummy.style.cssText = 'position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;left:-9999px';
      document.body.appendChild(dummy);
    }
    dummy.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function statusChanged() {
    const node = document.querySelector('.status');
    const text = (node?.textContent || '').trim();
    if (!text || text === lastStatus) return;
    lastStatus = text;
    if (/^Erreur\s*:/i.test(text) || /impossible|échoué|echec|échec/i.test(text)) {
      if (dirty || saving) {
        dirty = true;
        saving = false;
        renderDirty();
        window.setTimeout(rearmLegacyDirtyGuard, 20);
      }
      return;
    }
    if (/fiche enregistrée|mis en ligne|retiré du site|enregistré|enregistrée/i.test(text)) markSaved();
  }

  function bindStatusObserver() {
    const node = document.querySelector('.status');
    if (!node || node === observedStatus) return;
    if (statusObserver) statusObserver.disconnect();
    observedStatus = node;
    statusObserver = new MutationObserver(statusChanged);
    statusObserver.observe(node, { childList: true, subtree: true, characterData: true });
    statusChanged();
  }

  function findSaleSelect() {
    const labels = Array.from(document.querySelectorAll('.form-card label'));
    const label = labels.find((node) => /canal de vente|mode de vente/i.test((node.textContent || '').trim()));
    return label?.querySelector('select') || null;
  }

  function rememberSaleMode() {
    if (!isProductEditor()) return '';
    const select = findSaleSelect();
    const shell = document.querySelector('.product-editor-shell');
    if (select && shell) shell.setAttribute('data-admin-sale-mode', select.value || 'none');
    return select?.value || shell?.getAttribute('data-admin-sale-mode') || '';
  }

  function correctCompletionForWoo() {
    if (!isProductEditor()) return;
    const mode = rememberSaleMode();
    if (mode !== 'woo') return;
    const wrap = document.querySelector('.completion');
    const strong = wrap?.querySelector('b');
    const bar = wrap?.querySelector(':scope > span');
    if (!wrap || !strong || !bar) return;
    const shown = Number((strong.textContent || '').replace(/[^0-9]/g, ''));
    if (!Number.isFinite(shown)) return;
    if (!wrap.hasAttribute('data-react-base-score') || shown !== Number(wrap.getAttribute('data-quality-score') || -1)) {
      wrap.setAttribute('data-react-base-score', String(shown));
    }
    const base = Number(wrap.getAttribute('data-react-base-score') || shown);
    const complete = Math.round((base / 100) * 12);
    const corrected = Math.min(100, Math.round(((complete + 1) / 12) * 100));
    strong.textContent = `${corrected}%`;
    bar.style.width = `${corrected}%`;
    wrap.setAttribute('data-quality-score', String(corrected));
    const small = wrap.querySelector('small');
    if (small) small.textContent = corrected < 60 ? 'Fiche à compléter' : corrected < 90 ? 'Presque prête' : 'Prête à publier';
  }

  function updateWooPreview() {
    if (!isProductEditor()) return;
    const mode = rememberSaleMode();
    const previewButtons = document.querySelector('.preview-buttons');
    if (!previewButtons) return;

    if (mode === 'woo') {
      const existing = previewButtons.querySelector('[data-quality-woo-preview]');
      if (!existing) {
        if (!previewButtons.dataset.qualityOriginal) previewButtons.dataset.qualityOriginal = previewButtons.innerHTML;
        previewButtons.innerHTML = '<button type="button" class="woo-preview-button" data-quality-woo-preview>Ajouter au panier →</button>';
      }
    } else {
      const ours = previewButtons.querySelector('[data-quality-woo-preview]');
      if (ours) {
        previewButtons.innerHTML = previewButtons.dataset.qualityOriginal || '<button disabled>Bientôt disponible</button>';
        delete previewButtons.dataset.qualityOriginal;
      }
    }

    const paymentPreview = document.querySelector('.payment-preview');
    if (mode === 'woo' && !paymentPreview) {
      const form = document.querySelector('.form-card');
      const bottom = form?.querySelector('.bottom-actions');
      if (form && bottom) {
        const box = document.createElement('div');
        box.className = 'payment-preview';
        box.setAttribute('data-quality-payment-preview', '1');
        box.innerHTML = '<span>Bouton client</span><button type="button" class="woo-preview-button">Ajouter au panier →</button>';
        form.insertBefore(box, bottom);
      }
    }
    if (mode !== 'woo') document.querySelector('[data-quality-payment-preview]')?.remove();
  }

  function polishProductEditor() {
    if (!isProductEditor()) return;
    correctCompletionForWoo();
    updateWooPreview();
  }

  function schedulePolish() {
    window.setTimeout(polishProductEditor, 0);
    window.setTimeout(polishProductEditor, 120);
  }

  document.addEventListener('input', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) return;
    if (target.hasAttribute('data-unsaved-rearm')) return;
    if (target.closest('.connect') || target.closest('[data-unsaved-ignore]')) return;
    markDirty();
    schedulePolish();
  }, true);

  document.addEventListener('change', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) return;
    if (target.hasAttribute('data-unsaved-rearm')) return;
    if (target.closest('.connect') || target.closest('[data-unsaved-ignore]')) return;
    markDirty();
    schedulePolish();
  }, true);

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const button = target?.closest('button');
    if (button) {
      const text = (button.textContent || '').trim();
      if (text === 'Enregistrer' || text === 'Enregistrer la fiche' || text === 'Enregistrer les modifications' || text === 'Enregistrer le podcast' || text === 'Enregistrer l’accueil' || text === 'Mettre en ligne' || text === 'Retirer du site') markSaving();
    }
    schedulePolish();
  }, true);

  window.addEventListener('beforeunload', (event) => {
    if (!dirty && !saving) return;
    event.preventDefault();
    event.returnValue = '';
  });

  document.addEventListener('DOMContentLoaded', () => {
    ensureStyles();
    renderDirty();
    bindStatusObserver();
    schedulePolish();
    window.setInterval(bindStatusObserver, 500);
  });

  ensureStyles();
  window.setTimeout(() => {
    bindStatusObserver();
    schedulePolish();
  }, 350);
})();
