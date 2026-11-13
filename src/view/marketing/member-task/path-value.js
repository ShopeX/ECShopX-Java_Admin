/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

/** 会员任务路径存页面类型与目标 id；custom_page 另存 webId（两端自定义页 id 不同） */
const LINK_PAGE_LABELS = {
  recharge: '223cc8af.1200d5',
  memberSign: '6bfcaec0.8e34d0',
  registActivity: '223cc8af.7fb92b'
}

export const MEMBER_TASK_PATH_TABS = [
  { name: 'goods', labelKey: 'd81d8932.9897d8', component: 'PickerGoods' },
  { name: 'sale_category', labelKey: 'd81d8932.392d49', component: 'PickerSaleCategory' },
  { name: 'category', labelKey: 'd81d8932.b3ed9f', component: 'PickerCategory' },
  { name: 'regactivity', labelKey: 'd81d8932.2bc045', component: 'PickerRegactivity' },
  { name: 'custom_page', labelKey: 'd81d8932.cee6eb', component: 'PickerPages' },
  { name: 'link', labelKey: 'd81d8932.59ceff', component: 'MemberTaskPathPageList' }
]

/**
 * @param {string} linkPage
 * @param {string|number} id 小程序端 id（或非 custom_page 的通用 id）
 * @param {{ webId?: string|number, title?: string, webTitle?: string }} [extra]
 */
export function encodeMemberTaskPath(linkPage, id, extra = {}) {
  if (!linkPage) return ''
  if (linkPage === 'custom_page') {
    const webId = extra.webId
    if (id == null || id === '' || webId == null || webId === '') return ''
    const payload = {
      linkPage,
      id: String(id),
      webId: String(webId)
    }
    const title = extra.title
    if (title) payload.title = String(title)
    if (extra.webTitle) payload.web_title = String(extra.webTitle)
    return JSON.stringify(payload)
  }
  if (id == null || id === '') return ''
  const payload = {
    linkPage,
    id: String(id)
  }
  if (extra.title) payload.title = String(extra.title)
  return JSON.stringify(payload)
}

export function decodeMemberTaskPath(value) {
  const text = (value || '').trim()
  const empty = {
    linkPage: '',
    id: '',
    title: '',
    webId: '',
    webTitle: ''
  }
  if (!text) return { ...empty }
  try {
    const data = JSON.parse(text)
    if (data && data.linkPage) {
      return {
        linkPage: String(data.linkPage),
        id: data.id == null ? '' : String(data.id),
        webId: data.webId == null ? '' : String(data.webId),
        title: data.title
          ? String(data.title)
          : '',
        webTitle: data.web_title
          ? String(data.web_title)
          : ''
      }
    }
  } catch (e) {
    /* 历史手填路径保持原样展示 */
  }
  return { ...empty }
}

export function memberTaskPathIsValid(value) {
  const decoded = decodeMemberTaskPath(value)
  if (!decoded.linkPage) return false
  if (decoded.linkPage === 'custom_page') {
    return !!(decoded.id && decoded.webId)
  }
  return !!decoded.id
}

/** 已填路径但 custom_page 缺一端时返回 i18n key，否则空字符串 */
export function memberTaskPathValidateKey(value) {
  const text = (value || '').trim()
  if (!text) return ''
  try {
    const data = JSON.parse(text)
    if (data?.linkPage === 'custom_page' && (!data.id || !data.webId)) {
      return '67a8e492.ae5f23'
    }
  } catch (e) {
    /* ignore */
  }
  return ''
}

export function memberTaskPathLabel(value, t) {
  const decoded = decodeMemberTaskPath(value)
  if (!decoded.linkPage) return value || ''
  if (decoded.linkPage === 'link' && LINK_PAGE_LABELS[decoded.id]) {
    const typeLabel = t('d81d8932.59ceff')
    const name = decoded.title || t(LINK_PAGE_LABELS[decoded.id])
    return `${typeLabel}：${name}`
  }
  if (decoded.linkPage === 'custom_page') {
    const typeLabel = t('d81d8932.cee6eb')
    const mp =
      decoded.title ||
      (decoded.id ? decoded.id : t('67a8e492.f0409e'))
    const web =
      decoded.webTitle ||
      (decoded.webId ? decoded.webId : t('67a8e492.f0409e'))
    return `${typeLabel} · ${t('67a8e492.8c3f01')}：${mp} · ${t('67a8e492.9d4e12')}：${web}`
  }
  const tab = MEMBER_TASK_PATH_TABS.find((item) => item.name === decoded.linkPage)
  const typeLabel = tab ? t(tab.labelKey) : decoded.linkPage
  const name = decoded.title || decoded.id
  if (!name) return typeLabel
  return `${typeLabel}：${name}`
}
