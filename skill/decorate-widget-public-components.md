# 装修挂件 · 公共组件说明 (Public Components)

本文档描述装修挂件在 **config.js** 中可复用的公共组件，供 [挂件创建业务指南](decorate-widget-creation.md) 及具体挂件配置引用。

---

## 目录

1. [配置组件 (configsetting.js)](#1-配置组件-configsettingjs)
2. [样式组件](#2-样式组件)
3. [数据选择器组件](#3-数据选择器组件)
4. [链接选择与媒体选择器组件](#4-链接选择与媒体选择器组件)
5. [\$picker 方法速查](#5-picker-方法速查)

---

## 1. 配置组件 (configsetting.js)

**位置**: `src/view/decorate/comps/configsetting.js`

**作用**: 自动处理挂件配置，为所有挂件添加通用配置项，并自动识别和转换 CompStyle 配置。

**自动添加的配置项**:
- `outerMargin`（组件外边距）- 所有挂件自动添加
- `innerPadding`（组件内边距）- 特定挂件自动添加（如 `speedkill`, `group`, `shop`, `couponCard`, `storeAlphabet` 等）
- `tags`（人群设置）- 所有挂件自动添加
- `track`（埋点参数）- 所有挂件自动添加

**使用方法**:
```javascript
import '../../comps/configsetting'

export default (typeof globalThis !== 'undefined' && globalThis.__processConfig__)
  ? globalThis.__processConfig__(config)
  : config
```

---

## 2. 样式组件

### CompStyle (comp_style.vue)

用于配置边距（padding/margin）的组件。

**使用场景**: `outerMargin`（外边距）、`innerPadding`（内边距）

**示例**:
```javascript
{
  label: '组件内边距',
  key: 'innerPadding',
  component: function (h, { key }) {
    return (
      <CompStyle
        v-model={this.value[key]}
        uuid={this.value.uuid}
        showTop={true}
        showBottom={true}
        showLeft={true}
        showRight={true}
      />
    )
  },
  value: {
    paddedt: 16,
    paddedb: 16,
    paddedl: 16,
    paddedr: 16
  }
}
```

### CompOuter (comp_background_outer.vue / comp_outer)

用于配置组件外背景（颜色、图片）。

**示例**:
```javascript
{
  label: '组件外背景',
  key: 'outerBackground',
  component: function (h, { key }) {
    return <CompOuter v-model={this.value[key]} uuid={this.value.uuid} />
  },
  value: { color: '#f8f8f8', image: '' }
}
```

### CompInner (comp_background_inner.vue / comp_inner)

用于配置组件内背景（纯色、渐变）。

**示例**:
```javascript
{
  label: '组件内背景',
  key: 'innerBackground',
  component: function (h, { key }) {
    return <CompInner v-model={this.value[key]} uuid={this.value.uuid} />
  },
  value: { type: 'solid', color: '#ffffff', startColor: '#ffffff', endColor: '#ffffff' }
}
```

### CompButton (comp-button.vue)

用于触发选择器（如优惠券、商品等），展示占位文案与数量，点击打开选择弹窗。

**示例**:
```javascript
{
  label: '数据设置',
  key: 'data',
  component: function (h, { key }) {
    const self = this
    return (
      <CompButton
        placeholder="选择优惠券"
        format="{0}个优惠券"
        value={self.value[key]?.length || 0}
        viewBtn={false}
        on-click={async () => {
          const { data: couponData } = await self.$picker.coupon({
            data: self.value[key] || [],
            multiple: true,
            params: { regionauth_id: self.$route.query.regionauth_id }
          })
          self.$set(self.value, key, formattedCouponList)
        }}
        on-remove={() => { self.$set(self.value, key, []) }}
      />
    )
  },
  value: []
}
```

---

## 3. 数据选择器组件

### AttrStore (attr-store.vue)

店铺选择器，一般放在挂件目录下（如 `wgt_shop/attr-store.vue`），选择指定店铺。

**示例**:
```javascript
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
  value: []
}
```

### SpVideoPicker

**位置**: `@/components/sp-video-picker/index.vue`  
**作用**: 选择视频资源。

**示例**:
```javascript
{
  label: '选择视频',
  key: 'data',
  component: function (h, { key }) {
    return <SpVideoPicker v-model={this.value[key]} size='small' />
  },
  value: {}
}
```

---

## 4. 链接选择与媒体选择器组件

### CompPickerLink（链接/路径选择）

**位置**: `src/view/decorate/comps/comp-pickerLink.vue`

**作用**: 配置跳转链接，支持「选择路径」（商品、分类、自定义页面等）或「H5 链接」，并带埋点参数。

**v-model 结构**:
```javascript
{
  linkType: 0,        // 0=选择路径, 1=H5链接
  linkUrl: '',        // H5 链接（linkType=1 时）
  linkPage: '',       // 路径类型（如 goods, category, custom_page）
  id: '',
  title: '',
  trackingParams: ''
}
```

**Props**: `value`、`isShowH5Link`（默认 true）、`tabs`（可选，来自 `@/consts` 的 `DEFAULT_PICKER_TABS` / `PLATFORM_PAGE_PICKER_TABS`）

**基础用法**:
```javascript
import CompPickerLink from '../../comps/comp-pickerLink'

{
  label: '更多链接',
  key: 'moreLink',
  component: function (h, { key }) {
    return <CompPickerLink v-model={this.value[key]} style='margin-top: 7px;' />
  },
  value: {}
}
```

**指定 tabs 用法**（如商品/排行榜等「更多」链接）:
```javascript
import CompPickerLinkVue from '../../comps/comp-pickerLink.vue'
import { PLATFORM_PAGE_PICKER_TABS, DEFAULT_PICKER_TABS } from '@/consts'

{
  label: '更多链接',
  key: 'moreLink',
  component: function (h, { key }) {
    return (
      <CompPickerLinkVue
        v-model={this.value[key]}
        style='margin-top: 7px;'
        tabs={this.$route.query.scene == '1010' ? PLATFORM_PAGE_PICKER_TABS : DEFAULT_PICKER_TABS}
      />
    )
  },
  value: {}
}
```

**参考挂件**: wgt_speedkill、wgt_ranking、wgt_hotranking、wgt_group、wgt_goods、wgt_goodsScroll、wgt_goodsGrid、wgt_goodsGridTab。

### SpImagePicker（图片选择）

**位置**: `@/components/sp-image-picker/index.vue`  
**作用**: 选择一张图片（头图、背景图、商品图等）。

**示例**:
```javascript
{
  label: '标题图片',
  key: 'titleImage',
  component: function (h, { key }) {
    return <SpImagePicker v-model={this.value[key]} size='small' />
  },
  value: ''
}
```

**常用 props**: `value`/`v-model`、`size`（'small'|'mini'）、`text`（可选）。

### SpVideoPicker（视频选择）

见 [SpVideoPicker](#spvideopicker)  above.

### CompBtn（按钮样式：颜色 + 可选图片）

**位置**: `src/view/decorate/comps/comp_btn.vue`  
**作用**: 配置按钮背景色、文字颜色、可选按钮图。

**v-model 结构**: `{ color, textColor, image }`  
**Props**: `value`、`showImage`（默认 true）

**示例**:
```javascript
import CompBtn from '../../comps/comp_btn.vue'

{
  label: '领取按钮',
  key: 'receiveBtn',
  component: function (h, { key }) {
    return <CompBtn v-model={this.value[key]} showImage={false} />
  },
  value: { color: '#000000', textColor: '#fff', image: '' }
}
```

---

## 5. $picker 方法速查

在 CompButton 或自定义 component 的 `on-click` 中，通过 `this.$picker.xxx()` 打开选择弹窗：

| 方法 | 说明 | 典型参数 |
|------|------|----------|
| `this.$picker.path(options)` | 路径/链接选择 | `{ data, tab, multiple, guide }` |
| `this.$picker.coupon(options)` | 优惠券选择 | `{ data, multiple, params }` |
| `this.$picker.image(options)` | 图片选择 | - |
| `this.$picker.store(options)` / `this.$picker.shop(options)` | 店铺选择 | - |
| `this.$picker.goods(options)` | 商品选择 | - |
| `this.$picker.goodsitem(options)` | 商品项选择 | - |
| `this.$picker.category(options)` | 分类选择 | - |
| `this.$picker.tag(options)` | 标签选择 | - |

需要「路径 + 埋点」时可直接用 **CompPickerLink**；自定义 UI 时在 `on-click` 里调 `this.$picker.path(...)` 并用 `$set` 写回对应 key。

---

## 参考路径

- `src/view/decorate/comps/configsetting.js`
- `src/view/decorate/comps/comp_style.vue`
- `src/view/decorate/comps/comp-pickerLink.vue`
- `src/view/decorate/comps/comp_btn.vue`
- `src/view/decorate/comps/comp-button.vue`
- `@/components/sp-image-picker/index.vue`
- `@/components/sp-video-picker/index.vue`
