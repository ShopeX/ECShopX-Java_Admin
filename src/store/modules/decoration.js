const {
  createHomeDsl,
  createGlobalDsl,
  insertSection,
  updateSectionSettings,
  insertBlock,
  updateBlockSettings,
  removeBlock,
  replaceBlockOrder,
  removeSection,
  duplicateSection,
  moveSection,
  replaceSection,
  composePreviewDsl
} = require('../../components/DecorationEditor/utils/dsl')
const {
  createDefaultSection,
  createDefaultBlock,
  createGlobalSections
} = require('../../components/DecorationEditor/registry')

function createState() {
  return {
    pageType: 'home',
    pageId: '',
    dsl: createHomeDsl(),
    globalDsl: createGlobalDsl(createGlobalSections()),
    selectedSectionId: '',
    selectedBlockId: '',
    expandedSectionIds: [],
    editingScope: 'page',
    isPreviewReady: false,
    isSaving: false
  }
}

function resolveScopeKey(sectionId) {
  return sectionId === 'header' || sectionId === 'footer' ? 'globalDsl' : 'dsl'
}

const decorationStore = {
  namespaced: true,
  state: createState,
  getters: {
    currentSection(state) {
      if (!state.selectedSectionId) return null
      const scopeKey = resolveScopeKey(state.selectedSectionId)
      return state[scopeKey].sections[state.selectedSectionId] || null
    },
    currentBlock(state, getters) {
      if (!state.selectedBlockId || !getters.currentSection) return null
      return getters.currentSection.blocks?.[state.selectedBlockId] || null
    },
    activeDsl(state) {
      return composePreviewDsl({
        pageType: state.pageType,
        pageId: state.pageId,
        dsl: state.dsl,
        globalDsl: state.globalDsl
      })
    }
  },
  mutations: {
    initializeEditor(state, { pageType = 'home', pageId = '', dsl, globalDsl }) {
      state.pageType = pageType
      state.pageId = String(pageId || '')
      state.dsl = dsl || createHomeDsl({ pageId: state.pageId })
      state.globalDsl = globalDsl || createGlobalDsl(createGlobalSections())
      state.selectedSectionId = state.dsl.order[0] || ''
      state.selectedBlockId = ''
      state.expandedSectionIds = []
      state.editingScope = state.selectedSectionId ? 'page' : 'global'
      state.isPreviewReady = false
    },
    setDsl(state, dsl) {
      state.dsl = dsl
    },
    setGlobalDsl(state, dsl) {
      state.globalDsl = dsl
    },
    setSelectedSectionId(state, sectionId) {
      state.selectedSectionId = sectionId || ''
      state.selectedBlockId = ''
      state.editingScope = sectionId === 'header' || sectionId === 'footer' ? 'global' : 'page'
    },
    selectSection(state, sectionId) {
      state.selectedSectionId = sectionId || ''
      state.selectedBlockId = ''
      if (sectionId && !state.expandedSectionIds.includes(sectionId)) {
        state.expandedSectionIds = [...state.expandedSectionIds, sectionId]
      }
      state.editingScope = sectionId === 'header' || sectionId === 'footer' ? 'global' : 'page'
    },
    selectBlock(state, { sectionId, blockId }) {
      state.selectedSectionId = sectionId || ''
      state.selectedBlockId = blockId || ''
      if (sectionId && !state.expandedSectionIds.includes(sectionId)) {
        state.expandedSectionIds = [...state.expandedSectionIds, sectionId]
      }
      state.editingScope = sectionId === 'header' || sectionId === 'footer' ? 'global' : 'page'
    },
    addSection(state, { type, index }) {
      const section = createDefaultSection(type)
      state.dsl = insertSection(state.dsl, section, index)
      state.selectedSectionId = section.id
      state.selectedBlockId = ''
      state.expandedSectionIds = [...state.expandedSectionIds, section.id]
      state.editingScope = 'page'
    },
    updateSectionSettings(state, { sectionId, patch }) {
      const scopeKey = resolveScopeKey(sectionId)
      state[scopeKey] = updateSectionSettings(state[scopeKey], sectionId, patch)
    },
    updateSelectedSectionSettings(state, patch) {
      if (!state.selectedSectionId) return
      const scopeKey = resolveScopeKey(state.selectedSectionId)
      state[scopeKey] = updateSectionSettings(state[scopeKey], state.selectedSectionId, patch)
    },
    replaceSelectedSection(state, nextSection) {
      if (!state.selectedSectionId) return
      const scopeKey = resolveScopeKey(state.selectedSectionId)
      state[scopeKey] = replaceSection(state[scopeKey], state.selectedSectionId, nextSection)
    },
    removeSection(state, sectionId) {
      state.dsl = removeSection(state.dsl, sectionId)
      state.expandedSectionIds = state.expandedSectionIds.filter((id) => id !== sectionId)
      if (state.selectedSectionId === sectionId) {
        state.selectedSectionId = state.dsl.order[0] || ''
        state.selectedBlockId = ''
      }
    },
    duplicateSection(state, sectionId) {
      state.dsl = duplicateSection(state.dsl, sectionId, createDefaultSection)
    },
    moveSection(state, { sectionId, targetIndex }) {
      state.dsl = moveSection(state.dsl, sectionId, targetIndex)
    },
    replaceSectionOrder(state, nextOrder) {
      state.dsl = {
        ...state.dsl,
        order: nextOrder.slice()
      }
    },
    addBlock(state, { sectionId, blockType }) {
      const scopeKey = resolveScopeKey(sectionId)
      const block = createDefaultBlock(state[scopeKey].sections[sectionId].type, blockType)
      state[scopeKey] = insertBlock(state[scopeKey], sectionId, block)
      state.selectedSectionId = sectionId
      state.selectedBlockId = block.id
      state.editingScope = scopeKey === 'globalDsl' ? 'global' : 'page'
    },
    removeBlock(state, { sectionId, blockId }) {
      const scopeKey = resolveScopeKey(sectionId)
      state[scopeKey] = removeBlock(state[scopeKey], sectionId, blockId)
      if (state.selectedBlockId === blockId) {
        state.selectedSectionId = sectionId
        state.selectedBlockId = ''
      }
    },
    updateSelectedBlockSettings(state, patch) {
      if (!state.selectedSectionId || !state.selectedBlockId) return
      const scopeKey = resolveScopeKey(state.selectedSectionId)
      state[scopeKey] = updateBlockSettings(
        state[scopeKey],
        state.selectedSectionId,
        state.selectedBlockId,
        patch
      )
    },
    replaceBlockOrder(state, { sectionId, blockOrder }) {
      const scopeKey = resolveScopeKey(sectionId)
      state[scopeKey] = replaceBlockOrder(state[scopeKey], sectionId, blockOrder)
    },
    toggleSectionExpanded(state, sectionId) {
      if (!sectionId) return
      if (state.expandedSectionIds.includes(sectionId)) {
        state.expandedSectionIds = state.expandedSectionIds.filter((id) => id !== sectionId)
        return
      }
      state.expandedSectionIds = [...state.expandedSectionIds, sectionId]
    },
    setExpandedSections(state, sectionIds) {
      state.expandedSectionIds = Array.isArray(sectionIds) ? sectionIds.slice() : []
    },
    setGlobalOrder(state, nextOrder) {
      state.globalDsl = {
        ...state.globalDsl,
        order: nextOrder.slice()
      }
    },
    setPreviewReady(state, value) {
      state.isPreviewReady = Boolean(value)
    },
    setSaving(state, value) {
      state.isSaving = Boolean(value)
    },
    resetState(state) {
      Object.assign(state, createState())
    }
  }
}

module.exports = decorationStore
module.exports.default = decorationStore
