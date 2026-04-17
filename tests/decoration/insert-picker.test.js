const assert = require('assert')

const {
  createSectionPickerItems,
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
  assert.strictEqual(items[0].titleKey, 'decorationeditor.section.carousel')
}

function testBlockPickerItems() {
  const carouselItems = createBlockPickerItems('carousel')
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

function run() {
  testSectionPickerItems()
  testBlockPickerItems()
  console.log('insert-picker.test.js passed')
}

run()
