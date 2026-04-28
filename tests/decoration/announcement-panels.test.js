const assert = require('assert')
const fs = require('fs')
const path = require('path')

function read(relativePath) {
  return fs.readFileSync(path.resolve(__dirname, '../../', relativePath), 'utf8')
}

function testAnnouncementPanelFilesExist() {
  assert.strictEqual(
    fs.existsSync(
      path.resolve(
        __dirname,
        '../../src/components/sp-web-decoration/panels/AnnouncementBarPanel.vue'
      )
    ),
    true
  )
  assert.strictEqual(
    fs.existsSync(
      path.resolve(
        __dirname,
        '../../src/components/sp-web-decoration/panels/AnnouncementBlockPanel.vue'
      )
    ),
    true
  )
}

function testRegistryAndConfigPanelWireAnnouncementPanels() {
  const registrySource = read('src/components/sp-web-decoration/registry.js')
  const configPanelSource = read('src/components/sp-web-decoration/components/ConfigPanel.vue')

  assert.match(registrySource, /announcement-bar/)
  assert.match(registrySource, /announcement/)
  assert.match(configPanelSource, /AnnouncementBarPanel/)
  assert.match(configPanelSource, /AnnouncementBlockPanel/)
}

function testAnnouncementPanelFieldsFollowPlan() {
  const sectionPanelSource = read(
    'src/components/sp-web-decoration/panels/AnnouncementBarPanel.vue'
  )
  const blockPanelSource = read(
    'src/components/sp-web-decoration/panels/AnnouncementBlockPanel.vue'
  )

  assert.match(sectionPanelSource, /full_width/)
  assert.match(sectionPanelSource, /auto_rotate/)
  assert.match(sectionPanelSource, /change_slides_speed/)
  assert.match(sectionPanelSource, /enable_country_selector/)
  assert.match(sectionPanelSource, /enable_language_selector/)
  assert.match(sectionPanelSource, /show_line_separator/)
  assert.match(sectionPanelSource, /show_social/)
  assert.match(sectionPanelSource, /select-block/)
  assert.match(blockPanelSource, /text/)
}

function run() {
  testAnnouncementPanelFilesExist()
  testRegistryAndConfigPanelWireAnnouncementPanels()
  testAnnouncementPanelFieldsFollowPlan()
  console.log('announcement-panels.test.js passed')
}

run()
