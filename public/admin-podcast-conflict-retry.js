(function(){
  if (typeof window === 'undefined' || window.__comentrePodcastRetryInstalled) return;
  window.__comentrePodcastRetryInstalled = true;
  const originalFetch = window.fetch.bind(window);

  window.fetch = async function(input, init){
    const url = typeof input === 'string' ? input : (input && input.url) || '';
    const method = String((init && init.method) || (input && input.method) || 'GET').toUpperCase();
    const isPodcastWrite = method === 'PUT' && /api\.github\.com\/repos\/vartcom38-collab\/comentre-nous-site\/contents\/content\/podcast\.json(?:\?|$)/.test(url);

    const response = await originalFetch(input, init);
    if (!isPodcastWrite || response.status !== 409 || !init || typeof init.body !== 'string') return response;

    try {
      const current = await originalFetch('https://api.github.com/repos/vartcom38-collab/comentre-nous-site/contents/content/podcast.json?ref=main', {
        method: 'GET',
        headers: init.headers
      });
      if (!current.ok) return response;
      const latest = await current.json();
      const payload = JSON.parse(init.body);
      if (!latest || !latest.sha || !payload) return response;
      payload.sha = latest.sha;
      return originalFetch(url, { ...init, body: JSON.stringify(payload) });
    } catch (_) {
      return response;
    }
  };
})();
