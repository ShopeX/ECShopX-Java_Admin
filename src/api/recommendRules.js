/**
 * 商品推荐规则 API
 */
import { fetch } from './request'

const rulesUrl = '/goods/recommend-rules'
const displaySettingsUrl = '/goods/recommend-display-settings'

export function getRecommendDisplaySettings() {
  return fetch({
    url: displaySettingsUrl,
    method: 'get'
  })
}

export function saveRecommendDisplaySettings(params) {
  return fetch({
    url: displaySettingsUrl,
    method: 'put',
    params
  })
}

export function getRecommendRules(params) {
  return fetch({
    url: rulesUrl,
    method: 'get',
    params
  })
}

export function createRecommendRule(params) {
  return fetch({
    url: rulesUrl,
    method: 'post',
    params
  })
}

export function getRecommendRuleDetail(id, params) {
  return fetch({
    url: `${rulesUrl}/${id}`,
    method: 'get',
    params
  })
}

export function updateRecommendRule(params) {
  return fetch({
    url: rulesUrl,
    method: 'put',
    params: {
      ...params
    }
  })
}

export function deleteRecommendRule(id) {
  return fetch({
    url: `${rulesUrl}/${id}`,
    method: 'delete'
  })
}
