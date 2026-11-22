# Satzzxzxx Portfolio — Game-first, PWA & Editorial Showcase

A dependency-free personal portfolio for Satyam Kumar / Satzzxzxx. Preserves the original warm, minimal design language, interactive draggable technology icons, and shipped project archive while foregrounding **game-engine development, playable games, web/PWA products and digital finance articles**.

## Local preview

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`. The portfolio is served from a subdirectory at its GitHub Pages URL, so scripts and local JSON use relative asset paths.

## Content map

1. Original hero and twelve draggable technology icons (with optional phone motion).
2. **Three Paths** mini workflow, routed through CSS animations:
   - ARKYVON game engine → Chess, Carrom, Brain / IQ projects
   - Web / APK / PWA → FinCoPilot, ToolsLab LLMs, FinCalc, DigiRise, Zenvy
   - Blogs / Articles → [The Paisa Journal](https://thepaisajournal.blogspot.com/), [FinCalc Articles](https://satzzxzxx.me/blog/) and Labs
3. **Currently building:** ARKYVON and Global Chess.
4. **Engineering frontier:** four compact black cards. ARKYVON / Chess **BUILDING**; LiveClip Zero / OpenXdrive **TESTING**.
5. **Shipped products:** original six products, plus FinCoPilot and ToolsLab = eight cards. PWA platform labels only where source includes a manifest or service-worker setup. Old LIVE labels renamed VERIFIED as portfolio classifications.
6. The Paisa Journal editorial feature with language chips, links and product relationship disclosure.
7. Searchable public GitHub repository index (47 public at 22 Nov 2026), private count shown only as audited aggregate (11), no private repository names exposed.
8. Original learning, process, about, motion and footer sections.

The design includes compact mobile grid layouts, accessible links, reduced-motion handling and no heavy frontend framework. Project status tags are maintained editorially and do **not** indicate independent certification of live uptime, beta readiness, APK availability or individual feature activation.

## Dynamic repository index

`portfolio-live.js` requests public repos through the unauthenticated GitHub API and caches in session storage for 15 minutes. On API failure it falls back to `data/public-repositories.json`. Private repository names, secrets and GitHub API tokens are never inserted into the site.

## Validation

```bash
node --check app.js
node --check portfolio-live.js
node --test tests/portfolio.test.cjs
```

A PR/push validation workflow also runs these checks when GitHub Actions is available. Production deploy uses the existing GitHub Pages repository configuration.
