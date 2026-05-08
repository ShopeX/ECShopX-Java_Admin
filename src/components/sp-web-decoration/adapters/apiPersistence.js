/**
 * PC 模板装修：与 ThemeBundle pctemplate 接口对接，存取 ECX 编辑器 DSL（与 legacy 微件并存时用独立 type 标记）。
 * 页面内容：getTemplateContent / saveTemplateContent（config 为 JSON 数组字符串）
 * 全局头尾合并存一条：getHeaderOrFooter / saveHeaderOrFooter（page_name 固定）
 */
import {
  getTemplateContent,
  saveTemplateContent,
  getHeaderOrFooter,
  saveHeaderOrFooter
} from '@/api/webtemplate'
import {
  createHomeDsl,
  createGlobalDsl,
  serializeDsl,
  deserializeDsl,
  ensureGlobalDslDefaults
} from '../utils/dsl.js'
import { createGlobalSections } from '../definitions/documents/global.js'

export const DSL_ROW_TYPE = 'ECX_SP_WEB_DECORATION_DSL_V1'
export const GLOBAL_DECORATION_PAGE_NAME = 'ecx_sp_web_decoration_global'

function createPageFallback(templateId, scene) {
  return createHomeDsl({ pageId: String(templateId || ''), scene })
}

function createGlobalFallback() {
  return createGlobalDsl(createGlobalSections())
}

function normalizePageDsl(raw, templateId, scene) {
  const fallback = createPageFallback(templateId, scene)
  if (raw == null) return fallback
  let payload = raw
  if (typeof raw === 'string') {
    try {
      payload = JSON.parse(raw)
    } catch (e) {
      return fallback
    }
  }
  if (typeof payload !== 'object' || payload === null) return fallback
  try {
    const d = deserializeDsl(payload)
    if (!d || typeof d !== 'object') return fallback
    if (typeof d.sections !== 'object' || d.sections === null) return fallback
    if (!Array.isArray(d.order)) d.order = []
    if (!d.pageType) d.pageType = fallback.pageType
    if (d.pageId === undefined || d.pageId === null) d.pageId = fallback.pageId
    if (!d.meta || typeof d.meta !== 'object') d.meta = { ...(fallback.meta || {}) }
    return d
  } catch (e) {
    console.warn('[decoration] normalizePageDsl', e)
    return fallback
  }
}

function normalizeGlobalDsl(raw) {
  const fallback = createGlobalFallback()
  if (raw == null) return fallback
  let payload = raw
  if (typeof raw === 'string') {
    try {
      payload = JSON.parse(raw)
    } catch (e) {
      return fallback
    }
  }
  if (typeof payload !== 'object' || payload === null) return fallback
  try {
    const d = deserializeDsl(payload)
    if (!d || typeof d !== 'object') return fallback
    if (d.pageType !== 'global') return fallback
    const sections = d.sections || {}
    const keys = Object.keys(sections)
    if (keys.length === 0) return fallback

    if (!Array.isArray(d.order)) d.order = []
    if (d.order.length === 0) {
      const preferred = (fallback.order || []).filter((id) => sections[id])
      d.order = preferred.length ? preferred : keys
    }
    return ensureGlobalDslDefaults(d)
  } catch (e) {
    console.warn('[decoration] normalizeGlobalDsl', e)
    return fallback
  }
}

function unwrapPayload(res) {
  if (res == null) return null
  if (Array.isArray(res)) return res
  if (res.data !== undefined && res.data !== null) return res.data
  return res
}

export async function loadPageDslFromApi({ templateId, scene }) {
  const fallback = {
    dsl: createPageFallback(templateId, scene),
    contentRowId: 0,
    source: 'default'
  }
  if (!templateId) return fallback

  try {
    const raw = await getTemplateContent({ theme_pc_template_id: templateId })
    const list = unwrapPayload(raw)
    if (!Array.isArray(list) || !list.length) return fallback

    for (const row of list) {
      let cfg
      try {
        cfg = JSON.parse(row?.config || '[]')
      } catch (e) {
        continue
      }
      const target = Array.isArray(cfg)
        ? cfg.find((item) => item && item.type === DSL_ROW_TYPE)
        : null
      if (!target || !target.dsl) continue
      return {
        dsl: normalizePageDsl(target.dsl, templateId, scene),
        contentRowId: row.id || 0,
        source: 'api'
      }
    }
  } catch (e) {
    console.warn('[decoration] loadPageDslFromApi', e)
  }
  return fallback
}

export async function savePageDslToApi({ templateId, contentRowId, dsl, scene }) {
  const payload = {
    type: DSL_ROW_TYPE,
    dsl: serializeDsl(dsl)
  }
  const config = JSON.stringify([payload])
  const body = {
    theme_pc_template_id: templateId,
    config
  }

  if (contentRowId) {
    body.id = contentRowId
  }

  await saveTemplateContent(body)

  return {
    dsl: normalizePageDsl(dsl, templateId, scene),
    contentRowId: contentRowId || 0
  }
}

export async function loadGlobalDslFromApi() {
  try {
    const raw = await getHeaderOrFooter({ page_name: GLOBAL_DECORATION_PAGE_NAME })
    const payload = unwrapPayload(raw)
    if (!payload) return { dsl: createGlobalFallback(), source: 'default' }
    const candidate = payload?.config || payload?.dsl || payload
    return {
      dsl: normalizeGlobalDsl(candidate),
      source: 'api'
    }
  } catch (e) {
    console.warn('[decoration] loadGlobalDslFromApi', e)
    return { dsl: createGlobalFallback(), source: 'default' }
  }
}

export async function saveGlobalDslToApi({ dsl }) {
  const payload = {
    page_name: GLOBAL_DECORATION_PAGE_NAME,
    config: JSON.stringify(serializeDsl(dsl))
  }
  await saveHeaderOrFooter(payload)
  return {
    dsl: normalizeGlobalDsl(dsl)
  }
}

export default {
  loadPageDslFromApi,
  savePageDslToApi,
  loadGlobalDslFromApi,
  saveGlobalDslToApi
}
