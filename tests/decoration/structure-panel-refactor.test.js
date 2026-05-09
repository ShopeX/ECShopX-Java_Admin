const assert = require('assert')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '../../')
const read = (relativePath) => fs.readFileSync(path.resolve(root, relativePath), 'utf8')
const exists = (relativePath) => fs.existsSync(path.resolve(root, relativePath))

function run() {
  assert.ok(
    exists('src/components/sp-web-decoration/components/StructureInsertMenu.vue'),
    'StructureInsertMenu.vue should exist'
  )
  assert.ok(
    exists('src/components/sp-web-decoration/components/StructureInsertGap.vue'),
    'StructureInsertGap.vue should exist'
  )
  assert.ok(
    exists('src/components/sp-web-decoration/components/StructureBlockRow.vue'),
    'StructureBlockRow.vue should exist'
  )
  assert.ok(
    exists('src/components/sp-web-decoration/components/StructureSectionRow.vue'),
    'StructureSectionRow.vue should exist'
  )

  const panelSource = read('src/components/sp-web-decoration/components/StructurePanel.vue')
  const menuSource = read('src/components/sp-web-decoration/components/StructureInsertMenu.vue')
  const gapSource = read('src/components/sp-web-decoration/components/StructureInsertGap.vue')
  const blockRowSource = read('src/components/sp-web-decoration/components/StructureBlockRow.vue')
  const sectionRowSource = read(
    'src/components/sp-web-decoration/components/StructureSectionRow.vue'
  )

  assert.match(panelSource, /StructureInsertMenu/)
  assert.match(panelSource, /StructureInsertGap/)
  assert.match(panelSource, /StructureBlockRow/)
  assert.match(panelSource, /StructureSectionRow/)
  assert.strictEqual(
    (panelSource.match(/<StructureSectionRow/g) || []).length,
    4,
    'StructurePanel should render all section rows through StructureSectionRow'
  )
  assert.doesNotMatch(panelSource, /<GalleryVertical/)
  assert.doesNotMatch(panelSource, /<GripVertical/)
  assert.doesNotMatch(panelSource, /data-drag-handle="section"/)
  assert.doesNotMatch(panelSource, /data-drag-handle="header-zone-section"/)
  assert.doesNotMatch(panelSource, /data-drag-handle="footer-zone-section"/)
  assert.match(menuSource, /sp-structure-insert-menu/)
  assert.match(gapSource, /sp-structure-insert-gap/)
  assert.match(gapSource, /sp-structure-insert-gap__btn/)
  assert.match(blockRowSource, /data-drag-handle="block"/)
  assert.match(blockRowSource, /\$emit\('select'/)
  assert.match(blockRowSource, /\$emit\('remove'/)
  assert.match(blockRowSource, /\$emit\('toggle-disabled'/)
  assert.match(sectionRowSource, /data-drag-handle/)
  assert.match(sectionRowSource, /\$emit\('select'/)
  assert.match(sectionRowSource, /\$emit\('toggle'/)
  assert.match(sectionRowSource, /\$emit\('toggle-disabled'/)
  assert.match(menuSource, /v-for="item in items"/)
  assert.match(menuSource, /\$emit\('select', item\)/)

  console.log('structure-panel-refactor.test.js passed')
}

run()
