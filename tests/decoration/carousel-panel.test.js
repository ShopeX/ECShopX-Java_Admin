const assert = require('assert')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '../../')
const read = (relativePath) => fs.readFileSync(path.resolve(root, relativePath), 'utf8')

function run() {
  const panelSource = read('src/components/sp-web-decoration/panels/CarouselPanel.vue')
  const defaultSettingsSource = read(
    'src/components/sp-web-decoration/definitions/default-settings.js'
  )

  assert.match(panelSource, /normalizeTypedSectionSettings/)
  assert.match(panelSource, /text-foreground/)
  assert.match(panelSource, /text-muted-foreground/)
  assert.doesNotMatch(panelSource, /text-\[#/)
  assert.match(panelSource, /settings\.image_height/)
  assert.match(panelSource, /image_height/)
  assert.match(panelSource, /paginate_type/)
  assert.match(panelSource, /paginate_size/)
  assert.match(panelSource, /enable_auto_play/)
  assert.match(panelSource, /enable_arrow/)
  assert.match(panelSource, /full_width/)
  assert.match(panelSource, /interval/)
  assert.match(panelSource, /<el-slider/)
  assert.match(panelSource, /!w-\[88px\]/)
  assert.match(panelSource, /:min="3"/)
  assert.match(panelSource, /:max="9"/)
  assert.match(panelSource, /:step="1"/)
  assert.match(panelSource, /@input="updateField\('interval', \$event\)"/)
  assert.match(panelSource, />图片高度</)
  assert.match(panelSource, />分页样式</)
  assert.match(panelSource, />分页规格</)
  assert.match(panelSource, />幻灯片更换时间</)
  assert.doesNotMatch(panelSource, /<el-form/)
  assert.doesNotMatch(panelSource, /<el-form-item/)

  assert.match(defaultSettingsSource, /image_height: 'medium'/)
  assert.match(defaultSettingsSource, /paginate_type: 'point'/)
  assert.match(defaultSettingsSource, /paginate_size: 'medium'/)
  assert.match(defaultSettingsSource, /enable_auto_play: true/)
  assert.match(defaultSettingsSource, /enable_arrow: true/)
  assert.match(defaultSettingsSource, /full_width: false/)

  console.log('carousel-panel.test.js passed')
}

run()
