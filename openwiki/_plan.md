---
type: Documentation Plan
title: ECShopX Admin Wiki Update Plan
description: Temporary plan for refreshing the ECShopX Admin OpenWiki pages from repository source evidence and recent release history.
tags: [plan, openwiki, documentation]
---

# Plan

## Intended pages

1. `/openwiki/quickstart.md`
   - Evidence: `/README.md`, `/package.json`, `src/main.js`, `src/router/index.js`, `src/store/index.js`, `src/store/getters.js`, recent release history.
   - Purpose: entry point, navigation, repo shape, guardrails, backlog.

2. `/openwiki/architecture/overview.md`
   - Evidence: `src/main.js`, `src/App.vue`, `src/router/index.js`, `src/router/guard.js`, `src/router/access.js`, `src/store/index.js`, `src/store/modules/user.js`, `src/store/modules/access.js`, `src/bootstrap/`.
   - Purpose: runtime bootstrap, portal routing, Vuex persistence, theme loading, and API/auth boundary.

3. `/openwiki/workflows/commerce-admin.md`
   - Evidence: `src/view/`, `src/views/`, `src/api/`, `src/router/routes/`, `src/store/modules/*`.
   - Purpose: explain major business areas and how screens map to APIs and route ownership.

4. `/openwiki/workflows/change-guide.md`
   - Evidence: `README.md`, `src/i18n/`, `src/router/guard.js`, `src/router/access.js`, `src/api/request/`, `build/update_i18n_from_excel.js`.
   - Purpose: safe change path for features, locale updates, and portal-aware edits.

5. `/openwiki/operations/build-and-delivery.md`
   - Evidence: `package.json`, `README.md`, `vue.config.js`, `Dockerfile`, `docker/nginx-default.conf`.
   - Purpose: build variants, env configuration, and delivery packaging.

6. `/openwiki/operations/integrations-and-quality.md`
   - Evidence: `src/api/`, `src/store/modules/*`, `.husky/`, `commitlint.config.js`, `scripts/`, `.github/workflows/`, `package.json` scripts.
   - Purpose: integration boundary and the checks actually available in-repo.

7. `/openwiki/source-map.md`
   - Evidence: `src/`, `package.json`, `README.md`.
   - Purpose: concise navigator linking source areas to the canonical concept pages.

## Evidence-backed relationships

- `src/main.js` -> bootstraps -> `architecture/overview.md`
- `src/router/index.js` -> enforces base path and guards -> `architecture/overview.md`
- `src/store/index.js` -> persists user/system state -> `architecture/overview.md`
- `README.md` -> documents build-time environment variables -> `operations/build-and-delivery.md`
- `src/i18n/` -> supports localized UI copy -> `workflows/change-guide.md`
- `src/api/` -> backs commerce screens -> `workflows/commerce-admin.md`
- `package.json` scripts -> define variant builds and local dev -> `operations/build-and-delivery.md`
- `commitlint` / `husky` / `lint-staged` -> protect code changes -> `operations/integrations-and-quality.md`
- `src/view/` and `src/views/` -> contain feature ownership -> `workflows/commerce-admin.md`

## Remaining questions

- The repo root is large and some feature ownership is still inferred from directory structure rather than every leaf screen; document that at the directory level instead of overcommitting on individual pages.
- No dedicated test runner is declared in `package.json`; the quality page should call that out as an observed gap rather than speculate about external CI.
