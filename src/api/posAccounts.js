/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 *
 * ECX-10326：POS 账号
 * Apifox ECX-JAVA：/api/v1/store/pos-accounts → 相对路径 /store/pos-accounts
 */
import { fetch } from './request'

export function getPosAccountList(query) {
  return fetch({
    url: '/store/pos-accounts',
    method: 'get',
    params: query
  })
}

export function createPosAccount(params) {
  return fetch({
    url: '/store/pos-accounts',
    method: 'post',
    params,
    showError: false
  })
}

export function getPosAccountDetail(id) {
  return fetch({
    url: `/store/pos-accounts/${id}`,
    method: 'get',
    showError: false
  })
}

export function updatePosAccount(id, params) {
  return fetch({
    url: `/store/pos-accounts/${id}`,
    method: 'put',
    params,
    showError: false
  })
}

export function updatePosAccountStatus(id, action) {
  return fetch({
    url: `/store/pos-accounts/${id}/status`,
    method: 'post',
    params: { action },
    showError: false
  })
}

export function batchUpdatePosAccountStatus(params) {
  return fetch({
    url: '/store/pos-accounts/batch-status',
    method: 'post',
    params,
    showError: false
  })
}

export function resetPosAccountPassword(id) {
  return fetch({
    url: `/store/pos-accounts/${id}/reset-password`,
    method: 'post',
    showError: false
  })
}

export function updatePosAccountRole(id, role) {
  return fetch({
    url: `/store/pos-accounts/${id}/role`,
    method: 'post',
    params: { role },
    showError: false
  })
}

export function transferPosAccountShop(id, distributor_id) {
  return fetch({
    url: `/store/pos-accounts/${id}/shop`,
    method: 'post',
    params: { distributor_id },
    showError: false
  })
}

export function exportPosAccounts(params) {
  return fetch({
    url: '/store/pos-accounts/export',
    method: 'post',
    params,
    showError: false
  })
}
