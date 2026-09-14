/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
export function generatorParams(options, data) {
  const _params = {}
  options.forEach((_schema) => {
    if (_schema.key) {
      if (data) {
        _params[_schema.key] = data[_schema.key]
      } else {
        _params[_schema.key] = _schema.defaultValue
      }
    }
  })
  return _params
}

// 绑定表单schema的this指向（供 JSX 内 this.$createElement 使用）
export function bindThisForFormSchema(formSchema, target) {
  if (!target) return formSchema
  formSchema?.forEach((item) => {
    if (item?.component && typeof item.component === 'function') {
      item.component = item.component.bind(target)
    }
    if (item?.label && typeof item.label === 'function') {
      item.label = item.label.bind(target)
    }
    if (item?.validator && typeof item.validator === 'function') {
      item.validator = item.validator.bind(target)
    }
    if (item?.disabled && typeof item.disabled === 'function') {
      item.disabled = item.disabled.bind(target)
    }
    if (item?.isShow && typeof item.isShow === 'function') {
      item.isShow = item.isShow.bind(target)
    }
  })
  return formSchema
}
