(() => {
  if (!location.pathname.startsWith('/admin/produit')) return;

  function addWooOption() {
    const labels = Array.from(document.querySelectorAll('.form-card label'));
    const label = labels.find((node) => /canal de vente|mode de vente/i.test((node.textContent || '').trim()));
    if (!label) return;
    const select = label.querySelector('select');
    if (!select) return;

    const wantedWoo = select.dataset.keepWoo === '1';
    if (!Array.from(select.options).some((option) => option.value === 'woo')) {
      const option = document.createElement('option');
      option.value = 'woo';
      option.textContent = 'WooCommerce — vente sur le site';
      select.insertBefore(option, select.options[1] || null);
    }
    if (wantedWoo) select.value = 'woo';
  }

  function schedule() {
    window.setTimeout(addWooOption, 0);
    window.setTimeout(addWooOption, 120);
  }

  document.addEventListener('DOMContentLoaded', schedule);
  document.addEventListener('click', schedule, true);
  document.addEventListener('input', schedule, true);
  document.addEventListener('change', (event) => {
    const target = event.target;
    if (target instanceof HTMLSelectElement) {
      const label = target.closest('label');
      if (label && /canal de vente|mode de vente/i.test((label.textContent || '').trim())) {
        target.dataset.keepWoo = target.value === 'woo' ? '1' : '0';
      }
    }
    schedule();
  }, true);
  window.setTimeout(schedule, 350);
})();
