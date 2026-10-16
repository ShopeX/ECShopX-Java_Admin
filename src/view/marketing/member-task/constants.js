/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import { i18n } from '@/i18n'

/** 展示状态 → 文案 / 标签色（对齐 Figma） */
export const DISPLAY_STATUS_MAP = {
  draft: { label: i18n.t('f54153aa.0737ae'), tagType: 'warning' },
  pending_start: { label: i18n.t('f54153aa.1568ba'), tagType: '' },
  in_progress: { label: i18n.t('f54153aa.fb852f'), tagType: 'success' },
  expired: { label: i18n.t('f54153aa.a85a62'), tagType: 'info' }
}

export const STATUS_TABS = [
  { name: 'all', label: i18n.t('f54153aa.a8b0c2') },
  { name: 'draft', label: i18n.t('f54153aa.0737ae') },
  { name: 'pending_start', label: i18n.t('f54153aa.1568ba') },
  { name: 'in_progress', label: i18n.t('f54153aa.fb852f') },
  { name: 'expired', label: i18n.t('f54153aa.a85a62') }
]

/** 任务统计：明细列表 tab（原型：全部 / 奖励发放成功 / 奖励发放失败） */
export const GRANT_STATUS_TABS = [
  { value: 'all', label: i18n.t('f54153aa.a8b0c2') },
  { value: 'granted', label: i18n.t('f54153aa.1f3bde') },
  { value: 'failed', label: i18n.t('f54153aa.bb44ce') }
]

/** 奖励发放状态标签（对应 stats 接口 grant_status_counts 的 key） */
export const GRANT_STATUS_LABELS = {
  pending: i18n.t('f54153aa.78a7c2'),
  granted: i18n.t('f54153aa.43d640'),
  failed: i18n.t('f54153aa.9338d5'),
  cancelled: i18n.t('f54153aa.2111cc')
}

/**
 * 任务类型级联（一级 type_category / 二级 type_detail）
 * 列表筛选只传 type_detail（见 Apifox 列表契约）
 */
export const TYPE_CASCADER_OPTIONS = [
  {
    value: 'newcomer',
    label: i18n.t('f54153aa.09eec2'),
    children: [
      { value: 'first_order', label: i18n.t('f54153aa.8ae1fe') },
      { value: 'profile', label: i18n.t('f54153aa.818feb') }
    ]
  },
  {
    value: 'purchase',
    label: i18n.t('f54153aa.bdc336'),
    children: [
      { value: 'single_spend', label: i18n.t('f54153aa.e4001a') },
      { value: 'total_spend', label: i18n.t('f54153aa.5ea0f4') }
    ]
  },
  {
    value: 'share',
    label: i18n.t('f54153aa.0124a9'),
    children: [
      { value: 'share_order', label: i18n.t('f54153aa.717f36') },
      { value: 'invite_register', label: i18n.t('f54153aa.131dc2') }
    ]
  },
  {
    value: 'behavior',
    label: i18n.t('f54153aa.90dff0'),
    children: [
      { value: 'sign_in', label: i18n.t('f54153aa.c9da9b') },
      { value: 'browse', label: i18n.t('f54153aa.8920f2') },
      { value: 'favorite', label: i18n.t('f54153aa.ae336c') }
    ]
  }
]

export const FREQUENCY_TYPE_OPTIONS = [
  { label: i18n.t('f54153aa.68490b'), value: 'once' },
  { label: i18n.t('f54153aa.b7a078'), value: 'cycle' }
]

export const FREQUENCY_PERIOD_OPTIONS = [
  { label: i18n.t('f54153aa.ce2210'), value: 'daily' },
  { label: i18n.t('f54153aa.09b03b'), value: 'weekly' },
  { label: i18n.t('f54153aa.aa3d57'), value: 'monthly' }
]

/** 周期性任务状态重置时间（PRD 1.1.6.1） */
export const FREQUENCY_RESET_TIPS = {
  daily: i18n.t('f54153aa.856d21'),
  weekly: i18n.t('f54153aa.8af23c'),
  monthly: i18n.t('f54153aa.4b4463')
}

export const AUDIENCE_MODE_OPTIONS = [
  { label: i18n.t('f54153aa.ef8c99'), value: 'unlimited' },
  { label: i18n.t('f54153aa.ceabf7'), value: 'visible' },
  { label: i18n.t('f54153aa.e5b43f'), value: 'hidden' }
]

export const AUDIENCE_COMBINE_OPTIONS = [
  { label: i18n.t('f54153aa.c05ad5'), value: 'intersection' },
  { label: i18n.t('f54153aa.2b57f4'), value: 'union' }
]

export const GOODS_SCOPE_OPTIONS = [
  { label: i18n.t('f54153aa.d4dc06'), value: 'unlimited' },
  { label: i18n.t('f54153aa.289811'), value: 'items' },
  { label: i18n.t('f54153aa.2533b7'), value: 'category' }
]

/**
 * 二级类型 → 专属面板字段组（唯一真相源）
 *
 * 字段组含义：
 * - purchase  指定购买商品*（含 scope 联动：items→选商品 / category→选分类）、指定消费店铺、购买达指定金额、订单是否需要签收
 * - jump      设置任务跳转页面（分享类用 share.jump，不再出本项）
 * - share     分享卡片封面*、分享卡片标题*、卡片跳转页面*
 * - browse    需浏览页面*、停留时长
 * - favorite  需收藏商品、需收藏店铺
 *
 * 无专属面板：profile / sign_in
 *
 * 公共字段（与类型无关，始终在主表单）：
 * 任务名称*、任务时间*、任务类型*、可完成频次*（cycle→周期）、人群设置*（非不限→标签/交集并集）、
 * 奖励积分、奖励优惠券、任务规则*
 */
export const TYPE_EXCLUSIVE_SCHEMA = {
  // 新人
  first_order: { purchase: true, jump: true },
  profile: {},
  // 购买
  single_spend: { purchase: true, jump: true },
  total_spend: { purchase: true, jump: true },
  // 分享裂变
  share_order: { purchase: true, share: true },
  invite_register: { share: true },
  // 会员行为
  sign_in: {},
  browse: { browse: true },
  favorite: { favorite: true, jump: true }
}

/** @returns {{ needPurchaseRule, needShareCard, needBrowseRule, needFavoriteRule, needJumpPage, hasTypeExclusive }} */
export function getTypeExclusiveFlags(typeDetail) {
  const s = TYPE_EXCLUSIVE_SCHEMA[typeDetail] || {}
  const needPurchaseRule = !!s.purchase
  const needShareCard = !!s.share
  const needBrowseRule = !!s.browse
  const needFavoriteRule = !!s.favorite
  const needJumpPage = !!s.jump
  return {
    needPurchaseRule,
    needShareCard,
    needBrowseRule,
    needFavoriteRule,
    needJumpPage,
    hasTypeExclusive:
      needPurchaseRule || needShareCard || needBrowseRule || needFavoriteRule || needJumpPage
  }
}

function typeDetailsWithFlag(flag) {
  return Object.keys(TYPE_EXCLUSIVE_SCHEMA).filter((key) => TYPE_EXCLUSIVE_SCHEMA[key][flag])
}

/** @deprecated 请优先用 getTypeExclusiveFlags；保留给 applyDetail 等批量判断 */
export const PURCHASE_RULE_DETAILS = typeDetailsWithFlag('purchase')
export const SHARE_CARD_DETAILS = typeDetailsWithFlag('share')
export const BROWSE_RULE_DETAILS = typeDetailsWithFlag('browse')
export const FAVORITE_RULE_DETAILS = typeDetailsWithFlag('favorite')
export const JUMP_PAGE_DETAILS = typeDetailsWithFlag('jump')

/** 任务类型（二级）文案，用于类型专属区标题 */
export function findTypeDetailLabel(typeDetail) {
  if (!typeDetail) return ''
  for (let i = 0; i < TYPE_CASCADER_OPTIONS.length; i++) {
    const children = TYPE_CASCADER_OPTIONS[i].children || []
    const hit = children.find((c) => c.value === typeDetail)
    if (hit) return hit.label
  }
  return ''
}

export function findTypeCategory(typeDetail) {
  if (!typeDetail) return ''
  for (let i = 0; i < TYPE_CASCADER_OPTIONS.length; i++) {
    const cat = TYPE_CASCADER_OPTIONS[i]
    const children = cat.children || []
    if (children.some((c) => c.value === typeDetail)) {
      return cat.value
    }
  }
  return ''
}

export function formatTaskTime(row) {
  const begin = row.begin_time_text || ''
  const end = row.end_time_text || ''
  if (begin && end) return `${begin} ~ ${end}`
  if (begin || end) return begin || end
  return '-'
}

export function formatTypeLabel(row) {
  return row.type_label || row.type_detail || '-'
}

function formatRewardItem(item) {
  if (!item || typeof item !== 'object') return ''
  if (item.kind === 'points') {
    if (item.points == null || item.points === '') return ''
    return `${item.points}${i18n.t('f54153aa.9f68a8')}`
  }
  if (item.kind === 'coupon') return item.title || ''
  return ''
}

export function formatReward(row) {
  const rewards = Array.isArray(row.rewards) ? row.rewards : []
  const text = rewards.map(formatRewardItem).filter(Boolean).join('、')
  if (text) return text
  return row.reward_summary || '-'
}
