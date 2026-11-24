# Satzzxzxx Portfolio — Game-first, PWA & Editorial Showcase

A dependency-free personal portfolio for Satyam Kumar / Satzzxzxx. Preserves the original warm, minimal design language, interactive draggable technology icons, and shipped project archive while foregrounding **game-engine development, playable games, web/PWA products and digital finance articles**.

## Local preview

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`. The portfolio is served from a subdirectory at its GitHub Pages URL, so scripts and local JSON use relative asset paths.

## Content map

1. Original hero, twelve draggable technology icons (optional phone motion), and a link to the latest builds.
2. **Latest builds (23–24 Nov):** Global Chess Ultimate (offline chess PWA), Dragon Arena (WebGL2/Android debug preview), Royal Ludo Arena (offline bots and prototype rooms). Each has a working source link and a bounded stage claim.
3. **GitHub activity:** GitArena stats, rank pill and graph plus both GitRanks badges.
4. **Three Paths:** existing compact monochrome square workflow (game-engine, apps/PWA, editorial).
5. **Currently building:** ARKYVON engine (main scaffold; draft foundation) and Global Chess (main baseline merged; visual updates in draft).
6. **Engineering frontier:** existing four compact dark cards; honest BUILDING/TESTING indicators.
7. **Shipped products:** existing eight-item archive; status labels are portfolio classifications, not independent uptime certification.
8. **The Paisa Journal:** editorial feature and founder relationship disclosure.
9. **Repository explorer:** verified **50 public + 11 private = 61** repositories as of **24 Nov 2026**; public list only, private names hidden.
10. Learning, process, about, interaction, contact and footer sections.

The design includes compact mobile grid layouts, accessible links, reduced-motion handling and no heavy frontend framework. The new game cards keep existing cream/monochrome styling with concise, source-verifiable claims. The three route tiles remain square when closed; click or keyboard-expand each one to access all 14 original project links without losing the animation. The route UI uses no purple colors, images or JavaScript-driven motion. Project status tags are maintained editorially and do **not** indicate independent certification of live uptime, beta readiness, APK availability or individual feature activation.

## Dynamic repository index

`portfolio-live.js` requests public repos through the unauthenticated GitHub API and caches in session storage for 15 minutes. The 24 Nov 2026 update rotates the cache key and versioned static assets to avoid reusing the stale 47-repo snapshot. On API failure it falls back to `data/public-repositories.json`. Private repository names, secrets and GitHub API tokens are never inserted into the site.

## Validation

```bash
node --check app.js
node --check portfolio-live.js
node --test tests/portfolio.test.cjs
```

A PR/push validation workflow also runs these checks when GitHub Actions is available. Production deploy uses the existing GitHub Pages repository configuration.
