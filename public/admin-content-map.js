(function(){
  if (typeof window === 'undefined') return;

  function enhance(){
    if (window.location.pathname !== '/admin/contenus/' && window.location.pathname !== '/admin/contenus') return;
    const root = document.querySelector('.content-admin');
    if (!root || document.getElementById('content-map-note')) return;

    const header = root.querySelector('header');
    if (header) {
      const note = document.createElement('div');
      note.id = 'content-map-note';
      note.innerHTML = '<strong>Repère rapide</strong><span>Accueil : hero + nouveautés dans « Page d’accueil » du tableau de bord. Podcast de l’accueil : dans « Podcast ». Ici : encarts univers, pages univers, valeurs, newsletter et footer des pages intérieures.</span>';
      note.style.cssText = 'max-width:1400px;margin:18px auto 0;padding:14px 16px;border-radius:16px;background:#fff3cf;color:#4d3c12;display:grid;gap:5px;font:600 12px/1.55 Comfortaa,system-ui,sans-serif';
      header.insertAdjacentElement('afterend', note);
    }

    document.querySelectorAll('.tabs button').forEach(function(button){
      const text = (button.textContent || '').trim();
      if (text === 'Bloc podcast') {
        button.textContent = 'Podcast → espace dédié';
        button.addEventListener('click', function(event){
          event.preventDefault();
          event.stopPropagation();
          window.location.href = '/admin/podcast/';
        }, true);
      }
      if (text === 'Newsletter') button.textContent = 'Newsletter pages univers';
      if (text === 'Footer') button.textContent = 'Footer pages intérieures';
      if (text === 'Valeurs') button.textContent = 'Valeurs pages univers';
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', enhance);
  else enhance();
  setTimeout(enhance, 400);
})();
