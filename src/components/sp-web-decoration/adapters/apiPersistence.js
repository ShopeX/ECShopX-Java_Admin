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
import { createHomeDsl, createGlobalDsl, serializeDsl, deserializeDsl } from '../utils/dsl'
import { createGlobalSections } from '../registry'

export const DSL_ROW_TYPE = 'ECX_SP_WEB_DECORATION_DSL_V1'
/** 与 legacy 头/尾 name 区分，整包 globalDsl JSON 存 params */
export const GLOBAL_DECORATION_PAGE_NAME = 'ecx_sp_web_decoration_global'

function unwrapPayload(res) {
  if (res == null) return null
  if (Array.isArray(res)) return res
  if (res.data !== undefined && res.data !== null) return res.data
  return res
}

/**
 * @returns {{ dsl: object, contentRowId: number, source: string }}
 */
export async function loadPageDslFromApi({ templateId, scene }) {
  const fallback = {
    dsl: createHomeDsl({ pageId: String(templateId || ''), scene }),
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
        cfg = typeof row.config === 'string' ? JSON.parse(row.config) : row.config
      } catch (e) {
        continue
      }
      if (cfg && cfg.type === DSL_ROW_TYPE && cfg.dsl) {
        return {
          dsl: deserializeDsl(cfg.dsl),
          contentRowId: Number(row.id) || 0,
          source: 'api'
        }
      }
    }
  } catch (e) {
    console.warn('[decoration] loadPageDslFromApi', e)
  }
  return fallback
}

/**
 * @returns {{ dsl: object, source: string }}
 */
export async function loadGlobalDslFromApi() {
  const fallback = {
    dsl: createGlobalDsl(createGlobalSections()),
    source: 'default'
  }
  try {
    const raw = await getHeaderOrFooter({ page_name: GLOBAL_DECORATION_PAGE_NAME })
    const row = unwrapPayload(raw)
    if (!row || row.params == null || row.params === '') return fallback

    const parsed = typeof row.params === 'string' ? JSON.parse(row.params) : row.params
    if (parsed && parsed.pageType === 'global' && parsed.sections) {
      return { dsl: deserializeDsl(parsed), source: 'api' }
    }
  } catch (e) {
    console.warn('[decoration] loadGlobalDslFromApi', e)
  }
  return fallback
}

/**
 * @param {{ templateId: string, dsl: object, contentRowId?: number }} args
 */
export async function savePageDslToApi({ templateId, dsl, contentRowId = 0 }) {
  const payload = [
    {
      id: contentRowId || 0,
      type: DSL_ROW_TYPE,
      dsl: serializeDsl(dsl)
    }
  ]
  await saveTemplateContent({
    theme_pc_template_id: templateId,
    config: JSON.stringify(payload)
  })
}

export async function saveGlobalDslToApi({ globalDsl }) {
  await saveHeaderOrFooter({
    page_name: GLOBAL_DECORATION_PAGE_NAME,
    config: JSON.stringify(serializeDsl(globalDsl))
  })
}
