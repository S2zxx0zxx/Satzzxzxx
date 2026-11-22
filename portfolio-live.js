/* Public-only GitHub repository explorer. No private tokens, trackers or third-party UI dependencies. */
(() => {
  'use strict';
  const OWNER = 'S2zxx0zxx';
  const CACHE_KEY = 'satzzxzxx-public-repos-v1';
  const CACHE_TTL_MS = 15 * 60 * 1000;
  const MAX_PAGES = 10;
  const list = document.getElementById('repoList');
  const search = document.getElementById('repoSearch');
  const category = document.getElementById('repoCategory');
  const count = document.getElementById('repoResultCount');
  const publicCount = document.getElementById('publicRepoCount');
  const status = document.getElementById('repoSyncStatus');
  const source = document.getElementById('repoSourceBadge');
  const refresh = document.getElementById('repoRefresh');
  const explorer = document.getElementById('repoExplorer');
  if (!list || !search || !category || !count || !publicCount || !status || !explorer) return;

  const classify = name => {
    const n = name.toLowerCase();
    if (n === 'arkyvon' || n.startsWith('global-chess') || n.startsWith('global-carrom') ||
        n.startsWith('global-brain') || n.includes('gamemart')) return 'GAME / ENGINE';
    if (n.includes('clipper') || n.includes('music-photo')) return 'CREATOR TOOLS';
    if (n.includes('arcovia') || n.includes('openxdrive') || n.includes('codebase-memory') ||
        n.includes('omniroute')) return 'ARCHITECTURE / STORAGE';
    if (n.includes('satzzxzxx-labs') || n.includes('digi') || n.includes('portfolio') ||
        n.includes('brands')) return 'STUDIO / MEDIA';
    if (n.includes('finco') || n.includes('finance') || n.includes('stock') ||
        n.includes('fare') || n.includes('markettrade') || n.includes('bribes')) return 'FINANCE';
    if (n.includes('ai') || n.includes('agent') || n.includes('toolshub') ||
        n.includes('zenvy') || n.includes('mcp')) return 'AI / TOOLS';
    if (n.includes('lounge') || n.includes('scenic') || n.includes('travel') ||
        n.includes('github.io') || n.includes('elite')) return 'WEB / APPS';
    if (n.includes('leetcode') || n.includes('spam') || n.includes('scrap') ||
        n.includes('docx') || n.includes('image') || n.includes('airbnb')) return 'LEARNING / RESEARCH';
    return 'OTHER PROJECTS';
  };
  let repos = [];
  const isSafeName = name => /^[A-Za-z0-9._-]{1,100}$/.test(name);
  function normalize(raw) {
    const unique = new Map();
    if (!Array.isArray(raw)) return [];
    for (const item of raw) {
      const name = item && typeof item.name === 'string' ? item.name : '';
      if (!isSafeName(name) || item.private === true || item.visibility === 'private') continue;
      const key = name.toLowerCase();
      if (unique.has(key)) continue;
      unique.set(key, { name, category: classify(name) });
    }
    return [...unique.values()].sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
  }
  function updateCategories() {
    const selected = category.value;
    const categories = [...new Set(repos.map(item => item.category))].sort();
    category.replaceChildren(new Option('All areas', 'ALL'));
    for (const name of categories) category.add(new Option(name, name));
    category.value = categories.includes(selected) ? selected : 'ALL';
  }
  function render() {
    const term = search.value.trim().toLocaleLowerCase('en');
    const area = category.value;
    const filtered = repos.filter(repo =>
      (area === 'ALL' || repo.category === area) &&
      (repo.name.toLocaleLowerCase('en').includes(term) || repo.category.toLocaleLowerCase('en').includes(term))
    );
    count.textContent = filtered.length === repos.length ?
      repos.length + ' public repositories' : filtered.length + ' of ' + repos.length + ' public repositories';
    // Build DOM nodes without injecting untrusted GitHub API text as HTML.
    const fragment = document.createDocumentFragment();
    for (const repo of filtered) {
      const row = document.createElement('li');
      const link = document.createElement('a');
      link.href = 'https://github.com/' + OWNER + '/' + encodeURIComponent(repo.name);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', 'Open ' + repo.name + ' on GitHub');
      const name = document.createElement('span');
      name.className = 'repo-name';
      name.textContent = repo.name;
      const right = document.createElement('span');
      right.className = 'repo-list-right';
      const area = document.createElement('span');
      area.className = 'repo-area';
      area.textContent = repo.category;
      const arrow = document.createElement('span');
      arrow.className = 'repo-link-arrow';
      arrow.textContent = '↗';
      arrow.setAttribute('aria-hidden', 'true');
      right.append(area, arrow);
      link.append(name, right);
      row.append(link);
      fragment.append(row);
    }
    if (!filtered.length) {
      const row = document.createElement('li');
      row.className = 'repo-empty';
      row.textContent = repos.length ? 'No matching public repositories. Try another search or focus area.' :
        'Repository index could not be loaded. Browse the public projects on GitHub.';
      fragment.append(row);
    }
    list.replaceChildren(fragment);
  }
  function setRepos(value, message, badge) {
    const valid = normalize(value);
    if (!valid.length) return false;
    repos = valid;
    publicCount.textContent = String(repos.length);
    search.placeholder = 'Search ' + repos.length + ' public projects…';
    status.textContent = message;
    if (source) source.textContent = badge;
    updateCategories();
    render();
    return true;
  }
  async function getJson(url, signal) {
    const response = await fetch(url, {
      headers: { 'Accept': 'application/vnd.github+json' },
      cache: 'no-store',
      signal
    });
    if (!response.ok) throw new Error('GitHub HTTP ' + response.status);
    return response.json();
  }
  async function loadSnapshot() {
    try {
      const response = await fetch('./data/public-repositories.json', { cache: 'no-cache' });
      if (!response.ok) throw new Error('Snapshot unavailable');
      const data = await response.json();
      if (data.github_owner !== OWNER || !Array.isArray(data.public_repositories)) throw new Error('Invalid snapshot');
      setRepos(data.public_repositories, 'Verified snapshot · ' + data.verified_at, 'Verified snapshot');
    } catch {
      status.textContent = 'Snapshot unavailable; checking public GitHub API…';
    }
  }
  function getCached() {
    try {
      const value = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null');
      if (!value || Date.now() - value.saved_at > CACHE_TTL_MS) return null;
      return Array.isArray(value.repos) ? value.repos : null;
    } catch { return null; }
  }
  function storeCached(value) {
    try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ saved_at: Date.now(), repos: value })); }
    catch { /* Private browsing/storage disabled: still works without cache. */ }
  }
  let loading = false;
  async function syncFromGitHub(force = false) {
    if (loading) return;
    if (!force) {
      const cached = getCached();
      if (cached && setRepos(cached, 'Recent GitHub API snapshot · cached for 15 minutes', 'GitHub API cache')) return;
    }
    loading = true;
    if (refresh) { refresh.disabled = true; refresh.textContent = 'Syncing…'; }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);
    try {
      const fetched = [];
      for (let page = 1; page <= MAX_PAGES; page++) {
        const data = await getJson(
          'https://api.github.com/users/' + OWNER + '/repos?type=owner&sort=updated&per_page=100&page=' + page,
          controller.signal
        );
        if (!Array.isArray(data)) throw new Error('Unexpected GitHub response');
        fetched.push(...data.filter(item => item && item.private !== true));
        if (data.length < 100) break;
        if (page === MAX_PAGES) throw new Error('Repository inventory pagination limit reached');
      }
      const normalized = normalize(fetched);
      if (!normalized.length) throw new Error('Empty GitHub repository response');
      storeCached(normalized);
      setRepos(normalized, 'Public repository data · fetched from GitHub API', 'GitHub API');
    } catch {
      status.textContent = repos.length ?
        'Live GitHub refresh unavailable · showing last verified data' :
        'GitHub API unavailable · open repositories directly on GitHub';
      if (!repos.length) render();
    } finally {
      clearTimeout(timeout);
      loading = false;
      if (refresh) { refresh.disabled = false; refresh.textContent = 'Refresh ↻'; }
    }
  }
  search.addEventListener('input', render);
  category.addEventListener('change', render);
  if (refresh) refresh.addEventListener('click', () => syncFromGitHub(true));
  explorer.addEventListener('toggle', () => { if (explorer.open) render(); });
  loadSnapshot().then(() => syncFromGitHub());
})();
