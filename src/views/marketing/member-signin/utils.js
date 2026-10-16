/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

export function unwrap(res) {
  return res?.data?.data != null ? res.data.data : res?.data ?? res
}

/** HTTP/body status from RequestClient rejection (throws response.data). */
export function apiStatus(e) {
  return e?.response?.status ?? e?.status ?? e?.status_code ?? e?.code
}

/** Server message from common API error body shapes. */
export function apiErrorMessage(e, fallback = '') {
  const data = e
  return (
    data?.data?.message ||
    data?.data?.error ||
    data?.message ||
    data?.msg ||
    fallback
  )
}

function toDate(input) {
  if (input instanceof Date) return input
  // el-date-picker value-format 'yyyy-MM-dd'
  const s = String(input)
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  return new Date(input)
}

export function dayStartUnix(input) {
  const d = toDate(input)
  return Math.floor(new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0).getTime() / 1000)
}

export function dayEndUnix(input) {
  const d = toDate(input)
  return Math.floor(new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59).getTime() / 1000)
}

export function activityDayCount(beginUnix, endUnix) {
  if (!beginUnix || !endUnix || endUnix < beginUnix) return 0
  const ms = (endUnix - beginUnix) * 1000
  return Math.floor(ms / 86400000) + 1
}

function pad(n) {
  return n < 10 ? `0${n}` : String(n)
}

export function formatActivityRange(beginUnix, endUnix) {
  const fmt = (u) => {
    const d = new Date(u * 1000)
    return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`
  }
  if (!beginUnix || !endUnix) return '-'
  return `${fmt(beginUnix)} 至 ${fmt(endUnix)}`
}

export const STATUS_MAP = {
  not_started: { label: '未开始', type: 'info' },
  in_progress: { label: '进行中', type: '' },
  ended: { label: '已结束', type: 'info' }
}
