---
name: ecshop-business-implementation
description: 业务实现总览：本 skill 描述项目中「业务实现」的划分方式、业务整体实现逻辑（通用流程与子业务分支）及子业务入口。当前子业务包括装修挂件创建（目录结构、config/index 规范、transformIn/Out 约定、检查清单、FAQ）。做具体业务时需配合 ecshop-public-components（组件选用）、ecshop-public-utils（数据/样式工具）。在以下场景使用本 skill：新建或改造某一业务模块、梳理业务整体实现逻辑、核对业务是否符合项目规范、查找某业务的实现规范与示例。
---

# 业务实现模块（全项目总览）

本 skill 是**业务实现**的总入口：说明**业务整体实现的逻辑**（通用流程与子业务分支）、业务如何划分、子业务文档在哪、以及做业务时如何引用公共组件与公共工具。

## 业务整体实现逻辑（概要）

业务实现按以下顺序进行，具体约定按子业务分支到对应文档。完整流程与条件分支见 [references/business-implementation-workflow.md](references/business-implementation-workflow.md)。

1. **确定业务类型与入口** — 明确子业务类型，打开对应子业务文档。
2. **选用公共能力** — 从 **ecshop-public-components** 选组件/选择器，从 **ecshop-public-utils** 选工具；不在此重复写 API。
3. **约定配置与数据** — 确定该业务的配置结构、数据入参/出参、transformIn/Out（若适用）。
4. **实现渲染与联调** — 实现展示层、样式计算、与配置联动；按子业务约定使用工具。
5. **按检查清单收尾** — 使用子业务文档中的检查清单与 FAQ 核对。

详细步骤与「按子业务分支」说明见 **[references/business-implementation-workflow.md](references/business-implementation-workflow.md)**。

## 三大块关系

1. **ecshop-public-components**：全项目公共组件与选择器（SpImagePicker、SpVideoPicker、CompPickerLink、$picker 等）→ 做业务时选用组件、查 Props 与使用场景用该 skill。
2. **ecshop-public-utils**：全项目公共工具（pickBy、transform-utils、style-utils）→ 做数据提取、单位转换、样式计算用该 skill。
3. **ecshop-business-implementation**（本 skill）：业务实现总览与各子业务规范 → 做「某一类业务」时先看本 skill 与对应子业务文档。

## References 索引

| 文档 | 说明 |
|------|------|
| [references/business-implementation-workflow.md](references/business-implementation-workflow.md) | **业务整体实现逻辑**：通用顺序流程、按子业务分支、与三大块关系 |
| [references/decorate-widget-creation.md](references/decorate-widget-creation.md) | 子业务：装修挂件创建（目录、config、index、检查清单、FAQ） |

## 子业务列表

| 子业务 | 说明 | 详细文档 |
|--------|------|----------|
| 装修挂件创建 | 挂件目录结构、config.js/index.vue 规范、transformIn/Out、检查清单、FAQ | [references/decorate-widget-creation.md](references/decorate-widget-creation.md) |

（后续可在此增加其他子业务，如「小程序页面配置」「营销活动配置」等。）

## 使用方式

- 做**装修挂件**相关：阅读 [references/decorate-widget-creation.md](references/decorate-widget-creation.md)，并按需引用 **ecshop-public-components**、**ecshop-public-utils**。
- 做**其他业务**：先在本 SKILL 与 references 下确认是否有对应子业务文档；若无，可参照装修挂件文档的结构自行补充子业务说明，并复用公共组件与公共工具。
