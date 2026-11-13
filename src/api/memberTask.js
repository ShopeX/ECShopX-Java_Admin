/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { fetch } from './request'

/** 会员任务列表 */
export function getMemberTaskList(params = {}) {
  return fetch({
    url: '/promotions/member-tasks',
    method: 'get',
    params
  })
}

/**
 * 会员任务详情（编辑回显）
 * 返回：MemberTaskSaveRequest 全字段 + task_id / config_version / display_status
 * 任意展示态可读；编辑仅 draft 走 PUT
 */
export function getMemberTaskDetail(taskId) {
  return fetch({
    url: `/promotions/member-tasks/${taskId}`,
    method: 'get'
  })
}

/** 新建会员任务（草稿） */
export function createMemberTask(data) {
  return fetch({
    url: '/promotions/member-tasks',
    method: 'post',
    data
  })
}

/** 编辑会员任务（仅 draft，须带 config_version） */
export function updateMemberTask(taskId, data) {
  return fetch({
    url: `/promotions/member-tasks/${taskId}`,
    method: 'put',
    data
  })
}

/** 发布任务（仅 draft） */
export function publishMemberTask(taskId) {
  return fetch({
    url: `/promotions/member-tasks/${taskId}/publish`,
    method: 'post'
  })
}

/** 下架任务（pending_start / in_progress） */
export function offShelfMemberTask(taskId) {
  return fetch({
    url: `/promotions/member-tasks/${taskId}/off-shelf`,
    method: 'post'
  })
}

/** 任务完成统计（含 attributed_spend_fen / attributed_join_count） */
export function getMemberTaskStats(taskId) {
  return fetch({
    url: `/promotions/member-tasks/${taskId}/stats`,
    method: 'get'
  })
}

/**
 * 任务完成概览 CSV 导出（异步）
 * 导出类型：export_member_task_overview（导出中心 Tab）
 * Query 与列表一致：task_id / name / type_detail / display_status / filter_begin / filter_end
 */
export function exportMemberTaskOverview(params = {}) {
  return fetch({
    url: '/promotions/member-tasks/export-overview',
    method: 'get',
    params
  })
}

/**
 * 任务完成明细分页
 * grant_status：all（默认）/ granted / failed；page / page_size
 */
export function getMemberTaskCompletions(taskId, params = {}) {
  return fetch({
    url: `/promotions/member-tasks/${taskId}/completions`,
    method: 'get',
    params
  })
}

/**
 * 任务完成明细 CSV 导出（异步）
 * 导出类型：export_member_task_completion（导出中心 Tab）
 * 可选 grant_status（与 completions 一致）
 */
export function exportMemberTask(taskId, params = {}) {
  return fetch({
    url: `/promotions/member-tasks/${taskId}/export`,
    method: 'get',
    params
  })
}

/** 补发奖励（仅 grant.status=failed 且 completion 未作废可操作） */
export function retryMemberTaskGrant(taskId, grantId) {
  return fetch({
    url: `/promotions/member-tasks/${taskId}/grants/${grantId}/retry`,
    method: 'post'
  })
}
