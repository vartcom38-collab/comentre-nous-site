(() => {
  if (location.pathname !== '/' && location.pathname !== '') return;

  const update = () => {
    const link = document.querySelector('.home-page .actions a[aria-label="Compte"]');
    if (!link) return;
    link.setAttribute('href', '/mon-espace/');
    link.setAttribute('title', 'Se connecter à son espace');
    link.setAttribute('aria-label', 'Se connecter à son espace cliente');
    link.classList.remove('icon-link');
    link.classList.add('customer-login-link');
    link.textContent = 'Se connecter';

    if (!document.getElementById('customer-login-link-style')) {
      const style = document.createElement('style');
      style.id = 'customer-login-link-style';
      style.textContent = `
        .home-page .customer-login-link{display:inline-flex;align-items:center;justify-content:center;min-height:2.65rem;padding:.65rem .92rem;border:1.5px solid #0d1424;border-radius:999px;background:#fff;color:#0d1424;font:800 .78rem Comfortaa,system-ui,sans-serif;white-space:nowrap;text-decoration:none}
        .home-page .customer-login-link:hover{background:#fff1ef}
        @media(max-width:720px){.home-page .customer-login-link{display:none}}
      `;
      document.head.appendChild(style);
    }
  };

  document.addEventListener('DOMContentLoaded', update);
  window.setTimeout(update, 100);
  window.setTimeout(update, 400);
})();
