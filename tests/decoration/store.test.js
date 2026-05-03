const assert = require('assert')

const decorationStore = require('../../src/store/modules/decoration')

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
  assert.deepStrictEqual(state.globalDsl.order, ['header', 'footer'])
  assert.deepStrictEqual(state.expandedSectionIds, [])
}

function testSectionActions() {
  const state = createState()
  decorationStore.mutations.addSection(state, { type: 'carousel' })
  assert.strictEqual(state.dsl.order.length, 1)
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
  decorationStore.mutations.addGlobalSection(state, 'announcement-bar')
  const annId = state.globalDsl.order.find((id) => id !== 'header' && id !== 'footer')
  assert.ok(annId)
  decorationStore.mutations.selectSection(state, annId)
  assert.strictEqual(state.selectedSectionId, annId)
  assert.strictEqual(state.editingScope, 'global')

  const announcementBlockId = state.globalDsl.sections[annId].blockOrder[0]
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
    state.globalDsl.sections.header.settings.logoUrl,
    'https://cdn.example.com/logo.png'
  )

  const headerBlockId = state.globalDsl.sections.header.blockOrder[0]
  decorationStore.mutations.selectBlock(state, { sectionId: 'header', blockId: headerBlockId })
  assert.strictEqual(state.editingScope, 'global')
  assert.strictEqual(
    decorationStore.getters.currentBlock(state, {
      currentSection: decorationStore.getters.currentSection(state)
    }).type,
    'nav-item'
  )

  decorationStore.mutations.addSection(state, { type: 'carousel' })
  const previewDsl = decorationStore.getters.activeDsl(state)
  assert.deepStrictEqual(previewDsl.order, ['header', annId, state.dsl.order[0], 'footer'])
}

function testFlags() {
  const state = createState()
  decorationStore.mutations.setPreviewReady(state, true)
  decorationStore.mutations.setSaving(state, true)
  assert.strictEqual(state.isPreviewReady, true)
  assert.strictEqual(state.isSaving, true)
}

function testExpandedSections() {
  const state = createState()
  decorationStore.mutations.toggleSectionExpanded(state, 'header')
  assert.deepStrictEqual(state.expandedSectionIds, ['header'])

  decorationStore.mutations.toggleSectionExpanded(state, 'header')
  assert.deepStrictEqual(state.expandedSectionIds, [])

  decorationStore.mutations.setExpandedSections(state, ['header', 'footer'])
  assert.deepStrictEqual(state.expandedSectionIds, ['header', 'footer'])

  decorationStore.mutations.addSection(state, { type: 'carousel' })
  const sectionId = state.dsl.order[0]
  assert.strictEqual(state.expandedSectionIds.includes(sectionId), true)

  decorationStore.mutations.removeSection(state, sectionId)
  assert.strictEqual(state.expandedSectionIds.includes(sectionId), false)
}

function run() {
  testInitializeEditor()
  testSectionActions()
  testGlobalSelectionAndPreviewDsl()
  testFlags()
  testExpandedSections()
  console.log('store.test.js passed')
}

run()
