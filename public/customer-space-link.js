(() => {
  if (location.pathname !== '/' && location.pathname !== '') return;
  const update = () => {
    const link = document.querySelector('.home-page .actions a[aria-label="Compte"]');
    if (!link) return;
    link.setAttribute('href', '/mon-espace/');
    link.setAttribute('title', 'Mon compte');
  };
  document.addEventListener('DOMContentLoaded', update);
  window.setTimeout(update, 200);
})();
