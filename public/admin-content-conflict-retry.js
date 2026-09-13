(function(){
  if (typeof window === 'undefined' || window.__comentreContentRetryInstalled) return;
  window.__comentreContentRetryInstalled = true;
  const previousFetch = window.fetch.bind(window);

  window.fetch = async function(input, init){
    const url = typeof input === 'string' ? input : (input && input.url) || '';
    const method = String((init && init.method) || (input && input.method) || 'GET').toUpperCase();
    const isContentWrite = method === 'PUT' && /api\.github\.com\/repos\/vartcom38-collab\/comentre-nous-site\/contents\/content\/site-sections\.json(?:\?|$)/.test(url);

    const response = await previousFetch(input, init);
    if (!isContentWrite || response.status !== 409 || !init || typeof init.body !== 'string') return response;

    try {
      const current = await previousFetch('https://api.github.com/repos/vartcom38-collab/comentre-nous-site/contents/content/site-sections.json?ref=main', {
        method: 'GET',
        headers: init.headers
      });
      if (!current.ok) return response;
      const latest = await current.json();
      const payload = JSON.parse(init.body);
      if (!latest || !latest.sha || !payload) return response;
      payload.sha = latest.sha;
      return previousFetch(url, { ...init, body: JSON.stringify(payload) });
    } catch (_) {
      return response;
    }
  };
})();
