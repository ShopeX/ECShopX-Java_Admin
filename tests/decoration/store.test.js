const assert = require('assert')

const decorationStoreModule = require('../../src/store/modules/decoration')
const decorationStore = decorationStoreModule.default || decorationStoreModule

function createState() {
  return decorationStore.state()
}

function testInitializeEditor() {
  const state = createState()
  const payload = {
    pageType: 'home',
    pageId: '12',
    dsl: {
      pageType: 'home',
      pageId: '12',
      sections: {},
      order: [],
      meta: { version: 1, scene: '1001' }
    }
  }
  decorationStore.mutations.initializeEditor(state, payload)
  assert.strictEqual(state.pageId, '12')
  assert.strictEqual(state.dsl.pageType, 'home')
  assert.strictEqual(state.headerDsl.order.length, 2)
  assert.strictEqual(state.headerDsl.order[1], 'header')
  assert.strictEqual(state.headerDsl.sections[state.headerDsl.order[0]].type, 'announcement-bar')
  assert.deepStrictEqual(state.footerDsl.order, ['footer'])
  assert.deepStrictEqual(state.expandedSectionIds, [])
}

function testInitializeEditorBackfillsMissingHeaderDsl() {
  const state = createState()
  decorationStore.mutations.initializeEditor(state, {
    pageType: 'home',
    pageId: '12',
    dsl: {
      pageType: 'home',
      pageId: '12',
      sections: {},
      order: [],
      meta: { version: 1, scene: '1001' }
    },
    globalDsl: {
      pageType: 'global',
      pageId: 'global',
      sections: {
        footer: { type: 'footer', settings: { copyright: '2026' }, blocks: {}, blockOrder: [] }
      },
      order: ['footer']
    }
  })

  assert.strictEqual(state.headerDsl.sections.header.type, 'header')
  assert.strictEqual(state.headerDsl.sections.header.settings.menu, 'main-menu')
  assert.deepStrictEqual(state.headerDsl.sections.header.blockOrder, [])
  assert.deepStrictEqual(state.footerDsl.order, ['footer'])
  assert.strictEqual(state.selectedSectionId, 'header')
  assert.strictEqual(state.editingScope, 'global')
}

function testSectionActions() {
  const state = createState()
  decorationStore.mutations.addSection(state, { type: 'main-carousel' })
  assert.strictEqual(state.dsl.order.length, 2)
  const sectionId = state.dsl.order[0]
  const initialBlockId = state.dsl.sections[sectionId].blockOrder[0]

  decorationStore.mutations.setSelectedSectionId(state, sectionId)
  assert.strictEqual(state.selectedSectionId, sectionId)

  decorationStore.mutations.updateSelectedSectionSettings(state, { autoplay: false })
  assert.strictEqual(state.dsl.sections[sectionId].settings.autoplay, false)

  decorationStore.mutations.selectBlock(state, { sectionId, blockId: initialBlockId })
  assert.strictEqual(state.selectedBlockId, initialBlockId)

  decorationStore.mutations.updateSelectedBlockSettings(state, {
    imageUrl: 'https://cdn.example.com/banner.png'
  })
  assert.strictEqual(
    state.dsl.sections[sectionId].blocks[initialBlockId].settings.imageUrl,
    'https://cdn.example.com/banner.png'
  )

  decorationStore.mutations.addBlock(state, { sectionId, blockType: 'image' })
  assert.strictEqual(state.dsl.sections[sectionId].blockOrder.length, 4)

  const nextOrder = state.dsl.sections[sectionId].blockOrder.slice().reverse()
  decorationStore.mutations.replaceBlockOrder(state, { sectionId, blockOrder: nextOrder })
  assert.deepStrictEqual(state.dsl.sections[sectionId].blockOrder, nextOrder)

  decorationStore.mutations.duplicateSection(state, sectionId)
  assert.strictEqual(state.dsl.order.length, 2)

  const extraBlockId = state.dsl.sections[sectionId].blockOrder.find(
    (blockId) => blockId !== initialBlockId
  )
  decorationStore.mutations.removeBlock(state, { sectionId, blockId: extraBlockId })
  assert.strictEqual(state.dsl.sections[sectionId].blockOrder.length, 3)

  decorationStore.mutations.removeSection(state, sectionId)
  assert.strictEqual(state.dsl.order.length, 1)
}

function testGlobalSelectionAndPreviewDsl() {
  const state = createState()
  const annId = state.headerDsl.order.find((id) => id !== 'header')
  assert.ok(annId)
  decorationStore.mutations.selectSection(state, annId)
  assert.strictEqual(state.selectedSectionId, annId)
  assert.strictEqual(state.editingScope, 'global')

  const announcementBlockId = state.headerDsl.sections[annId].blockOrder[0]
  decorationStore.mutations.selectBlock(state, {
    sectionId: annId,
    blockId: announcementBlockId
  })
  assert.strictEqual(state.editingScope, 'global')
  assert.strictEqual(
    decorationStore.getters.currentBlock(state, {
      currentSection: decorationStore.getters.currentSection(state)
    }).type,
    'announcement'
  )

  decorationStore.mutations.selectSection(state, 'header')
  assert.strictEqual(state.selectedSectionId, 'header')
  assert.strictEqual(state.editingScope, 'global')

  decorationStore.mutations.updateSelectedSectionSettings(state, {
    logoUrl: 'https://cdn.example.com/logo.png'
  })
  assert.strictEqual(
    state.headerDsl.sections.header.settings.logoUrl,
    'https://cdn.example.com/logo.png'
  )

  const headerBlockId = state.headerDsl.sections.header.blockOrder[0]
  decorationStore.mutations.selectBlock(state, { sectionId: 'header', blockId: headerBlockId })
  assert.strictEqual(state.editingScope, 'global')
  assert.strictEqual(
    decorationStore.getters.currentBlock(state, {
      currentSection: decorationStore.getters.currentSection(state)
    }).type,
    'header_product_list'
  )

  decorationStore.mutations.addSection(state, { type: 'main-carousel' })
  const previewDsl = decorationStore.getters.activeDsl(state)
  assert.deepStrictEqual(previewDsl.order, ['header', annId, state.dsl.order[0], 'footer'])

  decorationStore.mutations.addGlobalSection(state, 'announcement-bar')
  assert.strictEqual(
    state.headerDsl.order.filter(
      (sectionId) => state.headerDsl.sections[sectionId]?.type === 'announcement-bar'
    ).length,
    2
  )
}

function testFlags() {
  const state = createState()
  decorationStore.mutations.setPreviewReady(state, true)
  decorationStore.mutations.setSaving(state, true)
  assert.strictEqual(state.isPreviewReady, true)
  assert.strictEqual(state.isSaving, true)
}

function testAddGlobalSectionUsesRequestedIndex() {
  const state = createState()
  decorationStore.mutations.initializeEditor(state, {
    pageType: 'home',
    pageId: '12',
    dsl: {
      pageType: 'home',
      pageId: '12',
      sections: {},
      order: [],
      meta: { version: 1, scene: '1001' }
    }
  })

  decorationStore.mutations.addGlobalSection(state, {
    type: 'announcement-bar',
    index: 1
  })

  assert.strictEqual(state.headerDsl.order[0], 'header')
  assert.strictEqual(state.headerDsl.order.length, 2)
  assert.notStrictEqual(state.headerDsl.order[1], 'header')
}

function testExpandedSections() {
  const state = createState()
  decorationStore.mutations.toggleSectionExpanded(state, 'header')
  assert.deepStrictEqual(state.expandedSectionIds, ['header'])

  decorationStore.mutations.toggleSectionExpanded(state, 'header')
  assert.deepStrictEqual(state.expandedSectionIds, [])

  decorationStore.mutations.setExpandedSections(state, ['header', 'footer'])
  assert.deepStrictEqual(state.expandedSectionIds, ['header', 'footer'])

  decorationStore.mutations.addSection(state, { type: 'main-carousel' })
  const sectionId = state.dsl.order[0]
  assert.strictEqual(state.expandedSectionIds.includes(sectionId), true)

  decorationStore.mutations.removeSection(state, sectionId)
  assert.strictEqual(state.expandedSectionIds.includes(sectionId), false)
}

function run() {
  testInitializeEditor()
  testInitializeEditorBackfillsMissingHeaderDsl()
  testSectionActions()
  testGlobalSelectionAndPreviewDsl()
  testFlags()
  testAddGlobalSectionUsesRequestedIndex()
  testExpandedSections()
  console.log('store.test.js passed')
}

run()
