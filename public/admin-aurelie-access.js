(() => {
  const styleLink = (link, bg = '#fff7f4') => {
    Object.assign(link.style, {
      display: 'block',
      margin: '8px 0',
      padding: '11px 13px',
      borderRadius: '14px',
      background: bg,
      color: '#171b2a',
      textDecoration: 'none',
      fontFamily: 'Comfortaa, system-ui, sans-serif',
      fontSize: '11px',
      fontWeight: '900',
      border: '1px solid #eaded8'
    });
  };

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

    const quick = document.querySelector('.admin-quick-access');
    if (quick && !quick.querySelector('[data-aurelie-quick]')) {
      const link = document.createElement('a');
      link.href = href;
      link.dataset.aurelieQuick = 'true';
      link.textContent = '🌷 Papeterie · espace Aurélie';
      quick.insertBefore(link, quick.firstChild);
    }

    const paperAside = document.querySelector('.paper-admin aside');
    if (paperAside && !paperAside.querySelector('[data-aurelie-tools]')) {
      const block = document.createElement('div');
      block.dataset.aurelieTools = 'true';
      block.style.margin = '14px 0';
      block.innerHTML = '<div style="font-family:Comfortaa,system-ui,sans-serif;font-size:10px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:#9a7f77;margin:8px 2px 10px">Mes outils</div>';

      const links = [
        ['＋ Nouveau produit', '/admin/produit/?new=papeterie', '#f6d8e8'],
        ['💳 Stripe', '/admin/papeterie/connexions/#stripe', '#f1e7ff'],
        ['📦 Mondial Relay', '/admin/papeterie/connexions/#mondial-relay', '#e8f3ff'],
        ['✉ Email des commandes', '/admin/papeterie/notifications/', '#fff0ee'],
        ['🧾 Mes commandes', '/admin/papeterie/commandes/', '#eef8f3'],
        ['🛍 Voir ma boutique', '/papeterie-du-lien/', '#fff6dc']
      ];

      links.forEach(([label, url, bg]) => {
        const link = document.createElement('a');
        link.href = url;
        link.textContent = label;
        if (url === '/papeterie-du-lien/') link.target = '_blank';
        styleLink(link, bg);
        block.appendChild(link);
      });

      const foot = paperAside.querySelector('.side-foot');
      if (foot) paperAside.insertBefore(block, foot);
      else paperAside.appendChild(block);
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
