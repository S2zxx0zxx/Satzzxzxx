const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const html = read('index.html');
const css = read('styles.css');
const app = read('app.js');
const live = read('portfolio-live.js');
const data = JSON.parse(read('data/public-repositories.json'));
const publicRepos = data.public_repositories;

test('repository snapshot is the audited 47 public / 11 private inventory', () => {
  assert.equal(data.github_owner, 'S2zxx0zxx');
  assert.equal(data.inventory.public_repositories, 47);
  assert.equal(data.inventory.private_repositories_audited, 11);
  assert.equal(data.inventory.total_audited, 58);
  assert.equal(publicRepos.length, 47);
  assert.equal(new Set(publicRepos.map(r => r.name.toLowerCase())).size, 47);
});

test('new public project links and stages are represented accurately', () => {
  for (const project of [
    'ARKYVON', 'Global-Chess-Online-PVP-', 'OpenXdrive',
    'Unlimited-Auto-Cut-Clipper-Tool', 'Satzzxzxx-Labs',
    'Fincopilot.App', 'arcovia-S2zzx0zxx',
    'Global-Carrom-Online-PVP-', 'Global-Brain-Iq-Train-Puzzle'
  ]) {
    assert.ok(publicRepos.some(r => r.name === project), project);
    assert.ok(html.includes(project) || html.includes(project.replace('Global-Chess-Online-PVP-', 'Global Chess')));
  }
  assert.match(html, /ARKYVON[\s\S]*?early scaffold/);
  assert.match(html, /Global Chess[\s\S]*?draft PR/);
});

test('original portfolio navigation, section, physics and shipped cards remain', () => {
  for (const anchor of ['id="top"', 'id="work"', 'id="about"', 'id="contact"', 'id="physicsZone"']) {
    assert.ok(html.includes(anchor), anchor);
  }
  for (const name of ['FinCo-Pilot', 'ToolsLab LLMs', 'FinCalc', 'DigiRise India', 'Taskora AI', 'Zenvy AI', 'Liquid Lounge', 'GameMart Store']) {
    assert.ok(html.includes(name), name);
  }
  assert.equal((app.match(/cdn\.jsdelivr\.net\/gh\/devicons/g) || []).length, 12);
});

test('repository browser is functional and fail-soft without sensitive GitHub token', () => {
  for (const id of ['repoSearch', 'repoCategory', 'repoRefresh', 'repoList', 'repoExplorer', 'publicRepoCount']) {
    assert.ok(html.includes('id="' + id + '"'));
  }
  assert.match(live, /api\.github\.com\/users/);
  assert.match(live, /public-repositories\.json/);
  assert.match(live, /item\.private === true/);
  assert.match(live, /textContent/);
  assert.doesNotMatch(live, /innerHTML/);
  assert.doesNotMatch(live, /ghp_[A-Za-z0-9]+/);
});

test('GitHub buttons remain clickable; device-motion control is not destroyed', () => {
  assert.doesNotMatch(app, /removeAttribute\('href'\)/);
  assert.doesNotMatch(app, /physicsZone\.innerHTML\s*=\s*''/);
  assert.match(app, /querySelectorAll\('\.physics-token'\)/);
  assert.match(app, /DeviceOrientationEvent/);
});

test('responsive design and reduced-motion behavior are preserved', () => {
  assert.match(css, /max-width:480px/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /\.frontier-grid/);
  assert.match(css, /\.repo-controls/);
});

test('repo URL and classification data use only valid public names', () => {
  for (const repo of publicRepos) {
    assert.match(repo.name, /^[A-Za-z0-9._-]{1,100}$/);
    assert.ok(repo.category && typeof repo.category === 'string');
  }
  assert.equal(publicRepos.some(r => r.name === 'SaveSocialNet'), false);
  assert.equal(publicRepos.some(r => r.name === 'FitTrackAI'), false);
});

test('the repository index retains its no-JavaScript GitHub fallback', () => {
  assert.match(html, /<noscript>/);
  assert.match(html, /github\.com\/S2zxx0zxx\?tab=repositories/);
});


test('game-first building section replaces the former finance/LLM spotlight', () => {
  const start = html.indexOf('id="work"');
  const end = html.indexOf('id="projects"', start);
  const building = html.slice(start, end);
  assert.ok(start > 0 && end > start);
  assert.equal((building.match(/class="build-item"/g) || []).length, 2);
  assert.match(building, /ARKYVON · Game Engine/);
  assert.match(building, /Global Chess · Game Development/);
  assert.doesNotMatch(building, /<h3>FinCo-Pilot<\/h3>/);
  assert.doesNotMatch(building, /<h3>ToolsLab LLMs<\/h3>/);
});

test('compact engineering frontier is all dark with exact curated phase states', () => {
  const start = html.indexOf('id="projects"');
  const end = html.indexOf('id="completed-title"', start);
  const frontier = html.slice(start, end);
  assert.equal((frontier.match(/class="frontier-card frontier-card-lead"/g) || []).length, 4);
  for (const [serial, status] of [
    ['01 / GAME ENGINE', 'BUILDING'],
    ['02 / INTERACTIVE GAMES', 'BUILDING'],
    ['03 / CREATOR INFRA', 'TESTING'],
    ['04 / STORAGE SYSTEMS', 'TESTING'],
  ]) {
    assert.ok(frontier.includes(serial + '</span><span class="phase-chip ' +
      (status === 'BUILDING' ? 'active' : 'testing') + '">' + status), serial);
  }
  assert.match(css, /\.frontier-card,.frontier-card-lead\{background:#171717/);
  assert.match(css, /grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
});

test('shipped product showcase has eight entries and correct PWA/status labels', () => {
  const start = html.indexOf('<div class="completed-card">');
  const end = html.indexOf('</div>\n      </section>', start);
  const shipped = html.slice(start, end);
  assert.equal((shipped.match(/class="completed-item"/g) || []).length, 8);
  for (const name of ['FinCo-Pilot', 'ToolsLab LLMs']) assert.ok(shipped.includes('<h3>' + name + '</h3>'));
  assert.doesNotMatch(shipped, /class="status-value good">LIVE/);
  assert.ok((shipped.match(/class="status-value good">VERIFIED/g) || []).length >= 3);
  assert.ok((shipped.match(/Web \+ PWA/g) || []).length >= 6);
  assert.ok(html.includes('data-count="8"'));
});

test('three-lane routing workflow precedes current development and has animated routes', () => {
  const start = html.indexOf('id="pathways"');
  assert.ok(start > 0 && start < html.indexOf('id="work"'));
  const workflow = html.slice(start, html.indexOf('id="work"', start));
  assert.equal((workflow.match(/<details class="pathway-card"/g) || []).length, 3);
  for (const name of ['Game Engine', 'Web / APK', 'Blogs / Articles',
    'Global-Chess-Online-PVP-', 'thepaisajournal.blogspot.com', 'pathway-dot']) {
    assert.ok(workflow.includes(name), name);
  }
  assert.match(workflow, /apk-badge/);
  assert.match(workflow, /pathway-pro/);
  assert.match(css, /@keyframes route-travel/);
  assert.match(css, /prefers-reduced-motion:reduce/);
});

test('editorial publication is discoverable, explicitly linked and disclosed', () => {
  assert.match(html, /id="journal"/);
  assert.match(html, /The Paisa Journal/);
  assert.match(html, /https:\/\/thepaisajournal\.blogspot\.com\//);
  assert.match(html, /same founder-led ecosystem/);
  assert.match(html, /FinCalc articles/);
});

test('phone-first styling keeps game cards in a compact two-column layout', () => {
  assert.match(css, /@media\(max-width:480px\)/);
  assert.match(css, /\.frontier-card\{min-height:167px/);
  assert.match(css, /\.pathways-grid\{gap:6px\}/);
  assert.match(css, /\.currently-section \.build-data\{display:none\}/);
  assert.match(css, /\.apk-badge/);
});


test('all three routes are compact native interactive squares, not tall columns or images', () => {
  const start = html.indexOf('id="pathways"');
  const end = html.indexOf('id="work"', start);
  const route = html.slice(start, end);
  assert.equal((route.match(/<details class="pathway-card"/g) || []).length, 3);
  assert.equal((route.match(/<summary class="pathway-summary"/g) || []).length, 3);
  assert.equal((route.match(/<span class="pathway-route"/g) || []).length, 3);
  assert.equal((route.match(/<span class="pathway-dot"/g) || []).length, 3);
  assert.equal((route.match(/class="pathway-nodes"/g) || []).length, 3);
  assert.equal((route.match(/<a /g) || []).length, 14);
  assert.doesNotMatch(route, /<img\b|<canvas\b|<video\b/);
  assert.match(css, /\.pathway-summary\{[^}]*aspect-ratio:1\/1/);
  assert.match(css, /\.pathways-grid\{[^}]*grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
});

test('the route alone has a strictly neutral palette, including dots, labels and APK badges', () => {
  const start = css.indexOf('/* Native expandable square route cards');
  const end = css.indexOf('.secondary-game-links{', start);
  assert.ok(start >= 0 && end > start);
  const routeStyle = css.slice(start, end);
  assert.doesNotMatch(routeStyle, /#(?:[0-9a-f]{3})?\b(?:a087ff|ab8eff|c5b7ff|ad91ff|a998ff|b393ff|7d67ff|ccbaff)\b/i);
  const hexColors = [...routeStyle.matchAll(/#([0-9a-f]{6})\b/gi)];
  for (const [, hex] of hexColors) {
    const channels = [0, 2, 4].map(offset => parseInt(hex.slice(offset, offset + 2), 16));
    assert.ok(Math.max(...channels) - Math.min(...channels) <= 12,
      'Route color must be monochrome or neutral gray: #' + hex);
  }
  assert.match(routeStyle, /background:#fff/);
  assert.match(routeStyle, /background:#eee/);
  assert.match(css, /\.apk-badge\{[^}]*background:#f2f2f2/);
  assert.doesNotMatch(css, /\.apk-badge\{[^}]*gradient\(/);
  assert.match(css, /\.pathway-pro\{[^}]*background:#eee/);
});

test('white route dots and live routing bars continue moving in pure CSS, with reduced-motion support', () => {
  assert.match(css, /\.pathway-dot\{[^}]*animation:route-travel/);
  assert.match(css, /\.pathway-route::before\{[^}]*animation:route-scan/);
  assert.match(css, /@keyframes route-travel/);
  assert.match(css, /@keyframes route-scan\{0%\{transform:translateX\(0\)\}100%\{transform:translateX\(300%\)\}\}/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)/);
  assert.match(css, /\.pathway-dot\{animation:none!important\}/);
  assert.match(css, /\.pathway-card\[open\] \.pathway-expand-icon/);
});

test('no other page components or route destinations are removed by the size reduction', () => {
  const route = html.slice(html.indexOf('id="pathways"'),html.indexOf('id="work"'));
  for (const name of ['ARKYVON', 'Chess', 'Carrom', 'Brain / IQ',
    'FinCoPilot', 'ToolsLab', 'FinCalc', 'DigiRise', 'Zenvy AI',
    'Paisa Journal', 'Money Guides', 'FinCalc Blog', 'Labs / Research']) {
    assert.ok(route.includes(name), name);
  }
  assert.match(route, /<span class="pathway-pro">PRO<\/span>/);
  assert.match(route, /<span class="pathway-pro">PLUS<\/span>/);
  for (const id of ['physicsZone', 'work', 'projects', 'journal', 'repositories']) {
    assert.ok(html.includes('id="' + id + '"'), id);
  }
});

test('GitArena activity section shows all three provided live badges with responsive styling', () => {
  const start = html.indexOf('id="activity"');
  const end = html.indexOf('id="pathways"', start);
  assert.ok(start > html.indexOf('class="hero"') && end > start, 'activity follows hero before pathways');
  const section = html.slice(start, end);
  assert.equal(section.split('gitarena.dev/api/badge/S2zxx0zxx').length - 1, 3);
  assert.ok(section.includes('timeframe=total&amp;theme=dark&amp;color=orange'));
  assert.ok(section.includes('pill?timeframe=total&amp;theme=light&amp;color=purple'));
  assert.ok(section.includes('graph?theme=light&amp;color=purple'));
  assert.equal(section.split('href="https://gitarena.dev/u/S2zxx0zxx"').length - 1, 4);
  assert.ok(section.includes('alt="Live GitArena GitHub contribution graph"'));
  assert.ok(css.includes('.gitarena-badge-grid{display:grid'));
  assert.ok(css.includes('.gitarena-graph img{display:block;width:100%'));
  assert.ok(css.includes('@media(max-width:600px)'));
});

test('GitRanks India rank is linked beside GitArena metrics without duplicating the badge', () => {
  const start = html.indexOf('id="activity"');
  const end = html.indexOf('id="pathways"', start);
  assert.ok(start >= 0 && end > start);
  const activity = html.slice(start, end);
  assert.equal(activity.split('gitranks.com/badge/user/S2zxx0zxx/rank.svg').length - 1, 1);
  assert.ok(activity.includes('href="https://gitranks.com/profile/S2zxx0zxx/country"'));
  assert.ok(activity.includes('scope=country&amp;extra=none&amp;scheme=custom&amp;left=%23ffff00&amp;right=%2300ff00&amp;label=Satzzxzxx&amp;logo=0'));
  assert.ok(activity.includes('alt="Satzzxzxx India developer rank on GitRanks"'));
  assert.ok(activity.includes('class="activity-compact-badges"'));
  assert.ok(css.includes('.activity-compact-badges{display:flex;flex-direction:column;gap:12px;min-width:0}'));
  assert.ok(css.includes('.gitranks-rank-card img{width:auto;max-width:100%;max-height:64px'));
  assert.ok(css.includes('.activity-compact-badges{gap:9px}'));
});

test('GitRanks profile card is shown once after badges and before contribution graph', () => {
  const section = html.slice(html.indexOf('id="activity"'), html.indexOf('id="pathways"'));
  const profileCard = 'gitranks.com/badge/user/S2zxx0zxx/profile-card.svg?scheme=classic';
  assert.equal(section.split(profileCard).length - 1, 1);
  assert.ok(section.includes('href="https://gitranks.com/profile/S2zxx0zxx"'));
  assert.ok(section.includes('alt="S2zxx0zxx GitRanks developer profile card"'));
  assert.ok(section.indexOf('class="gitranks-profile-card"') > section.indexOf('class="gitarena-badge-grid"'));
  assert.ok(section.indexOf('class="gitranks-profile-card"') < section.indexOf('class="gitarena-graph"'));
  assert.ok(css.includes('.gitranks-profile-card img{display:block;width:auto;height:auto;max-width:100%'));
  assert.ok(css.includes('.gitranks-profile-card{margin-top:9px;padding:9px;border-radius:11px}'));
  assert.ok(css.includes('.gitarena-badge-card,.gitranks-profile-card{transition:none}'));
});
