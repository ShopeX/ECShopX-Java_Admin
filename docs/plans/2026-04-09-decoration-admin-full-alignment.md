# Decoration Admin Full Alignment Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Align the Vue2 decoration admin with the confirmed 2026-03-28 design docs, including global header/footer, block-based DSL, structure-tree block interactions, and save-scope separation.

**Architecture:** Keep the current `src/view/decorate/index.vue` entry and `src/components/DecorationEditor/` shell, but normalize all editable sections onto the original `sections + blocks + blockOrder` model. The Vuex module remains the single source of truth; the left tree, right config panel, and iframe preview all read from the same page/global DSL state and selection model.

**Tech Stack:** Vue 2, Vuex 3, Element UI, vuedraggable, plain node-based test scripts, ESLint

---

### Task 1: Lock the missing behavior with failing tests

**Files:**
- Modify: `tests/decoration/foundation.test.js`
- Modify: `tests/decoration/store.test.js`

**Step 1: Write the failing DSL tests**

- Assert `carousel` and `image-hotspot` default sections start with `blocks` plus `blockOrder`, not array data inside `settings`.
- Assert duplicated sections preserve block data but use independent section IDs.
- Assert preview composition keeps `header -> page sections -> footer` ordering.

**Step 2: Run the focused tests to verify RED**

Run: `node tests/decoration/foundation.test.js`
Expected: FAIL because section defaults and DSL helpers still use the old array-in-settings model.

**Step 3: Write the failing store tests**

- Assert selecting a block updates `selectedBlockId`.
- Assert adding, removing, updating, and reordering blocks works for both page sections and global header/footer.
- Assert current block lookup follows the active section selection.

**Step 4: Run the focused tests to verify RED**

Run: `node tests/decoration/store.test.js`
Expected: FAIL because block-level mutations/getters are incomplete or missing.

### Task 2: Normalize registry and DSL helpers to the original block model

**Files:**
- Modify: `src/components/DecorationEditor/registry.js`
- Modify: `src/components/DecorationEditor/utils/dsl.js`

**Step 1: Implement section definitions with block metadata**

- Add block definitions for `carousel` image blocks and `image-hotspot` hotspot blocks.
- Keep `product-shelf` blockless.
- Preserve header/footer as global fixed sections.

**Step 2: Implement minimal DSL helpers**

- Add helpers to create default blocks from registry metadata.
- Add immutable helpers for `addBlock`, `removeBlock`, `updateBlockSettings`, and `replaceBlockOrder`.
- Keep naming consistent with current codebase (`blockOrder`) unless API adapters explicitly convert to `block_order`.

**Step 3: Re-run focused foundation tests**

Run: `node tests/decoration/foundation.test.js`
Expected: PASS

### Task 3: Extend the Vuex module to fully support block-level editing

**Files:**
- Modify: `src/store/modules/decoration.js`

**Step 1: Implement failing store behaviors minimally**

- Add `currentBlock` getter.
- Add mutations for `addBlock`, `removeBlock`, `updateSelectedBlockSettings`, `replaceBlockOrder`, and any selection resets required by the design.
- Route page/global mutations through the correct DSL scope.

**Step 2: Re-run focused store tests**

Run: `node tests/decoration/store.test.js`
Expected: PASS

### Task 4: Bring the structure tree up to the design-doc interaction model

**Files:**
- Modify: `src/components/DecorationEditor/components/StructurePanel.vue`
- Modify: `src/components/DecorationEditor/index.vue`

**Step 1: Write the failing structure-tree tests**

- Extend an existing test file or add a new one under `tests/decoration/` to assert:
  - header/footer render as fixed groups
  - page sections render nested block rows
  - clicking a block emits block selection
  - block reorder emits a block-order payload
  - add-block actions are shown only when the section supports blocks

**Step 2: Run the structure-tree tests to verify RED**

Run: `node tests/decoration/<new-structure-test>.js`
Expected: FAIL

**Step 3: Implement the tree**

- Render nested block rows for header, footer, carousel, and image-hotspot sections.
- Add per-section “add block” affordances using registry block definitions.
- Emit `select-block` and `reorder-blocks` events.

**Step 4: Re-run the structure-tree tests**

Run: `node tests/decoration/<new-structure-test>.js`
Expected: PASS

### Task 5: Align the right config panel with section/block selection

**Files:**
- Modify: `src/components/DecorationEditor/components/ConfigPanel.vue`
- Modify: `src/components/DecorationEditor/panels/CarouselPanel.vue`
- Modify: `src/components/DecorationEditor/panels/ImageHotspotPanel.vue`
- Modify: `src/components/DecorationEditor/panels/HeaderPanel.vue`
- Modify: `src/components/DecorationEditor/panels/FooterPanel.vue`

**Step 1: Write the failing config-panel tests**

- Assert section selection shows the section-level form.
- Assert block selection switches to the selected block form/content.
- Assert panel edits emit the correct section/block update events.

**Step 2: Run the config-panel tests to verify RED**

Run: `node tests/decoration/<new-config-test>.js`
Expected: FAIL

**Step 3: Implement panel switching**

- Pass both `section` and `block` context into `ConfigPanel`.
- Keep page-section settings separate from block settings.
- For now, reuse the same panel component where practical, but ensure block edits only touch block settings.

**Step 4: Re-run the config-panel tests**

Run: `node tests/decoration/<new-config-test>.js`
Expected: PASS

### Task 6: Wire save/load and preview payloads through the aligned editor state

**Files:**
- Modify: `src/view/decorate/index.vue`
- Modify: `src/components/DecorationEditor/components/PreviewCanvas.vue`
- Modify: `src/components/DecorationEditor/adapters/homeDecoration.js`

**Step 1: Keep save-scope separation intact**

- Save global DSL when `editingScope === 'global'`.
- Save page DSL otherwise.
- Ensure preview always receives the merged active DSL.

**Step 2: Add any missing focused tests if behavior changes**

Run: `node tests/decoration/adapter.test.js`
Expected: PASS

### Task 7: Verification

**Files:**
- Modify if needed: `src/i18n/locales/zh-CN.json`
- Modify if needed: `src/i18n/locales/en.json`
- Modify if needed: `src/i18n/locales/ar.json`

**Step 1: Run all focused tests**

Run:
- `node tests/decoration/foundation.test.js`
- `node tests/decoration/store.test.js`
- `node tests/decoration/adapter.test.js`
- `node tests/decoration/<new-structure-test>.js`
- `node tests/decoration/<new-config-test>.js`

Expected: PASS

**Step 2: Run lint**

Run: `./node_modules/.bin/eslint --ext .js,.vue src/components/DecorationEditor src/view/decorate/index.vue src/store/modules/decoration.js`
Expected: PASS

**Step 3: Run production build**

Run: `npm run build:b2c`
Expected: PASS with only existing non-blocking size warnings if unchanged.

### Task 8: Align the editor shell layout to the confirmed reference image

**Files:**
- Modify: `src/components/DecorationEditor/index.vue`
- Modify: `src/components/DecorationEditor/index.scss`
- Modify: `src/components/DecorationEditor/components/StructurePanel.vue`
- Modify: `src/components/DecorationEditor/components/PreviewCanvas.vue`
- Modify: `src/components/DecorationEditor/components/ConfigPanel.vue`

**Step 1: Lock the expected shell hierarchy**

- Keep the existing interaction model and DSL wiring unchanged.
- Treat the shell as a three-column workbench with a thin top bar: left structure tree, center canvas, right inspector.
- Remove the permanent component-library presentation from the left rail and keep insert actions contextual.

**Step 2: Implement the shared shell styling**

- Replace the current rounded-card dashboard look with flatter workspace chrome.
- Narrow the sidebars, reduce header height, and make the preview area visually dominate the page.
- Preserve responsive fallback for narrower viewports.

**Step 3: Tighten per-panel internals**

- Make the structure tree resemble a navigation rail instead of stacked cards.
- Make the right config panel read like an inspector with compact spacing.
- Reduce preview chrome so the iframe stage reads like the main focus.

**Step 4: Re-run focused verification**

Run:
- `node tests/decoration/insert-picker.test.js`
- `node tests/decoration/store.test.js`
- `./node_modules/.bin/eslint --ext .js,.vue src/components/DecorationEditor src/view/decorate/index.vue src/store/modules/decoration.js`

Expected: PASS
