(() => {
  const addAurelieAccess = () => {
    if (!window.location.pathname.startsWith('/admin')) return;

    const href = '/admin/papeterie/';

    const globalNav = document.querySelector('.admin-global-nav');
    if (globalNav && !globalNav.querySelector('[data-aurelie-access]')) {
      const link = document.createElement('a');
      link.href = href;
      link.dataset.aurelieAccess = 'true';
      link.textContent = '🌷 Espace Aurélie';
      link.style.background = '#f6d8e8';
      link.style.color = '#171b2a';
      link.style.fontWeight = '900';
      link.style.borderRadius = '999px';
      link.style.padding = '8px 12px';
      link.style.whiteSpace = 'nowrap';
      globalNav.insertBefore(link, globalNav.firstChild);
    }
    if (globalNav && !globalNav.querySelector('[data-seasonal-access]')) {
      const link = document.createElement('a');
      link.href = '/admin/ambiance/';
      link.dataset.seasonalAccess = 'true';
      link.textContent = '✨ Ambiance du site';
      link.style.background = '#fff1c9';
      link.style.color = '#171b2a';
      link.style.fontWeight = '900';
      link.style.borderRadius = '999px';
      link.style.padding = '8px 12px';
      link.style.whiteSpace = 'nowrap';
      globalNav.insertBefore(link, globalNav.firstChild);
    }

    const quick = document.querySelector('.admin-quick-access');
    if (quick && !quick.querySelector('[data-aurelie-quick]')) {
      const link = document.createElement('a');
      link.href = href;
      link.dataset.aurelieQuick = 'true';
      link.textContent = '🌷 Papeterie · espace Aurélie';
      quick.insertBefore(link, quick.firstChild);
    }
    if (quick && !quick.querySelector('[data-seasonal-quick]')) {
      const link = document.createElement('a');
      link.href = '/admin/ambiance/';
      link.dataset.seasonalQuick = 'true';
      link.textContent = '✨ Ambiance du site';
      quick.insertBefore(link, quick.firstChild);
    }

    const paperAside = document.querySelector('.paper-admin aside');
    if (paperAside && !paperAside.querySelector('[data-order-email-settings]')) {
      const link = document.createElement('a');
      link.href = '/admin/papeterie/notifications/';
      link.dataset.orderEmailSettings = 'true';
      link.textContent = '✉ Email des commandes';
      Object.assign(link.style, {
        display: 'block',
        margin: '10px 0',
        padding: '11px 13px',
        borderRadius: '14px',
        background: '#fff0ee',
        color: '#171b2a',
        textDecoration: 'none',
        fontFamily: 'Comfortaa, system-ui, sans-serif',
        fontSize: '11px',
        fontWeight: '900',
        border: '1px solid #f1d7d2'
      });
      const foot = paperAside.querySelector('.side-foot');
      if (foot) paperAside.insertBefore(link, foot);
      else paperAside.appendChild(link);
    }

    if (!document.querySelector('.aurelie-floating-access')) {
      const link = document.createElement('a');
      link.href = href;
      link.className = 'aurelie-floating-access';
      link.textContent = '🌷 Espace Aurélie';
      Object.assign(link.style, {
        position: 'fixed',
        right: '18px',
        bottom: '18px',
        zIndex: '99999',
        background: '#f6d8e8',
        color: '#171b2a',
        textDecoration: 'none',
        fontFamily: 'Comfortaa, system-ui, sans-serif',
        fontSize: '12px',
        fontWeight: '900',
        padding: '11px 15px',
        borderRadius: '999px',
        boxShadow: '0 12px 30px rgba(48,30,18,.16)'
      });
      document.body.appendChild(link);
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addAurelieAccess);
  else addAurelieAccess();

  new MutationObserver(addAurelieAccess).observe(document.documentElement, { childList: true, subtree: true });
})();
