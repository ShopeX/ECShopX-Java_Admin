import { pickBy } from '@/utils'
import AttrStore from './attr-store'
import { transformInBase, createTransformOutBase } from '../../comps/transform-utils'

const NEARBY_SETTING_KEYS = [
  'title',
  'subtitle',
  'padded',
  'show_nearby_merchants',
  'merchantsNumber',
  'quantityNumber'
]

const SHARED_BASE_KEYS = [
  'dataType',
  'outerMargin',
  'innerPadding',
  'outerBackground',
  'innerBackground',
  'wgtCustName',
  'track',
  ...NEARBY_SETTING_KEYS
]

function isNearbyDataType(v, raw = {}) {
  if (raw.name === 'nearbyShop') return true
  const base = raw.base || {}
  return (base.dataType || v.dataType) === 'nearby'
}

function buildNearbySetting() {
  return [
    { label: '组件间距', key: 'padded', component: 'switch', value: false },
    {
      label: '显示更多附近商家',
      key: 'show_nearby_merchants',
      component: 'switch',
      value: false
    },
    {
      label: '显示附近商家数量',
      key: 'merchantsNumber',
      component: 'number',
      value: 4,
      min: 1,
      max: 100
    },
    {
      label: '显示附近商品数量',
      key: 'quantityNumber',
      component: 'number',
      value: 4,
      min: 1,
      max: 100
    }
  ]
}

const config = {
  name: 'shop',
  setting: [
    {
      label: '自定义挂件名称',
      key: 'wgtCustName',
      component: 'input',
      value: ''
    },
    {
      label: '埋点上报参数',
      key: 'track',
      component: 'input',
      value: ''
    },
    {
      label: '数据类型',
      key: 'dataType',
      component: 'select',
      options: [
        { label: '指定店铺', value: 'specify' },
        { label: '附近商家', value: 'nearby' }
      ],
      value: 'specify',
      onchange: function (e, vm) {
        if (e === 'nearby') {
          vm.value.data = []
        }
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
                this.value.items = []
                this.value.tags = []
              }
            }}
          />
        )
      },
      value: [],
      isShow() {
        return this.value.dataType === 'specify'
      }
    },
    ...buildNearbySetting().map((item) => ({
      ...item,
      isShow() {
        return this.value.dataType === 'nearby'
      }
    }))
  ],
  transformIn: (v) => {
    const nearby = isNearbyDataType(v, v)
    const base = v.base || {}
    const transformedBase = transformInBase(base, ['outerMargin', 'innerPadding'])
    const tags = {
      type: v.tagsType || '2',
      meber_tags: v.meber_tags || [],
      no_meber_tags: v.no_meber_tags || []
    }
    const common = {
      id: v?.id,
      name: 'shop',
      dataType: nearby ? 'nearby' : base.dataType || 'specify',
      ...transformedBase,
      wgtCustName: base.wgtCustName ?? '',
      track: v.track ?? base.track ?? '',
      tags
    }
    if (nearby) {
      return {
        ...common,
        data: [],
        title: base.title ?? '',
        subtitle: base.subtitle ?? '',
        padded: base.padded ?? false,
        show_nearby_merchants: base.show_nearby_merchants ?? false,
        merchantsNumber: base.merchantsNumber ?? 4,
        quantityNumber: base.quantityNumber ?? 4
      }
    }
    return {
      ...common,
      data: v.data || [],
      padded: false,
      show_nearby_merchants: false,
      merchantsNumber: 4,
      quantityNumber: 4,
      title: '',
      subtitle: ''
    }
  },
  transformOut: (v, wgtList, regionauth_id) => {
    const nearby = v.dataType === 'nearby'
    const baseKeys = nearby
      ? SHARED_BASE_KEYS
      : SHARED_BASE_KEYS.filter((k) => !NEARBY_SETTING_KEYS.includes(k))
    const out = {
      id: 'id',
      name: () => 'shop',
      base: createTransformOutBase(baseKeys, ['outerMargin', 'innerPadding']),
      meber_tags: 'tags.meber_tags',
      no_meber_tags: 'tags.no_meber_tags',
      tagsType: 'tags.type',
      noRegionauth: !regionauth_id
    }
    if (nearby) {
      out.data = () => []
    } else {
      out.data = 'data'
    }
    return pickBy(v, out)
  }
}

import '../../comps/configsetting'

export default typeof globalThis !== 'undefined' && globalThis.__processConfig__
  ? globalThis.__processConfig__(config)
  : config
