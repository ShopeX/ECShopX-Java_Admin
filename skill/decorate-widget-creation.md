# 装修挂件创建指南 (Widget Creation · 业务逻辑)

本文档描述挂件的**业务逻辑**：目录结构、config 与渲染组件规范、数据转换、样式处理、检查清单等。  
配置项中使用的**公共组件**（链接、图片、视频、按钮、样式等）统一在 **[装修挂件公共组件](decorate-widget-public-components.md)** 中说明，本文在需要处引用。

---

## 目录

1. [挂件结构概述](#1-挂件结构概述)
2. [配置项与公共组件引用](#2-配置项与公共组件引用)
3. [配置文件 (config.js)](#3-配置文件-configjs)
4. [渲染组件 (index.vue)](#4-渲染组件-indexvue)
5. [公共方法（工具函数）](#5-公共方法工具函数)
6. [样式处理](#6-样式处理)
7. [数据转换](#7-数据转换)
8. [完整示例](#8-完整示例)
9. [快速创建检查清单](#9-快速创建检查清单)
10. [常见问题](#10-常见问题)

---

## 1. 挂件结构概述

每个挂件由两个核心文件组成：

```
src/view/decorate/wgts/wgt_[name]/
├── config.js      # 配置文件：设置项、数据转换逻辑
└── index.vue     # 渲染组件：展示与样式
```

**命名规范**:
- 文件夹：`wgt_[name]`（小写，短横线）
- 配置 name：驼峰，如 `film`, `couponCard`, `storeAlphabet`

---

## 2. 配置项与公共组件引用

在 `config.js` 的 `setting` 中会用到：

- **内置类型**：`input`、`select`、`switch`、`color`、`radiobutton` 等
- **公共组件**：样式（CompStyle、CompOuter、CompInner）、链接（CompPickerLink）、图片（SpImagePicker）、视频（SpVideoPicker）、按钮（CompBtn、CompButton）、店铺（AttrStore）等

**完整组件说明、Props、示例见 → [装修挂件公共组件](decorate-widget-public-components.md)**。  
业务文档下文只写 config 结构约定，不展开每个组件的用法。

---

## 3. 配置文件 (config.js)

### 基本结构

```javascript
import { pickBy } from '@/utils'
import { transformInBase, createTransformOutBase } from '../../comps/transform-utils'

const config = {
  name: 'widgetName',
  setting: [ /* 配置项，可引用公共组件 */ ],
  transformIn: (v) => { /* 后端 → 前端 */ },
  transformOut: (v) => { /* 前端 → 后端 */ }
}

import '../../comps/configsetting'
export default (typeof globalThis !== 'undefined' && globalThis.__processConfig__)
  ? globalThis.__processConfig__(config)
  : config
```

configsetting 的用法见 [公共组件 - 配置组件 (configsetting.js)](decorate-widget-public-components.md#1-配置组件-configsettingjs)。

### setting 配置项格式

```javascript
{
  label: '配置项标签',
  key: 'configKey',
  component: 'input',   // 或 'select' | 'switch' | 'color' | 'radiobutton' | 函数(自定义/公共组件)
  value: defaultValue,
  group: '分组名称',    // 可选
  options: [],         // 可选，select/radiobutton
  isShow: function() { return this.value.someCondition },
  onchange: function(e, vm) { }
}
```

**常用 component 类型**:
- `'input'` | `'select'` | `'switch'` | `'color'` | `'radiobutton'`
- 函数：自定义 JSX，或封装 [公共组件](decorate-widget-public-components.md)（如 CompPickerLink、SpImagePicker、CompBtn 等）

---

## 4. 渲染组件 (index.vue)

### 基本结构

```vue
<template>
  <div class="wgt-[name]" :style="outerStyle">
    <div class="wgt-[name]-inner" :style="innerStyle">
      <!-- 挂件内容 -->
    </div>
  </div>
</template>

<script>
import config from './config'
import { getOuterStyle, getInnerStyle } from '../../comps/style-utils'

export default {
  name: 'WidgetName',
  wgtName: '挂件显示名称',
  wgtDesc: '挂件描述',
  wgtIcon: 'icon-name',
  wgtType: 2,
  config: config,
  props: { value: [Object, Array] },
  data() { return {} },
  computed: {
    outerStyle() { return getOuterStyle(this.value) },
    innerStyle() { return getInnerStyle(this.value) }
  },
  methods: {}
}
</script>
```

### 必需属性

- `name`、`wgtName`、`wgtIcon`、`config`、`props.value`

### 样式计算

统一使用 `style-utils`（见 [公共方法 - style-utils](#5-公共方法工具函数)）：

```javascript
import { getOuterStyle, getInnerStyle } from '../../comps/style-utils'

computed: {
  outerStyle() { return getOuterStyle(this.value) },
  innerStyle() { return getInnerStyle(this.value) }
}
```

---

## 5. 公共方法（工具函数）

与挂件创建强相关的工具在以下两个文件中，**不**放在公共组件 skill 中。

### transform-utils.js

**位置**: `src/view/decorate/comps/transform-utils.js`

- **transformInBase(base, styleKeys)**  
  后端 base 中样式字段 rpx → px，用于 `transformIn`。
- **createTransformOutBase(baseKeys, styleKeys)**  
  得到 base 处理函数：提取字段并将样式 px → rpx，用于 `transformOut` 的 `base`。
- **convertRpxToPx(marginObj)** / **convertPxToRpx(marginObj)**  
  单对象单位转换（可选直接使用）。

### style-utils.js

**位置**: `src/view/decorate/comps/style-utils.js`

- **getOuterStyle(value)**  
  根据 `outerMargin`、`outerBackground` 计算外层样式（padding、背景）。
- **getInnerStyle(value)**  
  根据 `innerPadding`、`innerBackground` 计算内层样式。

---

## 6. 样式处理

### 数据格式

- **outerMargin / innerPadding**: `{ paddedt, paddedb, paddedl, paddedr }`（单位见下）
- **outerBackground**: `{ color, image }`
- **innerBackground**: `{ type: 'solid'|'gradient', color, startColor, endColor }`

### 单位与转换

- 后端存 rpx（rpx = px × 2），前端用 px。
- `transformIn`：用 `transformInBase` 做 rpx → px。
- `transformOut`：用 `createTransformOutBase` 做 px → rpx。

---

## 7. 数据转换

### transformIn（数据输入）

后端 → 前端：解构字段、用 `transformInBase` 处理 base、处理 data/嵌套、设默认值。

### transformOut（数据输出）

前端 → 后端：用 `pickBy` 抽字段，base 用 `createTransformOutBase` 生成。

### pickBy

**位置**: `@/utils`  
**用法**: `pickBy(source, { field1: 'field1', field2: 'nested.field2', field3: (v) => v.xxx })`

---

## 8. 完整示例

示例中出现的 **SpVideoPicker、CompButton、CompBtn** 等均在 [公共组件](decorate-widget-public-components.md) 中有说明。

### 示例：wgt_film 精简

- **config.js**：`name: 'film'`，setting 含组件间距(switch)、选择视频(SpVideoPicker)、视频比例(radiobutton)；transformIn 用 `transformInBase(base, ['outerMargin'])`，transformOut 用 `createTransformOutBase(['proportion','outerMargin'], ['outerMargin'])`，末尾 `import configsetting` 并 export processConfig 结果。
- **index.vue**：`getOuterStyle(this.value)` 作为 outerStyle，根据 `value.proportion` 算 aspectRatio，`value.data?.url` 作为 sourceUrl。

### 示例：wgt_coupon 精简

- **config.js**：数据设置用 [CompButton + $picker.coupon](decorate-widget-public-components.md#compbutton-comp-buttonvue)；面额颜色(color)；领取按钮用 [CompBtn](decorate-widget-public-components.md#compbtn按钮样式颜色--可选图片)。transformIn/Out 使用 `transformInBase` / `createTransformOutBase` 处理 `outerMargin`、`innerPadding`。
- **index.vue**：outerStyle / innerStyle 用 `getOuterStyle` / `getInnerStyle`，receiveBtnStyle 取自 `value.receiveBtn`。

### 示例：wgt_store-alphabet 精简

- **config.js**：数据类型(select)，onchange 清空 data；样式转换同前。
- **index.vue**：outerStyle / innerStyle，brandList / letterList 计算逻辑。

更多完整代码见项目：`wgt_film`、`wgt_coupon`、`wgt_shop`、`wgt_store-alphabet`。

---

## 9. 快速创建检查清单

- [ ] 新建 `wgt_[name]` 目录，`config.js` + `index.vue`
- [ ] config：name、setting、transformIn（transformInBase）、transformOut（createTransformOutBase）、import configsetting
- [ ] index.vue：name、wgtName、wgtIcon、config、props.value、outerStyle（getOuterStyle）、innerStyle（按需 getInnerStyle）
- [ ] 模板根节点应用 `:style="outerStyle"` / `:style="innerStyle"`
- [ ] 需要链接/图片/视频/按钮等配置时，从 [公共组件](decorate-widget-public-components.md) 选用并按示例接入

---

## 10. 常见问题

**Q: 如何添加自定义样式配置项？**  
A: 在 setting 里加项，component 用 CompStyle / CompOuter / CompInner，见 [公共组件 - 样式组件](decorate-widget-public-components.md#2-样式组件)。

**Q: 如何添加数据选择器？**  
A: 用 CompButton + `$picker.xxx` 或 AttrStore、SpVideoPicker 等，见 [公共组件 - 数据选择器](decorate-widget-public-components.md#3-数据选择器组件) 与 [\$picker 速查](decorate-widget-public-components.md#5-picker-方法速查)。

**Q: 如何做链接/路径选择？**  
A: 使用 [CompPickerLink](decorate-widget-public-components.md#compickerlink链接路径选择)。

**Q: 样式单位怎么转换？**  
A: transformIn 用 `transformInBase`，transformOut 用 `createTransformOutBase`（见 [公共方法](#5-公共方法工具函数)）。

**Q: 条件显示配置项？**  
A: 配置项加 `isShow: function() { return this.value.xxx }`。

**Q: 监听配置项变化？**  
A: 配置项加 `onchange: function (e, vm) { }`。

---

## 参考资源

- [装修挂件公共组件](decorate-widget-public-components.md) — 配置项可用组件一览
- `src/view/decorate/comps/configsetting.js`
- `src/view/decorate/comps/transform-utils.js`
- `src/view/decorate/comps/style-utils.js`
- `src/view/decorate/wgts/wgt_film/`、`wgt_coupon/`、`wgt_shop/`、`wgt_store-alphabet/`
