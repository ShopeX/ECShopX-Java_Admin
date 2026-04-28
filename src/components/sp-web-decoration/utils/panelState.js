function cloneValue(value) {
  return JSON.parse(JSON.stringify(value))
}

function normalizeCarouselSettings(settings = {}) {
  return {
    title: '',
    autoplay: true,
    interval: 3000,
    height: 520,
    showDots: true,
    showArrows: true,
    ...cloneValue(settings)
  }
}

function normalizeAnnouncementBarSettings(settings = {}) {
  return {
    full_width: false,
    auto_rotate: false,
    enable_country_selector: false,
    color_mode: 'light',
    show_line_separator: true,
    change_slides_speed: 5,
    color_style: 'pure',
    show_social: false,
    enable_language_selector: false,
    ...cloneValue(settings)
  }
}

function normalizeHeaderSettings(settings = {}) {
  return {
    color_mode: 'dark',
    sticky_header_type: 'none',
    padding_top: 'xs',
    menu_color_style: 'pure',
    menu_type_desktop: 'dropdown',
    show_line_separator: true,
    menu: 'main-menu',
    color_style: 'pure',
    layout: 'middle',
    margin_bottom: 0,
    enable_country_selector: true,
    mobile_logo_position: 'center',
    menu_color_mode: 'dark',
    logo_position: 'center',
    enable_customer_avatar: true,
    padding_bottom: 'xs',
    menu_color_scheme: 'scheme-1',
    enable_language_selector: true,
    ...cloneValue(settings)
  }
}

function normalizeFooterSettings(settings = {}) {
  return {
    content_alignment: 'center',
    newsletter_heading: '',
    color_mode: 'dark',
    margin_top: 48,
    padding_top: 'm',
    color_style: 'pure',
    show_social: true,
    payment_enable: true,
    newsletter_enable: false,
    enable_country_selector: true,
    show_policy: true,
    color_scheme: 'scheme-2',
    padding_bottom: 'xs',
    enable_brand_information: true,
    enable_language_selector: true,
    ...cloneValue(settings)
  }
}

function normalizeProductShelfSettings(settings = {}) {
  const nextSettings = {
    title: '',
    displayMode: settings.displayMode || settings.sourceMode || 'category',
    categoryId: '',
    itemIds: [],
    columns: 4,
    limit: 8,
    showPrice: true,
    showAddCart: true,
    ...cloneValue(settings)
  }

  nextSettings.displayMode = nextSettings.displayMode || 'category'
  nextSettings.itemIds = Array.isArray(nextSettings.itemIds)
    ? nextSettings.itemIds.filter(Boolean).slice(0, nextSettings.limit || 8)
    : []

  return nextSettings
}

function normalizeAnnouncementBlockSettings(settings = {}) {
  return {
    text: '',
    ...cloneValue(settings)
  }
}

function normalizeNavItemBlockSettings(settings = {}) {
  return {
    label: '',
    url: '/',
    ...cloneValue(settings)
  }
}

function normalizeBrandBlockSettings(settings = {}) {
  return {
    enable_social: true,
    ...cloneValue(settings)
  }
}

function normalizeLinkListBlockSettings(settings = {}) {
  return {
    heading: '',
    menu: '',
    alignment: 'left',
    ...cloneValue(settings)
  }
}

function normalizeNewsletterBlockSettings(settings = {}) {
  return {
    title: '',
    alignment: 'left',
    enable_social: false,
    ...cloneValue(settings)
  }
}

function normalizeImageHotspotSettings(settings = {}) {
  return {
    title: '',
    imageUrl: '',
    imageWidth: 1200,
    imageHeight: 600,
    ...cloneValue(settings)
  }
}

function normalizeImageBlockSettings(settings = {}) {
  return {
    imageUrl: '',
    link: '',
    alt: '',
    ...cloneValue(settings)
  }
}

function clampCoordinate(value) {
  const numericValue = Number(value)
  if (Number.isNaN(numericValue)) return 0
  if (numericValue < 0) return 0
  if (numericValue > 100) return 100
  return numericValue
}

function normalizeHotspotBlockSettings(settings = {}) {
  const nextSettings = {
    x: 50,
    y: 50,
    link: '',
    label: '',
    shape: 'circle',
    ...cloneValue(settings)
  }

  nextSettings.x = clampCoordinate(nextSettings.x)
  nextSettings.y = clampCoordinate(nextSettings.y)
  nextSettings.shape = nextSettings.shape === 'rect' ? 'rect' : 'circle'

  return nextSettings
}

function normalizeBlockSettings(block) {
  if (!block) return block

  if (block.type === 'image') {
    return {
      ...block,
      settings: normalizeImageBlockSettings(block.settings)
    }
  }

  if (block.type === 'hotspot') {
    return {
      ...block,
      settings: normalizeHotspotBlockSettings(block.settings)
    }
  }

  if (block.type === 'announcement') {
    return {
      ...block,
      settings: normalizeAnnouncementBlockSettings(block.settings)
    }
  }

  if (block.type === 'nav-item') {
    return {
      ...block,
      settings: normalizeNavItemBlockSettings(block.settings)
    }
  }

  if (block.type === 'brand') {
    return {
      ...block,
      settings: normalizeBrandBlockSettings(block.settings)
    }
  }

  if (block.type === 'link_list') {
    return {
      ...block,
      settings: normalizeLinkListBlockSettings(block.settings)
    }
  }

  if (block.type === 'newsletter') {
    return {
      ...block,
      settings: normalizeNewsletterBlockSettings(block.settings)
    }
  }

  return cloneValue(block)
}

function normalizeSection(section) {
  if (!section) return section

  const nextSection = cloneValue(section)
  nextSection.blockOrder = Array.isArray(nextSection.blockOrder)
    ? nextSection.blockOrder.slice()
    : Array.isArray(nextSection.block_order)
    ? nextSection.block_order.slice()
    : []
  nextSection.blocks = nextSection.blocks || {}

  if (nextSection.type === 'carousel') {
    nextSection.settings = normalizeCarouselSettings(nextSection.settings)
  } else if (nextSection.type === 'announcement-bar') {
    nextSection.settings = normalizeAnnouncementBarSettings(nextSection.settings)
  } else if (nextSection.type === 'header') {
    nextSection.settings = normalizeHeaderSettings(nextSection.settings)
  } else if (nextSection.type === 'footer') {
    nextSection.settings = normalizeFooterSettings(nextSection.settings)
  } else if (nextSection.type === 'product-shelf') {
    nextSection.settings = normalizeProductShelfSettings(nextSection.settings)
  } else if (nextSection.type === 'image-hotspot') {
    nextSection.settings = normalizeImageHotspotSettings(nextSection.settings)
  } else {
    nextSection.settings = cloneValue(nextSection.settings || {})
  }

  Object.keys(nextSection.blocks).forEach((blockId) => {
    nextSection.blocks[blockId] = normalizeBlockSettings(nextSection.blocks[blockId])
  })

  return nextSection
}

function updateSectionBlock(section, blockId, patch) {
  const nextSection = normalizeSection(section)
  if (!nextSection?.blocks?.[blockId]) return nextSection

  nextSection.blocks[blockId] = normalizeBlockSettings({
    ...nextSection.blocks[blockId],
    settings: {
      ...nextSection.blocks[blockId].settings,
      ...cloneValue(patch)
    }
  })

  return nextSection
}

function addSectionBlock(section, createBlock, settings = {}) {
  const nextSection = normalizeSection(section)
  const block = createBlock()
  block.settings = {
    ...block.settings,
    ...cloneValue(settings)
  }

  nextSection.blocks[block.id] = normalizeBlockSettings(block)
  nextSection.blockOrder = [...nextSection.blockOrder, block.id]

  return {
    section: nextSection,
    blockId: block.id
  }
}

function removeSectionBlock(section, blockId) {
  const nextSection = normalizeSection(section)
  if (!nextSection?.blocks?.[blockId]) return nextSection

  delete nextSection.blocks[blockId]
  nextSection.blockOrder = nextSection.blockOrder.filter((id) => id !== blockId)

  return nextSection
}

function moveSectionBlock(section, blockId, targetIndex) {
  const nextSection = normalizeSection(section)
  const currentIndex = nextSection.blockOrder.findIndex((id) => id === blockId)
  if (currentIndex === -1) return nextSection

  const normalizedIndex = Math.max(0, Math.min(targetIndex, nextSection.blockOrder.length - 1))
  if (currentIndex === normalizedIndex) return nextSection

  nextSection.blockOrder.splice(currentIndex, 1)
  nextSection.blockOrder.splice(normalizedIndex, 0, blockId)

  return nextSection
}

function sanitizeProductItemIds(itemIds, limit) {
  const max = Number(limit) > 0 ? Number(limit) : 8
  return Array.from(
    new Set((Array.isArray(itemIds) ? itemIds : []).map((item) => String(item || '').trim()))
  )
    .filter(Boolean)
    .slice(0, max)
}

module.exports = {
  normalizeCarouselSettings,
  normalizeAnnouncementBarSettings,
  normalizeHeaderSettings,
  normalizeFooterSettings,
  normalizeProductShelfSettings,
  normalizeImageHotspotSettings,
  normalizeAnnouncementBlockSettings,
  normalizeNavItemBlockSettings,
  normalizeBrandBlockSettings,
  normalizeLinkListBlockSettings,
  normalizeNewsletterBlockSettings,
  normalizeImageBlockSettings,
  normalizeHotspotBlockSettings,
  normalizeSection,
  updateSectionBlock,
  addSectionBlock,
  removeSectionBlock,
  moveSectionBlock,
  sanitizeProductItemIds
}
