const assert = require('assert')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '../../')
const read = (relativePath) => fs.readFileSync(path.resolve(root, relativePath), 'utf8')

function run() {
  const rowSource = read('src/components/sp-web-decoration/components/StructureSectionRow.vue')
  const panelSource = read('src/components/sp-web-decoration/components/StructurePanel.vue')

  assert.match(rowSource, /showExpandIcon/)
  assert.match(rowSource, /v-else-if="expandable"/)
  assert.match(rowSource, /opacity-0/)
  assert.match(panelSource, /show-expand-icon="canSectionContainBlocks\(sectionId\)"/)
  assert.match(panelSource, /show-expand-icon="canSectionContainBlocks\('footer'\)"/)

  console.log('structure-section-row.test.js passed')
}

run()
