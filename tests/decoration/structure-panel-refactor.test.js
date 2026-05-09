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
    exists('src/components/sp-web-decoration/components/StructureInsertPoint.vue'),
    'StructureInsertPoint.vue should exist'
  )
  assert.ok(
    exists('src/components/sp-web-decoration/components/StructureBlockRow.vue'),
    'StructureBlockRow.vue should exist'
  )
  assert.ok(
    exists('src/components/sp-web-decoration/components/StructureSectionRow.vue'),
    'StructureSectionRow.vue should exist'
  )
  assert.ok(
    exists('src/components/sp-web-decoration/components/StructureAddButton.vue'),
    'StructureAddButton.vue should exist'
  )
  assert.ok(
    exists('src/components/sp-web-decoration/components/StructureAddAction.vue'),
    'StructureAddAction.vue should exist'
  )

  const panelSource = read('src/components/sp-web-decoration/components/StructurePanel.vue')
  const menuSource = read('src/components/sp-web-decoration/components/StructureInsertMenu.vue')
  const gapSource = read('src/components/sp-web-decoration/components/StructureInsertGap.vue')
  const insertPointSource = read(
    'src/components/sp-web-decoration/components/StructureInsertPoint.vue'
  )
  const blockRowSource = read('src/components/sp-web-decoration/components/StructureBlockRow.vue')
  const sectionRowSource = read(
    'src/components/sp-web-decoration/components/StructureSectionRow.vue'
  )
  const addButtonSource = read('src/components/sp-web-decoration/components/StructureAddButton.vue')
  const addActionSource = read('src/components/sp-web-decoration/components/StructureAddAction.vue')

  assert.match(panelSource, /StructureInsertPoint/)
  assert.match(panelSource, /StructureBlockRow/)
  assert.match(panelSource, /StructureSectionRow/)
  assert.match(panelSource, /StructureAddAction/)
  assert.strictEqual(
    (panelSource.match(/<StructureInsertPoint/g) || []).length,
    10,
    'StructurePanel should render adjacent insert gaps through StructureInsertPoint'
  )
  assert.doesNotMatch(panelSource, /<StructureInsertGap/)
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
  assert.strictEqual(
    (panelSource.match(/<StructureAddAction/g) || []).length,
    8,
    'StructurePanel should render add button/menu groups through StructureAddAction'
  )
  assert.doesNotMatch(panelSource, /<StructureAddButton/)
  assert.doesNotMatch(panelSource, /StructureAddButton/)
  assert.doesNotMatch(panelSource, /<StructureInsertMenu/)
  assert.doesNotMatch(panelSource, /StructureInsertMenu/)
  assert.doesNotMatch(panelSource, /<CirclePlus/)
  assert.match(menuSource, /sp-structure-insert-menu/)
  assert.match(menuSource, /GalleryVertical/)
  assert.match(menuSource, /Diamond/)
  assert.match(menuSource, /iconType/)
  assert.match(menuSource, /menuIcon/)
  assert.match(menuSource, /shouldShowIcon/)
  assert.doesNotMatch(menuSource, /resolveIcon/)
  assert.match(gapSource, /sp-structure-insert-gap/)
  assert.match(gapSource, /sp-structure-insert-gap__btn/)
  assert.match(insertPointSource, /StructureInsertGap/)
  assert.match(insertPointSource, /StructureInsertMenu/)
  assert.match(insertPointSource, /iconType/)
  assert.match(insertPointSource, /\$emit\('open', \$event\)/)
  assert.match(insertPointSource, /\$emit\('select', \$event\)/)
  assert.match(blockRowSource, /data-drag-handle="block"/)
  assert.match(blockRowSource, /\$emit\('select'/)
  assert.match(blockRowSource, /\$emit\('remove'/)
  assert.match(blockRowSource, /\$emit\('toggle-disabled'/)
  assert.match(sectionRowSource, /data-drag-handle/)
  assert.match(sectionRowSource, /\$emit\('select'/)
  assert.match(sectionRowSource, /\$emit\('toggle'/)
  assert.match(sectionRowSource, /\$emit\('toggle-disabled'/)
  assert.match(addButtonSource, /CirclePlus/)
  assert.match(addButtonSource, /align/)
  assert.match(addButtonSource, /flushStart/)
  assert.match(addButtonSource, /\$emit\('click', \$event\)/)
  assert.match(addActionSource, /StructureAddButton/)
  assert.match(addActionSource, /StructureInsertMenu/)
  assert.match(addActionSource, /iconType/)
  assert.match(addActionSource, /\$emit\('open', \$event\)/)
  assert.match(addActionSource, /\$emit\('select', \$event\)/)
  assert.match(menuSource, /v-for="item in items"/)
  assert.match(menuSource, /\$emit\('select', item\)/)

  console.log('structure-panel-refactor.test.js passed')
}

run()
