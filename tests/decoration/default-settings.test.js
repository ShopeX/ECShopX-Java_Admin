const assert = require('assert')
const {
  sectionDefaultSettings,
  blockDefaultSettings
} = require('../../src/components/sp-web-decoration/definitions/default-settings')
const {
  createTypedSection,
  createTypedBlock
} = require('../../src/components/sp-web-decoration/definitions/factory')

function run() {
  assert.strictEqual(sectionDefaultSettings.header.enable_language_selector, true)
  assert.strictEqual(sectionDefaultSettings['main-carousel'].interval, 5)
  assert.strictEqual(blockDefaultSettings.image.pc_image, '')
  assert.strictEqual(blockDefaultSettings.video.mobileVideoUrl, '')

  const header = createTypedSection('header')
  const image = createTypedBlock('main-carousel', 'image')
  const video = createTypedBlock('main-carousel', 'video')

  assert.strictEqual(header.settings.menu_type_desktop, 'dropdown')
  assert.strictEqual(image.settings.pc_image, '')
  assert.strictEqual(video.settings.posterUrl, '')

  console.log('default-settings.test.js passed')
}

run()
