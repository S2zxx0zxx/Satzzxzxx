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
  assert.match(html, /ARKYVON[\s\S]*?starter scaffold/);
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
