(() => {
  if (!location.pathname.startsWith('/admin/produit')) return;

  function addWooOption() {
    const labels = Array.from(document.querySelectorAll('.form-card label'));
    const label = labels.find((node) => /canal de vente|mode de vente/i.test((node.textContent || '').trim()));
    if (!label) return;
    const select = label.querySelector('select');
    if (!select) return;

    if (!Array.from(select.options).some((option) => option.value === 'woo')) {
      const option = document.createElement('option');
      option.value = 'woo';
      option.textContent = 'WooCommerce — vente sur le site';
      select.insertBefore(option, select.options[1] || null);
    }
  }

  document.addEventListener('DOMContentLoaded', addWooOption);
  window.setTimeout(addWooOption, 250);
  window.setTimeout(addWooOption, 1000);

  const observer = new MutationObserver(() => addWooOption());
  const startObserver = () => {
    const form = document.querySelector('.form-card');
    if (form) observer.observe(form, { childList: true, subtree: true });
    else window.setTimeout(startObserver, 300);
  };
  startObserver();
})();
