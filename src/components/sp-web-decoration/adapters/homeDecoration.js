import { createHomeDsl, createGlobalDsl, serializeDsl, deserializeDsl } from '../utils/dsl.js'
import { createGlobalSections } from '../definitions/documents/global.js'

const STORAGE_PREFIX = 'decoration:home:'
const GLOBAL_STORAGE_KEY = 'decoration:global'

function getStorage() {
  if (typeof sessionStorage !== 'undefined') {
    return sessionStorage
  }
  if (typeof globalThis !== 'undefined' && globalThis.sessionStorage) {
    return globalThis.sessionStorage
  }
  return null
}

function getStorageKey(templateId) {
  return `${STORAGE_PREFIX}${templateId || 'draft'}`
}

export async function loadHomeDecoration({ templateId = '', scene = '1001' } = {}) {
  const fallbackDsl = createHomeDsl({
    pageId: String(templateId || ''),
    scene
  })
  const storage = getStorage()
  if (!storage) {
    return { dsl: fallbackDsl, source: 'default' }
  }

  const rawValue = storage.getItem(getStorageKey(templateId))
  if (!rawValue) {
    return { dsl: fallbackDsl, source: 'default' }
  }

  try {
    return {
      dsl: deserializeDsl(JSON.parse(rawValue)),
      source: 'session'
    }
  } catch (error) {
    return { dsl: fallbackDsl, source: 'default' }
  }
}

export async function saveHomeDecoration({ templateId = '', dsl }) {
  const storage = getStorage()

  if (storage) {
    storage.setItem(getStorageKey(templateId), JSON.stringify(serializeDsl(dsl)))
  }

  return {
    dsl,
    persisted: Boolean(storage),
    messageKey: '4c11e15d.ebf4e4'
  }
}

export async function loadGlobalDecoration() {
  const fallbackDsl = createGlobalDsl(createGlobalSections())
  const storage = getStorage()
  if (!storage) {
    return { dsl: fallbackDsl, source: 'default' }
  }

  const rawValue = storage.getItem(GLOBAL_STORAGE_KEY)
  if (!rawValue) {
    return { dsl: fallbackDsl, source: 'default' }
  }

  try {
    return {
      dsl: deserializeDsl(JSON.parse(rawValue)),
      source: 'session'
    }
  } catch (error) {
    return { dsl: fallbackDsl, source: 'default' }
  }
}

export async function saveGlobalDecoration({ dsl }) {
  const storage = getStorage()
  if (storage) {
    storage.setItem(GLOBAL_STORAGE_KEY, JSON.stringify(serializeDsl(dsl)))
  }

  return {
    dsl,
    persisted: Boolean(storage),
    messageKey: '4c11e15d.ebf4e4'
  }
}

export default {
  loadHomeDecoration,
  saveHomeDecoration,
  loadGlobalDecoration,
  saveGlobalDecoration
}
