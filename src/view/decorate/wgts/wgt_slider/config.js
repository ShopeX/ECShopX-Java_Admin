/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { pickBy, isObject } from '@/utils'
import AttrItem from './attr-item'
import { transformInBase, createTransformOutBase } from '../../comps/transform-utils'

const config = {
  name: 'slider',
  setting: [
    // { label: '标题颜色', key: 'WordColor', component: 'color', value: '#333333' },
    {
      group: '7bb603be.9f1cbe',
      label: '7bb603be.8695d8',
      key: 'interval',
      component: 'number',
      value: 3000,
      min: 1000,
      max: 50000,
      step: 1000
    },
    {
      group: '7bb603be.9f1cbe',
      label: '7bb603be.e33142',
      key: 'rounded',
      component: 'radiobutton',
      value: false,
      options: [
        { name: '7bb603be.0103eb', label: true },
        { name: '7bb603be.bf307d', label: false }
      ]
    },
    {
      group: '7bb603be.148c77',
      label: '7bb603be.9a9056',
      key: 'dot',
      component: 'radiobutton',
      options: [
        { name: '7bb603be.be604f', label: true },
        { name: '7bb603be.55d479', label: false }
      ],
      value: true
    },
    {
      group: '7bb603be.148c77',
      label: '7bb603be.175553',
      key: 'dotCover',
      component: 'radiobutton',
      value: false,
      options: [
        { name: '7bb603be.cc42dd', label: true },
        { name: '7bb603be.b15d91', label: false }
      ]
    },
    {
      group: '7bb603be.148c77',
      label: '7bb603be.a8a94d',
      key: 'dotLocation',
      component: 'radiobutton',
      options: [
        { name: '7bb603be.316a63', label: 'left' },
        { name: '7bb603be.0bbc2e', label: 'center' },
        { name: '7bb603be.e2aaec', label: 'right' }
      ],
      value: 'right'
    },
    {
      group: '7bb603be.148c77',
      label: '7bb603be.11333d',
      key: 'shape',
      component: 'radiobutton',
      options: [
        { name: '7bb603be.2db0fc', label: 'circle' },
        { name: '7bb603be.2fce58', label: 'rectangle' }
      ],
      value: 'circle'
    },
    {
      group: '7bb603be.148c77',
      label: '7bb603be.14db62',
      key: 'dotColor',
      component: 'radiobutton',
      options: [
        { name: '7bb603be.41e8e8', label: 'dark' },
        { name: '7bb603be.a32b3b', label: 'light' }
      ],
      value: 'dark'
    },
    // { label: '图片描述', key: 'content', component: 'switch', value: true },
    {
      label: '',
      key: 'data',
      component: function (h, { key }) {
        return <AttrItem v-model={this.value[key]} uuid={this.value.uuid} />
      },
      value: [
        {
          media_type: 'img',
          videoUrl: '',
          autoplay: false,
          interact: 'reset',
          overlay: '',
          overlayWidth: 100,
          overlaybuttom: 0,
          overlayLeft: 0,
          imgUrl: '',
          mainTitle: '',
          hotData: [],
          overlayHotData: []
        }
      ]
    },
    {
      label: '7bb603be.3dd185',
      group: '7bb603be.9f1cbe',
      key: 'autoplay',
      component: 'radiobutton',
      options: [
        { name: '7bb603be.cc42dd', label: true },
        { name: '7bb603be.b15d91', label: false }
      ],
      value: true
    }
  ],
  transformIn: (v) => {
    const { name, base, config, data, track, tagsType, meber_tags, no_meber_tags } = v
    // 使用公共函数处理 base 中的样式数据转换
    const transformedBase = transformInBase(base, ['outerMargin'])
    // 第一屏尺寸：宽固定 375，高从保存数据回显，渲染后再由 measureFirstScreenHeight 更新
    const { firstScreenWidth, firstScreenHeight } = config || {}
    return {
      id: v?.id,
      name,
      ...transformedBase,
      ...config,
      firstScreenWidth: firstScreenWidth ?? 375,
      firstScreenHeight: firstScreenHeight ?? 0,
      track,
      tags: {
        type: tagsType || '2',
        meber_tags: meber_tags || [],
        no_meber_tags: no_meber_tags || []
      },
      data: (data || []).map((item) => {
        const {
          linkPage,
          title,
          id,
          hotData = [],
          videoUrl,
          overlayHotData = [],
          autoplay,
          interact,
          overlay,
          overlayWidth,
          overlaybuttom,
          overlayLeft,
          media_type,
          ...content
        } = item
        const url = isObject(videoUrl) ? videoUrl?.url : videoUrl
        return {
          data: {
            linkPage: linkPage,
            id: id,
            title: title
          },
          hotData,
          videoUrl: url,
          autoplay,
          interact,
          overlay,
          overlayWidth,
          overlaybuttom,
          overlayLeft,
          overlayHotData,
          media_type: media_type || (url ? 'video' : 'img'),
          ...content
        }
      })
    }
  },
  transformOut: (v) => {
    return pickBy(v, {
      id: 'id',
      name: 'name',
      base: createTransformOutBase(['outerMargin'], ['outerMargin']),
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
          content: 'content',
          autoplay: 'autoplay',
          firstScreenWidth: 'firstScreenWidth',
          firstScreenHeight: 'firstScreenHeight'
        })
      },
      data: ({ data }) => {
        return (data || []).map((item) => {
          return pickBy(item, {
            imgUrl: 'imgUrl',
            videoUrl: 'videoUrl',
            subtitle: 'subtitle',
            subtitleTow: 'subtitleTow',
            button: 'button',
            template: 'template',
            media_type: 'media_type',
            linkPage: 'data.linkPage',
            ctoken: 'data.ctoken',
            id: 'data.id',
            title: 'data.title',
            hotData: 'hotData',
            autoplay: 'autoplay',
            interact: 'interact',
            overlay: 'overlay',
            overlayWidth: 'overlayWidth',
            overlaybuttom: 'overlaybuttom',
            overlayLeft: 'overlayLeft',
            overlayHotData: 'overlayHotData',
            moreLink: 'moreLink'
          })
        })
      },
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
export default typeof globalThis !== 'undefined' && globalThis.__processConfig__
  ? globalThis.__processConfig__(config)
  : config
