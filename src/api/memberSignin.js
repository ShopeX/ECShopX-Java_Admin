/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 *
 * 会员签到 Admin：Apifox ECX-JAVA /api/v1/promotions/member-signin/*
 */
import { fetch } from './request'

export function getDailyPoints() {
  return fetch({
    url: '/promotions/member-signin/daily-points',
    method: 'get',
    showError: false
  })
}

export function saveDailyPoints(params) {
  return fetch({
    url: '/promotions/member-signin/daily-points',
    method: 'put',
    params,
    showError: false
  })
}

export function getActivityList(query) {
  return fetch({
    url: '/promotions/member-signin/activities',
    method: 'get',
    params: query
  })
}

export function createActivity(params) {
  return fetch({
    url: '/promotions/member-signin/activities',
    method: 'post',
    params,
    showError: false
  })
}

export function getActivityDetail(id) {
  return fetch({
    url: `/promotions/member-signin/activities/${id}`,
    method: 'get'
  })
}

export function updateActivity(id, params) {
  return fetch({
    url: `/promotions/member-signin/activities/${id}`,
    method: 'put',
    params,
    showError: false
  })
}

export function stopActivity(id) {
  return fetch({
    url: `/promotions/member-signin/activities/${id}/stop`,
    method: 'post'
  })
}

export function getCouponCandidates(query) {
  return fetch({
    url: '/promotions/member-signin/coupons/candidates',
    method: 'get',
    params: query
  })
}
