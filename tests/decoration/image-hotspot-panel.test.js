const assert = require('assert')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '../../')
const read = (relativePath) => fs.readFileSync(path.resolve(root, relativePath), 'utf8')

function run() {
  const panelSource = read('src/components/sp-web-decoration/panels/ImageHotspotPanel.vue')
  const defaultSettingsSource = read(
    'src/components/sp-web-decoration/definitions/default-settings.js'
  )

  assert.match(panelSource, /PC图片/)
  assert.match(panelSource, /移动图片/)
  assert.match(panelSource, /:value="settings.pc_image"/)
  assert.match(panelSource, /:value="settings.mobile_image"/)
  assert.match(panelSource, /settings\.link/)
  assert.match(panelSource, /settings\.full_width/)
  assert.match(panelSource, /settings\.enable_link/)
  assert.match(panelSource, /normalizeTypedSectionSettings\('image-hotspot'/)
  assert.doesNotMatch(panelSource, /v-model="localValue\./)

  assert.match(defaultSettingsSource, /pc_image: ''/)
  assert.match(defaultSettingsSource, /mobile_image: ''/)

  console.log('image-hotspot-panel.test.js passed')
}

run()
