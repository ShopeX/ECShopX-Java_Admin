const assert = require('assert')
const fs = require('fs')
const path = require('path')

const {
  getInitialEditorSelection
} = require('../../src/components/sp-web-decoration/definitions/selection')
const { createGlobalDsl } = require('../../src/components/sp-web-decoration/utils/dsl')
const {
  createGlobalSections
} = require('../../src/components/sp-web-decoration/definitions/documents/global')

const emptySection = (type) => ({
  type,
  title: '',
  disabled: false,
  settings: {},
  blocks: {},
  blockOrder: []
})

const createTestHomeDsl = () => ({
  pageType: 'home',
  pageId: 't1',
  sections: {},
  order: [],
  meta: { version: 1, scene: '1001' }
})

function testPrefersHeaderWhenPresent() {
  const globalDsl = createGlobalDsl(createGlobalSections())
  const dsl = createTestHomeDsl()
  dsl.order = ['sec-carousel']
  dsl.sections['sec-carousel'] = emptySection('carousel')

  const sel = getInitialEditorSelection({ dsl, globalDsl })
  assert.strictEqual(sel.selectedSectionId, 'header')
  assert.strictEqual(sel.editingScope, 'global')
}

function testFooterWhenNoHeaderSection() {
  const globalDsl = createGlobalDsl({})
  globalDsl.sections = {
    footer: emptySection('footer')
  }
  globalDsl.order = ['footer']

  const dsl = createTestHomeDsl()
  const sel = getInitialEditorSelection({ dsl, globalDsl })
  assert.strictEqual(sel.selectedSectionId, 'footer')
}

function testCarouselWhenNoGlobalHeaderFooter() {
  const globalDsl = createGlobalDsl({})
  globalDsl.sections = {}
  globalDsl.order = []

  const dsl = createTestHomeDsl()
  dsl.order = ['a', 'b']
  dsl.sections.a = emptySection('product-shelf')
  dsl.sections.b = emptySection('carousel')

  const sel = getInitialEditorSelection({ dsl, globalDsl })
  assert.strictEqual(sel.selectedSectionId, 'b')
  assert.strictEqual(sel.editingScope, 'page')
}

function testMainCarouselSectionTypeMatchesSelection() {
  const globalDsl = createGlobalDsl({})
  globalDsl.sections = {}
  globalDsl.order = []

  const dsl = createTestHomeDsl()
  dsl.order = ['main-carousel-b84OOB']
  dsl.sections['main-carousel-b84OOB'] = emptySection('main-carousel')

  const sel = getInitialEditorSelection({ dsl, globalDsl })
  assert.strictEqual(sel.selectedSectionId, 'main-carousel-b84OOB')
  assert.strictEqual(sel.editingScope, 'page')
}

function testProductShelfBeforeImageHotspot() {
  const globalDsl = createGlobalDsl({})
  globalDsl.sections = {}
  globalDsl.order = []

  const dsl = createTestHomeDsl()
  dsl.order = ['hot', 'shelf']
  dsl.sections.hot = emptySection('image-hotspot')
  dsl.sections.shelf = emptySection('product-shelf')

  const sel = getInitialEditorSelection({ dsl, globalDsl })
  assert.strictEqual(sel.selectedSectionId, 'shelf')
}

function testFallbackFirstOrder() {
  const globalDsl = createGlobalDsl({})
  globalDsl.sections = {}
  globalDsl.order = []

  const dsl = createTestHomeDsl()
  dsl.order = ['only']
  dsl.sections.only = emptySection('custom-x')

  const sel = getInitialEditorSelection({ dsl, globalDsl })
  assert.strictEqual(sel.selectedSectionId, 'only')
}

function testImageHotspotWhenNoHigherPriorityPageSection() {
  const globalDsl = createGlobalDsl({})
  globalDsl.sections = {}
  globalDsl.order = []

  const dsl = createTestHomeDsl()
  dsl.order = ['ban']
  dsl.sections.ban = emptySection('image-hotspot')

  const sel = getInitialEditorSelection({ dsl, globalDsl })
  assert.strictEqual(sel.selectedSectionId, 'ban')
  assert.strictEqual(sel.editingScope, 'page')
}

function testSelectionRulesAreDefined() {
  const rulesPath = path.resolve(
    __dirname,
    '../../src/components/sp-web-decoration/definitions/selection.js'
  )
  assert.ok(fs.existsSync(rulesPath), 'selection rules should exist')
  const { selectionManifest, selectionRules } = require(rulesPath)
  assert.ok(Array.isArray(selectionManifest.ruleOrder) && selectionManifest.ruleOrder.length >= 5)
  selectionManifest.ruleOrder.forEach((key) => {
    assert.ok(selectionRules[key], `selection rule expected: ${key}`)
  })
  assert.strictEqual(selectionRules.fallback.strategy, 'firstPageSectionInOrder')
}

function run() {
  testSelectionRulesAreDefined()
  testPrefersHeaderWhenPresent()
  testFooterWhenNoHeaderSection()
  testCarouselWhenNoGlobalHeaderFooter()
  testMainCarouselSectionTypeMatchesSelection()
  testProductShelfBeforeImageHotspot()
  testImageHotspotWhenNoHigherPriorityPageSection()
  testFallbackFirstOrder()
  console.log('initial-editor-selection.test.js passed')
}

run()
