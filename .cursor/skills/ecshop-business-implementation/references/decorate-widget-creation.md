# 子业务：装修挂件创建

本文档为**业务实现**下的子业务之一：装修挂件的创建流程、目录约定、config 与渲染规范。组件与工具用法见 **ecshop-public-components**、**ecshop-public-utils**。

## 挂件结构

```
src/view/decorate/wgts/wgt_[name]/
├── config.js   # 配置：setting、transformIn、transformOut
└── index.vue   # 渲染：模板、outerStyle/innerStyle、业务逻辑
```

- 文件夹名：`wgt_[name]`，小写、短横线。
- 配置 `name`：驼峰，如 `film`、`couponCard`、`storeAlphabet`。

## config.js 要点

- 末尾：`import '../../comps/configsetting'`，并 `export default (globalThis.__processConfig__ ? globalThis.__processConfig__(config) : config)`。configsetting 行为见 **ecshop-public-components**。
- **setting**：每项含 `label`、`key`、`component`（字符串或函数）、`value`；可选 `group`、`options`、`isShow`、`onchange`。需要链接/图片/视频/样式/按钮等时，从 **ecshop-public-components** 选用组件。
- **transformIn**：解构后端数据，对 `base` 使用 **ecshop-public-utils** 的 `transformInBase(base, styleKeys)`，再合并返回。
- **transformOut**：用 `pickBy` 抽字段，`base` 使用 **ecshop-public-utils** 的 `createTransformOutBase(baseKeys, styleKeys)(v)`。

## index.vue 要点

- 必需：`name`、`wgtName`、`wgtIcon`、`config`、`props.value`。
- 样式：从 **ecshop-public-utils** 引入 `getOuterStyle`、`getInnerStyle`，在 computed 中计算并绑定到根/内层节点。

## 快速检查清单

- [ ] 目录 `wgt_[name]`，存在 `config.js` 与 `index.vue`
- [ ] config 有 `name`、`setting`、`transformIn`、`transformOut`，并 import configsetting 且 export 经 processConfig 的结果
- [ ] transformIn 对 base 使用 `transformInBase`，transformOut 对 base 使用 `createTransformOutBase`
- [ ] index.vue 有 `getOuterStyle`/`getInnerStyle`，模板绑定对应 style
- [ ] 配置项若需链接/图片/视频/按钮等，从 **ecshop-public-components** 选用并写对 Props/value

## 常见问题

- **如何添加样式配置项？** 在 setting 中用 CompStyle/CompOuter/CompInner（见 ecshop-public-components）。
- **如何添加数据/链接选择？** 用 CompButton+$picker 或 CompPickerLink、AttrStore 等（见 ecshop-public-components、picker-api）。
- **样式单位怎么转换？** transformIn 用 `transformInBase`，transformOut 用 `createTransformOutBase`（见 ecshop-public-utils）。
- **条件显示配置项？** 配置项加 `isShow: function() { return this.value.xxx }`。
- **监听配置项变化？** 配置项加 `onchange: function (e, vm) { }`。

## 参考路径

- `src/view/decorate/comps/configsetting.js`、transform-utils.js、style-utils.js
- `src/view/decorate/wgts/wgt_film/`、`wgt_coupon/`、`wgt_shop/`、`wgt_store-alphabet/`
