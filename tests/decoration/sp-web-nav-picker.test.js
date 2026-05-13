const assert = require('assert')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '../../')
const read = (relativePath) => fs.readFileSync(path.resolve(root, relativePath), 'utf8')
const exists = (relativePath) => fs.existsSync(path.resolve(root, relativePath))

function run() {
  assert.ok(
    !exists('src/components/sp-web-nav-picker/index.vue'),
    'SpWebNavPicker adapter should be removed'
  )
  assert.ok(
    exists('src/components/sp-web-nav-picker/PickerDialog.vue'),
    'SpWebNavPicker dialog should exist'
  )

  const dialogSource = read('src/components/sp-web-nav-picker/PickerDialog.vue')
  const pickerPluginSource = read('src/components/sp-picker/plugin.js')
  const componentBootstrapSource = read('src/bootstrap/component.js')

  assert.match(dialogSource, /name: 'SpWebNavPickerDialog'/)
  assert.match(dialogSource, /initialSelected/)
  assert.match(dialogSource, /sp-web-nav-picker bg-card text-foreground/)
  assert.match(dialogSource, /sp-web-nav-picker__search -mt-\[12px\] !bg-white/)
  assert.match(dialogSource, /SpFormPlus/)
  assert.match(dialogSource, /SpFinder/)
  assert.match(dialogSource, /@shopex-ui\/finder/)
  assert.match(dialogSource, /createSetting/)
  assert.match(dialogSource, /url="\/web-menus"/)
  assert.match(dialogSource, /__picker_checkbox__/)
  assert.match(dialogSource, /const checked = row\.id === this\.selectedRow\?\.id/)
  assert.match(dialogSource, /el-icon-check/)
  assert.match(dialogSource, /border-primary bg-primary text-primary-foreground/)
  assert.match(dialogSource, /border-border bg-card text-transparent/)
  assert.match(dialogSource, /event\.stopPropagation\(\)/)
  assert.match(dialogSource, /beforeSearch/)
  assert.match(dialogSource, /this\.\$refs\.finder\.refresh\(true\)/)
  assert.match(dialogSource, /rowClassName/)
  assert.match(dialogSource, /is-picker-selected/)
  assert.match(dialogSource, /highlight-current-row/)
  assert.match(dialogSource, /hsl\(var\(--primary\) \/ 0\.08\)/)
  assert.match(dialogSource, /submit\(\)/)
  assert.match(dialogSource, /\$emit\('close', this\.selectedRow\)/)
  assert.match(dialogSource, /id: row\.id/)
  assert.match(dialogSource, /name: row\.name/)
  assert.match(dialogSource, /key: row\.key/)
  assert.match(dialogSource, /name: '导航菜单'/)
  assert.match(dialogSource, /name: '菜单项'/)
  assert.match(dialogSource, /top_level_item_names/)
  assert.match(dialogSource, /getMenuItemText/)
  assert.match(dialogSource, /String\(text\)\.trim\(\) \|\| '—'/)
  assert.doesNotMatch(dialogSource, /name: '标识符（key）'/)
  assert.doesNotMatch(dialogSource, /name: '状态'/)
  assert.doesNotMatch(dialogSource, /\$api\.decoration\.getMenuList/)
  assert.doesNotMatch(dialogSource, /<el-table/)
  assert.doesNotMatch(dialogSource, /el-checkbox/)
  assert.doesNotMatch(dialogSource, /el-radio/)
  assert.doesNotMatch(dialogSource, /<el-pagination/)
  assert.doesNotMatch(dialogSource, /margin: -12px/)

  assert.doesNotMatch(pickerPluginSource, /webnav/)
  assert.doesNotMatch(pickerPluginSource, /WebNavPickerDialog/)
  assert.doesNotMatch(pickerPluginSource, /openWebNavPicker/)
  const dialogPlusPluginSource = read('src/components/sp-dialog-plus/plugin.js')
  assert.match(dialogPlusPluginSource, /openComponent/)
  assert.match(dialogPlusPluginSource, /open\(componentOrOptions, options\)/)
  assert.match(dialogPlusPluginSource, /componentOrOptions\.component \|\| componentOrOptions/)
  assert.match(
    dialogPlusPluginSource,
    /const dialogContent = this\.\$refs\.dialogContent \|\| contentVm/
  )
  assert.match(dialogPlusPluginSource, /dialogContent\.submit\(\)/)
  assert.match(
    dialogPlusPluginSource,
    /if \(dialogContent && typeof dialogContent\.submit === 'function'\)/
  )
  assert.match(
    dialogPlusPluginSource,
    /dialogContent\.submit\(\)\n\s+callback\(\)\n\s+return\n\s+}\n\s+callback\(\)/
  )
  assert.match(dialogPlusPluginSource, /Object\.defineProperty\(Vue\.prototype, '\$dialog'/)
  assert.match(dialogPlusPluginSource, /parent: parent \|\| undefined/)
  assert.match(dialogPlusPluginSource, /createDialogMethods\(this\)/)

  assert.doesNotMatch(componentBootstrapSource, /@\/plugins\/picker/)
  assert.doesNotMatch(componentBootstrapSource, /sp-web-nav-picker/)
  assert.match(componentBootstrapSource, /Vue\.use\(plugin\)/)

  console.log('sp-web-nav-picker.test.js passed')
}

run()
