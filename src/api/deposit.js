/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { fetch } from './request'

export function createRechargeRule(query) {
  return fetch({
    url: '/deposit/rechargerule',
    method: 'post',
    params: query
  })
}

export function getRechargeRuleList(query) {
  return fetch({
    url: '/deposit/rechargerules',
    method: 'get',
    params: query
  })
}

export function deleteRechargeRuleById(id) {
  return fetch({
    url: '/deposit/rechargerule/' + id,
    method: 'delete'
  })
}

export function editRechargeRuleById(query) {
  return fetch({
    url: '/deposit/rechargerule',
    method: 'put',
    params: query
  })
}

export function setRechargeAgreement(query) {
  return fetch({
    url: '/deposit/recharge/agreement',
    method: 'post',
    params: query
  })
}

export function getRechargeAgreementByCompanyId() {
  return fetch({
    url: '/deposit/recharge/agreement',
    method: 'get'
  })
}

export function setRechargeMultiple(query) {
  return fetch({
    url: '/deposit/recharge/multiple',
    method: 'post',
    params: query
  })
}

export function getRechargeMultipleByCompanyId() {
  return fetch({
    url: '/deposit/recharge/multiple',
    method: 'get'
  })
}

export function getDepositTradeList(query) {
  return fetch({
    url: '/deposit/trades',
    method: 'get',
    params: query
  })
}

export function getDepositCountIndex() {
  return fetch({
    url: '/deposit/count/index',
    method: 'get'
  })
}

// 添加储值
export function rechargeDeposit(params) {
  return fetch({
    url: '/deposit/recharge',
    method: 'post',
    params
  })
}

/** ECX-10126：储值设置（开关 + 面额统一保存） */
export function getDepositSettings() {
  return fetch({
    url: '/deposit/settings',
    method: 'get'
  })
}

export function saveDepositSettings(body) {
  return fetch({
    url: '/deposit/settings',
    method: 'put',
    params: body
  })
}
