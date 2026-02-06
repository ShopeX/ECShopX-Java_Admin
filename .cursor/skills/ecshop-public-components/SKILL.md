---
name: ecshop-public-components
description: 全项目可复用的公共组件与选择能力。包含：(1) 图片/视频选择器 SpImagePicker、SpVideoPicker 在各业务中的用法（商品、会员、营销、装修、小程序、商户、表单等），(2) 配置面板用组件 CompStyle/CompOuter/CompInner、CompButton、CompBtn、CompPickerLink、AttrStore、configsetting（装修等配置场景，可复用于同类表单），(3) 全局选择弹窗 $picker 的所有方法及使用模块。在以下场景使用本 skill：选用或查阅图片/视频/链接/店铺等选择组件、在表单或配置中接入选择器、查阅 $picker 某方法在项目中的用法与入参。
---

# 公共组件模块（全项目）

本 skill 描述**全项目**可复用的组件与选择能力，不限于单一业务。详细用法、使用场景、引用路径见 references。

## 三大块中的位置

- **ecshop-public-components**（本 skill）：公共组件与选择器
- **ecshop-public-utils**：公共工具（pickBy、transform-utils、style-utils 等）
- **ecshop-business-implementation**：业务实现总览（含装修挂件等子业务）

## 何时使用本 skill

- 需要在页面或表单中接入「图片选择」「视频选择」「链接/路径选择」「店铺/商品/优惠券选择」等
- 需要查阅 SpImagePicker、SpVideoPicker、CompPickerLink 等组件的 Props、v-model 结构及在项目中的用法
- 需要查阅或调用 `this.$picker.xxx` 的入参及在哪些模块被使用

## 组件与能力索引

| 类别 | 名称 | 适用范围 | 详细说明 |
|------|------|----------|----------|
| 图片选择 | SpImagePicker | 全项目（商品、会员、营销、装修、小程序、商户、表单等） | [references/components.md](references/components.md#spimagepicker)、[references/usage-scenarios.md](references/usage-scenarios.md#spimagepicker-使用场景) |
| 视频选择 | SpVideoPicker | 全项目（装修、商品、UGC 等） | [references/components.md](references/components.md#spvideopicker)、[references/usage-scenarios.md](references/usage-scenarios.md#spvideopicker-使用场景) |
| 链接/路径选择 | CompPickerLink | 装修、小程序统计等；可复用于需「路径+H5+埋点」的表单 | [references/components.md](references/components.md#compickerlink)、[references/usage-scenarios.md](references/usage-scenarios.md#compickerlink-使用场景) |
| 配置注入 | configsetting | 装修挂件 config；可复用于类似配置结构 | [references/components.md](references/components.md#configsetting) |
| 样式/按钮/触发选择 | CompStyle、CompOuter、CompInner、CompButton、CompBtn、AttrStore | 装修配置面板；可复用于同类配置 | [references/components.md](references/components.md#样式与配置面板组件) |
| 选择器 API | $picker | 全项目（装修、会员、营销、商城、设置、商户、内容等） | [references/picker-api.md](references/picker-api.md) |

## 使用方式

1. **图片/视频**：模板或 JSX 中 `<SpImagePicker v-model={...} />`、`<SpVideoPicker v-model={...} />`，或表单 schema 中指定 component。各业务用法见 [references/usage-scenarios.md](references/usage-scenarios.md)。
2. **链接**：需「选择路径」或「H5 链接+埋点」时用 CompPickerLink；自定义 UI 时在 `on-click` 中调 `this.$picker.path(...)` 并写回。
3. **其他选择**：在事件中调用 `this.$picker.xxx(...)`，入参与使用模块见 [references/picker-api.md](references/picker-api.md)。

完整 Props、v-model 结构、示例见 **[references/components.md](references/components.md)**；按业务/模块的使用场景见 **[references/usage-scenarios.md](references/usage-scenarios.md)**；$picker 方法一览见 **[references/picker-api.md](references/picker-api.md)**。
