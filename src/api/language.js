/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 *
 * ECX-10022：站点语言配置（管理端）
 * Apifox ECX-JAVA：GET/POST /api/v1/setting/language → 相对路径 /setting/language
 */
import { fetch } from './request'

/** 读取语言配置（配置页，固定返回四种语言） */
export function getLanguageSetting(query) {
  return fetch({
    url: '/setting/language',
    method: 'get',
    params: query,
    showError: false
  })
}

/** 保存语言配置（全量替换；已有配置需带 version） */
export function saveLanguageSetting(params) {
  return fetch({
    url: '/setting/language',
    method: 'post',
    params
  })
}
