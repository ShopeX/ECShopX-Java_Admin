/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

/** 会员任务路径只存页面类型和目标 id，两端各自映射真实路径 */
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

export function encodeMemberTaskPath(linkPage, id) {
  if (!linkPage || id == null || id === '') return ''
  return JSON.stringify({
    linkPage,
    id: String(id)
  })
}

export function decodeMemberTaskPath(value) {
  const text = (value || '').trim()
  if (!text) return { linkPage: '', id: '' }
  try {
    const data = JSON.parse(text)
    if (data && data.linkPage) {
      return {
        linkPage: String(data.linkPage),
        id: data.id == null ? '' : String(data.id)
      }
    }
  } catch (e) {
    /* 历史手填路径保持原样展示 */
  }
  return { linkPage: '', id: '' }
}

export function memberTaskPathLabel(value, t) {
  const decoded = decodeMemberTaskPath(value)
  if (!decoded.linkPage) return value || ''
  if (decoded.linkPage === 'link' && LINK_PAGE_LABELS[decoded.id]) {
    return t(LINK_PAGE_LABELS[decoded.id])
  }
  const tab = MEMBER_TASK_PATH_TABS.find((item) => item.name === decoded.linkPage)
  return tab ? t(tab.labelKey) : decoded.linkPage
}
