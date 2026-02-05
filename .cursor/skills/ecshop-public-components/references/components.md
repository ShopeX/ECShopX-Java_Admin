# 公共组件详细说明（全项目）

本文档为 ecshop-public-components skill 的参考，包含各组件的路径、Props、v-model 结构及示例。**使用场景与所在模块**见 [usage-scenarios.md](usage-scenarios.md)；**$picker 全部方法与使用模块**见 [picker-api.md](picker-api.md)。

## 目录

1. [配置组件 (configsetting)](#1-配置组件-configsetting)
2. [样式与配置面板组件](#2-样式与配置面板组件)
3. [数据选择器组件](#3-数据选择器组件)
4. [链接选择与媒体选择器组件](#4-链接选择与媒体选择器组件)
5. [$picker 速查](#5-picker-速查)

---

## 1. 配置组件 (configsetting)

**位置**: `src/view/decorate/comps/configsetting.js`  
**适用范围**: 装修挂件 config；可复用于需「统一注入边距/人群/埋点」的配置结构。

**作用**: 自动为挂件添加 outerMargin、innerPadding（部分挂件）、tags、track，并识别 `component: 'compStyle'` 转为 CompStyle 组件。

**用法**（在 config 末尾）:
```javascript
import '../../comps/configsetting'
export default (typeof globalThis !== 'undefined' && globalThis.__processConfig__)
  ? globalThis.__processConfig__(config)
  : config
```

---

## 2. 样式与配置面板组件

### CompStyle (comp_style.vue)

边距/背景配置。使用场景：`outerMargin`、`innerPadding`；内部可带 SpImagePicker 做背景图。  
**示例**：见 [usage-scenarios](usage-scenarios.md)；value 形如 `{ paddedt, paddedb, paddedl, paddedr }`。

### CompOuter / CompInner

外背景（颜色、图片）、内背景（纯色、渐变）。value 见原 decorate 文档。  
**使用场景**: 装修 config；可复用于同类配置面板。

### CompButton (comp-button.vue)

占位文案+数量，点击调 `$picker`。Props：placeholder、format、value、viewBtn、on-click、on-remove。  
**使用场景**: 装修多挂件、attr-store/attr-goods/attr-label、goods-attr/attr-data 等；任何「点击弹窗选择并写回」的表单均可复用。

### CompBtn (comp_btn.vue)

按钮样式：颜色、文字色、可选图片。v-model：`{ color, textColor, image }`；Props：`showImage`。  
**使用场景**: 装修 wgt_coupon 领取按钮等。

---

## 3. 数据选择器组件

### AttrStore (attr-store.vue)

店铺选择，多位于挂件目录（如 wgt_shop、wgt_store）。v-model 绑定店铺数据；on-change 可清空关联项。  
**使用场景**: 装修店铺类挂件；可复用于需「选店铺」的表单。

### SpVideoPicker

**位置**: `@/components/sp-video-picker/index.vue`  
**Props**: v-model、size（如 'small'）。value 常为 `{}` 或视频对象。  
**使用场景**: 装修视频挂件/轮播、商品视频、会员 UGC 等；见 [usage-scenarios](usage-scenarios.md#spvideopicker-使用场景)。

---

## 4. 链接选择与媒体选择器组件

### CompPickerLink（链接/路径选择）

**位置**: `src/view/decorate/comps/comp-pickerLink.vue`  
**v-model**: `{ linkType: 0|1, linkUrl: '', linkPage: '', id: '', title: '', trackingParams: '' }`  
**Props**: value、isShowH5Link（默认 true）、tabs（可选，DEFAULT_PICKER_TABS / PLATFORM_PAGE_PICKER_TABS）

基础：`<CompPickerLink v-model={this.value[key]} style='margin-top: 7px;' />`。  
指定 tabs：`<CompPickerLinkVue v-model={...} tabs={...} />`。  
**使用场景**: 装修多挂件、小程序统计等；见 [usage-scenarios](usage-scenarios.md#compickerlink-使用场景)。

### SpImagePicker（图片选择）

**位置**: `@/components/sp-image-picker/index.vue`  
**Props**: value/v-model、size（'small'|'mini'|'big'）、text（可选）、drag、max 等。  
**使用场景**: 全项目多业务；见 [usage-scenarios](usage-scenarios.md#spimagepicker-使用场景)。

### CompBtn

见 [样式与配置面板组件](#2-样式与配置面板组件)。

---

## 5. $picker 速查

常用方法：path、image、video、coupon、store/shop、goods、goodsitem、category、tag、pages、crowds 等。  
**完整方法列表、入参与使用模块**见 **[picker-api.md](picker-api.md)**。  
需要「路径+埋点」时用 **CompPickerLink**；自定义 UI 时在 on-click 中 `this.$picker.xxx(...)` 并 `$set` 写回。

---

## 参考路径

- `src/view/decorate/comps/configsetting.js`、comp_style.vue、comp-pickerLink.vue、comp_btn.vue、comp-button.vue
- `@/components/sp-image-picker/index.vue`、`@/components/sp-video-picker/index.vue`
