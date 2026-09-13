(() => {
  if (typeof window === 'undefined' || typeof window.fetch !== 'function') return;

  const nativeFetch = window.fetch.bind(window);
  const podcastPath = '/repos/vartcom38-collab/comentre-nous-site/contents/content/podcast.json';

  window.fetch = async function(input, init = {}) {
    const url = typeof input === 'string' ? input : input instanceof Request ? input.url : String(input || '');
    const method = String(init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();

    if (!url.includes(podcastPath) || method !== 'PUT') {
      return nativeFetch(input, init);
    }

    let response = await nativeFetch(input, init);
    if (response.status !== 409) return response;

    try {
      const rawBody = typeof init.body === 'string' ? init.body : '';
      if (!rawBody) return response;

      const payload = JSON.parse(rawBody);
      const headers = new Headers(init.headers || (input instanceof Request ? input.headers : undefined));
      const latestUrl = `${url}${url.includes('?') ? '&' : '?'}ref=${encodeURIComponent(payload.branch || 'main')}&_=${Date.now()}`;
      const latest = await nativeFetch(latestUrl, {
        method: 'GET',
        headers,
        cache: 'no-store'
      });
      if (!latest.ok) return response;

      const current = await latest.json();
      if (!current?.sha) return response;

      payload.sha = current.sha;
      response = await nativeFetch(input, {
        ...init,
        headers,
        body: JSON.stringify(payload)
      });
      return response;
    } catch (error) {
      console.warn('[Com entre nous] Retry sauvegarde podcast impossible', error);
      return response;
    }
  };
})();
