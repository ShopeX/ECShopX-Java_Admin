const { getSectionBlockTypes, getBlockDefinition } = require('../registry')

function createSectionPickerItems(sectionDefinitions) {
  return (sectionDefinitions || []).map((definition) => ({
    key: definition.type,
    type: definition.type,
    titleKey: definition.titleKey,
    icon: definition.icon
  }))
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
  createBlockPickerItems
}
