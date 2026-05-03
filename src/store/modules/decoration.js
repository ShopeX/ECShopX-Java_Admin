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

function cloneDeep(value) {
  return JSON.parse(JSON.stringify(value))
}

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

function isGlobalSection(state, sectionId) {
  return Boolean(sectionId && state.globalDsl?.sections?.[sectionId])
}

function resolveScopeKey(state, sectionId) {
  return isGlobalSection(state, sectionId) ? 'globalDsl' : 'dsl'
}

const decorationStore = {
  namespaced: true,
  state: createState,
  getters: {
    currentSection(state) {
      if (!state.selectedSectionId) return null
      const scopeKey = resolveScopeKey(state, state.selectedSectionId)
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
      state.editingScope = state.selectedSectionId
        ? isGlobalSection(state, state.selectedSectionId)
          ? 'global'
          : 'page'
        : 'global'
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
      state.editingScope = isGlobalSection(state, sectionId) ? 'global' : 'page'
    },
    selectSection(state, sectionId) {
      state.selectedSectionId = sectionId || ''
      state.selectedBlockId = ''
      if (sectionId && !state.expandedSectionIds.includes(sectionId)) {
        state.expandedSectionIds = [...state.expandedSectionIds, sectionId]
      }
      state.editingScope = isGlobalSection(state, sectionId) ? 'global' : 'page'
    },
    selectBlock(state, { sectionId, blockId }) {
      state.selectedSectionId = sectionId || ''
      state.selectedBlockId = blockId || ''
      if (sectionId && !state.expandedSectionIds.includes(sectionId)) {
        state.expandedSectionIds = [...state.expandedSectionIds, sectionId]
      }
      state.editingScope = isGlobalSection(state, sectionId) ? 'global' : 'page'
    },
    addSection(state, { type, index }) {
      const section = createDefaultSection(type)
      state.dsl = insertSection(state.dsl, section, index)
      state.selectedSectionId = section.id
      state.selectedBlockId = ''
      state.expandedSectionIds = [...state.expandedSectionIds, section.id]
      state.editingScope = 'page'
    },
    addGlobalSection(state, payload) {
      const type = typeof payload === 'string' ? payload : payload?.type
      if (!type) return

      const requestedIndex =
        typeof payload === 'object' && payload !== null && typeof payload.index === 'number'
          ? payload.index
          : undefined

      if (type === 'announcement-bar') {
        const section = createDefaultSection('announcement-bar')
        const newId = section.id
        const currentOrder = Array.isArray(state.globalDsl.order)
          ? state.globalDsl.order.slice()
          : []
        const nextOrder = currentOrder.length ? currentOrder : ['header', 'footer']
        const footerIndex = nextOrder.indexOf('footer')
        const prefix = footerIndex >= 0 ? nextOrder.slice(0, footerIndex) : nextOrder.slice()
        const suffix = footerIndex >= 0 ? nextOrder.slice(footerIndex) : []

        let insertAt = typeof requestedIndex === 'number' ? requestedIndex : prefix.length
        insertAt = Math.max(1, Math.min(insertAt, prefix.length))

        const newPrefix = prefix.slice()
        newPrefix.splice(insertAt, 0, newId)
        const orderWithNew = [...newPrefix, ...suffix]

        state.globalDsl = {
          ...state.globalDsl,
          sections: {
            ...(state.globalDsl.sections || {}),
            [newId]: section
          },
          order: orderWithNew
        }
        state.selectedSectionId = newId
        state.selectedBlockId = ''
        if (!state.expandedSectionIds.includes(newId)) {
          state.expandedSectionIds = [...state.expandedSectionIds, newId]
        }
        state.editingScope = 'global'
        return
      }

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
      const scopeKey = resolveScopeKey(state, sectionId)
      const section = state[scopeKey]?.sections?.[sectionId]
      if (!section) return
      section.disabled = Boolean(disabled)
    },
    updateSectionSettings(state, { sectionId, patch }) {
      const scopeKey = resolveScopeKey(state, sectionId)
      state[scopeKey] = updateSectionSettings(state[scopeKey], sectionId, patch)
    },
    updateSelectedSectionSettings(state, patch) {
      if (!state.selectedSectionId) return
      const scopeKey = resolveScopeKey(state, state.selectedSectionId)
      state[scopeKey] = updateSectionSettings(state[scopeKey], state.selectedSectionId, patch)
    },
    replaceSelectedSection(state, nextSection) {
      if (!state.selectedSectionId) return
      const scopeKey = resolveScopeKey(state, state.selectedSectionId)
      state[scopeKey] = replaceSection(state[scopeKey], state.selectedSectionId, nextSection)
    },
    removeSection(state, sectionId) {
      if (!sectionId) return
      if (sectionId === 'header' || sectionId === 'footer') return
      const globalSection = state.globalDsl?.sections?.[sectionId]
      if (globalSection) {
        if (globalSection.type !== 'announcement-bar') return
        const nextGlobal = cloneDeep(state.globalDsl)
        delete nextGlobal.sections[sectionId]
        nextGlobal.order = (nextGlobal.order || []).filter((id) => id !== sectionId)
        state.globalDsl = nextGlobal
        state.expandedSectionIds = state.expandedSectionIds.filter((id) => id !== sectionId)
        if (state.selectedSectionId === sectionId) {
          state.selectedSectionId = state.globalDsl.order.find((id) => id !== 'footer') || 'header'
          state.selectedBlockId = ''
        }
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
      if (isGlobalSection(state, sectionId)) {
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
    addBlock(state, { sectionId, blockType, index }) {
      const scopeKey = resolveScopeKey(state, sectionId)
      const block = createDefaultBlock(state[scopeKey].sections[sectionId].type, blockType)
      const insertAt = typeof index === 'number' && !Number.isNaN(index) ? index : undefined
      state[scopeKey] = insertBlock(state[scopeKey], sectionId, block, insertAt)
      state.selectedSectionId = sectionId
      state.selectedBlockId = block.id
      state.editingScope = scopeKey === 'globalDsl' ? 'global' : 'page'
    },
    removeBlock(state, { sectionId, blockId }) {
      const scopeKey = resolveScopeKey(state, sectionId)
      state[scopeKey] = removeBlock(state[scopeKey], sectionId, blockId)
      if (state.selectedBlockId === blockId) {
        state.selectedSectionId = sectionId
        state.selectedBlockId = ''
      }
    },
    toggleBlockDisabled(state, { sectionId, blockId }) {
      if (!sectionId || !blockId) return
      const scopeKey = resolveScopeKey(state, sectionId)
      const block = state[scopeKey]?.sections?.[sectionId]?.blocks?.[blockId]
      if (!block) return
      block.disabled = !block.disabled
    },
    updateSelectedBlockSettings(state, patch) {
      if (!state.selectedSectionId || !state.selectedBlockId) return
      const scopeKey = resolveScopeKey(state, state.selectedSectionId)
      state[scopeKey] = updateBlockSettings(
        state[scopeKey],
        state.selectedSectionId,
        state.selectedBlockId,
        patch
      )
    },
    replaceBlockOrder(state, { sectionId, blockOrder }) {
      const scopeKey = resolveScopeKey(state, sectionId)
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
      const incoming = Array.isArray(nextOrder) ? nextOrder.filter(Boolean) : []
      const sections = state.globalDsl?.sections || {}
      const seen = new Set()
      const body = []
      for (const id of incoming) {
        if (id === 'footer') continue
        if (!sections[id] || seen.has(id)) continue
        seen.add(id)
        body.push(id)
      }
      const hasFooter = Boolean(sections.footer)
      const orderOut = hasFooter ? [...body, 'footer'] : body
      state.globalDsl = {
        ...state.globalDsl,
        order: orderOut
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
