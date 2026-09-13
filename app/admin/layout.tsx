import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Administration — Com' entre nous",
  robots: { index: false, follow: false, nocache: true },
};

const persistentTokenScript = `
(() => {
  const key = 'comentre_admin_github_token';
  const syncToken = () => {
    try {
      const persistent = window.localStorage.getItem(key) || '';
      const session = window.sessionStorage.getItem(key) || '';
      if (persistent && !session) {
        window.sessionStorage.setItem(key, persistent);
      } else if (session && session !== persistent) {
        window.localStorage.setItem(key, session);
      }
    } catch (_) {}
  };
  syncToken();
  window.setInterval(syncToken, 1000);
  window.addEventListener('pagehide', syncToken);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') syncToken();
  });
})();
`;

const adminEnhancementsScript = `
(() => {
  let lastDeployVersion = '';
  let deployWatchTimer = null;
  const mutationLabels = ['Enregistrer', 'Enregistrer la fiche', 'Mettre en ligne', 'Retirer du site', 'Supprimer la fiche', 'Enregistrer les modifications', 'Enregistrer le podcast'];

  const getDeployBadge = () => {
    let badge = document.querySelector('.admin-deploy-status');
    if (!badge) {
      badge = document.createElement('div');
      badge.className = 'admin-deploy-status';
      badge.innerHTML = '<span class="admin-deploy-dot"></span><b>Vérification…</b>';
      document.body.appendChild(badge);
    }
    return badge;
  };

  const setDeployStatus = (label, mode = 'ready') => {
    const badge = getDeployBadge();
    badge.classList.remove('ready','working','error');
    badge.classList.add(mode);
    const text = badge.querySelector('b');
    if (text) text.textContent = label;
  };

  const fetchDeployVersion = async () => {
    try {
      const response = await fetch('/deploy-version.txt?ts=' + Date.now(), { cache: 'no-store' });
      if (!response.ok) throw new Error('deploy marker');
      const text = (await response.text()).trim();
      return text.split(/\\s+/)[0] || '';
    } catch (_) {
      return '';
    }
  };

  const initDeployStatus = async () => {
    lastDeployVersion = await fetchDeployVersion();
    setDeployStatus(lastDeployVersion ? 'Site à jour' : 'Statut indisponible', lastDeployVersion ? 'ready' : 'error');
  };

  const watchDeployment = async () => {
    const before = lastDeployVersion || await fetchDeployVersion();
    setDeployStatus('Mise en ligne en cours…', 'working');
    if (deployWatchTimer) window.clearInterval(deployWatchTimer);
    let attempts = 0;
    deployWatchTimer = window.setInterval(async () => {
      attempts += 1;
      const current = await fetchDeployVersion();
      if (current && current !== before) {
        lastDeployVersion = current;
        window.clearInterval(deployWatchTimer);
        deployWatchTimer = null;
        setDeployStatus('Site à jour ✓', 'ready');
      } else if (attempts >= 40) {
        window.clearInterval(deployWatchTimer);
        deployWatchTimer = null;
        setDeployStatus('Toujours en déploiement…', 'working');
      }
    }, 6000);
  };

  const findField = (labelStart) => {
    const labels = Array.from(document.querySelectorAll('.form-card label'));
    const label = labels.find((node) => (node.textContent || '').trim().toLowerCase().startsWith(labelStart.toLowerCase()));
    if (!label) return null;
    return { label, control: label.querySelector('input, textarea, select') };
  };

  const fieldValue = (labelStart) => {
    const field = findField(labelStart);
    return field && field.control && 'value' in field.control ? String(field.control.value || '').trim() : '';
  };

  const setControlValue = (control, value) => {
    if (!control) return;
    const proto = control instanceof HTMLSelectElement ? HTMLSelectElement.prototype : control instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    const descriptor = Object.getOwnPropertyDescriptor(proto, 'value');
    if (descriptor && descriptor.set) descriptor.set.call(control, value);
    else control.value = value;
    control.dispatchEvent(new Event('input', { bubbles: true }));
    control.dispatchEvent(new Event('change', { bubbles: true }));
  };

  const publicationMissing = () => {
    if (!document.querySelector('.product-editor-shell')) return [];
    const missing = [];
    if (!fieldValue('Nom du produit') || fieldValue('Nom du produit') === 'Nouveau produit') missing.push('nom du produit');
    if (!fieldValue('Slug / URL')) missing.push('slug / URL');
    if (!fieldValue('Prix')) missing.push('prix');
    if (!fieldValue('Description courte')) missing.push('description courte');
    if (!document.querySelector('.main-image img')) missing.push('image principale');
    const channel = fieldValue('Canal de vente');
    if (channel === 'amazon' && !fieldValue('Lien Amazon')) missing.push('lien Amazon');
    if (channel === 'stripe' && !fieldValue('Lien Stripe Payment Link')) missing.push('lien Stripe');
    if (channel === 'external' && !fieldValue("Lien d’achat externe")) missing.push("lien d’achat");
    return missing;
  };

  const showValidation = (missing) => {
    let box = document.querySelector('.admin-publish-warning');
    if (!box) {
      box = document.createElement('div');
      box.className = 'admin-publish-warning';
      const anchor = document.querySelector('.completion') || document.querySelector('.editor-topbar');
      if (anchor && anchor.parentElement) anchor.parentElement.insertBefore(box, anchor.nextSibling);
    }
    if (box) {
      box.innerHTML = '<strong>Avant de publier, il manque :</strong> ' + missing.join(' · ');
      box.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const ensureDraftPreview = () => {
    const shell = document.querySelector('.product-editor-shell');
    const actions = document.querySelector('.editor-topbar .top-actions');
    if (!shell || !actions || actions.querySelector('.admin-draft-preview-btn')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'light admin-draft-preview-btn';
    button.textContent = 'Aperçu plein écran';
    button.addEventListener('click', () => {
      const preview = document.querySelector('.preview');
      if (!preview) return;
      const overlay = document.createElement('div');
      overlay.className = 'admin-preview-overlay';
      const card = document.createElement('div');
      card.className = 'admin-preview-modal';
      const close = document.createElement('button');
      close.className = 'admin-preview-close';
      close.textContent = 'Fermer ×';
      const clone = preview.cloneNode(true);
      clone.classList.remove('mobile');
      clone.classList.add('desktop','admin-preview-clone');
      close.addEventListener('click', () => overlay.remove());
      overlay.addEventListener('click', (event) => { if (event.target === overlay) overlay.remove(); });
      card.append(close, clone);
      overlay.append(card);
      document.body.append(overlay);
    });
    actions.insertBefore(button, actions.firstChild);
  };

  const ensureBadgePresets = () => {
    if (!document.querySelector('.product-editor-shell') || document.querySelector('.admin-badge-presets')) return;
    const field = findField('Badge');
    if (!field || !field.control) return;
    const wrap = document.createElement('div');
    wrap.className = 'admin-badge-presets';
    ['', 'À imprimer', 'Nouveau', 'Précommande', 'Édition limitée'].forEach((choice) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = choice || 'Aucun badge';
      button.addEventListener('click', () => setControlValue(field.control, choice));
      wrap.appendChild(button);
    });
    field.label.appendChild(wrap);
  };

  const ensureReadyShortcut = () => {
    if (!document.querySelector('.product-editor-shell') || document.querySelector('.admin-ready-shortcut')) return;
    const field = findField('État de travail');
    if (!field || !(field.control instanceof HTMLSelectElement)) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'admin-ready-shortcut';
    button.textContent = '✓ Marquer prêt à publier';
    button.addEventListener('click', () => setControlValue(field.control, 'ready'));
    field.label.appendChild(button);
  };

  const ensureSeoHelper = () => {
    if (!document.querySelector('.product-editor-shell') || document.querySelector('.admin-seo-helper')) return;
    const seoTitle = findField('Titre Google');
    const seoDescription = findField('Description Google');
    if (!seoTitle || !seoDescription || !seoTitle.control || !seoDescription.control) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'admin-seo-helper';
    button.textContent = '✨ Remplir automatiquement le SEO';
    button.addEventListener('click', () => {
      const title = fieldValue('Nom du produit');
      const short = fieldValue('Description courte');
      const tagline = fieldValue('Petite accroche');
      if (!String(seoTitle.control.value || '').trim()) setControlValue(seoTitle.control, title ? title + " — Com’ entre nous" : '');
      if (!String(seoDescription.control.value || '').trim()) setControlValue(seoDescription.control, short || tagline || '');
    });
    const heading = Array.from(document.querySelectorAll('.form-card h2')).find((node) => (node.textContent || '').trim() === 'Référencement');
    if (heading) heading.insertAdjacentElement('afterend', button);
  };

  const ensureProductHelpers = () => {
    ensureDraftPreview();
    ensureBadgePresets();
    ensureReadyShortcut();
    ensureSeoHelper();
  };

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const button = target.closest('button');
    if (!button) return;
    const text = (button.textContent || '').trim();
    if (text === 'Mettre en ligne') {
      const missing = publicationMissing();
      if (missing.length) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        showValidation(missing);
        return;
      }
      const warning = document.querySelector('.admin-publish-warning');
      if (warning) warning.remove();
    }
    if (mutationLabels.some((label) => text === label || text.startsWith(label))) {
      window.setTimeout(watchDeployment, 1200);
    }
  }, true);

  const observer = new MutationObserver(() => ensureProductHelpers());
  document.addEventListener('DOMContentLoaded', () => {
    initDeployStatus();
    ensureProductHelpers();
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();
`;

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>
    <script dangerouslySetInnerHTML={{ __html: persistentTokenScript }} />
    <script dangerouslySetInnerHTML={{ __html: adminEnhancementsScript }} />
    <nav className="admin-global-nav">
      <Link href="/admin/">Tableau de bord</Link>
      <Link href="/admin/contenus/">Contenus du site</Link>
      <Link href="/admin/podcast/">Podcast</Link>
      <Link href="/boutique/">Voir la boutique</Link>
      <Link href="/">Voir le site</Link>
    </nav>
    <div className="admin-quick-access" aria-label="Accès rapides administration">
      <Link href="/admin/contenus/">✎ Contenus du site</Link>
      <Link href="/admin/podcast/">◉ Podcast</Link>
    </div>
    {children}
    <style>{`
      .admin-global-nav{position:relative;z-index:9999;display:flex;gap:8px;align-items:center;overflow:auto;padding:9px 14px;background:#0f1320;border-bottom:1px solid rgba(255,255,255,.1);font-family:Comfortaa,system-ui,sans-serif}
      .admin-global-nav a{white-space:nowrap;color:#fff;text-decoration:none;font-size:11px;font-weight:900;padding:8px 11px;border-radius:999px;background:rgba(255,255,255,.08)}
      .admin-global-nav a:hover{background:#ff5d62}
      .admin-quick-access{position:fixed;right:18px;bottom:18px;z-index:100000;display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;font-family:Comfortaa,system-ui,sans-serif;pointer-events:auto}
      .admin-quick-access a{display:inline-flex;align-items:center;gap:6px;background:#171b2a;color:#fff;text-decoration:none;border-radius:999px;padding:12px 16px;font-size:12px;font-weight:900;box-shadow:0 12px 30px rgba(23,27,42,.22)}
      .admin-quick-access a:first-child{background:#ff5d62}
      .admin-deploy-status{position:fixed;left:18px;bottom:18px;z-index:100001;display:flex;align-items:center;gap:8px;border-radius:999px;padding:10px 14px;background:#fff;color:#171b2a;box-shadow:0 12px 30px rgba(23,27,42,.16);font:800 11px Comfortaa,system-ui,sans-serif;border:1px solid #eadfd6}
      .admin-deploy-dot{width:9px;height:9px;border-radius:50%;background:#8b93a7}
      .admin-deploy-status.ready .admin-deploy-dot{background:#0fa399}.admin-deploy-status.working .admin-deploy-dot{background:#f1a52b;animation:adminPulse 1s infinite}.admin-deploy-status.error .admin-deploy-dot{background:#b42318}
      @keyframes adminPulse{50%{opacity:.35}}
      .admin-publish-warning{max-width:1500px;margin:12px auto 16px;padding:13px 16px;border-radius:14px;background:#fff0ef;color:#8f2018;font:700 12px/1.6 Comfortaa,system-ui,sans-serif;border:1px solid #ffd4d0}
      .admin-preview-overlay{position:fixed;inset:0;z-index:200000;background:rgba(15,19,32,.78);display:grid;place-items:center;padding:24px;overflow:auto}
      .admin-preview-modal{position:relative;width:min(1100px,96vw);background:#fff8f1;border-radius:28px;padding:26px;box-shadow:0 30px 90px rgba(0,0,0,.28)}
      .admin-preview-close{position:sticky;top:0;float:right;z-index:2;border:0;border-radius:999px;background:#171b2a;color:#fff;padding:10px 14px;font-weight:900;cursor:pointer}
      .admin-preview-clone{position:static!important;max-width:720px!important;width:100%!important;margin:24px auto 0!important;box-shadow:none!important}
      .admin-preview-clone .preview-head{display:none!important}
      .admin-badge-presets{display:flex;gap:6px;flex-wrap:wrap;margin-top:4px}
      .admin-badge-presets button,.admin-ready-shortcut,.admin-seo-helper{border:1px solid #e4d9d1;border-radius:999px;background:#fff;color:#171b2a;padding:7px 10px;font:800 10px Comfortaa,system-ui,sans-serif;cursor:pointer}
      .admin-badge-presets button:hover,.admin-ready-shortcut:hover,.admin-seo-helper:hover{border-color:#171b2a}
      .admin-ready-shortcut{margin-top:4px;background:#e8f7f3;border-color:#c5ebe3;color:#087f78}
      .admin-seo-helper{display:inline-flex;margin:-8px 0 18px;background:#fff0ee;border-color:#ffd5d1;color:#8f2018}
      @media(max-width:650px){.admin-global-nav{padding:7px 8px}.admin-global-nav a{font-size:10px;padding:7px 9px}.admin-quick-access{left:10px;right:10px;bottom:10px}.admin-quick-access a{flex:1;justify-content:center;padding:11px 12px}.admin-deploy-status{left:10px;bottom:64px}.admin-preview-overlay{padding:8px}.admin-preview-modal{padding:14px;border-radius:18px}}
    `}</style>
  </>;
}
