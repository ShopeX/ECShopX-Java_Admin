const assert = require('assert')
const fs = require('fs')
const path = require('path')

function read(relativePath) {
  return fs.readFileSync(path.resolve(__dirname, '../../', relativePath), 'utf8')
}

function testAnnouncementRendersInsideHeaderGroup() {
  const source = read('src/components/sp-web-decoration/components/StructurePanel.vue')
  const headerIndex = source.indexOf("@click=\"$emit('select-section', 'header')\"")
  const headerGroupIndex = source.indexOf("{{ $t('54e3d97e.917f14') }}")
  const pageGroupIndex = source.indexOf("{{ $t('54e3d97e.cdb7d0') }}")
  const footerGroupIndex = source.indexOf("{{ $t('54e3d97e.4eb88f') }}")

  assert.notStrictEqual(headerIndex, -1)
  assert.notStrictEqual(headerGroupIndex, -1)
  assert.notStrictEqual(pageGroupIndex, -1)
  assert.notStrictEqual(footerGroupIndex, -1)
  assert.ok(headerGroupIndex < pageGroupIndex, 'header group should render before page group')
  assert.ok(pageGroupIndex < footerGroupIndex, 'page group should render before footer group')
  assert.match(source, /text-\[11px\] font-semibold/)
}

function run() {
  testAnnouncementRendersInsideHeaderGroup()
  console.log('structure-global-layout.test.js passed')
}

run()
