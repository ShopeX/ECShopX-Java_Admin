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
  const headerDefinitionSource = read(
    'src/components/sp-web-decoration/definitions/sections/header.js'
  )
  const footerDefinitionSource = read(
    'src/components/sp-web-decoration/definitions/sections/footer.js'
  )
  const panelStateSource = read('src/components/sp-web-decoration/utils/panelState.js')
  const defaultSettingsSource = read(
    'src/components/sp-web-decoration/definitions/default-settings.js'
  )
  const configPanelSource = read('src/components/sp-web-decoration/components/ConfigPanel.vue')

  assert.match(panelStateSource, /normalizeTypedSectionSettings/)
  assert.match(registrySource, /headerSection/)
  assert.match(registrySource, /footerSection/)
  assert.match(headerDefinitionSource, /type: 'header'/)
  assert.match(headerDefinitionSource, /header_product_list/)
  assert.match(headerDefinitionSource, /mega_menu/)
  assert.match(footerDefinitionSource, /type: 'footer'/)
  assert.match(footerDefinitionSource, /footer-link/)

  assert.match(configPanelSource, /HeaderPanel/)
  assert.match(configPanelSource, /FooterPanel/)
  assert.match(configPanelSource, /NavItemBlockPanel/)
  assert.match(configPanelSource, /FooterLinkBlockPanel/)
  assert.match(configPanelSource, /getTypedSectionDefinition/)
  assert.match(configPanelSource, /sectionTitle\(\)/)
  assert.match(configPanelSource, /blockTitle\(\)/)
  assert.match(configPanelSource, /panelTitle\(\)/)
  assert.match(configPanelSource, /`\$\{this\.sectionTitle\}-\$\{this\.blockTitle\}`/)
  assert.match(configPanelSource, /border-border/)
  assert.match(configPanelSource, /bg-card/)
  assert.match(configPanelSource, /text-foreground/)
  assert.match(configPanelSource, /text-muted-foreground/)
  assert.doesNotMatch(configPanelSource, /\{\{ \$t\('250dc970\.6aab38'\) \}\}/)
  assert.doesNotMatch(configPanelSource, /#[0-9a-fA-F]{3,8}/)
}

function testHeaderFooterPanelFieldsFollowPlan() {
  const panelStateSource = read('src/components/sp-web-decoration/utils/panelState.js')
  const defaultSettingsSource = read(
    'src/components/sp-web-decoration/definitions/default-settings.js'
  )
  const headerPanelSource = read('src/components/sp-web-decoration/panels/HeaderPanel.vue')
  const footerPanelSource = read('src/components/sp-web-decoration/panels/FooterPanel.vue')

  assert.match(panelStateSource, /function normalizeSectionSettings/)
  assert.match(defaultSettingsSource, /sticky_header_type/)
  assert.match(defaultSettingsSource, /padding_top/)
  assert.match(defaultSettingsSource, /padding_bottom/)
  assert.match(defaultSettingsSource, /menu_type_desktop/)
  assert.match(defaultSettingsSource, /show_line_separator/)
  assert.match(defaultSettingsSource, /logo_position/)
  assert.match(defaultSettingsSource, /mobile_logo_position/)
  assert.match(defaultSettingsSource, /layout/)
  assert.match(defaultSettingsSource, /margin_bottom/)
  assert.match(defaultSettingsSource, /enable_country_selector/)
  assert.match(defaultSettingsSource, /enable_language_selector/)
  assert.match(defaultSettingsSource, /enable_customer_avatar/)
  assert.match(defaultSettingsSource, /menu_color_mode/)
  assert.match(defaultSettingsSource, /menu_color_scheme/)

  assert.match(panelStateSource, /function normalizeSectionSettings/)
  assert.match(defaultSettingsSource, /content_alignment/)
  assert.match(defaultSettingsSource, /newsletter_heading/)
  assert.match(defaultSettingsSource, /margin_top/)
  assert.match(defaultSettingsSource, /payment_enable/)
  assert.match(defaultSettingsSource, /newsletter_enable/)
  assert.match(defaultSettingsSource, /enable_brand_information/)

  assert.match(headerPanelSource, /normalizeTypedSectionSettings/)
  assert.match(headerPanelSource, /settings\.menu/)
  assert.match(headerPanelSource, /main-menu/)
  assert.match(headerPanelSource, /currentMenuLabel/)
  assert.match(headerPanelSource, /text-foreground/)
  assert.match(headerPanelSource, /text-muted-foreground/)
  assert.match(headerPanelSource, /border-border/)
  assert.match(headerPanelSource, /bg-background-deep/)
  assert.doesNotMatch(headerPanelSource, /#[0-9a-fA-F]{3,8}/)
  assert.match(headerPanelSource, /SpWebNavPickerDialog/)
  assert.match(headerPanelSource, /PickerDialog\.vue/)
  assert.match(headerPanelSource, /initialSelected/)
  assert.match(headerPanelSource, /\$dialog\.open/)
  assert.match(headerPanelSource, /updateSetting\('menu', selected\.id\)/)
  assert.doesNotMatch(headerPanelSource, /updateSetting\('menu', selected\)/)
  assert.doesNotMatch(headerPanelSource, /dialogMode: true/)
  assert.doesNotMatch(headerPanelSource, /\$picker\.webnav/)
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
