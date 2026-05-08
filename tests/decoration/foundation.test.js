const assert = require('assert')

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
  composePreviewDsl,
  serializeDsl,
  deserializeDsl
} = require('../../src/components/sp-web-decoration/utils/dsl')
const {
  createTypedSection: createDefaultSection,
  createTypedBlock: createDefaultBlock
} = require('../../src/components/sp-web-decoration/definitions/factory')
const {
  sectionDefinitions,
  blockDefinitions,
  getSectionTypesByScope,
  getSectionBlockTypes
} = require('../../src/components/sp-web-decoration/definitions/registry')
const {
  createGlobalSections
} = require('../../src/components/sp-web-decoration/definitions/documents/global')
const {
  createDecorationMessenger
} = require('../../src/components/sp-web-decoration/utils/postMessage')

function testCreateHomeDsl() {
  const dsl = createHomeDsl({ pageId: '123', scene: '1001' })
  assert.strictEqual(dsl.pageType, 'home')
  assert.strictEqual(dsl.pageId, '123')
  assert.strictEqual(dsl.order.length, 1)
  assert.strictEqual(dsl.sections[dsl.order[0]].type, 'main-carousel')
  assert.strictEqual(dsl.sections[dsl.order[0]].blockOrder.length, 3)
  assert.strictEqual(dsl.meta.scene, '1001')
}

function testCreateGlobalDsl() {
  const globalDsl = createGlobalDsl()
  assert.deepStrictEqual(globalDsl.order, ['header', 'footer'])
  assert.strictEqual(globalDsl.sections.header.type, 'header')
  assert.strictEqual(globalDsl.sections.footer.type, 'footer')
}

function testRegistryDefinitions() {
  const types = getSectionTypesByScope('template')
  assert.deepStrictEqual(types, ['main-carousel', 'image-hotspot', 'product-shelf'])

  const carousel = createDefaultSection('main-carousel')
  assert.strictEqual(carousel.type, 'main-carousel')
  assert.ok(carousel.id.startsWith('main-carousel-'))
  assert.strictEqual(carousel.settings.enable_auto_play, true)
  assert.strictEqual(Array.isArray(carousel.settings.items), false)
  assert.deepStrictEqual(carousel.blockOrder.length, 3)
  assert.strictEqual(carousel.blocks[carousel.blockOrder[0]].type, 'image')

  const hotspot = createDefaultSection('image-hotspot')
  assert.strictEqual(hotspot.type, 'image-hotspot')
  assert.strictEqual(Array.isArray(hotspot.settings.hotspots), false)
  assert.deepStrictEqual(hotspot.blockOrder, [])

  const blockTypes = getSectionBlockTypes('main-carousel')
  assert.deepStrictEqual(blockTypes, ['image'])

  const imageBlock = createDefaultBlock('main-carousel', 'image')
  assert.strictEqual(imageBlock.type, 'image')
  assert.deepStrictEqual(imageBlock.settings, {
    introduction: '提供背景或介绍，吸引用户注意',
    introduction_size: 's',
    heading: '关键主题或焦点，简明直接',
    heading_size: 'm',
    description: '简要概述幻灯片内容，突出重点',
    description_size: 's',
    button_text: '按钮文字',
    button_size: 'large',
    button_style: 'primary',
    button_scheme: 'brand',
    content_alignment: 'left',
    content_layout: 'top-left',
    image_opacity: 20,
    color_mode: 'light',
    enable_card: false,
    color_style: 'pure'
  })

  const globalSections = createGlobalSections()
  assert.deepStrictEqual(Object.keys(globalSections), ['header', 'footer'])
  assert.strictEqual(globalSections.header.type, 'header')
  assert.strictEqual(globalSections.header.blockOrder.length, 3)
  assert.deepStrictEqual(
    globalSections.header.blockOrder.map((id) => globalSections.header.blocks[id].type),
    ['header_product_list', 'header_collection_product_list', 'mega_menu']
  )
  assert.strictEqual(globalSections.footer.type, 'footer')
  assert.strictEqual(globalSections.footer.blockOrder.length, 1)
  assert.strictEqual(
    globalSections.footer.blocks[globalSections.footer.blockOrder[0]].type,
    'footer-link'
  )
}

function testDslMutations() {
  const initial = createHomeDsl({ pageId: '123', scene: '1001' })
  const carousel = createDefaultSection('main-carousel')
  const withCarousel = insertSection(initial, carousel)
  assert.strictEqual(withCarousel.order.length, 1)
  assert.strictEqual(withCarousel.sections[carousel.id].type, 'main-carousel')
  assert.strictEqual(withCarousel.sections[carousel.id].blockOrder.length, 3)

  const updated = updateSectionSettings(withCarousel, carousel.id, { title: '首页轮播' })
  assert.strictEqual(updated.sections[carousel.id].settings.title, '首页轮播')

  const duplicated = duplicateSection(updated, carousel.id, createDefaultSection)
  assert.strictEqual(duplicated.order.length, 2)
  assert.strictEqual(duplicated.sections[duplicated.order[0]].type, 'main-carousel')
  assert.strictEqual(duplicated.sections[duplicated.order[1]].type, 'main-carousel')

  const moved = moveSection(duplicated, duplicated.order[1], 0)
  assert.strictEqual(moved.order[0], duplicated.order[1])

  const removed = removeSection(moved, carousel.id)
  assert.strictEqual(removed.order.includes(carousel.id), false)
}

function testDslBlockMutations() {
  const initial = createHomeDsl({ pageId: '123', scene: '1001' })
  const carousel = createDefaultSection('main-carousel')
  const withSection = insertSection(initial, carousel)

  const imageBlock = createDefaultBlock('main-carousel', 'image')
  const withBlock = insertBlock(withSection, carousel.id, imageBlock)
  assert.strictEqual(withBlock.sections[carousel.id].blockOrder.length, 4)

  const newBlockId = withBlock.sections[carousel.id].blockOrder[1]
  const updatedBlock = updateBlockSettings(withBlock, carousel.id, newBlockId, {
    heading: '新标题'
  })
  assert.strictEqual(
    updatedBlock.sections[carousel.id].blocks[newBlockId].settings.heading,
    '新标题'
  )

  const reordered = replaceBlockOrder(updatedBlock, carousel.id, [
    newBlockId,
    carousel.blockOrder[0]
  ])
  assert.deepStrictEqual(reordered.sections[carousel.id].blockOrder, [
    newBlockId,
    carousel.blockOrder[0]
  ])

  const removedBlock = removeBlock(reordered, carousel.id, newBlockId)
  assert.deepStrictEqual(removedBlock.sections[carousel.id].blockOrder, [carousel.blockOrder[0]])
}

function testComposePreviewDsl() {
  const pageDsl = createHomeDsl({ pageId: '123', scene: '1001' })
  const withSection = insertSection(pageDsl, createDefaultSection('main-carousel'))
  const globalDsl = createGlobalDsl()
  const previewDsl = composePreviewDsl({
    pageType: 'home',
    pageId: '123',
    dsl: withSection,
    globalDsl
  })

  assert.deepStrictEqual(previewDsl.order, ['header', withSection.order[0], 'footer'])
  assert.strictEqual(previewDsl.sections.header.type, 'header')
  assert.strictEqual(previewDsl.sections.footer.type, 'footer')

  const serialized = serializeDsl(previewDsl)
  const firstPageSectionId = withSection.order[0]
  assert.deepStrictEqual(
    serialized.sections[firstPageSectionId].block_order,
    serialized.sections[firstPageSectionId].blockOrder
  )

  const deserialized = deserializeDsl(serialized)
  assert.strictEqual('block_order' in deserialized.sections[firstPageSectionId], false)
}

function testMessenger() {
  const messenger = createDecorationMessenger('http://localhost:3000')
  assert.strictEqual(messenger.previewOrigin, 'http://localhost:3000')
  assert.strictEqual(
    messenger.getPreviewUrl({ templateId: '11', pageType: 'home' }),
    'http://localhost:3000/?designMode=1&pageType=home&pageId=11'
  )

  const calls = []
  const iframeWindow = {
    postMessage(payload, origin) {
      calls.push({ payload, origin })
    }
  }
  messenger.sendInit(iframeWindow, { pageType: 'home', pageId: '11', dsl: { order: [] } })
  messenger.sendUpdate(iframeWindow, { pageType: 'home', pageId: '11', dsl: { order: ['a'] } })

  assert.strictEqual(calls.length, 2)
  assert.strictEqual(calls[0].payload.type, 'DECORATION_INIT')
  assert.strictEqual(calls[1].payload.type, 'DECORATION_UPDATE')
  assert.strictEqual(calls[0].origin, 'http://localhost:3000')
}

function run() {
  testCreateHomeDsl()
  testCreateGlobalDsl()
  testRegistryDefinitions()
  testDslMutations()
  testDslBlockMutations()
  testComposePreviewDsl()
  testMessenger()
  console.log('foundation.test.js passed')
}

run()
