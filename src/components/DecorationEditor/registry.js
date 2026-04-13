const { generateSectionId, generateBlockId } = require('./utils/nanoid')

const sectionRegistry = {
  carousel: {
    type: 'carousel',
    title: '轮播图',
    titleKey: 'decorationeditor.section.carousel',
    icon: 'el-icon-picture-outline',
    settings: {
      title: '',
      autoplay: true,
      height: 380
    },
    initialBlocks: ['image'],
    blockTypes: {
      image: {
        title: '图片',
        titleKey: 'decorationeditor.block.image',
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
    title: '图片热区',
    titleKey: 'decorationeditor.section.imageHotspot',
    icon: 'el-icon-map-location',
    settings: {
      title: '',
      imageUrl: ''
    },
    initialBlocks: [],
    blockTypes: {
      hotspot: {
        title: '热区',
        titleKey: 'decorationeditor.block.hotspot',
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
    title: '商品货架',
    titleKey: 'decorationeditor.section.productShelf',
    icon: 'el-icon-s-grid',
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
  header: {
    type: 'header',
    title: '标头',
    titleKey: 'decorationeditor.section.header',
    icon: 'el-icon-s-home',
    settings: {
      title: '',
      logoUrl: '',
      backgroundColor: '#ffffff'
    },
    initialBlocks: ['nav-item'],
    blockTypes: {
      'nav-item': {
        title: '导航项',
        titleKey: 'decorationeditor.block.navItem',
        defaultBlock: {
          type: 'nav-item',
          settings: {
            label: '首页',
            url: '/'
          }
        }
      }
    }
  },
  footer: {
    type: 'footer',
    title: '页脚',
    titleKey: 'decorationeditor.section.footer',
    icon: 'el-icon-s-platform',
    settings: {
      title: '',
      copyright: '',
      backgroundColor: '#0f172a'
    },
    initialBlocks: ['footer-link'],
    blockTypes: {
      'footer-link': {
        title: '页脚链接',
        titleKey: 'decorationeditor.block.footerLink',
        defaultBlock: {
          type: 'footer-link',
          settings: {
            label: '帮助中心',
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
    title: '标头',
    titleKey: 'decorationeditor.section.header',
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
          label: '首页',
          url: '/'
        }
      }
    },
    blockOrder: ['nav-item-default']
  },
  footer: {
    id: 'footer',
    type: 'footer',
    title: '页脚',
    titleKey: 'decorationeditor.section.footer',
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
          label: '帮助中心',
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
