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
} = require('../../components/sp-web-decoration/utils/dsl')
const {
  createDefaultSection,
  createDefaultBlock,
  createGlobalSections
} = require('../../components/sp-web-decoration/registry')

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

function isGlobalSection(sectionId) {
  return ['announcement-bar', 'header', 'footer'].includes(sectionId)
}

function resolveScopeKey(sectionId) {
  return isGlobalSection(sectionId) ? 'globalDsl' : 'dsl'
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
      state.editingScope = isGlobalSection(sectionId) ? 'global' : 'page'
    },
    selectSection(state, sectionId) {
      state.selectedSectionId = sectionId || ''
      state.selectedBlockId = ''
      if (sectionId && !state.expandedSectionIds.includes(sectionId)) {
        state.expandedSectionIds = [...state.expandedSectionIds, sectionId]
      }
      state.editingScope = isGlobalSection(sectionId) ? 'global' : 'page'
    },
    selectBlock(state, { sectionId, blockId }) {
      state.selectedSectionId = sectionId || ''
      state.selectedBlockId = blockId || ''
      if (sectionId && !state.expandedSectionIds.includes(sectionId)) {
        state.expandedSectionIds = [...state.expandedSectionIds, sectionId]
      }
      state.editingScope = isGlobalSection(sectionId) ? 'global' : 'page'
    },
    addSection(state, { type, index }) {
      const section = createDefaultSection(type)
      state.dsl = insertSection(state.dsl, section, index)
      state.selectedSectionId = section.id
      state.selectedBlockId = ''
      state.expandedSectionIds = [...state.expandedSectionIds, section.id]
      state.editingScope = 'page'
    },
    addGlobalSection(state, type) {
      if (!type) return
      if (state.globalDsl.sections?.[type]) {
        state.selectedSectionId = type
        state.selectedBlockId = ''
        state.editingScope = 'global'
        return
      }
      const section = createDefaultSection(type)
      section.id = type
      state.globalDsl = {
        ...state.globalDsl,
        sections: {
          ...(state.globalDsl.sections || {}),
          [type]: section
        }
      }
      const currentOrder = Array.isArray(state.globalDsl.order) ? state.globalDsl.order.slice() : []
      const insertIndex = currentOrder.includes('header') ? currentOrder.indexOf('header') : 0
      currentOrder.splice(insertIndex, 0, type)
      state.globalDsl.order = currentOrder
      state.selectedSectionId = type
      state.selectedBlockId = ''
      if (!state.expandedSectionIds.includes(type)) {
        state.expandedSectionIds = [...state.expandedSectionIds, type]
      }
      state.editingScope = 'global'
    },
    setSectionDisabled(state, { sectionId, disabled }) {
      if (!sectionId) return
      const scopeKey = resolveScopeKey(sectionId)
      const section = state[scopeKey]?.sections?.[sectionId]
      if (!section) return
      section.disabled = Boolean(disabled)
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
      if (isGlobalSection(sectionId)) {
        return
      }
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
      if (isGlobalSection(sectionId)) {
        return
      }
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
      const incoming = Array.isArray(nextOrder) ? nextOrder.slice() : []
      const deduped = Array.from(new Set(incoming.filter(Boolean)))
      const hasHeader = deduped.includes('header')
      const hasFooter = deduped.includes('footer')
      const middle = deduped.filter((id) => id !== 'header' && id !== 'footer')
      const normalized = []
      if (hasHeader || state.globalDsl.sections?.header) normalized.push('header')
      normalized.push(...middle)
      if (hasFooter || state.globalDsl.sections?.footer) normalized.push('footer')
      state.globalDsl = {
        ...state.globalDsl,
        order: normalized
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
