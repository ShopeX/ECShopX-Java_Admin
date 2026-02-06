---
name: ecshop-public-utils
description: 全项目可复用的公共工具。包含：(1) pickBy（@/utils）— 按字段或嵌套路径从对象/数组提取数据，用于 transformOut、选择器结果整形、表单与配置的数据映射；(2) transform-utils（rpx/px 转换、transformInBase、createTransformOutBase）— 当前主要用于装修挂件 config，可复用于相同 base 结构的业务；(3) style-utils（getOuterStyle、getInnerStyle）— 当前主要用于装修挂件渲染，可复用于相同 value 结构的组件。在以下场景使用本 skill：做数据提取或映射、做后端与前端样式单位转换、根据配置 value 计算外层/内层 style 对象。
---

# 公共工具模块（全项目）

本 skill 描述**全项目**可复用的工具函数，不限于单一业务。详细 API、参数与使用场景见 references。

## 三大块中的位置

- **ecshop-public-components**：公共组件与选择器
- **ecshop-public-utils**（本 skill）：公共工具
- **ecshop-business-implementation**：业务实现总览

## 何时使用本 skill

- 需要从对象或数组中按 key、嵌套路径或函数提取字段（如提交前只保留部分字段、选择器返回结果整形）
- 需要做「后端 rpx ↔ 前端 px」的样式单位转换，或从挂件/配置 value 生成要提交的 base 对象
- 需要根据 value（outerMargin、outerBackground、innerPadding、innerBackground）计算可直接绑定到 DOM 的 style 对象

## 工具索引

| 工具 | 位置 | 适用范围 | 详细说明 |
|------|------|----------|----------|
| pickBy | `@/utils` | 全项目（transformOut、选择器结果、表单映射等） | [references/pickby.md](references/pickby.md) |
| transform-utils | `src/view/decorate/comps/transform-utils.js` | 装修挂件及相同 base 结构的业务 | [references/transform-utils.md](references/transform-utils.md) |
| style-utils | `src/view/decorate/comps/style-utils.js` | 装修挂件及相同 value 结构的组件 | [references/style-utils.md](references/style-utils.md) |

## 使用方式

1. **pickBy**：`import { pickBy } from '@/utils'`；首参为对象或数组，第二参为 keyMaps（键→路径/函数/默认值）。用于只提交部分字段、或把选择器返回的数据映射成业务所需结构。
2. **transform-utils**：在 transformIn 中对 base 调用 `transformInBase(base, styleKeys)`；在 transformOut 的 base 中调用 `createTransformOutBase(baseKeys, styleKeys)(v)`。
3. **style-utils**：在组件 computed 中 `getOuterStyle(this.value)` / `getInnerStyle(this.value)`，绑定到根或内层节点。

完整 API、参数与项目内使用场景见 **[references/pickby.md](references/pickby.md)**、**[references/transform-utils.md](references/transform-utils.md)**、**[references/style-utils.md](references/style-utils.md)**。
