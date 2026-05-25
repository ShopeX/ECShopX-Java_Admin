const assert = require('assert')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '../../')
const read = (relativePath) => fs.readFileSync(path.resolve(root, relativePath), 'utf8')

function run() {
  const panelSource = read('src/components/sp-web-decoration/panels/VideoBlockPanel.vue')
  const blockSource = read('src/components/sp-web-decoration/definitions/blocks/video.js')
  const defaultSettingsSource = read(
    'src/components/sp-web-decoration/definitions/default-settings.js'
  )

  assert.match(panelSource, /视频/)
  assert.match(panelSource, /视频封面/)
  assert.match(panelSource, /移动视频/)
  assert.match(panelSource, /SpVideoPicker/)
  assert.match(panelSource, /SpImagePicker/)
  assert.match(panelSource, /videoUrl/)
  assert.match(panelSource, /posterUrl/)
  assert.match(panelSource, /mobileVideoUrl/)
  assert.match(panelSource, /size="big"/)
  assert.doesNotMatch(panelSource, /<el-form/)
  assert.doesNotMatch(panelSource, /<el-form-item/)

  assert.match(blockSource, /videoUrl: ''/)
  assert.match(blockSource, /posterUrl: ''/)
  assert.match(blockSource, /mobileVideoUrl: ''/)

  assert.match(defaultSettingsSource, /videoUrl: ''/)
  assert.match(defaultSettingsSource, /posterUrl: ''/)
  assert.match(defaultSettingsSource, /mobileVideoUrl: ''/)

  console.log('video-block-panel.test.js passed')
}

run()
