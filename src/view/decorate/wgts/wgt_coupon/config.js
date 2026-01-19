/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { pickBy } from '@/utils'
import CouponStyle from './coupon-style'
import CouponItem from './coupon-item'
import CouponPackage from './coupon-package'

const config = {
  name: 'coupon',
  setting: [
    { label: '组件间距', key: 'padded', component: 'switch', value: true },
    // {
    //   label: '样式',
    //   key: 'style',
    //   component: function (h, { key }) {
    //     return <CouponStyle v-model={this.value[key]} />
    //   },
    //   value: '1'
    // },
    {
      label: '优惠券',
      key: 'data',
      component: function (h, { key }) {
        return <CouponItem v-model={this.value[key]} />
      },
      value: [
        {
          amount: 8,
          desc: '优惠券描述',
          id: '',
          imgUrl: '',
          title: '优惠券名称',
          type: 'cash'
        }
      ]
    },
    {
      label: '券包',
      key: 'voucher_package',
      component: function (h, { key }) {
        return <CouponPackage v-model={this.value[key]} />
      },
      value: [],
      tip: `提示: 优惠券、券包颜色跟随商城主题色变化<br />
      建议尺寸:<br />
      一张图片（宽度355px，高度90px）<br />
      二张图片（宽度172px，高度90px）<br />
      三张图片或更多（宽度138px，高度90px）`
    }
  ],
  transformIn: (v) => {
    const { name, base, data, voucher_package, track, tagsType, meber_tags, no_meber_tags } = v
    return {
      id: v?.id,
      name,
      ...base,
      data,
      voucher_package,
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
      id: 'id',
      name: 'name',
      base: (v) => {
        return pickBy(v, {
          title: 'title',
          subtitle: 'subtitle',
          padded: 'padded'
        })
      },
      data: 'data',
      voucher_package: 'voucher_package',
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
