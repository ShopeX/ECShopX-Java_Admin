const assert = require('assert')
const fs = require('fs')
const path = require('path')

function read(relativePath) {
  return fs.readFileSync(path.resolve(__dirname, '../../', relativePath), 'utf8')
}

function testHeaderFooterBlockPanelFilesExist() {
  ;['HeaderPanel.vue', 'FooterPanel.vue'].forEach((fileName) => {
    assert.strictEqual(
      fs.existsSync(
        path.resolve(__dirname, `../../src/components/sp-web-decoration/panels/${fileName}`)
      ),
      true
    )
  })
}

function testRegistryAndConfigPanelWireHeaderFooterBlocks() {
  const registrySource = read('src/components/sp-web-decoration/definitions/registry.js')
  const panelStateSource = read('src/components/sp-web-decoration/utils/panelState.js')
  const configPanelSource = read('src/components/sp-web-decoration/components/ConfigPanel.vue')

  assert.match(panelStateSource, /normalizeHeaderSettings/)
  assert.match(panelStateSource, /normalizeFooterSettings/)
  assert.match(registrySource, /DEFAULT_HEADER_SETTINGS/)
  assert.match(registrySource, /type: 'header'/)
  assert.match(registrySource, /type: 'nav-item'/)
  assert.match(registrySource, /type: 'footer'/)
  assert.match(registrySource, /type: 'footer-link'/)

  assert.match(configPanelSource, /HeaderPanel/)
  assert.match(configPanelSource, /FooterPanel/)
  assert.match(configPanelSource, /NavItemBlockPanel/)
  assert.match(configPanelSource, /FooterLinkBlockPanel/)
}

function testHeaderFooterPanelFieldsFollowPlan() {
  const panelStateSource = read('src/components/sp-web-decoration/utils/panelState.js')
  const headerPanelSource = read('src/components/sp-web-decoration/panels/HeaderPanel.vue')
  const footerPanelSource = read('src/components/sp-web-decoration/panels/FooterPanel.vue')

  assert.match(panelStateSource, /function normalizeHeaderSettings/)
  assert.match(panelStateSource, /sticky_header_type/)
  assert.match(panelStateSource, /padding_top/)
  assert.match(panelStateSource, /padding_bottom/)
  assert.match(panelStateSource, /menu_type_desktop/)
  assert.match(panelStateSource, /show_line_separator/)
  assert.match(panelStateSource, /logo_position/)
  assert.match(panelStateSource, /mobile_logo_position/)
  assert.match(panelStateSource, /layout/)
  assert.match(panelStateSource, /margin_bottom/)
  assert.match(panelStateSource, /enable_country_selector/)
  assert.match(panelStateSource, /enable_language_selector/)
  assert.match(panelStateSource, /enable_customer_avatar/)
  assert.match(panelStateSource, /menu_color_mode/)
  assert.match(panelStateSource, /menu_color_scheme/)

  assert.match(panelStateSource, /function normalizeFooterSettings/)
  assert.match(panelStateSource, /content_alignment/)
  assert.match(panelStateSource, /newsletter_heading/)
  assert.match(panelStateSource, /margin_top/)
  assert.match(panelStateSource, /payment_enable/)
  assert.match(panelStateSource, /newsletter_enable/)
  assert.match(panelStateSource, /enable_brand_information/)

  assert.match(headerPanelSource, /title/)
  assert.match(headerPanelSource, /logoUrl/)
  assert.match(headerPanelSource, /backgroundColor/)
  assert.match(footerPanelSource, /title/)
  assert.match(footerPanelSource, /copyright/)
  assert.match(footerPanelSource, /backgroundColor/)
}

function run() {
  testHeaderFooterBlockPanelFilesExist()
  testRegistryAndConfigPanelWireHeaderFooterBlocks()
  testHeaderFooterPanelFieldsFollowPlan()
  console.log('header-footer-panels.test.js passed')
}

run()
