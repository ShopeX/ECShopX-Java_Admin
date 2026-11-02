---
type: Application Architecture
title: Runtime Architecture and Access Model
description: How the ECShopX Vue 2 frontend starts, composes plugins, selects portal-specific routes, derives permission-aware navigation, persists session state, and sends localized authenticated API requests.
resource: /src/main.js
tags: [architecture, vue2, routing, authentication, api]
verified:
  - by: openwiki/0.5.1
    at: 2026-10-23T02:32:18.329Z
sources:
  - id: openwiki-source-5c889f1ce3b9bab3da4e12cd
    resource: repo://src/api/index.js
  - id: openwiki-source-9e9630c991da6bc3f10e57e0
    resource: repo://src/api/req.js
  - id: openwiki-source-fa36778a3966f2951adbc77a
    resource: repo://src/api/request/index.js
  - id: openwiki-source-d8bce5a0e8597805563b4ea5
    resource: repo://src/api/request/request.js
  - id: openwiki-source-4892f5697807b73d3eea088d
    resource: repo://src/bootstrap/index.js
  - id: openwiki-source-e029e977238f5e7f074140a4
    resource: repo://src/i18n/index.js
  - id: openwiki-source-72107503e1d3c3ab415a51ba
    resource: repo://src/layout/basic/layout.vue
  - id: openwiki-source-d108f687449b962ddcdaeba8
    resource: repo://src/main.js
  - id: openwiki-source-ee9e0af4abe112e497a2711b
    resource: repo://src/router/access.js
  - id: openwiki-source-013d089e0f5ad4ba71ca6c66
    resource: repo://src/router/guard.js
  - id: openwiki-source-72116f477c26dc81ac2d3df2
    resource: repo://src/router/index.js
  - id: openwiki-source-54ce442d327d1a2d570cb618
    resource: repo://src/router/routes/index.js
  - id: openwiki-source-a88294d3cdf9d5b784ea2b3e
    resource: repo://src/store/index.js
  - id: openwiki-source-c820c71ab06e1e8a94bb7cc3
    resource: repo://src/store/modules/access.js
  - id: openwiki-source-5d74a5e1ac80cfced5e3beab
    resource: repo://src/store/modules/user.js
  - id: openwiki-source-28243b984cff2b594be28ebd
    resource: repo://src/views/core/authentication/login.vue
  - id: openwiki-source-3af366d10aedd26e5b4d14f9
    resource: repo://vue.config.js
generated: { by: "openwiki/0.5.1", at: "2026-10-23T02:32:18.329Z" }
---

# Runtime Architecture and Access Model

This frontend is a Vue 2 application whose runtime behavior is controlled by four coupled boundaries: bootstrap composition, portal-aware routing, Vuex session/access state, and the shared API client. Feature work that crosses any of these boundaries must preserve their ordering and ownership rules.

## Startup and plugin composition

`src/main.js` imports the legacy language bootstrap and global styles, loads the theme composable, and then dynamically imports `src/bootstrap/index.js`. `bootstrap()` installs the API plugin before mounting the application, followed by Element UI, filters, directives, Finder, discovered components, Vue prototype helpers, clipboard, video-player support, and global Lucide icons. It mounts `App.vue` with the singleton router, store, and i18n instance, and exposes the store as `globalThis.$store`.

```mermaid
sequenceDiagram
    participant Main as main.js
    participant Theme as Theme composable
    participant Boot as bootstrap()
    participant Plugins as Vue plugins
    participant App as Vue App
    Main->>Theme: updateThemeColor()
    Main->>Boot: dynamic import and await bootstrap()
    Boot->>Plugins: install API, UI, filters, directives, components
    Boot->>App: mount with router, store, and i18n
    App->>App: render App.vue router view
```

This diagram shows the application startup ordering from `main.js` through plugin installation and the root mount.

Bootstrap also installs a document `MutationObserver` that adjusts Element UI form labels when the document is RTL. It processes existing and newly added forms when `dir="rtl"` or `lang="ar-SA"`; Arabic layout behavior is therefore part of the bootstrap contract, not only a component concern.

## Product variant and portal selection

Two independent selectors affect the running application:

- **Build-time product variant:** build tooling uses `PLATFORM` to choose the BBC or B2C `newpc` asset source. This is a delivery concern and does not choose the router’s portal.
- **Runtime portal:** `src/router/routes/index.js` examines the browser URL for `/shopadmin`, `/supplier`, or `/merchant`. It loads that portal’s route directory; URLs without one of those namespaces load the root `modules` routes. The router always starts with core routes and adds the selected dynamic route set as access routes.

The router uses HTML5 history mode and `VUE_APP_PUBLIC_PATH` as its base. A deployment under a public subpath must keep that setting aligned with the generated links and server fallback configuration.

## Authentication and access-controlled navigation

The login flow writes the token, login type, and product/menu mode into Vuex, then dispatches `user/fetchAccessMenus` and `user/fetchAccountInfo`. After those requests complete, it reloads the application root (or the license/login special case), allowing the guard to build the authenticated route table from the persisted menu tree.

The access guard runs on every navigation:

1. Without a token, it permits login/license routes and redirects protected portal paths to the matching `/{portal}/login`; root paths go to `/login`.
2. With a token, core routes bypass dynamic permission generation. For dynamic routes, the first guarded navigation calls `generateAccess()` unless `access.isAccessChecked` is already true.
3. `generateAccess()` converts leaf `alias_name` values in `user.accessMenus` into permission strings, filters the static access route tree by route metadata permissions, adds the resulting routes and a portal-prefixed fallback route, and marks access as checked.
4. An inaccessible target, or a bare `/shopadmin`, `/supplier`, or `/merchant` root, is redirected to the first router route whose metadata contains the first stored permission.
5. The guard also prevents a persisted login type from entering the wrong portal. Root paths require an admin/staff login; `/shopadmin` requires a distributor login. Supplier and merchant namespaces are selected by the route set, but the guard’s explicit mismatch check currently covers only those two conditions.

```mermaid
flowchart TD
    Start["Navigation starts"] --> Token{"Token present"}
    Token -->|"No"| Public{"Login or license route"}
    Public -->|"Yes"| Allow["Allow navigation"]
    Public -->|"No"| Portal{"Portal namespace present"}
    Portal -->|"Yes"| PortalLogin["Redirect to portal login"]
    Portal -->|"No"| RootLogin["Redirect to root login"]
    Token -->|"Yes"| Core{"Core route"}
    Core -->|"Yes"| Allow
    Core -->|"No"| Checked{"Access already checked"}
    Checked -->|"No"| Generate["Filter routes from accessMenus and add routes"]
    Generate --> CheckedAgain["Mark access checked"]
    Checked -->|"Yes"| Target["Check target accessibility"]
    CheckedAgain --> Target
    Target -->|"No or bare portal root"| First["Redirect to first permitted route"]
    Target -->|"Yes"| Allow
```

This diagram shows the guard’s authentication, dynamic route generation, portal, and fallback decisions.

`src/layout/basic/layout.vue` renders its main and submenus from `store.state.user.accessMenus`, so route metadata and the backend menu tree must remain aligned. `src/layout/authentication/auth.vue` is the authentication shell. A change to a route, menu alias, permission metadata, or login namespace should be checked against both the guard and the layout navigation.

## Vuex state and persistence lifecycle

`src/store/index.js` registers `access`, `user`, `system`, `decoration`, and `sku` modules. Vuex persistence uses `vuex-persist` with local storage key `__presist` and persists only the `user` and `system` modules. Consequently, the user token, login type, account/menu data, and system version state can survive a reload; the `access` module does not. Its `isAccessChecked` flag and derived permission list are rebuilt in memory, while the guard regenerates routes from the persisted `user.accessMenus` on the next protected navigation.

The access source is refreshed explicitly by `user/fetchAccessMenus`, which calls `api.auth.getPermission()` and commits the returned menu tree. Logout clears token, account, menu, and login-type state in the user module. The request client’s 401 path also commits `user/logout` and `system/logout` before redirecting, so changes to session cleanup must account for both explicit logout and transport failures.

```mermaid
stateDiagram-v2
    [*] --> Hydrated
    Hydrated --> Unauthenticated: no persisted token
    Hydrated --> SessionPresent: persisted user state
    Unauthenticated --> SessionPresent: login stores token and login type
    SessionPresent --> MenusLoaded: fetchAccessMenus and fetchAccountInfo
    MenusLoaded --> RoutesInjected: guard generates access routes
    RoutesInjected --> RoutesReady: access checked
    RoutesReady --> RoutesReady: navigation uses injected routes
    SessionPresent --> Unauthenticated: logout or HTTP 401
    MenusLoaded --> Unauthenticated: logout or HTTP 401
```

This lifecycle shows which state survives reload and where menu loading and route injection occur.

## Active API request boundary

`src/api/index.js` discovers the domain API modules and installs two Vue prototype entry points:

- `$api` contains generated domain methods. Each method is wrapped and returns the nested `res.data.data` value expected by callers.
- `$http` is the direct `fetch` helper from `src/api/request/index.js`.

The active `RequestClient` is created with `VUE_APP_BASE_API`, JSON content type defaults, and a 30-second timeout. Its request interceptor:

- adds `Bearer` authorization when the Vuex token exists;
- sets `Accept-Language` from the i18n country code;
- moves GET data into query parameters and removes empty-string parameters;
- converts `isUploadFile` payloads to `FormData`; and
- serializes object bodies when the caller requests `application/x-www-form-urlencoded`.

Before Axios runs, `RequestClient.request()` adds `country_code` from the stored language unless `skipCountryCode` is set. The i18n mapping intentionally distinguishes HTML language from backend country code, for example English uses `htmlLang: en` and `countryCode: en-CN`. Successful HTTP responses without an application `status_code` are accepted; responses with an application status code are rejected for the error interceptor.

```mermaid
sequenceDiagram
    participant View as View or API caller
    participant API as $api or $http
    participant Client as Active RequestClient
    participant Store as Vuex user store
    participant I18n as i18n country code
    participant Backend as Backend API
    View->>API: call domain method or fetch
    API->>Client: request with URL and data
    Client->>Store: read token
    Client->>I18n: read country code
    Client->>Client: add auth, language, country, and body transforms
    Client->>Backend: Axios request
    Backend-->>Client: HTTP response
    Client-->>API: response or rejected error
    API-->>View: unwrapped domain data or error
```

This diagram shows the active request boundary and the state reads performed before transport.

For a 401, the active client derives the login path from the current router path, shows an expiration warning, clears user and system modules, and replaces the matching root or portal login after two seconds. The token-refresh queue remains commented out, so the current behavior is logout and redirect, not automatic refresh. Network and timeout errors can show localized messages; individual requests can set `showError: false` to suppress the default error toast.

`src/api/req.js` is a legacy or alternate Axios wrapper with different response unwrapping, timeout, token-expiration, and login-path behavior. Direct callers still exist, so it must not be silently treated as equivalent to the active `src/api/request/` plugin path when changing request behavior.

## Internationalization and RTL effects

`src/i18n/index.js` defines Chinese Simplified, Chinese Traditional, English, Arabic, Japanese, and Russian configurations. It restores the language key from local storage, sets Vue I18n’s locale, and updates the document `lang` and `dir`. `getCurrentCountryCode()` is the shared backend country-code source used by the active request client. New language work therefore requires a locale configuration, message bundle, document-direction check, and request-country-code check. Arabic additionally exercises the bootstrap form-label observer.

## Safe change checklist

- Route changes: identify the build variant and runtime portal, then verify route metadata, `alias_name` values, layout menus, fallback routing, and public-path deployment.
- Authentication changes: verify token/menu persistence, login-type mismatch handling, all portal login redirects, explicit logout, and active-client 401 behavior.
- API changes: use the active `$api`/`$http` boundary unless a legacy caller is intentionally being migrated; preserve GET, upload, form encoding, `country_code`, `Accept-Language`, and `showError` semantics.
- State changes: decide whether data belongs in persisted `user`/`system` state or transient `access` state, and clear it on both explicit logout and transport failure where appropriate.
- Localization changes: update all locale bundles and verify both LTR and Arabic RTL rendering plus backend country-code propagation.
