const assert = require('assert')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '../../')
const read = (relativePath) => fs.readFileSync(path.resolve(root, relativePath), 'utf8')

function run() {
  const panelSource = read('src/components/sp-web-decoration/components/StructurePanel.vue')

  assert.match(panelSource, /showHeaderFooterSectionInsertControls/)
  assert.match(panelSource, /v-show="showHeaderFooterSectionInsertControls"/)
  assert.match(panelSource, /toggleInsertMenu\('section', 'header'/)
  assert.match(panelSource, /toggleInsertMenu\('section', 'footer'/)

  console.log('structure-panel-mvp.test.js passed')
}

run()
