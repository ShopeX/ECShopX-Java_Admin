import { pickBy } from '@/utils'
import CompInner from '../../comps/comp_background_inner.vue'; // 组件内背景
import CompStyle from '../../comps/comp_style.vue';
import CompOuter from '../../comps/comp_background_outer.vue';
import CompNavtext from '../../comps/comp_navtext.vue';
import AttrMorebtnVue from './attr-morebtn.vue';
import AttrDataVue from './attr-data.vue';
import CompPickerLinkVue from '../../comps/comp-pickerLink.vue';
import { PLATFORM_PAGE_PICKER_TABS, DEFAULT_PICKER_TABS } from '@/consts'
export default {
  name: 'shelves',
  setting: [
    {
      label: '展示形式',
      key: 'animation',
      component: 'radiobutton',
      options: [
        { name: '横向排列', label: 'horizontal' },
        { name: '纵向排列', label: 'vertical' }
      ],
      value: 'horizontal',
      onchange: function (v, self) {
        console.log(v, self)
        if (v == 'vertical') {
          self.$set(self.value, 'limitedTime', false)
        } else {
          self.$set(self.value, 'limitedTime', true)
        }
      }
    }, {
      label: '商品排列',
      key: 'goodsSort',
      component: 'radio',
      options: [
        { name: '一行一个', label: 'one' },
        { name: '一行两个', label: 'two' },
        { name: '一行三个', label: 'three' },
      ],
      value: 'one',
      isShow: function () {
        return this.value.animation === 'vertical'
      }
    },
    {
      label: '数据类型',
      key: 'dataType',
      component: 'select',
      placeholder: '请选择数据类型',
      options: [
        { label: '按销量', value: 'sales' },
        { label: '按价格区间', value: 'price' },
        { label: '按指定商品', value: 'items' },
        { label: '按管理分类', value: 'main_category' },
        { label: '按销售分类', value: 'category' },
        { label: '按限时特惠活动', value: 'seckill' },
        { label: '按品类热销榜单', value: 'category_ranking' },
        { label: '按活动集合页-秒杀', value: 'promotion' },
        { label: '按活动集合页-拼团', value: 'group' },
      ],
      value: 'main_category',
      onchange: function (v, self) {
        self.$set(self.value, 'data', {
          id: v == 'price' ? '0,0' : '',
          info: null
        })
        self.$set(self.value, 'limitedTime', false)
        if (v == 'seckill') {
          self.$set(self.value, 'titleText', {
            type: 'image',
            text: '',
            image: 'https://aiopro-imgcdn.fvo2o.com/aiopro_vshop/fv_wgt-scekill.png'
          })
        }
      }
    },
    {
      label: '数据设置',
      key: 'data',
      component: function (h, { key }) {
        return <AttrDataVue v-model={this.value[key]} type={this.value.dataType} dataCount={this.value.dataCount} />
      },
      value: {
        id: '',
        info: null
      },
      isShow: function () {
        return !['sales', 'price','group'].includes(this.value.dataType)
      }
    },
    {
      label: '价格区间',
      key: 'data',
      component: function (h, { key }) {
        return <AttrDataVue v-model={this.value[key]} type={this.value.dataType} dataCount={this.value.dataCount} />
      },
      value: {
        id: '0,0',
        info: null
      },
      isShow: function () {
        return ['price'].includes(this.value.dataType)
      }
    },
    {
      label: '数据数量',
      key: 'dataCount',
      component: 'number',
      value: 4,
      min: 1,
      max: 99
    },
    {
      label: '限时特惠',
      key: 'limitedTime',
      component: 'switch',
      value: false,
      isShow: function () {
        return this.value.animation == 'horizontal' && ['sales', 'price', 'items', 'main_category', 'category'].includes(this.value.dataType)
      }
    }, {
      label: '限时特惠数据',
      key: 'limitedTimeData',
      size: 'mini',
      component: function (h, { key }) {
        return <AttrDataVue v-model={this.value[key]} type={'seckill'} />
      },
      value: {
        id: '',
        info: null
      },
      isShow: function () {
        return this.value.limitedTime
      }
    },
    {
      label: '限时特惠标题',
      key: 'limitedTimeTitle',
      component: 'input',
      value: '限时特惠',
      isShow: function () {
        return this.value.limitedTime
      }
    },
    {
      label: '限时特惠背景',
      key: 'limitedTimeBackground',
      component: function (h, { key }) {
        return <CompInner v-model={this.value[key]} />
      },
      value: { type: 'gradient', color: '#ffffff', startColor: '#E5C9FE', endColor: '#ffffff' },
      isShow: function () {
        return this.value.limitedTime
      }
    },
    {
      label: '组件标题',
      key: 'titleText',
      component: function (h, { key }) {
        return <CompNavtext v-model={this.value[key]} />
      },
      value: {
        type: 'text',
        text: '热销榜单',
        image: ''
      }
    },
    {
      label: '标题颜色',
      key: 'titleColor',
      component: 'color',
      value: '#000000',
      isShow: function () {
        return this.value.titleText.type === 'text'
      }
    },
    {
      label: '更多按钮',
      key: 'moreBtn',
      component: function (h, { key }) {
        return <AttrMorebtnVue v-model={this.value[key]} />
      },
      value: {
        show: true,
        color: '#000000',
      }
    },
    {
      label: '更多跳转设置',
      key: 'moreLink',
      component: function (h, { key }) {
        return <CompPickerLinkVue v-model={this.value[key]} style='margin-top: 7px;' tabs={this.$route.query.scene=='1010' ? PLATFORM_PAGE_PICKER_TABS : DEFAULT_PICKER_TABS} />
      },
      isShow: function () {
        return this.value.moreBtn.show
      },
      value: {}
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
          />
        );
      },
      value: {
        paddedt: 12,
        paddedb: 12,
        paddedl: 12,
        paddedr: 12,
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
        );
      },
      value: {
        paddedt: 9,
        paddedb: 9,
        paddedl: 12,
        paddedr: 12,
      }
    },
    {
      label: '组件外背景',
      key: 'outerBackground',
      component: function (h, { key }) {
        return <CompOuter v-model={this.value[key]} />
      },
      value: { color: '', image: '' }
    },
    {
      label: '组件内背景',
      key: 'innerBackground',
      component: function (h, { key }) {
        return <CompInner v-model={this.value[key]} showImage={true} />
      },
      value: { type: 'gradient', color: '', startColor: '#FFCCDA', endColor: '#FFF', image: '' }
    }
  ],
  transformIn: (v) => {
    const {innerPadding,...rest} = v.base
    const {paddedt,paddedb,paddedl,paddedr} = innerPadding || {} //兼容
    return {
      name: v.name,
      ...rest,
      data: v.data,
      innerPadding: {
        paddedt,
        paddedb,
        paddedl,
        paddedr
      },
      tags: {
        type: v.tagsType || '2',
        meber_tags: v.meber_tags || [],
        no_meber_tags: v.no_meber_tags || []
      },
    }
  },
  transformOut: (v,wgtList,regionauth_id) => {
    return pickBy(v, {
      name: 'name',
      base: (v) => {
        return pickBy(v, {
          wgtCustName: 'wgtCustName',
          track: 'track', // 埋点上报参数
          animation: 'animation', // 展示形式
          dataType: 'dataType', // 数据类型
          dataCount: 'dataCount', // 数据数量
          outerMargin: 'outerMargin', // 组件外边距
          innerPadding: 'innerPadding', // 组件内边距
          outerBackground: 'outerBackground', // 组件外背景
          innerBackground: 'innerBackground', // 组件内背景
          titleText: 'titleText', // 组件标题
          titleColor: 'titleColor', // 标题颜色
          moreBtn: 'moreBtn', // 更多按钮
          moreLink: 'moreLink', // 更多跳转设置
          limitedTime: 'limitedTime', // 限时特惠
          limitedTimeData: 'limitedTimeData', // 限时特惠数据
          limitedTimeTitle: 'limitedTimeTitle', // 限时特惠标题
          limitedTimeBackground: 'limitedTimeBackground', // 限时特惠背景
          goodsSort: 'goodsSort', // 商品排列
        })
      },
      data: 'data',
      meber_tags: 'tags.meber_tags',
      no_meber_tags: 'tags.no_meber_tags',
      tagsType: 'tags.type',
      noRegionauth: !regionauth_id,
    })
  }
}