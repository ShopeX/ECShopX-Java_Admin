/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { pickBy } from '@/utils'
import AttrItem from './attr-item'

const config = {
  name: 'slider',
  setting: [
    // { label: '标题颜色', key: 'WordColor', component: 'color', value: '#333333' },
    {
      group: '内容样式',
      label: '轮播时间',
      key: 'interval',
      component: 'number',
      value: 3000,
      min: 1000,
      max: 50000,
      step: 1000
    },
    {
      group: '内容样式',
      label: '组件间距', key: 'padded', component: 'radiobutton', value: true, options: [
        { name: '开启', label: true },
        { name: '关闭', label: false }
      ]
    },
    {
      group: '内容样式',
      label: '图片边角', key: 'rounded', component: 'radiobutton', value: false, options: [
        { name: '圆角', label: true },
        { name: '直角', label: false }
      ]
    },
    {
      group: '指示点设置',
      label: '指示点样式',
      key: 'dot',
      component: 'radiobutton',
      options: [
        { name: '点', label: true },
        { name: '数字', label: false }
      ],
      value: true
    },
    { 
      group: '指示点设置',
      label: '指示点覆盖', key: 'dotCover', component: 'radiobutton', value: false, options: [
      { name: '开启', label: true },
      { name: '关闭', label: false }
    ] },
    {
      group: '指示点设置',
      label: '指示点位置',
      key: 'dotLocation',
      component: 'radiobutton',
      options: [
        { name: '居左', label: 'left' },
        { name: '居中', label: 'center' },
        { name: '居右', label: 'right' }
      ],
      value: 'right'
    },
    {
      group: '指示点设置',
      label: '指示点形状',
      key: 'shape',
      component: 'radiobutton',
      options: [
        { name: '圆形', label: 'circle' },
        { name: '长方型', label: 'rectangle' }
      ],
      value: 'circle'
    },
    {
      group: '指示点设置',
      label: '指示点颜色',
      key: 'dotColor',
      component: 'radiobutton',
      options: [
        { name: '深色', label: 'dark' },
        { name: '亮色', label: 'light' }
      ],
      value: 'dark'
    },
    {
      group: '内容样式',
      label: '轮播项间距', key: 'itemPadded', component: 'radiobutton', value: true, options: [
      { name: '开启', label: true },
      { name: '关闭', label: false }
    ] },
    // { label: '图片描述', key: 'content', component: 'switch', value: true },
    {
      label: '',
      key: 'data',
      component: function (h, { key }) {
        return <AttrItem v-model={this.value[key]} />
      },
      value: [
        {
          button: '',
          content: '',
          id: '',
          imgUrl: '',
          linkPage: '',
          mainTitle: '',
          subtitle: '',
          subtitleTow: '',
          template: ''
        }
      ]
    }
  ],
  transformIn: (v) => {
    const { name, base, config, data, track, tagsType ,meber_tags, no_meber_tags} = v
    return {
      id: v?.id,
      name,
      ...base,
      ...config,
      data,
      track,
      tags:{
        type: tagsType || '2',
        meber_tags: meber_tags || [],
        no_meber_tags: no_meber_tags || []
      },
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
      config: (v) => {
        return pickBy(v, {
          interval: 'interval',
          dot: 'dot',
          dotLocation: 'dotLocation',
          dotColor: 'dotColor',
          shape: 'shape',
          dotCover: 'dotCover',
          itemPadded: 'itemPadded',
          rounded: 'rounded',
          content: 'content'
        })
      },
      data: 'data',
      track: 'track',
      tags: 'tags',
      tagsType: 'tags.type',
      meber_tags: 'tags.meber_tags',
      no_meber_tags: 'tags.no_meber_tags',
    })
  }
}

// 自动处理 compStyle 配置（初始化全局处理函数）
import '../../comps/configsetting'
export default (typeof globalThis !== 'undefined' && globalThis.__processConfig__) 
  ? globalThis.__processConfig__(config) 
  : config
