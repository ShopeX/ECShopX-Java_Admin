const { getSectionBlockTypes, getBlockDefinition, getSectionDefinition } = require('../registry')

function createSectionPickerItems(sectionDefinitions) {
  return (sectionDefinitions || []).map((definition) => ({
    key: definition.type,
    type: definition.type,
    titleKey: definition.titleKey
  }))
}

/** 按固定 type 列表生成「添加分区」项（含全局分区如 announcement-bar） */
function createSectionPickerItemsForTypes(types) {
  return (types || [])
    .map((type) => {
      const definition = getSectionDefinition(type)
      if (!definition) return null
      return {
        key: definition.type,
        type: definition.type,
        titleKey: definition.titleKey
      }
    })
    .filter(Boolean)
}

function createBlockPickerItems(sectionType) {
  return getSectionBlockTypes(sectionType).map((blockType) => {
    const definition = getBlockDefinition(sectionType, blockType)
    return {
      key: blockType,
      type: blockType,
      titleKey: definition?.titleKey || '134c6b2c.7f56ad'
    }
  })
}

module.exports = {
  createSectionPickerItems,
  createSectionPickerItemsForTypes,
  createBlockPickerItems
}
