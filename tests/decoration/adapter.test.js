const assert = require('assert')

const {
  loadHomeDecoration,
  saveHomeDecoration,
  loadGlobalDecoration,
  saveGlobalDecoration
} = require('../../src/components/DecorationEditor/adapters/homeDecoration')

async function testDefaultLoad() {
  const result = await loadHomeDecoration({ templateId: '22', scene: '1001' })
  assert.strictEqual(result.dsl.pageType, 'home')
  assert.strictEqual(result.dsl.pageId, '22')
  assert.strictEqual(result.dsl.meta.scene, '1001')
}

async function testSessionRoundTrip() {
  const memory = new Map()
  global.sessionStorage = {
    getItem(key) {
      return memory.has(key) ? memory.get(key) : null
    },
    setItem(key, value) {
      memory.set(key, value)
    }
  }

  const payload = {
    pageType: 'home',
    pageId: '22',
    sections: {},
    order: ['carousel-test'],
    meta: { version: 1, scene: '1001' }
  }
  await saveHomeDecoration({ templateId: '22', dsl: payload })
  const loaded = await loadHomeDecoration({ templateId: '22', scene: '1001' })
  assert.deepStrictEqual(loaded.dsl, payload)

  const globalPayload = {
    pageType: 'global',
    pageId: 'global',
    sections: {
      header: { type: 'header', settings: { logoUrl: 'logo' }, blocks: {}, blockOrder: [] },
      footer: { type: 'footer', settings: { copyright: '2026' }, blocks: {}, blockOrder: [] }
    },
    order: ['header', 'footer']
  }
  await saveGlobalDecoration({ dsl: globalPayload })
  const loadedGlobal = await loadGlobalDecoration()
  assert.deepStrictEqual(loadedGlobal.dsl, globalPayload)
  delete global.sessionStorage
}

async function run() {
  await testDefaultLoad()
  await testSessionRoundTrip()
  console.log('adapter.test.js passed')
}

run()
