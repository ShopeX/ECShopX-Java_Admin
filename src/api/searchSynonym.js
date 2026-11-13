/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { fetch } from './request'

export function listSynonyms(params) {
  return fetch({ url: '/goods/search/synonyms', method: 'get', params })
}

export function saveSynonymGroup(data) {
  return fetch({ url: '/goods/search/synonyms', method: 'put', data })
}

export function removeSynonymGroup(id) {
  return fetch({ url: `/goods/search/synonyms/${id}`, method: 'delete' })
}
