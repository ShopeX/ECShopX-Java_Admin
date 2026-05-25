# Home Decoration Admin Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the current home template edit page with a new three-column decoration editor that uses a new DSL, Vuex state, and a real PC iframe preview driven by `VUE_APP_WEBSITE`.

**Architecture:** Build a standalone `DecorationEditor` module and mount it from the existing `src/view/decorate/index.vue` route entry. Keep backend persistence behind adapters, use Vuex for editor state, and make iframe preview synchronization run through a focused postMessage utility.

**Tech Stack:** Vue 2, Vuex 3, Element UI, vuedraggable, existing admin router/env setup

---

### Task 1: Scaffold the new editor foundation

**Files:**
- Create: `src/components/DecorationEditor/index.vue`
- Create: `src/components/DecorationEditor/index.scss`
- Create: `src/components/DecorationEditor/registry.js`
- Create: `src/components/DecorationEditor/utils/nanoid.js`
- Create: `src/components/DecorationEditor/utils/dsl.js`
- Create: `src/components/DecorationEditor/utils/postMessage.js`

**Step 1: Write the failing utility checks**

Create focused executable checks for the pure utility layer in temporary node scripts or repo tests so ID generation, default DSL creation, and message payload builders can be verified before the editor shell is wired.

**Step 2: Run the checks to confirm failure**

Run the focused utility check command and confirm the new files are missing.

**Step 3: Implement the minimal utility layer**

Add:

- nanoid-based ID helpers
- default home DSL factory
- section insert, update, delete, duplicate, and reorder helpers
- preview message creator helpers with origin-safe contracts
- a component registry for `carousel`, `image-hotspot`, and `product-shelf`

**Step 4: Run the utility checks again**

Verify the pure helpers now pass the focused checks.

**Step 5: Commit**

```bash
git add src/components/DecorationEditor
git commit -m "feat(decoration): scaffold editor foundation"
```

### Task 2: Add Vuex decoration state

**Files:**
- Create: `src/store/modules/decoration.js`
- Modify: `src/store/index.js`

**Step 1: Write the failing state checks**

Define focused checks for the store module covering:

- loading a full DSL
- selecting a section
- inserting a section
- updating section settings
- deleting or duplicating a section
- save state flags

**Step 2: Run the checks to confirm failure**

Run the focused module checks and confirm the `decoration` module does not yet exist.

**Step 3: Implement the store module**

Add a `decoration` Vuex module with:

- `pageType`
- `pageId`
- `dsl`
- `selectedSectionId`
- `isPreviewReady`
- `isSaving`

Include mutations and actions only for the first iteration scope.

**Step 4: Run the checks again**

Verify the store behavior passes the focused checks.

**Step 5: Commit**

```bash
git add src/store/modules/decoration.js src/store/index.js
git commit -m "feat(decoration): add editor vuex module"
```

### Task 3: Build the three-column shell

**Files:**
- Modify: `src/components/DecorationEditor/index.vue`
- Modify: `src/components/DecorationEditor/index.scss`
- Create: `src/components/DecorationEditor/components/StructurePanel.vue`
- Create: `src/components/DecorationEditor/components/PreviewCanvas.vue`
- Create: `src/components/DecorationEditor/components/ConfigPanel.vue`

**Step 1: Write the failing shell checks**

Define focused render checks for the editor shell:

- left structure panel is present
- center preview canvas is present
- right config panel is present
- top action bar renders back and save actions

**Step 2: Run the checks to confirm failure**

Run the focused shell checks and confirm the components do not exist.

**Step 3: Implement the shell**

Create the three-column layout and wire child component props/events so the root editor can:

- read state from Vuex
- dispatch DSL mutations
- send save events
- hold current template metadata from the route query

**Step 4: Run the checks again**

Verify the shell renders and receives expected props.

**Step 5: Commit**

```bash
git add src/components/DecorationEditor
git commit -m "feat(decoration): add editor shell layout"
```

### Task 4: Implement iframe preview synchronization

**Files:**
- Modify: `src/components/DecorationEditor/components/PreviewCanvas.vue`
- Modify: `src/components/DecorationEditor/utils/postMessage.js`

**Step 1: Write the failing preview checks**

Cover:

- preview URL uses `process.env.VUE_APP_WEBSITE`
- `DECORATION_INIT` is sent after `PREVIEW_READY`
- `DECORATION_UPDATE` is sent after DSL changes
- only allowed origins are processed
- `SECTION_FOCUSED` updates editor selection

**Step 2: Run the checks to confirm failure**

Verify the preview synchronization behavior does not yet exist.

**Step 3: Implement preview messaging**

Build `PreviewCanvas.vue` so it:

- parses the preview origin from `VUE_APP_WEBSITE`
- builds the home preview URL from `templateId`
- waits for `PREVIEW_READY`
- sends the full DSL on init and update
- emits focus events back to the editor

**Step 4: Run the checks again**

Verify the preview contract works for the first iteration.

**Step 5: Commit**

```bash
git add src/components/DecorationEditor/components/PreviewCanvas.vue src/components/DecorationEditor/utils/postMessage.js
git commit -m "feat(decoration): add iframe preview messaging"
```

### Task 5: Implement structure editing flows

**Files:**
- Modify: `src/components/DecorationEditor/components/StructurePanel.vue`
- Modify: `src/components/DecorationEditor/index.vue`
- Modify: `src/components/DecorationEditor/utils/dsl.js`
- Modify: `src/components/DecorationEditor/registry.js`

**Step 1: Write the failing interaction checks**

Cover:

- add section from the library
- select section from the structure list
- reorder sections
- duplicate section
- delete section

**Step 2: Run the checks to confirm failure**

Verify the structure panel is still static.

**Step 3: Implement the interaction flows**

Use the registry and DSL helpers to power:

- add menu or button for three first section types
- draggable structure list
- selection/highlight behavior
- duplicate and delete actions

**Step 4: Run the checks again**

Verify the first iteration structure editing flow works.

**Step 5: Commit**

```bash
git add src/components/DecorationEditor
git commit -m "feat(decoration): add structure editing flows"
```

### Task 6: Add section configuration panels

**Files:**
- Create: `src/components/DecorationEditor/panels/CarouselPanel.vue`
- Create: `src/components/DecorationEditor/panels/ImageHotspotPanel.vue`
- Create: `src/components/DecorationEditor/panels/ProductShelfPanel.vue`
- Modify: `src/components/DecorationEditor/components/ConfigPanel.vue`
- Modify: `src/components/DecorationEditor/registry.js`

**Step 1: Write the failing panel checks**

Cover:

- correct panel renders for selected section type
- editing panel fields updates section settings
- panel empty state renders when no section is selected

**Step 2: Run the checks to confirm failure**

Verify the panel switch logic is incomplete.

**Step 3: Implement the panels**

Build minimal first-iteration settings:

- `carousel`: title, autoplay, height, image list placeholder fields
- `image-hotspot`: title, image URL, hotspot list placeholder fields
- `product-shelf`: title, source mode, item IDs/category, columns, limit

**Step 4: Run the checks again**

Verify the panels switch correctly and update the DSL.

**Step 5: Commit**

```bash
git add src/components/DecorationEditor
git commit -m "feat(decoration): add first section config panels"
```

### Task 7: Add load/save adapters and mount the new page

**Files:**
- Create: `src/components/DecorationEditor/adapters/homeDecoration.js`
- Modify: `src/view/decorate/index.vue`
- Optionally Modify: `src/view/decorate/index.scss`

**Step 1: Write the failing integration checks**

Cover:

- route query `id` is passed into the new editor
- editor loads a default home DSL when no saved data is returned
- save action calls the adapter with `{ templateId, dsl }`

**Step 2: Run the checks to confirm failure**

Verify the legacy page is still mounted.

**Step 3: Implement the adapter seam and page mount**

Replace the legacy edit page contents with a wrapper that mounts `DecorationEditor`, reads the route query, and calls the adapter for initial load and save.

The adapter should expose explicit TODO boundaries for later backend wiring instead of embedding API assumptions into the editor.

**Step 4: Run the checks again**

Verify the new editor opens from the existing home template route and can run the load/save flow with placeholders.

**Step 5: Commit**

```bash
git add src/view/decorate/index.vue src/components/DecorationEditor/adapters/homeDecoration.js
git commit -m "feat(decoration): mount new home decoration editor"
```

### Task 8: Verify and clean up

**Files:**
- Review: `src/components/DecorationEditor/**`
- Review: `src/store/modules/decoration.js`
- Review: `src/view/decorate/index.vue`

**Step 1: Run focused verification**

Run the narrowest available verification for the changed surface first, then run project-level checks that are realistic in this repo.

Suggested commands:

```bash
npm run eslint
npm run build:b2c
```

**Step 2: Fix any failures**

Resolve lint, compile, import, or runtime shape issues without expanding scope.

**Step 3: Re-run verification**

Confirm the final changed surface passes the selected checks.

**Step 4: Commit**

```bash
git add src/components/DecorationEditor src/store/modules/decoration.js src/store/index.js src/view/decorate/index.vue docs/plans
git commit -m "feat(decoration): deliver new home decoration editor"
```

Plan complete and saved to `docs/plans/2026-04-08-home-decoration-admin-implementation.md`.

Execution note: subagent-driven execution is not available unless you explicitly want delegated agents. I can continue locally in this session and implement the plan step by step.
