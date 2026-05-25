const assert = require('assert')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '../../')
const read = (relativePath) => fs.readFileSync(path.resolve(root, relativePath), 'utf8')

function run() {
  const panelSource = read('src/components/sp-web-decoration/panels/ImageBlockPanel.vue')
  const blockSource = read('src/components/sp-web-decoration/definitions/blocks/image.js')
  const videoSource = read('src/components/sp-web-decoration/definitions/blocks/video.js')

  assert.match(panelSource, /PC图片/)
  assert.match(panelSource, /移动图片/)
  assert.match(panelSource, /SpImagePicker/)
  assert.match(panelSource, /pc_image/)
  assert.match(panelSource, /mobile_image/)
  assert.match(panelSource, /size="big"/)

  assert.match(blockSource, /pc_image: ''/)
  assert.match(blockSource, /mobile_image: ''/)
  assert.doesNotMatch(videoSource, /pc_image: ''/)
  assert.doesNotMatch(videoSource, /mobile_image: ''/)

  console.log('image-block-panel.test.js passed')
}

run()
