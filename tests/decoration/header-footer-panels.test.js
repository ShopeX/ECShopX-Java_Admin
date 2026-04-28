const assert = require('assert')
const fs = require('fs')
const path = require('path')

function read(relativePath) {
  return fs.readFileSync(path.resolve(__dirname, '../../', relativePath), 'utf8')
}

function testHeaderFooterBlockPanelFilesExist() {
  ;[
    'HeaderPanel.vue',
    'FooterPanel.vue',
    'BrandBlockPanel.vue',
    'LinkListBlockPanel.vue',
    'NewsletterBlockPanel.vue'
  ].forEach((fileName) => {
    assert.strictEqual(
      fs.existsSync(
        path.resolve(__dirname, `../../src/components/sp-web-decoration/panels/${fileName}`)
      ),
      true
    )
  })
}

function testRegistryAndConfigPanelWireHeaderFooterBlocks() {
  const registrySource = read('src/components/sp-web-decoration/registry.js')
  const configPanelSource = read('src/components/sp-web-decoration/components/ConfigPanel.vue')

  assert.match(registrySource, /normalizeHeaderSettings/)
  assert.match(registrySource, /normalizeFooterSettings/)
  assert.match(registrySource, /type: 'brand'/)
  assert.match(registrySource, /type: 'link_list'/)
  assert.match(registrySource, /type: 'newsletter'/)

  assert.match(configPanelSource, /BrandBlockPanel/)
  assert.match(configPanelSource, /LinkListBlockPanel/)
  assert.match(configPanelSource, /NewsletterBlockPanel/)
}

function testHeaderFooterPanelFieldsFollowPlan() {
  const headerPanelSource = read('src/components/sp-web-decoration/panels/HeaderPanel.vue')
  const footerPanelSource = read('src/components/sp-web-decoration/panels/FooterPanel.vue')
  const brandPanelSource = read('src/components/sp-web-decoration/panels/BrandBlockPanel.vue')
  const linkListPanelSource = read('src/components/sp-web-decoration/panels/LinkListBlockPanel.vue')
  const newsletterPanelSource = read(
    'src/components/sp-web-decoration/panels/NewsletterBlockPanel.vue'
  )

  assert.match(headerPanelSource, /sticky_header_type/)
  assert.match(headerPanelSource, /padding_top/)
  assert.match(headerPanelSource, /padding_bottom/)
  assert.match(headerPanelSource, /menu_type_desktop/)
  assert.match(headerPanelSource, /show_line_separator/)
  assert.match(headerPanelSource, /logo_position/)
  assert.match(headerPanelSource, /mobile_logo_position/)
  assert.match(headerPanelSource, /layout/)
  assert.match(headerPanelSource, /margin_bottom/)
  assert.match(headerPanelSource, /enable_country_selector/)
  assert.match(headerPanelSource, /enable_language_selector/)
  assert.match(headerPanelSource, /enable_customer_avatar/)
  assert.match(headerPanelSource, /menu_color_mode/)
  assert.match(headerPanelSource, /menu_color_scheme/)

  assert.match(footerPanelSource, /content_alignment/)
  assert.match(footerPanelSource, /newsletter_heading/)
  assert.match(footerPanelSource, /margin_top/)
  assert.match(footerPanelSource, /payment_enable/)
  assert.match(footerPanelSource, /newsletter_enable/)
  assert.match(footerPanelSource, /enable_brand_information/)

  assert.match(brandPanelSource, /enable_social/)
  assert.match(linkListPanelSource, /heading/)
  assert.match(linkListPanelSource, /menu/)
  assert.match(linkListPanelSource, /alignment/)
  assert.match(newsletterPanelSource, /title/)
  assert.match(newsletterPanelSource, /alignment/)
  assert.match(newsletterPanelSource, /enable_social/)
}

function run() {
  testHeaderFooterBlockPanelFilesExist()
  testRegistryAndConfigPanelWireHeaderFooterBlocks()
  testHeaderFooterPanelFieldsFollowPlan()
  console.log('header-footer-panels.test.js passed')
}

run()
