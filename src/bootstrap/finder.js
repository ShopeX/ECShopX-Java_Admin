/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { initFinder } from '@shopex-ui/finder'
import { requestClient } from '@/api/request'
import { i18n } from '@/i18n'

function install(Vue) {
  initFinder(Vue, {
    fetchLibrary: requestClient.instance,
    context: {
      qs: false,
      globalHooks: {
        beforeQuery: (p) => {
          const lang = window.localStorage.getItem('lang')
          const langMap = {
            zhcn: 'zh-CN',
            en: 'en-CN',
            zhtw: 'zh-TW',
            ar: 'ar-SA'
          }

          let params = {
            ...p,
            pageSize: p.pageSize,
            page: p.pageNum,
            finderId: 100
          }
          if (lang) {
            params.country_code = langMap[lang]
          }
          // delete params.pageSize
          delete params.pageNum
          return params
        },
        afterQuery: (response) => {
          const payload = response?.data?.data
          // 接口异常 / 非标准结构时仍返回空列表，避免 Finder 整页空白
          if (!payload || typeof payload !== 'object') {
            return { list: [], count: 0 }
          }
          const { status_code, message } = payload
          if (status_code == 500) {
            Vue.prototype.$message.error(message || '请求失败')
            return { list: [], count: 0 }
          }
          return {
            ...payload,
            list: payload.list || [],
            count: parseInt(payload.total_count || 0, 10)
          }
        }
      },
      locale: {
        get search() {
          return i18n.t('7b53c26a.e5f71f')
        },
        get reset() {
          return i18n.t('7b53c26a.4b9c32')
        },
        get open() {
          return i18n.t('7b53c26a.e2edde')
        },
        get retract() {
          return i18n.t('7b53c26a.def9e9')
        },
        get operation() {
          return i18n.t('7b53c26a.2b6bc0')
        },
        get enter() {
          return i18n.t('7b53c26a.02cc4f')
        },
        get choose() {
          return i18n.t('7b53c26a.708c9d')
        },
        get more() {
          return i18n.t('7b53c26a.0ec9ea')
        },
        get empty() {
          return i18n.t('7b53c26a.281bad')
        },
        get ['return']() {
          return i18n.t('7b53c26a.5f4112')
        },
        get save() {
          return i18n.t('7b53c26a.be5fbb')
        }
      }
    }
  })
}

export { install }
