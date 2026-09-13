(function(){
  if (typeof window === 'undefined' || window.__comentreGithubWriteQueueInstalled) return;
  window.__comentreGithubWriteQueueInstalled = true;

  const nativeFetch = window.fetch.bind(window);
  let queue = Promise.resolve();

  const repoPrefix = 'https://api.github.com/repos/vartcom38-collab/comentre-nous-site/contents/';

  function isRepoWrite(url, method){
    return method === 'PUT' && url.startsWith(repoPrefix);
  }

  function wait(ms){ return new Promise(resolve => setTimeout(resolve, ms)); }

  async function retryWrite(url, init){
    let lastResponse = null;
    let body = typeof init.body === 'string' ? init.body : null;

    for (let attempt = 0; attempt < 4; attempt++) {
      if (attempt) await wait(220 * attempt);
      const response = await nativeFetch(url, { ...init, body });
      lastResponse = response;
      if (response.status !== 409 || !body) return response;

      try {
        const relative = url.slice(repoPrefix.length).split('?')[0];
        const current = await nativeFetch(`${repoPrefix}${relative}?ref=main`, {
          method: 'GET',
          headers: init.headers
        });
        const payload = JSON.parse(body);

        if (current.ok) {
          const latest = await current.json();
          if (latest && latest.sha) payload.sha = latest.sha;
        } else if (current.status === 404) {
          delete payload.sha;
        }
        body = JSON.stringify(payload);
      } catch (_) {
        // Branch-head conflicts can also resolve with a simple delayed retry.
      }
    }

    return lastResponse;
  }

  window.fetch = function(input, init){
    const url = typeof input === 'string' ? input : (input && input.url) || '';
    const method = String((init && init.method) || (input && input.method) || 'GET').toUpperCase();

    if (!isRepoWrite(url, method)) return nativeFetch(input, init);

    const task = () => retryWrite(url, init || {});
    const result = queue.then(task, task);
    queue = result.then(() => undefined, () => undefined);
    return result;
  };
})();
