import { pickBy } from '@/utils'
import NavItem from './nav-item.vue'
import CompOuter from '../../comps/comp_background_outer.vue'
import CompStyle from '../../comps/comp_style.vue'

export default {
  name: 'locationModule',
  setting: [
    {
      label: '导航可吸顶',
      key: 'navSticky',
      component: 'switch',
      value: false
    },
    {
      label: '导航栏背景',
      key: 'navbg',
      component: function (h, { key }) {
        return <CompOuter v-model={this.value[key]} />
      },
      value: { color: '#ffffff', image: '' },
      module: 'navstyle'
    },
    {
      label: '导航栏内边距',
      key: 'navpadded',
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
        paddedt: 8,
        paddedb: 10,
        paddedl: 0,
        paddedr: 0
      },
      module: 'navstyle'
    },
    {
      label: '导航项区域背景',
      key: 'navitembg',
      component: function (h, { key }) {
        return <CompOuter v-model={this.value[key]} />
      },
      value: { color: '', image: '' },
      module: 'navitemarea'
    },
    {
      label: '导航项区域内边距',
      key: 'navitempadded',
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
        paddedt: 0,
        paddedb: 0,
        paddedl: 0,
        paddedr: 0
      },
      module: 'navitemarea'
    },
    {
      label: '导航项区域圆角',
      key: 'navitemradius',
      component: 'number',
      value: 0,
      module: 'navitemarea'
    },
    {
      label: '导航项高度',
      key: 'navitemheight',
      component: 'number',
      value: 40,
      module: 'navitemstyle'
    },
    {
      label: '导航项内间距',
      key: 'navitemmargin',
      component: function (h, { key }) {
        return (
          <CompStyle
            showBgsetting={false}
            v-model={this.value[key]}
            uuid={this.value.uuid}
            showLabel={false}
            showTop={false}
            showBottom={false}
            showLeft={false}
            showRight={false}
            showLR={true}
          />
        )
      },
      value: {
        paddedlr: 18
      },
      module: 'navitemstyle'
    },
    {
      label: '导航左滑示意图',
      key: 'leftimgUrl',
      component: function (h, { key }) {
        return (
          <div class={'sp-image-picker'}>
            <SpImagePicker v-model={this.value[key]} size='small' />
          </div>
        )
      },
      value: '',
      module: 'navitemstyle'
    },
    {
      label: '导航右滑示意图',
      key: 'rightimgUrl',
      component: function (h, { key }) {
        return (
          <div class={'sp-image-picker'}>
            <SpImagePicker v-model={this.value[key]} size='small' />
          </div>
        )
      },
      value: '',
      module: 'navitemstyle'
    },
    {
      label: '导航项选中底线',
      key: 'navitemborder',
      component: 'switch',
      value: false,
      module: 'navitemstyle'
    },
    {
      label: '底线颜色',
      key: 'navitembordercolor',
      component: 'color',
      value: '#ffffff',
      module: 'navitemstyle'
    },
    {
      label: '',
      key: 'data',
      component: function (h, { key }) {
        return <NavItem v-model={this.value[key]} animate={this.value.animate}/>
      },
      value: [],
      module: 'navdata'
    }
  ],
  transformIn: (v, wgtList) => {
    const {
      name,
      base,
      data: { data },
      uuid,
      meber_tags,
      no_meber_tags,
      tagsType
    } = v
    return {
      name,
      uuid,
      ...base,
      tags: {
        type: tagsType || '2',
        meber_tags: meber_tags || [],
        no_meber_tags: no_meber_tags || []
      },
      data: data.map(({ children, no_meber_tags = [], meber_tags = [], tagsType, configType = 'widget', ...item }) => {
        let _children = children
        if(configType == 'widget'){
          _children = children?.map((ele) => {
            const { transformIn } =
              wgtList.find((wgt) => wgt.name.toLowerCase() == ele.name.toLowerCase())?.config || {}
            if (transformIn) {
              return { ...transformIn(ele, wgtList), wgtName: ele.wgtName }
            }
            return { ...ele, wgtName: ele.wgtName }
          })
        }
        return {
          ...item,
          tags: {
            type: tagsType || '2',
            no_meber_tags,
            meber_tags
          },
          configType,
          children: _children
        }
      })
    }
  },
  transformOut: (v, wgtList,regionauth_id) => {
    return pickBy(v, {
      name: 'name',
      meber_tags: 'tags.meber_tags',
      no_meber_tags: 'tags.no_meber_tags',
      tagsType: 'tags.type',
      base: (v) => {
        return pickBy(v, {
          wgtCustName: 'wgtCustName',
          track: 'track',
          animate: 'animate',
          navSticky: 'navSticky',
          navbg: 'navbg',
          navpadded: 'navpadded',
          navitembg: 'navitembg',
          navitempadded: 'navitempadded',
          navitemheight: 'navitemheight',
          navitemmargin: 'navitemmargin',
          leftimgUrl: 'leftimgUrl',
          rightimgUrl: 'rightimgUrl',
          navitemborder: 'navitemborder',
          navitemradius: 'navitemradius',
          navitembordercolor: 'navitembordercolor'
        })
      },
      data: (v) => {
        return pickBy(v, {
          data: ({ data }) => {
            return data.map(({ children, ...item }) => {
              const { tags, configType, ...rest } = item
              let _children = children
              if (configType == 'widget') {
                _children = children?.map((ele) => {
                  const { transformOut } =
                    wgtList.find((wgt) => wgt.name.toLowerCase() == ele.name.toLowerCase()).config ||
                    {}
                  if (transformOut) {
                    return { ...transformOut(ele, wgtList,regionauth_id), wgtName: ele.wgtName }
                  }
                  return { ...ele, wgtName: ele.wgtName }
                })
              }
              return {
                ...rest,
                no_meber_tags: tags.no_meber_tags || [],
                meber_tags: tags.meber_tags || [],
                tagsType: tags.type,
                configType,
                children: children ? _children : []
              }
            })
          }
        })
      }
    })
  }
}
