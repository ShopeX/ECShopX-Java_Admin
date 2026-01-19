import { pickBy } from '@/utils'
import AttrStore from './attr-store'
import CompBackgroundInner from '../../comps/comp_background_inner.vue'
import CompOuter from '../../comps/comp_background_outer.vue'

const config = {
  name: 'storeAlphabet',
  setting: [
    {
      label: '数据类型',
      key: 'dataType',
      component: 'select',
      options: [
        { label: '所有店铺', value: 'all' },
        { label: '指定店铺', value: 'specify' }
      ],
      value: 'all',
      onchange: function (e, vm) {
        vm.value.data = []
      }
    },

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
      isShow: function () {
        return this.value.dataType === 'specify'
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
    const { name, base, data, track, tagsType, meber_tags, no_meber_tags } = v
    return {
      name,
      ...base,
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
        return pickBy(v, {
          dataType: 'dataType',
          outerMargin: 'outerMargin',
          innerPadding: 'innerPadding',
          outerBackground: 'outerBackground',
          innerBackground: 'innerBackground',
        })
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
