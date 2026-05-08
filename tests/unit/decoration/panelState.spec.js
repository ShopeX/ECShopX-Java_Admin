const assert = require('assert')
const {
  normalizeCarouselSettings,
  normalizeAnnouncementBarSettings,
  normalizeProductShelfSettings,
  normalizeHotspotBlockSettings,
  normalizeSection,
  addSectionBlock,
  moveSectionBlock,
  removeSectionBlock,
  sanitizeProductItemIds
} = require('../../../src/components/sp-web-decoration/utils/panelState')
const {
  createTypedBlock: createDefaultBlock
} = require('../../../src/components/sp-web-decoration/definitions/factory')

const tests = []

function test(name, run) {
  tests.push({ name, run })
}

test('fills carousel defaults required by the plan', () => {
  assert.deepStrictEqual(normalizeCarouselSettings({ height: 520 }), {
    title: '',
    autoplay: true,
    interval: 3000,
    height: 520,
    showDots: true,
    showArrows: true
  })
})

test('fills announcement bar defaults required by the plan', () => {
  assert.deepStrictEqual(normalizeAnnouncementBarSettings({ auto_rotate: true }), {
    full_width: false,
    auto_rotate: true,
    enable_country_selector: false,
    color_mode: 'light',
    show_line_separator: true,
    change_slides_speed: 5,
    color_style: 'pure',
    show_social: false,
    enable_language_selector: false
  })
})

test('normalizes header and footer settings required by the updated global schema', () => {
  const header = normalizeSection({
    id: 'header',
    type: 'header',
    settings: {},
    blocks: {
      'nav-item-default': {
        type: 'nav-item',
        settings: {}
      }
    },
    blockOrder: ['nav-item-default']
  })

  const footer = normalizeSection({
    id: 'footer',
    type: 'footer',
    settings: {},
    blocks: {
      brand: {
        type: 'brand',
        settings: {}
      },
      'link_list-1': {
        type: 'link_list',
        settings: {}
      },
      newsletter: {
        type: 'newsletter',
        settings: {}
      }
    },
    blockOrder: ['brand', 'link_list-1', 'newsletter']
  })

  assert.strictEqual(header.settings.sticky_header_type, 'none')
  assert.strictEqual(header.settings.menu_type_desktop, 'dropdown')
  assert.strictEqual(header.settings.enable_country_selector, true)
  assert.strictEqual(header.settings.enable_language_selector, true)
  assert.strictEqual(header.settings.enable_customer_avatar, true)
  assert.deepStrictEqual(header.blocks['nav-item-default'].settings, {
    label: '',
    url: '/'
  })

  assert.strictEqual(footer.settings.content_alignment, 'center')
  assert.strictEqual(footer.settings.margin_top, 48)
  assert.strictEqual(footer.settings.newsletter_enable, false)
  assert.strictEqual(footer.settings.enable_brand_information, true)
  assert.deepStrictEqual(footer.blocks.brand.settings, {
    enable_social: true
  })
  assert.deepStrictEqual(footer.blocks['link_list-1'].settings, {
    heading: '',
    menu: '',
    alignment: 'left'
  })
  assert.deepStrictEqual(footer.blocks.newsletter.settings, {
    title: '',
    alignment: 'left',
    enable_social: false
  })
})

test('migrates product shelf sourceMode to displayMode and trims manual items by limit', () => {
  assert.deepStrictEqual(
    normalizeProductShelfSettings({
      sourceMode: 'manual',
      itemIds: ['1', '2', '3'],
      limit: 2
    }),
    {
      title: '',
      displayMode: 'manual',
      categoryId: '',
      itemIds: ['1', '2'],
      columns: 4,
      limit: 2,
      showPrice: true,
      showAddCart: true,
      sourceMode: 'manual'
    }
  )
})

test('clamps hotspot coordinates and normalizes unsupported shapes', () => {
  assert.deepStrictEqual(
    normalizeHotspotBlockSettings({
      x: 120,
      y: -8,
      shape: 'triangle'
    }),
    {
      x: 100,
      y: 0,
      link: '',
      label: '',
      shape: 'circle'
    }
  )
})

test('adds, moves and removes section blocks while keeping order in sync', () => {
  const baseSection = normalizeSection({
    id: 'carousel-123456',
    type: 'carousel',
    settings: {},
    blocks: {},
    blockOrder: []
  })

  const firstResult = addSectionBlock(baseSection, () => createDefaultBlock('carousel', 'image'), {
    imageUrl: 'https://a.example/banner-1.png'
  })
  const secondResult = addSectionBlock(
    firstResult.section,
    () => createDefaultBlock('carousel', 'image'),
    {
      imageUrl: 'https://a.example/banner-2.png'
    }
  )

  const movedSection = moveSectionBlock(secondResult.section, secondResult.blockId, 0)

  assert.deepStrictEqual(movedSection.blockOrder, [secondResult.blockId, firstResult.blockId])

  const removedSection = removeSectionBlock(movedSection, firstResult.blockId)
  assert.deepStrictEqual(removedSection.blockOrder, [secondResult.blockId])
  assert.strictEqual(removedSection.blocks[firstResult.blockId], undefined)
})

test('deduplicates and limits selected product ids', () => {
  assert.deepStrictEqual(sanitizeProductItemIds(['1', '2', '2', '', '3'], 2), ['1', '2'])
})

function run() {
  let failures = 0

  tests.forEach(({ name, run }) => {
    try {
      run()
      console.log(`PASS ${name}`)
    } catch (error) {
      failures += 1
      console.error(`FAIL ${name}`)
      console.error(error.stack || error.message)
    }
  })

  if (failures > 0) {
    process.exitCode = 1
    return
  }

  console.log(`All ${tests.length} panelState checks passed.`)
}

if (require.main === module) {
  run()
}
