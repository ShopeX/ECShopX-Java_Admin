/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 *
 * 站点语言配置：API LanguageCode ↔ admin store lang（zhcn/en/ar/zhtw/ja/ru）
 */
import { LANGUAGES } from '@/i18n'

/** 固定六种语言（与 Apifox LanguageCode 一致，顺序固定） */
export const FIXED_LANGUAGE_CODES = ['zh-CN', 'en-CN', 'ar-SA', 'zh-TW', 'ja-JP', 'ru-RU']

const API_TO_STORE = {
  'zh-CN': 'zhcn',
  'zh-cn': 'zhcn',
  zhcn: 'zhcn',
  'zh-TW': 'zhtw',
  'zh-tw': 'zhtw',
  zhtw: 'zhtw',
  'en-CN': 'en',
  'en-US': 'en',
  'en-us': 'en',
  en: 'en',
  'ar-SA': 'ar',
  'ar-sa': 'ar',
  ar: 'ar',
  'ja-JP': 'ja',
  'ja-jp': 'ja',
  ja: 'ja',
  'ru-RU': 'ru',
  'ru-ru': 'ru',
  ru: 'ru'
}

const STORE_TO_API = {
  zhcn: 'zh-CN',
  zhtw: 'zh-TW',
  en: 'en-CN',
  ar: 'ar-SA',
  ja: 'ja-JP',
  ru: 'ru-RU'
}

const DISPLAY_FALLBACK = {
  'zh-CN': '中文',
  'en-CN': 'English',
  'ar-SA': 'العربية',
  'zh-TW': '中文繁体',
  'ja-JP': '日本語',
  'ru-RU': 'Русский'
}

export function mapApiCodeToStoreLang(code) {
  const raw = String(code || '').trim()
  if (!raw) return ''
  if (API_TO_STORE[raw]) return API_TO_STORE[raw]
  return API_TO_STORE[raw.toLowerCase()] || ''
}

export function mapStoreLangToApiCode(storeLang) {
  return STORE_TO_API[storeLang] || ''
}

export function pickLanguagePayload(raw) {
  if (!raw || typeof raw !== 'object') return {}
  if (raw.languages || raw.defaultLanguage !== undefined || raw.version !== undefined) {
    return raw
  }
  if (raw.data && typeof raw.data === 'object') {
    return pickLanguagePayload(raw.data)
  }
  return raw
}

/**
 * 归一化管理端配置（始终补齐六种语言）
 */
export function normalizeAdminLanguageSetting(raw) {
  const payload = pickLanguagePayload(raw)
  const rows = Array.isArray(payload.languages) ? payload.languages : []
  const rowMap = new Map()
  rows.forEach((row) => {
    const code = String(row?.code || '').trim()
    const canonical = mapStoreLangToApiCode(mapApiCodeToStoreLang(code)) || code
    if (FIXED_LANGUAGE_CODES.includes(canonical)) {
      rowMap.set(canonical, row)
    }
  })

  const languages = FIXED_LANGUAGE_CODES.map((code, index) => {
    const row = rowMap.get(code)
    const enabled = row ? Boolean(row.enabled) : code === 'zh-CN'
    return {
      code,
      displayName: row?.displayName || DISPLAY_FALLBACK[code],
      enabled,
      sort: Number(row?.sort) || index + 1,
      storeLang: mapApiCodeToStoreLang(code)
    }
  })

  const enabledCodes = languages.filter((l) => l.enabled).map((l) => l.code)
  let defaultLanguage = mapStoreLangToApiCode(mapApiCodeToStoreLang(payload.defaultLanguage))
  if (!defaultLanguage || !enabledCodes.includes(defaultLanguage)) {
    defaultLanguage = enabledCodes[0] || 'zh-CN'
  }

  return {
    version: Number(payload.version) || 0,
    configValid: payload.configValid !== false,
    configWarning: payload.configWarning || null,
    defaultLanguage,
    enabledCount: enabledCodes.length,
    languages,
    updatedAt: payload.updatedAt
  }
}

/** 无配置时的初始态：仅中文开启且为默认 */
export function createDefaultAdminLanguageSetting() {
  return normalizeAdminLanguageSetting({
    version: 0,
    defaultLanguage: 'zh-CN',
    languages: FIXED_LANGUAGE_CODES.map((code, index) => ({
      code,
      displayName: DISPLAY_FALLBACK[code],
      enabled: code === 'zh-CN',
      sort: index + 1
    }))
  })
}

export function getEnabledStoreLangs(setting) {
  const normalized = setting || createDefaultAdminLanguageSetting()
  return normalized.languages.filter((l) => l.enabled).map((l) => l.storeLang)
}

export function getStoreLangLabel(storeLang) {
  return (LANGUAGES[storeLang] && LANGUAGES[storeLang].label) || storeLang
}

const CACHE_KEY = 'admin_site_language_setting'
const CACHE_TTL_MS = 60 * 1000

export function readLanguageSettingCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.normalized || !parsed?.ts) return null
    if (Date.now() - parsed.ts > CACHE_TTL_MS) return null
    return parsed.normalized
  } catch {
    return null
  }
}

export function writeLanguageSettingCache(normalized) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), normalized }))
  } catch {
    // ignore
  }
}

export function clearLanguageSettingCache() {
  try {
    sessionStorage.removeItem(CACHE_KEY)
  } catch {
    // ignore
  }
}
