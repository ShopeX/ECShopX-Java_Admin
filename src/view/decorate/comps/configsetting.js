/**
 * 公共配置设置
 * 封装常用的组件配置，避免在每个组件中重复引用
 */
import CompStyle from './comp_style.vue'

/**
 * 检查一个值是否是 CompStyle 类型的配置值
 * 通过检测 value 的结构来判断：如果包含 padding/margin 相关字段，则认为是 CompStyle 类型
 */
function isCompStyleValue(value) {
  if (!value || typeof value !== 'object') {
    return false
  }
  
  // 检查是否包含 padding/margin 相关的字段
  const paddingKeys = ['paddedt', 'paddedb', 'paddedl', 'paddedr', 'paddedtb', 'paddedlr']
  const hasPaddingFields = paddingKeys.some(key => key in value)
  
  return hasPaddingFields
}

/**
 * 处理配置对象，自动识别并转换 CompStyle 配置项
 * 自动为所有组件添加 outerMargin 等通用配置项
 * 自动识别包含 padding/margin 字段的配置项并转换为 CompStyle 组件
 */
function processConfig(config) {
  if (!config || !config.setting || !Array.isArray(config.setting)) {
    return config
  }

  // 检查 setting 中已有的 key
  const existingKeys = config.setting.map(item => item.key).filter(Boolean)
  
  // 创建 CompStyle 配置项的函数
  const createCompStyleItem = (key, label, defaultValue = { paddedt: 0, paddedb: 0, paddedl: 0, paddedr: 0 }) => ({
    group: '组件样式',
    label,
    key,
    component: function (h, { key }) {
      return (
        <CompStyle
          showBgsetting={true}
          v-model={this.value[key]}
          uuid={this.value.uuid}
          showLabel={true}
          showTop={true}
          showBottom={true}
          showLeft={true}
          showRight={true}
        />
      )
    },
    value: defaultValue
  })

  // 默认的通用配置项（所有组件都自动包含）
  const defaultCommonSettings = [
    createCompStyleItem('outerMargin', '边距')
  ]

  // 针对特定挂件的额外配置项
  const widgetSpecificSettings = []
  if (config.name === 'speedkill') {
    // 秒杀挂件自动添加组件内样式
    widgetSpecificSettings.push({
      group: '组件内样式',
      label: '边距',
      key: 'innerPadding',
      component: function (h, { key }) {
        return (
          <CompStyle
            showBgsetting={true}
            v-model={this.value[key]}
            uuid={this.value.uuid}
            showLabel={true}
            showTop={true}
            showBottom={true}
            showLeft={true}
            showRight={true}
          />
        )
      },
      value: {
        paddedt: 9,
        paddedb: 9,
        paddedl: 12,
        paddedr: 12
      }
    })
  }

  // 处理现有的 setting，自动识别并转换 CompStyle 配置项
  const processedSetting = config.setting.map(item => {
    // 自动判断是否需要使用 CompStyle：
    // 1. 如果 component 已经是 'compStyle'
    // 2. 如果 value 是一个包含 padding/margin 字段的对象（且没有指定其他 component）
    const hasCompStyleComponent = item.component === 'compStyle'
    const hasCompStyleValue = isCompStyleValue(item.value)
    const hasOtherComponent = item.component && item.component !== 'compStyle' && typeof item.component !== 'function'
    
    // 如果需要使用 CompStyle，且没有其他自定义组件，则自动转换
    const shouldUseCompStyle = (hasCompStyleComponent || hasCompStyleValue) && !hasOtherComponent
    
    if (shouldUseCompStyle) {
      const { component, ...rest } = item
      return {
        ...rest,
        group: rest.group || '组件样式', // 如果没有 group，则设置为"组件样式"
        component: function (h, { key }) {
          return (
            <CompStyle
              showBgsetting={true}
              v-model={this.value[key]}
              uuid={this.value.uuid}
              showLabel={true}
              showTop={true}
              showBottom={true}
              showLeft={true}
              showRight={true}
            />
          )
        },
        value: item.value || {
          paddedt: 0,
          paddedb: 0,
          paddedl: 0,
          paddedr: 0
        }
      }
    }
    return item
  })

  // 自动添加缺失的通用配置项
  defaultCommonSettings.forEach(defaultItem => {
    if (!existingKeys.includes(defaultItem.key)) {
      processedSetting.push(defaultItem)
    }
  })

  // 自动添加挂件特定的配置项
  widgetSpecificSettings.forEach(specificItem => {
    if (!existingKeys.includes(specificItem.key)) {
      processedSetting.push(specificItem)
    }
  })

  return {
    ...config,
    setting: processedSetting
  }
}

// 将处理函数挂载到全局，让所有 config.js 文件可以直接使用
if (typeof globalThis !== 'undefined') {
  globalThis.__processConfig__ = processConfig
}

export default processConfig