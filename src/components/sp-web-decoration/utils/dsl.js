function cloneValue(value) {
  return JSON.parse(JSON.stringify(value))
}

function createHomeDsl({ pageId = '', scene = '1001' } = {}) {
  return {
    pageType: 'home',
    pageId: String(pageId || ''),
    sections: {},
    order: [],
    meta: {
      version: 1,
      scene
    }
  }
}

function createGlobalDsl(sections) {
  const resolvedSections = cloneValue(
    sections || {
      header: {
        id: 'header',
        type: 'header',
        title: '',
        titleKey: '5f1b7ccc.917f14',
        disabled: false,
        settings: {},
        blocks: {},
        blockOrder: []
      },
      footer: {
        id: 'footer',
        type: 'footer',
        title: '',
        titleKey: '5f1b7ccc.4eb88f',
        disabled: false,
        settings: {},
        blocks: {},
        blockOrder: []
      }
    }
  )
  const order = ['header']
  if (resolvedSections.footer) order.push('footer')
  if (resolvedSections['announcement-bar']) {
    const hi = order.indexOf('header')
    order.splice(hi >= 0 ? hi + 1 : 0, 0, 'announcement-bar')
  }
  return {
    pageType: 'global',
    pageId: 'global',
    sections: resolvedSections,
    order
  }
}

function insertSection(dsl, section, index) {
  const nextDsl = cloneValue(dsl)
  const nextIndex =
    typeof index === 'number' && index >= 0 && index <= nextDsl.order.length
      ? index
      : nextDsl.order.length
  nextDsl.sections[section.id] = cloneValue(section)
  nextDsl.order.splice(nextIndex, 0, section.id)
  return nextDsl
}

function updateSectionSettings(dsl, sectionId, patch) {
  if (!dsl.sections[sectionId]) return cloneValue(dsl)
  const nextDsl = cloneValue(dsl)
  nextDsl.sections[sectionId].settings = {
    ...nextDsl.sections[sectionId].settings,
    ...cloneValue(patch)
  }
  return nextDsl
}

function insertBlock(dsl, sectionId, block, insertIndex) {
  if (!dsl.sections[sectionId] || !block?.id) return cloneValue(dsl)
  const nextDsl = cloneValue(dsl)
  nextDsl.sections[sectionId].blocks = {
    ...(nextDsl.sections[sectionId].blocks || {}),
    [block.id]: cloneValue(block)
  }
  const prevOrder = nextDsl.sections[sectionId].blockOrder || []
  const order = prevOrder.slice()
  if (
    typeof insertIndex === 'number' &&
    !Number.isNaN(insertIndex) &&
    insertIndex >= 0 &&
    insertIndex <= order.length
  ) {
    order.splice(insertIndex, 0, block.id)
  } else {
    order.push(block.id)
  }
  nextDsl.sections[sectionId].blockOrder = order
  return nextDsl
}

function updateBlockSettings(dsl, sectionId, blockId, patch) {
  const section = dsl.sections[sectionId]
  if (!section?.blocks?.[blockId]) return cloneValue(dsl)
  const nextDsl = cloneValue(dsl)
  nextDsl.sections[sectionId].blocks[blockId].settings = {
    ...nextDsl.sections[sectionId].blocks[blockId].settings,
    ...cloneValue(patch)
  }
  return nextDsl
}

function removeBlock(dsl, sectionId, blockId) {
  const section = dsl.sections[sectionId]
  if (!section?.blocks?.[blockId]) return cloneValue(dsl)
  const nextDsl = cloneValue(dsl)
  delete nextDsl.sections[sectionId].blocks[blockId]
  nextDsl.sections[sectionId].blockOrder = (nextDsl.sections[sectionId].blockOrder || []).filter(
    (id) => id !== blockId
  )
  return nextDsl
}

function replaceBlockOrder(dsl, sectionId, blockOrder) {
  if (!dsl.sections[sectionId]) return cloneValue(dsl)
  const nextDsl = cloneValue(dsl)
  nextDsl.sections[sectionId].blockOrder = blockOrder.slice()
  return nextDsl
}

function removeSection(dsl, sectionId) {
  if (!dsl.sections[sectionId]) return cloneValue(dsl)
  const nextDsl = cloneValue(dsl)
  delete nextDsl.sections[sectionId]
  nextDsl.order = nextDsl.order.filter((id) => id !== sectionId)
  return nextDsl
}

function duplicateSection(dsl, sectionId, createDefaultSection) {
  const sourceSection = dsl.sections[sectionId]
  if (!sourceSection) return cloneValue(dsl)
  const duplicatedSection = createDefaultSection(sourceSection.type)
  duplicatedSection.disabled = sourceSection.disabled
  duplicatedSection.settings = cloneValue(sourceSection.settings)
  duplicatedSection.blocks = cloneValue(sourceSection.blocks || {})
  duplicatedSection.blockOrder = cloneValue(sourceSection.blockOrder || [])
  duplicatedSection.title = sourceSection.title
  duplicatedSection.titleKey = sourceSection.titleKey

  const nextDsl = cloneValue(dsl)
  const sourceIndex = nextDsl.order.findIndex((id) => id === sectionId)
  nextDsl.sections[duplicatedSection.id] = duplicatedSection
  nextDsl.order.splice(sourceIndex + 1, 0, duplicatedSection.id)
  return nextDsl
}

function moveSection(dsl, sectionId, targetIndex) {
  const currentIndex = dsl.order.findIndex((id) => id === sectionId)
  if (currentIndex === -1) return cloneValue(dsl)

  const normalizedTargetIndex = Math.max(0, Math.min(targetIndex, dsl.order.length - 1))
  if (currentIndex === normalizedTargetIndex) {
    return cloneValue(dsl)
  }

  const nextDsl = cloneValue(dsl)
  nextDsl.order.splice(currentIndex, 1)
  nextDsl.order.splice(normalizedTargetIndex, 0, sectionId)
  return nextDsl
}

function replaceSection(dsl, sectionId, nextSection) {
  if (!dsl.sections[sectionId]) return cloneValue(dsl)
  const nextDsl = cloneValue(dsl)
  nextDsl.sections[sectionId] = cloneValue(nextSection)
  return nextDsl
}

function composePreviewDsl({ pageType = 'home', pageId = '', dsl, globalDsl }) {
  const gOrder = Array.isArray(globalDsl?.order) ? globalDsl.order.slice() : []
  const footerIndex = gOrder.indexOf('footer')
  const prefix = footerIndex >= 0 ? gOrder.slice(0, footerIndex) : gOrder.slice()
  const suffix = footerIndex >= 0 ? gOrder.slice(footerIndex) : []
  return {
    pageType,
    pageId,
    sections: {
      ...(globalDsl?.sections || {}),
      ...(dsl?.sections || {})
    },
    order: [...prefix, ...(dsl?.order || []).slice(), ...suffix],
    meta: cloneValue(dsl?.meta || {})
  }
}

function serializeDsl(dsl) {
  const nextDsl = cloneValue(dsl)
  Object.keys(nextDsl.sections || {}).forEach((sectionId) => {
    const section = nextDsl.sections[sectionId]
    section.block_order = cloneValue(section.blockOrder || [])
  })
  return nextDsl
}

function deserializeDsl(dsl) {
  const nextDsl = cloneValue(dsl)
  Object.keys(nextDsl.sections || {}).forEach((sectionId) => {
    const section = nextDsl.sections[sectionId]
    if (!section.blockOrder && Array.isArray(section.block_order)) {
      section.blockOrder = cloneValue(section.block_order)
    }
    delete section.block_order
  })
  return nextDsl
}

module.exports = {
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
  composePreviewDsl,
  serializeDsl,
  deserializeDsl
}
