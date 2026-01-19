import { pickBy } from '@/utils'
import Attrdata from './attr_data.vue'

const config = {
  name: 'classify',
  setting: [
    {
      label: '展示形式',
      key: 'animate',
      component: 'radiobutton',
      options: [
        { name: '横向排列', label: 'horizontal' },
        { name: '纵向排列', label: 'vertical' }
      ],
      value: 'vertical',
      module: ''
    },
    {
      label: '数据类型',
      key: 'dataType',
      component: 'select',
      options: [
        { label: '按管理分类', value: 'manage' },
        { label: '按销售分类', value: 'sales' }
      ],
      value: 'manage',
      onchange: function (v, self) {
        self.value.data = null
      }
    },
    {
      label: '数据设置',
      key: 'data',
      component: function (h, { key }) {
        return <Attrdata v-model={this.value[key]} dataType={this.value.dataType} />
      },
      value: {
        type: 'select',
        category: {
          category_id: ''
        },
        data: []
      }
    },
    {
      label: '组件内边距',
      key: 'innerPadding',
      value: {
        paddedt: 10,
        paddedb: 10,
        paddedl: 10,
        paddedr: 10
      }
    }
    // outerMargin、outerBackground、innerBackground 会自动添加，无需手动写
  ],
  transformIn: (v) => {
    const { name, base, data, track, tagsType, meber_tags, no_meber_tags } = v
    // 将 outerMargin 中的尺寸除以2
    const convertedOuterMargin = base?.outerMargin ? {
      paddedt: (base.outerMargin.paddedt || 0) / 2,
      paddedb: (base.outerMargin.paddedb || 0) / 2,
      paddedl: (base.outerMargin.paddedl || 0) / 2,
      paddedr: (base.outerMargin.paddedr || 0) / 2
    } : base?.outerMargin
    // 将 innerPadding 中的尺寸除以2
    const convertedInnerPadding = base?.innerPadding ? {
      paddedt: (base.innerPadding.paddedt || 0) / 2,
      paddedb: (base.innerPadding.paddedb || 0) / 2,
      paddedl: (base.innerPadding.paddedl || 0) / 2,
      paddedr: (base.innerPadding.paddedr || 0) / 2
    } : base?.innerPadding
    
    return {
      name,
      ...base,
      outerMargin: convertedOuterMargin,
      innerPadding: convertedInnerPadding,
      data: data,
      track,
      tags: {
        type: tagsType || '2',
        meber_tags: meber_tags || [],
        no_meber_tags: no_meber_tags || []
      }
    }
  },
  transformOut: (v) => {
    return pickBy(v, {
      name: 'name',
      base: (v) => {
        const baseData = pickBy(v, {
          animate: 'animate',
          dataType: 'dataType',
          outerMargin: 'outerMargin',
          innerPadding: 'innerPadding',
          outerBackground: 'outerBackground',
          innerBackground: 'innerBackground'
        })
        // 将 outerMargin 中的尺寸乘以2
        if (baseData.outerMargin) {
          baseData.outerMargin = {
            paddedt: (baseData.outerMargin.paddedt || 0) * 2,
            paddedb: (baseData.outerMargin.paddedb || 0) * 2,
            paddedl: (baseData.outerMargin.paddedl || 0) * 2,
            paddedr: (baseData.outerMargin.paddedr || 0) * 2
          }
        }
        // 将 innerPadding 中的尺寸乘以2
        if (baseData.innerPadding) {
          baseData.innerPadding = {
            paddedt: (baseData.innerPadding.paddedt || 0) * 2,
            paddedb: (baseData.innerPadding.paddedb || 0) * 2,
            paddedl: (baseData.innerPadding.paddedl || 0) * 2,
            paddedr: (baseData.innerPadding.paddedr || 0) * 2
          }
        }
        return baseData
      },
      data: 'data',
      track: 'track',
      tags: 'tags',
      tagsType: 'tags.type',
      meber_tags: 'tags.meber_tags',
      no_meber_tags: 'tags.no_meber_tags'
    })
  }
}

// 自动处理 compStyle 配置（初始化全局处理函数）
import '../../comps/configsetting'
export default (typeof globalThis !== 'undefined' && globalThis.__processConfig__) 
  ? globalThis.__processConfig__(config) 
  : config
