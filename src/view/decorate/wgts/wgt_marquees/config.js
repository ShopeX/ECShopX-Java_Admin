/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import AttrHorizontal from './attr_horizontal'
import AttrVertical from './attr_vertical'
import { pickBy } from '@/utils'

const config = {
  name: 'marquees',
  setting: [
    { label: '组件间距', key: 'padded', component: 'switch', value: true },
    {
      label: '内容',
      key: 'direction',
      component: 'radiobutton',
      options: [
        { name: '软文', label: 'vertical' },
        { name: '文本', label: 'horizontal' }
      ],
      value: 'vertical'
    },
    { label: '背景颜色', key: 'bgcolor', component: 'color', value: '#ffffff' },
    { label: '字体颜色', key: 'fontcolor', component: 'color', value: '#000000' },
    {
      label: '文本',
      key: 'dataText',
      isShow: function () {
        return this.value.direction == 'horizontal'
      },
      component: function (h, { key }) {
        return <AttrHorizontal v-model={this.value[key]} />
      },
      value: [{ title: '文本内容' }]
    },
    {
      label: '软文',
      key: 'dataContent',
      isShow: function () {
        return this.value.direction == 'vertical'
      },
      component: function (h, { key }) {
        return <AttrVertical v-model={this.value[key]} />
      },
      value: [{ title: '软文标题', id: '' }]
    }
  ],
  transformIn: (v) => {
    const { name, base, config, data, track, tagsType, meber_tags, no_meber_tags } = v
    let res = {
      id: v?.id,
      name,
      ...base,
      ...config,
      track,
      tags: {
        type: tagsType || '2',
        meber_tags: meber_tags || [],
        no_meber_tags: no_meber_tags || []
      }
    }
    if (config.direction == 'horizontal') {
      res = {
        ...res,
        dataText: data
      }
    } else {
      res = {
        ...res,
        dataContent: data
      }
    }
    return res

    // dataText: config.direction == 'horizontal' ? data : [{ title: '文本内容' }],
    //   dataContent: config.direction == 'vertical' ? data : [{ title: '软文标题', id: '' }]
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
      config: (v) => {
        return pickBy(v, {
          bgcolor: 'bgcolor',
          direction: 'direction',
          fontcolor: 'fontcolor'
        })
      },
      data: v.direction == 'horizontal' ? v.dataText : v.dataContent,
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
