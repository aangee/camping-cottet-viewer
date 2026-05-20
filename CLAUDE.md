# CLAUDE.md — Viewer Camping Cottet

**Chemin :** `L:/CORE/labs/Camping_Cottet_2026/Apps/app-viewer/`
**Stack :** Vite 8 + React 19 + PWA + Playwright
**NSM project_id :** `p-mp9r25nqaks`

## Rôle

PWA mobile-first publique, **lecture seule**, pour consulter le plan du camping sur le terrain : hébergements, bornes eau/élec, liaisons. Zoom/pan SVG, panneau bas avec détails. Offline-capable.

## Position dans la suite

Consommateur du studio admin (cf. `Apps/CLAUDE.md`). Reçoit ses données via `public/data.json`, généré par le module `viewer` du studio puis poussé ici via `npm run sync:viewer` (script `app-admin/tools/sync_viewer_data.mjs`).

**Ne jamais éditer `public/data.json` à la main.**

## Structure src/

```
src/
  App.jsx                — État racine (data, selected), fetch data.json
  components/
    PlanSVG.jsx          — Rendu SVG zoom/pan (react-zoom-pan-pinch), culling viewport
    BottomSheet.jsx      — Panneau détails hébergement / borne sélectionnés
    InstallPrompt.jsx    — Prompt iOS « Ajouter à l'écran d'accueil »
  hooks/
    useHighlight.js      — Calcule le Set d'IDs liés à la sélection (liaisons)
  index.css              — Design tokens (dark theme), animations pulse
```

## Format `public/data.json`

Top-level :
```json
{
  "hebergements": [{ "id", "nom", "type", "borne_eau", "borne_elec", "cx", "cy" }],
  "bornes_eau":   [{ "id": "EAU-XX", "num", "x", "y", "parcelles": [...], "note"? }],
  "bornes_elec":  [{ "id": "ELEC-XX", "num", "x", "y", "parcelles": [...], "distribue_vers": [...]?, "note"? }]
}
```

Coords en pixels SVG (viewBox 2000×1224).

## Conventions

- **State** : `useState` local, pas de Zustand
- **Style** : CSS vanilla + custom properties
- **Tests** : Playwright smoke (`tests/smoke.spec.js`) — chargement, clic hébergement, drag
- **Pas de `.env`** — tout est public/statique

## Build & deploy

- `vite.config.js` : `base: '/camping-cottet-viewer/'` → ⚠️ **à mettre à jour en `/camping-viewer/`** avant prochain déploiement (repo renommé 2026-05-20)
- GitHub Actions : `.github/workflows/deploy.yml` (node 20, `npm ci --legacy-peer-deps`, deploy Pages)

## Scripts npm

```
dev / build / preview / lint / generate-pwa-assets
```

## Pièges connus

- `BASE_URL = '/camping-cottet-viewer/'` → tout chemin public doit utiliser `import.meta.env.BASE_URL`
- `react-zoom-pan-pinch` v4 → la transformation affine est appliquée inline dans PlanSVG (utilisée pour le culling perf)
- PWA Workbox cache `data.json` → un refresh nécessite une nouvelle visite ou un skipWaiting
