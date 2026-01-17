/**
 * 公共配置设置
 * 封装常用的组件配置，避免在每个组件中重复引用
 */
import CompStyle from './comp_style.vue'

/**
 * 处理配置对象，自动识别并转换 CompStyle 配置项
 * 自动为所有组件添加 outerMargin 等通用配置项
 */
function processConfig(config) {
  if (!config || !config.setting || !Array.isArray(config.setting)) {
    return config
  }

  // 需要自动使用 CompStyle 的 key 列表（所有组件都自动包含）
  const compStyleKeys = [
    'outerMargin',
    'innerPadding', 
    'navpadded',
    'navitempadded',
    'navitemmargin'
  ]

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
    createCompStyleItem('outerMargin', '组件外边距')
  ]

  // 处理现有的 setting，转换已有的 compStyle 配置项
  const processedSetting = config.setting.map(item => {
    // 如果配置项的 key 在列表中，或者有 component: 'compStyle'，则自动转换为 CompStyle
    const shouldUseCompStyle = compStyleKeys.includes(item.key) || item.component === 'compStyle'
    
    if (shouldUseCompStyle && (!item.component || item.component === 'compStyle')) {
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