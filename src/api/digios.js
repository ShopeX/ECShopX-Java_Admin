/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 *
 * ECX-10670：DigiOS 进销存接入配置
 * Apifox ECX-JAVA：GET/POST /api/v1/digios/company_config → 相对路径 /digios/company_config
 */
import { fetch } from './request'

/** 获取 DigiOS 进销存接入配置 */
export function getDigiosCompanyConfig(query) {
  return fetch({
    url: '/digios/company_config',
    method: 'get',
    params: query,
    showError: false
  })
}

/** 保存 DigiOS 进销存接入配置 */
export function saveDigiosCompanyConfig(params) {
  return fetch({
    url: '/digios/company_config',
    method: 'post',
    params,
    showError: false
  })
}
