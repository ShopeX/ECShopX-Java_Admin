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
} = require('../../src/components/DecorationEditor/utils/dsl')
const {
  createDefaultSection,
  getSectionTypes,
  createGlobalSections,
  createDefaultBlock,
  getSectionBlockTypes
} = require('../../src/components/DecorationEditor/registry')
const {
  createDecorationMessenger
} = require('../../src/components/DecorationEditor/utils/postMessage')

function testCreateHomeDsl() {
  const dsl = createHomeDsl({ pageId: '123', scene: '1001' })
  assert.strictEqual(dsl.pageType, 'home')
  assert.strictEqual(dsl.pageId, '123')
  assert.deepStrictEqual(dsl.order, [])
  assert.deepStrictEqual(dsl.sections, {})
  assert.strictEqual(dsl.meta.scene, '1001')
}

function testCreateGlobalDsl() {
  const globalDsl = createGlobalDsl()
  assert.deepStrictEqual(globalDsl.order, ['header', 'footer'])
  assert.strictEqual(globalDsl.sections.header.type, 'header')
  assert.strictEqual(globalDsl.sections.footer.type, 'footer')
}

function testRegistryDefinitions() {
  const types = getSectionTypes()
  assert.deepStrictEqual(types, ['carousel', 'image-hotspot', 'product-shelf'])

  const carousel = createDefaultSection('carousel')
  assert.strictEqual(carousel.type, 'carousel')
  assert.ok(carousel.id.startsWith('carousel-'))
  assert.strictEqual(carousel.settings.autoplay, true)
  assert.strictEqual(Array.isArray(carousel.settings.items), false)
  assert.deepStrictEqual(carousel.blockOrder.length, 1)
  assert.strictEqual(carousel.blocks[carousel.blockOrder[0]].type, 'image')

  const hotspot = createDefaultSection('image-hotspot')
  assert.strictEqual(hotspot.type, 'image-hotspot')
  assert.strictEqual(Array.isArray(hotspot.settings.hotspots), false)
  assert.deepStrictEqual(hotspot.blockOrder, [])

  const blockTypes = getSectionBlockTypes('carousel')
  assert.deepStrictEqual(blockTypes, ['image'])

  const imageBlock = createDefaultBlock('carousel', 'image')
  assert.strictEqual(imageBlock.type, 'image')
  assert.deepStrictEqual(imageBlock.settings, {
    imageUrl: '',
    link: ''
  })

  const globalSections = createGlobalSections()
  assert.deepStrictEqual(Object.keys(globalSections), ['header', 'footer'])
}

function testDslMutations() {
  const initial = createHomeDsl({ pageId: '123', scene: '1001' })
  const carousel = createDefaultSection('carousel')
  const withCarousel = insertSection(initial, carousel)
  assert.deepStrictEqual(withCarousel.order, [carousel.id])
  assert.strictEqual(withCarousel.sections[carousel.id].title, '轮播图')

  const updated = updateSectionSettings(withCarousel, carousel.id, { title: '首页轮播' })
  assert.strictEqual(updated.sections[carousel.id].settings.title, '首页轮播')

  const duplicated = duplicateSection(updated, carousel.id, createDefaultSection)
  assert.strictEqual(duplicated.order.length, 2)
  assert.notStrictEqual(duplicated.order[0], duplicated.order[1])

  const moved = moveSection(duplicated, duplicated.order[1], 0)
  assert.strictEqual(moved.order[0], duplicated.order[1])

  const removed = removeSection(moved, carousel.id)
  assert.strictEqual(removed.order.includes(carousel.id), false)
}

function testDslBlockMutations() {
  const initial = createHomeDsl({ pageId: '123', scene: '1001' })
  const carousel = createDefaultSection('carousel')
  const withSection = insertSection(initial, carousel)

  const imageBlock = createDefaultBlock('carousel', 'image')
  const withBlock = insertBlock(withSection, carousel.id, imageBlock)
  assert.strictEqual(withBlock.sections[carousel.id].blockOrder.length, 2)

  const newBlockId = withBlock.sections[carousel.id].blockOrder[1]
  const updatedBlock = updateBlockSettings(withBlock, carousel.id, newBlockId, {
    imageUrl: 'https://cdn.example.com/banner.png'
  })
  assert.strictEqual(
    updatedBlock.sections[carousel.id].blocks[newBlockId].settings.imageUrl,
    'https://cdn.example.com/banner.png'
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
  const withSection = insertSection(pageDsl, createDefaultSection('carousel'))
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
    'http://localhost:3000/?preview=true&pageType=home&pageId=11'
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
