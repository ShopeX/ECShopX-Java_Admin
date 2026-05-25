# Home Decoration Admin Design

**Date:** 2026-04-08
**Status:** Approved

## Goal

Rebuild the existing home template editor into a new admin-side decoration editor with a three-column layout, a real PC iframe preview, a new DSL as the source of truth, and adapter-based persistence hooks for later backend integration.

## Confirmed Scope

- Rebuild the current edit entry instead of creating a parallel page
- Use `.env` `VUE_APP_WEBSITE` as the preview site origin
- Only support home page template editing in the first iteration
- Use the new DSL as the internal and persisted data model
- Leave backend API integration as an adapter seam for later work

## Editor Architecture

The new editor will be implemented as a standalone module under `src/components/DecorationEditor/` and mounted by the existing route page at `src/view/decorate/index.vue`.

The editor is split into three areas:

- Left: component library and structure tree
- Center: PC mall iframe preview
- Right: section-specific configuration panel

The editor state is stored in a dedicated Vuex module so selection state, DSL data, and save state remain stable across nested components.

## Data Model

The editor uses a new DSL and treats it as the only source of truth:

```js
{
  pageType: 'home',
  pageId: '<templateId>',
  sections: {
    'carousel-ab12cd': {
      id: 'carousel-ab12cd',
      type: 'carousel',
      title: '轮播图',
      disabled: false,
      settings: {},
      blocks: {},
      blockOrder: []
    }
  },
  order: ['carousel-ab12cd'],
  meta: {
    version: 1,
    scene: '1001'
  }
}
```

First iteration section types:

- `carousel`
- `image-hotspot`
- `product-shelf`

## UI Composition

`DecorationEditor/index.vue` orchestrates the page-level experience:

- top bar for back and save actions
- left structure panel for selection, add, delete, duplicate, and sorting
- center preview canvas for iframe loading and message sync
- right config panel for editing the selected section

Section behavior is configuration-driven through a registry instead of hard-coded branching.

## Preview Integration

The preview iframe URL is derived from `process.env.VUE_APP_WEBSITE`.

Home preview URL shape:

```txt
${VUE_APP_WEBSITE}/?designMode=1&pageType=home&pageId=<templateId>
```

The iframe is wired with a minimal postMessage protocol:

- admin -> preview: `DECORATION_INIT`
- admin -> preview: `DECORATION_UPDATE`
- preview -> admin: `PREVIEW_READY`
- preview -> admin: `SECTION_FOCUSED`

The editor sends the full DSL payload after the preview is ready, then sends debounced updates on every edit. Incoming preview messages are origin-checked against the `VUE_APP_WEBSITE` origin.

## Persistence Boundary

Backend integration is intentionally isolated behind adapters:

- `loadHomeDecoration({ templateId })`
- `saveHomeDecoration({ templateId, dsl })`

This iteration only defines and uses the adapter contract. Real API endpoints and payload mapping can be connected later without rewriting the editor flow.

## Component Strategy

The new editor does not reuse the old generic `attr_panel` as the main editing surface. Instead it uses small focused panel components:

- `CarouselPanel.vue`
- `ImageHotspotPanel.vue`
- `ProductShelfPanel.vue`

This keeps the new DSL clean and avoids coupling the rewrite back to the legacy widget parameter model.

## Delivery Strategy

The implementation will:

1. Build the new editor foundation and DSL utilities
2. Add Vuex state for editor data and selection
3. Add iframe preview and postMessage synchronization
4. Implement the three first section types and their config panels
5. Mount the new editor at the current home template edit entry
6. Leave save/load adapters ready for future API wiring
