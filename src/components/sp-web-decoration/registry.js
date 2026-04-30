const { generateSectionId, generateBlockId } = require('./utils/nanoid')

const sectionRegistry = {
  carousel: {
    type: 'carousel',
    title: '',
    titleKey: 'd65dbcac.0c0180',
    settings: {
      title: '',
      autoplay: true,
      height: 520
    },
    initialBlocks: ['image', 'image', 'image'],
    blockTypes: {
      image: {
        title: '',
        titleKey: 'd65dbcac.20def7',
        defaultBlock: {
          type: 'image',
          settings: {
            imageUrl: '',
            link: ''
          }
        }
      }
    }
  },
  'image-hotspot': {
    type: 'image-hotspot',
    title: '',
    titleKey: 'd65dbcac.081a81',
    settings: {
      title: '',
      imageUrl: ''
    },
    initialBlocks: [],
    blockTypes: {
      hotspot: {
        title: '',
        titleKey: 'd65dbcac.50da72',
        defaultBlock: {
          type: 'hotspot',
          settings: {
            label: '',
            x: 0,
            y: 0,
            link: ''
          }
        }
      }
    }
  },
  'product-shelf': {
    type: 'product-shelf',
    title: '',
    titleKey: 'd65dbcac.4a02ad',
    settings: {
      title: '',
      sourceMode: 'manual',
      itemIds: [],
      categoryId: '',
      columns: 4,
      limit: 8
    },
    initialBlocks: [],
    blockTypes: {}
  }
}

const globalSectionRegistry = {
  'announcement-bar': {
    type: 'announcement-bar',
    title: '',
    titleKey: 'd65dbcac.3921b6',
    settings: {
      full_width: false,
      auto_rotate: false,
      enable_country_selector: false,
      color_mode: 'light',
      show_line_separator: true,
      change_slides_speed: 5,
      color_style: 'pure',
      show_social: false,
      enable_language_selector: false
    },
    initialBlocks: ['announcement'],
    blockTypes: {
      announcement: {
        title: '',
        titleKey: 'd65dbcac.fa86f1',
        defaultBlock: {
          type: 'announcement',
          settings: {
            text: ''
          }
        }
      }
    }
  },
  header: {
    type: 'header',
    title: '',
    titleKey: 'd65dbcac.917f14',
    settings: {
      title: '',
      logoUrl: '',
      backgroundColor: '#ffffff'
    },
    initialBlocks: ['nav-item'],
    blockTypes: {
      'nav-item': {
        title: '',
        titleKey: 'd65dbcac.ae5ff3',
        defaultBlock: {
          type: 'nav-item',
          settings: {
            label: '',
            url: '/'
          }
        }
      }
    }
  },
  footer: {
    type: 'footer',
    title: '',
    titleKey: 'd65dbcac.4eb88f',
    settings: {
      title: '',
      copyright: '',
      backgroundColor: '#0f172a'
    },
    initialBlocks: ['footer-link'],
    blockTypes: {
      'footer-link': {
        title: '',
        titleKey: 'd65dbcac.406baf',
        defaultBlock: {
          type: 'footer-link',
          settings: {
            label: '',
            url: '/help'
          }
        }
      }
    }
  }
}

const globalSectionTemplates = {
  header: {
    id: 'header',
    type: 'header',
    title: '',
    titleKey: 'd65dbcac.917f14',
    disabled: false,
    settings: {
      title: '',
      logoUrl: '',
      backgroundColor: '#ffffff'
    },
    blocks: {
      'nav-item-default': {
        type: 'nav-item',
        settings: {
          label: '',
          url: '/'
        }
      }
    },
    blockOrder: ['nav-item-default']
  },
  footer: {
    id: 'footer',
    type: 'footer',
    title: '',
    titleKey: 'd65dbcac.4eb88f',
    disabled: false,
    settings: {
      title: '',
      copyright: '',
      backgroundColor: '#0f172a'
    },
    blocks: {
      'footer-link-default': {
        type: 'footer-link',
        settings: {
          label: '',
          url: '/help'
        }
      }
    },
    blockOrder: ['footer-link-default']
  }
}

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value))
}

function getSectionDefinition(type) {
  return sectionRegistry[type] || globalSectionRegistry[type] || null
}

function getSectionTypes() {
  return Object.keys(sectionRegistry)
}

function createDefaultSection(type) {
  const definition = getSectionDefinition(type)
  if (!definition) {
    throw new Error(`Unknown decoration section type: ${type}`)
  }
  const blocks = {}
  const blockOrder = []

  ;(definition.initialBlocks || []).forEach((blockType) => {
    const block = createDefaultBlock(type, blockType)
    blocks[block.id] = block
    blockOrder.push(block.id)
  })

  return {
    id: generateSectionId(type),
    type: definition.type,
    title: definition.title,
    titleKey: definition.titleKey,
    disabled: false,
    settings: cloneValue(definition.settings),
    blocks,
    blockOrder
  }
}

function getBlockDefinition(sectionType, blockType) {
  return getSectionDefinition(sectionType)?.blockTypes?.[blockType] || null
}

function getSectionBlockTypes(sectionType) {
  return Object.keys(getSectionDefinition(sectionType)?.blockTypes || {})
}

function createDefaultBlock(sectionType, blockType) {
  const definition = getBlockDefinition(sectionType, blockType)
  if (!definition) {
    throw new Error(`Unknown decoration block type: ${sectionType}/${blockType}`)
  }

  return {
    id: generateBlockId(blockType),
    type: definition.defaultBlock.type,
    settings: cloneValue(definition.defaultBlock.settings)
  }
}

function createGlobalSections() {
  return cloneValue(globalSectionTemplates)
}

module.exports = {
  sectionRegistry,
  getSectionDefinition,
  getSectionTypes,
  getBlockDefinition,
  getSectionBlockTypes,
  createDefaultSection,
  createDefaultBlock,
  createGlobalSections
}
