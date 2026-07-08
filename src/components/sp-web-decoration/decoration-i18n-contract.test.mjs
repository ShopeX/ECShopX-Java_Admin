import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'

const root = process.cwd()
const read = (filePath) => readFileSync(path.resolve(root, filePath), 'utf8')
const chinesePattern = /[\u4e00-\u9fff]/

const visibleUiFiles = [
  'src/components/sp-web-decoration/panels/CarouselPanel.vue',
  'src/components/sp-web-decoration/panels/SectionAppearancePanel.vue',
  'src/components/sp-web-decoration/panels/ProductTabShelfPanel.vue',
  'src/components/sp-web-decoration/panels/ProductTabBlockPanel.vue',
  'src/components/sp-web-decoration/panels/ImageHotspotPanel.vue',
  'src/components/sp-web-decoration/panels/ImageHotspotEditorDialog.vue',
  'src/components/sp-web-decoration/panels/FooterTextBlockPanel.vue',
  'src/components/sp-web-decoration/panels/FooterMenuBlockPanel.vue',
  'src/components/sp-web-decoration/panels/FooterImageBlockPanel.vue',
  'src/components/sp-web-decoration/panels/ImageBlockPanel.vue',
  'src/components/sp-web-decoration/panels/VideoBlockPanel.vue',
  'src/components/sp-web-decoration/panels/HeaderPanel.vue',
  'src/components/sp-web-decoration/components/ConfigPanel.vue',
  'src/components/sp-web-decoration/index.vue',
  'src/views/decoration/web-template/index.vue'
]

function stripComments(source) {
  return source.replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')
}

function findChineseLines(filePath) {
  return stripComments(read(filePath))
    .split('\n')
    .map((line, index) => ({ line: line.trim(), number: index + 1 }))
    .filter(({ line }) => chinesePattern.test(line))
}

function loadSectionAppearance() {
  const source = read('src/components/sp-web-decoration/utils/sectionAppearance.js')
    .replace(/export\s+const\s+/g, 'const ')
    .replace(/export\s+function\s+/g, 'function ')
    .replace(/export\s+default\s+\{[\s\S]*$/, '')

  return new Function(
    `${source}\nreturn { SECTION_PADDING_OPTIONS, SECTION_COLOR_SCHEMES }`
  )()
}

function loadDecorationI18nHelper(locale = 'en') {
  const messages = {
    en: {
      'test.name': 'English name',
      'test.heading': 'English heading'
    },
    'zh-CN': {
      'test.name': '中文名称',
      'test.heading': '中文标题'
    }
  }
  const i18n = {
    locale,
    t(key) {
      return messages[this.locale]?.[key] || key
    }
  }
  const source = read('src/components/sp-web-decoration/utils/i18n.js')
    .replace(/import\s+\{\s*i18n\s+\}\s+from\s+'@\/i18n'\n/, '')
    .replace(/export\s+function\s+/g, 'function ')
    .replace(/export\s+default\s+\{[\s\S]*$/, '')

  return new Function(
    'i18n',
    `${source}\nreturn { decorationT, i18nValue, resolveDecorationI18nValue }`
  )(i18n)
}

function loadFactoryWithStubs(helper) {
  const definitions = {
    section: {
      type: 'test-section',
      name: helper.i18nValue('test.name', '名称'),
      defaultBlocks: [
        {
          type: 'test-block',
          settings: { heading: helper.i18nValue('test.heading', '标题') }
        }
      ]
    },
    block: {
      type: 'test-block',
      name: helper.i18nValue('test.heading', '标题')
    }
  }
  const stubs = {
    generateSectionId: () => 'section-id',
    generateBlockId: () => 'block-id',
    getAllowedBlockTypes: () => ['test-block'],
    getTypedSectionDefinition: () => definitions.section,
    getTypedBlockDefinition: () => definitions.block,
    getSectionDefaultSettings: () => ({ heading: helper.i18nValue('test.heading', '标题') }),
    getBlockDefaultSettings: () => ({ heading: helper.i18nValue('test.heading', '标题') }),
    resolveDecorationI18nValue: helper.resolveDecorationI18nValue
  }
  const source = read('src/components/sp-web-decoration/definitions/factory.js')
    .replace(/import[\s\S]*?from\s+'.*?'\n/g, '')
    .replace(/export\s+function\s+/g, 'function ')
    .replace(/export\s+default\s+\{[\s\S]*$/, '')

  return new Function(
    ...Object.keys(stubs),
    `${source}\nreturn { createTypedSection, createTypedBlock }`
  )(...Object.values(stubs))
}

function stringify(value) {
  return JSON.stringify(value)
}

test('decoration visible ui has no hardcoded Chinese', () => {
  const offenders = visibleUiFiles.flatMap((filePath) =>
    findChineseLines(filePath).map(({ number, line }) => `${filePath}:${number}: ${line}`)
  )

  assert.deepEqual(offenders, [])
})

test('section appearance options expose label keys', () => {
  const { SECTION_PADDING_OPTIONS, SECTION_COLOR_SCHEMES } = loadSectionAppearance()

  for (const option of [...SECTION_PADDING_OPTIONS, ...SECTION_COLOR_SCHEMES]) {
    assert.equal(typeof option.labelKey, 'string')
    assert.ok(option.labelKey)
    assert.equal(option.label, undefined)
  }
})

test('default dsl i18n markers are resolved before persistence', () => {
  const helper = loadDecorationI18nHelper('en')
  const { createTypedSection } = loadFactoryWithStubs(helper)
  const section = createTypedSection('test-section')

  assert.equal(section.title, 'English name')
  assert.equal(section.settings.heading, 'English heading')
  assert.equal(Object.values(section.blocks)[0].title, 'English heading')
  assert.equal(Object.values(section.blocks)[0].settings.heading, 'English heading')
  assert.doesNotMatch(stringify(section), /__decorationI18n/)
})

test('default dsl resolves English text under English admin locale', () => {
  const helper = loadDecorationI18nHelper('en')

  assert.equal(
    helper.resolveDecorationI18nValue({
      intro: helper.i18nValue('test.heading', '标题')
    }).intro,
    'English heading'
  )
})

test('locale files contain decoration i18n keys', () => {
  const requiredKeys = [
    '30ac5b9e.3c92ff',
    '5987e78b.b372fc',
    '24ca8e2b.18c634',
    '6daca440.78964b',
    'a01949a4.add0b7'
  ]
  const locales = ['zh-CN', 'en', 'ar'].map((locale) =>
    JSON.parse(read(`src/i18n/locales/${locale}.json`))
  )

  for (const messages of locales) {
    for (const key of requiredKeys) {
      assert.equal(typeof messages[key], 'string', key)
      assert.ok(messages[key])
    }
  }
})
