/**
 * 订单导航项：key 与 linkPage.id 映射，供 C 端角标/跳转与后台补全旧数据。
 */
import { i18n } from '@/i18n'

export const ORDER_NAV_ID_TO_KEY = {
  orderWaitPay: 'waitPayNum',
  orderWaitSend: 'waitSendNum',
  orderWaitReceive: 'waitRecevieNum',
  orderWaitEvaluate: 'waitEvaluateNum',
  orderAfterSale: 'afterSalesNum',
  orderAll: 'orderAll',
  zitiOrder: 'zitiNum'
}

export const ORDER_NAV_KEY_TO_ID = Object.fromEntries(
  Object.entries(ORDER_NAV_ID_TO_KEY).map(([id, key]) => [key, id])
)

/** 5 项默认（含待发货） */
export function createDefaultOrderNavItems5() {
  return [
    {
      content: i18n.t('cff31093.818d78'),
      imgUrl: '',
      key: 'waitPayNum',
      linkType: 0,
      linkPage: 'link',
      id: 'orderWaitPay',
      title: i18n.t('cff31093.818d78')
    },
    {
      content: i18n.t('2345face.d8476e'),
      imgUrl: '',
      key: 'waitSendNum',
      linkType: 0,
      linkPage: 'link',
      id: 'orderWaitSend',
      title: i18n.t('2345face.d8476e')
    },
    {
      content: i18n.t('cff31093.4933ca'),
      imgUrl: '',
      key: 'waitRecevieNum',
      linkType: 0,
      linkPage: 'link',
      id: 'orderWaitReceive',
      title: i18n.t('cff31093.4933ca')
    },
    {
      content: i18n.t('cff31093.a48b28'),
      imgUrl: '',
      key: 'waitEvaluateNum',
      linkType: 0,
      linkPage: 'link',
      id: 'orderWaitEvaluate',
      title: i18n.t('cff31093.a48b28')
    },
    {
      content: i18n.t('cff31093.59bd68'),
      imgUrl: '',
      key: 'afterSalesNum',
      linkType: 0,
      linkPage: 'link',
      id: 'orderAfterSale',
      title: i18n.t('cff31093.59bd68')
    }
  ]
}

/** 历史 4 项（无待发货） */
const TEMPLATE_4_KEYS = [
  'waitPayNum',
  'waitRecevieNum',
  'waitEvaluateNum',
  'afterSalesNum'
]

const TEMPLATE_5_KEYS = [
  'waitPayNum',
  'waitSendNum',
  'waitRecevieNum',
  'waitEvaluateNum',
  'afterSalesNum'
]

function inferKeyFromContent(content) {
  const text = String(content || '').trim()
  if (!text) return ''
  if (/待支付|待付款/.test(text)) return 'waitPayNum'
  if (/待发货/.test(text)) return 'waitSendNum'
  if (/待收货/.test(text)) return 'waitRecevieNum'
  if (/待评价/.test(text)) return 'waitEvaluateNum'
  if (/售后/.test(text)) return 'afterSalesNum'
  return ''
}

function hasConfiguredLink(item = {}) {
  if (item.linkType == 1 && item.linkUrl) return true
  return !!(item.linkPage && item.id)
}

function templateByKey(key) {
  const id = ORDER_NAV_KEY_TO_ID[key]
  if (!id) return null
  return {
    key,
    linkType: 0,
    linkPage: 'link',
    id
  }
}

/**
 * 补全单条：优先保留已有配置，缺 key/link 时按 key、文案或下标兜底。
 */
export function normalizeOrderNavItem(item = {}, index = 0, total = 1) {
  const keys = total >= 5 ? TEMPLATE_5_KEYS : TEMPLATE_4_KEYS
  const indexKey = keys[index] || ''
  let key = item.key || ORDER_NAV_ID_TO_KEY[item.id] || inferKeyFromContent(item.content) || indexKey
  const tpl = templateByKey(key) || {}

  const merged = {
    linkType: 0,
    linkPage: '',
    id: '',
    title: '',
    imgUrl: '',
    content: '',
    ...tpl,
    ...item,
    key
  }

  if (!hasConfiguredLink(item) && tpl.id) {
    merged.linkType = 0
    merged.linkPage = 'link'
    merged.id = tpl.id
  }

  if (!merged.title && merged.content) {
    merged.title = merged.content
  }

  return merged
}

export function normalizeOrderNavData(data) {
  if (!Array.isArray(data) || !data.length) {
    return createDefaultOrderNavItems5()
  }
  return data.map((item, index) => normalizeOrderNavItem(item, index, data.length))
}

export function syncKeyFromLinkPicker(item = {}) {
  const key = item.key || ORDER_NAV_ID_TO_KEY[item.id] || inferKeyFromContent(item.content)
  return key ? { ...item, key } : item
}
