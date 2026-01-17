import { pickBy } from '@/utils'
import AttrStore from '../wgt_store-alphabet/attr-store'
import CompBackgroundInner from '../../comps/comp_background_inner.vue'
import CompOuter from '../../comps/comp_background_outer.vue'

const config = {
  name: 'shop',
  setting: [
    {
      label: '数据设置',
      key: 'data',
      component: function (h, { key }) {
        return (
          <AttrStore
            v-model={this.value[key]}
            on-change={() => {
              if (this.value[key].id === '') {
                this.value['items'] = []
                this.value['tags'] = []
              }
            }}
          />
        )
      },
      value: [],
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
    },
    // outerMargin 会自动添加，无需手动写
    {
      label: '组件外背景',
      key: 'outerBackground',
      component: function (h, { key }) {
        return <CompOuter v-model={this.value[key]} uuid={this.value.uuid} />
      },
      value: { color: '#f8f8f8', image: '' }
    },
    {
      label: '组件内背景',
      key: 'innerBackground',
      component: function (h, { key }) {
        return <CompBackgroundInner v-model={this.value[key]} uuid={this.value.uuid} />
      },
      value: { type: 'solid', color: '#ffffff', startColor: '#ffffff', endColor: '#ffffff' }
    }
  ],
  transformIn: (v) => {
    const { name, base, data } = v
    // 将 rpx 转换为 px（除以2）
    const convertedOuterMargin = base?.outerMargin ? {
      paddedt: (base.outerMargin.paddedt || 0) / 2,
      paddedb: (base.outerMargin.paddedb || 0) / 2,
      paddedl: (base.outerMargin.paddedl || 0) / 2,
      paddedr: (base.outerMargin.paddedr || 0) / 2
    } : base?.outerMargin
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
    }
  },
  transformOut: (v) => {
    return pickBy(v, {
      name: 'name',
      base: (v) => {
        const baseData = pickBy(v, {
          outerMargin: 'outerMargin',
          innerPadding: 'innerPadding',
          outerBackground: 'outerBackground',
          innerBackground: 'innerBackground',
        })
        // 将 outerMargin 中的尺寸转换为 rpx（乘以2）
        if (baseData.outerMargin) {
          baseData.outerMargin = {
            paddedt: (baseData.outerMargin.paddedt || 0) * 2,
            paddedb: (baseData.outerMargin.paddedb || 0) * 2,
            paddedl: (baseData.outerMargin.paddedl || 0) * 2,
            paddedr: (baseData.outerMargin.paddedr || 0) * 2
          }
        }
        // 将 innerPadding 中的尺寸转换为 rpx（乘以2）
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
    })
  }
}

// 自动处理 compStyle 配置（初始化全局处理函数）
import '../../comps/configsetting'
export default (typeof globalThis !== 'undefined' && globalThis.__processConfig__) 
  ? globalThis.__processConfig__(config) 
  : config
