import { pickBy } from '@/utils'
import AttrStore from './attr-store'
import CompBackgroundInner from '../../comps/comp_background_inner.vue'
import CompStyle from '../../comps/comp_style.vue'
import CompOuter from '../../comps/comp_background_outer.vue'

export default {
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
      label: '组件外边距',
      key: 'outerMargin',
      component: function (h, { key }) {
        return (
          <CompStyle
            showBgsetting={false}
            v-model={this.value[key]}
            uuid={this.value.uuid}
            showLabel={false}
            showLeft={false}
            showRight={false}
          />
        )
      },
      value: {
        paddedt: 10,
        paddedb: 10
      }
    },
    {
      label: '组件内边距',
      key: 'innerPadding',
      component: function (h, { key }) {
        return (
          <CompStyle
            showBgsetting={false}
            v-model={this.value[key]}
            uuid={this.value.uuid}
            showLabel={false}
          />
        )
      },
      value: {
        paddedt: 10,
        paddedb: 10,
        paddedl: 10,
        paddedr: 10
      }
    },
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
    return {
      name,
      ...base,
      data: data,
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
    })
  }
}
