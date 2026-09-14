(() => {
  function mountFamilyCharacters() {
    if (location.pathname !== '/com-en-famille' && location.pathname !== '/com-en-famille/') return;
    const panel = document.querySelector('.family-character-panel');
    if (!panel || panel.dataset.familyCharacterMounted === '1') return;

    panel.dataset.familyCharacterMounted = '1';
    panel.innerHTML = '<img class="family-character-art" src="/uploads/family-characters-link.png?v=1" alt="Personnages illustrés Com’ entre nous, en famille" />';

    if (!document.getElementById('family-character-art-style')) {
      const style = document.createElement('style');
      style.id = 'family-character-art-style';
      style.textContent = `
        .family-character-panel{padding:0!important;background:#fff8ef!important;border-radius:2.4rem!important;overflow:hidden!important;box-shadow:0 18px 45px rgba(50,32,20,.08)!important}
        .family-character-art{display:block;width:100%;height:100%;min-height:330px;object-fit:cover;object-position:center}
        @media(max-width:680px){.family-character-art{min-height:280px}}
      `;
      document.head.appendChild(style);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountFamilyCharacters, { once: true });
  } else {
    mountFamilyCharacters();
  }

  const observer = new MutationObserver(mountFamilyCharacters);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
