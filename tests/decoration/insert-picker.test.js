const assert = require('assert')

const {
  createSectionPickerItems,
  createSectionPickerItemsForTypes,
  createBlockPickerItems
} = require('../../src/components/sp-web-decoration/utils/insertPicker')
const {
  getSectionTypes,
  getSectionDefinition
} = require('../../src/components/sp-web-decoration/registry')

function testSectionPickerItems() {
  const definitions = getSectionTypes().map((type) => getSectionDefinition(type))
  const items = createSectionPickerItems(definitions)

  assert.deepStrictEqual(
    items.map((item) => item.type),
    ['carousel', 'image-hotspot', 'product-shelf']
  )
  assert.strictEqual(items[0].titleKey, getSectionDefinition('carousel').titleKey)
}

function testSectionPickerItemsForTypes() {
  const items = createSectionPickerItemsForTypes(['announcement-bar'])
  assert.strictEqual(items.length, 1)
  assert.strictEqual(items[0].type, 'announcement-bar')
  assert.ok(items[0].titleKey)
}

function testBlockPickerItems() {
  const carouselItems = createBlockPickerItems('carousel')
  assert.deepStrictEqual(
    carouselItems.map((item) => item.type),
    ['image', 'video']
  )

  const hotspotItems = createBlockPickerItems('image-hotspot')
  assert.deepStrictEqual(
    hotspotItems.map((item) => item.type),
    ['hotspot']
  )

  const shelfItems = createBlockPickerItems('product-shelf')
  assert.deepStrictEqual(shelfItems, [])
}

function run() {
  testSectionPickerItems()
  testSectionPickerItemsForTypes()
  testBlockPickerItems()
  console.log('insert-picker.test.js passed')
}

run()
