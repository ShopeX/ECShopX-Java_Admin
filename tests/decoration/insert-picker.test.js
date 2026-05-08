const assert = require('assert')

const {
  createSectionPickerItems,
  createSectionPickerItemsForTypes,
  createBlockPickerItems
} = require('../../src/components/sp-web-decoration/utils/insertPicker')
const {
  getSectionTypesByScope,
  getTypedSectionDefinition: getSectionDefinition
} = require('../../src/components/sp-web-decoration/definitions/registry')

const {
  getAreaSectionInsertPolicy
} = require('../../src/components/sp-web-decoration/definitions/areas')

function testSectionPickerItems() {
  const definitions = getSectionTypesByScope('template').map((type) => getSectionDefinition(type))
  const items = createSectionPickerItems(definitions)

  assert.deepStrictEqual(
    items.map((item) => item.type),
    ['main-carousel', 'image-hotspot', 'product-shelf']
  )
  assert.strictEqual(items[0].titleKey, getSectionDefinition('main-carousel').titleKey)
}

function testSectionPickerItemsForTypes() {
  const items = createSectionPickerItemsForTypes(['announcement-bar'])
  assert.strictEqual(items.length, 1)
  assert.strictEqual(items[0].type, 'announcement-bar')
  assert.ok(items[0].type)
}

function testBlockPickerItems() {
  const carouselItems = createBlockPickerItems('main-carousel')
  assert.deepStrictEqual(
    carouselItems.map((item) => item.type),
    ['image']
  )

  const hotspotItems = createBlockPickerItems('image-hotspot')
  assert.deepStrictEqual(
    hotspotItems.map((item) => item.type),
    ['hotspot']
  )

  const shelfItems = createBlockPickerItems('product-shelf')
  assert.deepStrictEqual(shelfItems, [])
}

function testAreaSectionInsertPolicy() {
  assert.deepStrictEqual(getAreaSectionInsertPolicy('header'), {
    types: ['announcement-bar'],
    mutation: 'global'
  })
  assert.deepStrictEqual(getAreaSectionInsertPolicy('template'), {
    types: ['main-carousel', 'image-hotspot', 'product-shelf'],
    mutation: 'page'
  })
  assert.deepStrictEqual(getAreaSectionInsertPolicy('footer'), {
    types: [],
    mutation: 'footer'
  })
}

function run() {
  testSectionPickerItems()
  testSectionPickerItemsForTypes()
  testBlockPickerItems()
  testAreaSectionInsertPolicy()
  console.log('insert-picker.test.js passed')
}

run()
