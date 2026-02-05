# 业务整体实现逻辑（通用流程）

本文档描述项目中**业务实现的整体逻辑**：从确定业务类型到配置、渲染、检查的通用流程，以及按子业务分支的差异。各子业务（如装修挂件）的细项在各自 reference 中展开。

## 顺序流程概览

业务实现通常按以下步骤进行：

1. **确定业务类型与入口** — 明确属于哪一类子业务（装修挂件、小程序页面配置、营销活动等），并打开对应子业务文档。
2. **选用公共能力** — 从 **ecshop-public-components** 选组件/选择器（图片、视频、链接、按钮、样式等），从 **ecshop-public-utils** 选工具（pickBy、transform-utils、style-utils 等）；不在业务文档中重复写组件/工具 API。
3. **约定配置与数据** — 确定该业务的配置结构（如 config/setting）、数据入参/出参格式，以及 transformIn/transformOut（若适用）的约定。
4. **实现渲染与联调** — 实现展示层（如 index.vue）、样式计算、与配置的联动；按子业务约定使用 style-utils、getOuterStyle/getInnerStyle 等。
5. **按检查清单收尾** — 使用该子业务文档中的检查清单逐项核对，并处理常见问题（见子业务 FAQ）。

## 条件分支：按子业务走

不同子业务在「配置与数据」「渲染」上的具体约定不同，需按类型分支：

| 业务类型 | 入口文档 | 配置/数据特点 | 渲染特点 |
|----------|----------|----------------|----------|
| **装修挂件** | [decorate-widget-creation.md](decorate-widget-creation.md) | config.js（setting、transformIn、transformOut）、configsetting、transformInBase/createTransformOutBase | index.vue、getOuterStyle/getInnerStyle、wgtName/wgtIcon/config |
| **其他子业务** | 在 SKILL 子业务列表中对应 reference | 由该子业务文档定义 | 由该子业务文档定义 |

- **做装修挂件**：严格按 [decorate-widget-creation.md](decorate-widget-creation.md) 的目录结构、config 要点、index.vue 要点与检查清单执行；组件与工具用法查 **ecshop-public-components**、**ecshop-public-utils**。
- **做其他业务**：先在本 skill 的「子业务列表」中确认是否有对应文档；若有则按该文档的流程与约定；若无则参照装修挂件文档的结构，在 `references/` 下新增子业务文档并在 SKILL 中登记。

## 与三大块的关系

- **业务整体逻辑**（本文）：通用步骤 + 子业务分支，不涉及具体组件 API 或工具函数签名。
- **公共组件 / 公共工具**：在步骤 2、3、4 中按需查阅；业务文档只写「用哪些」「在哪用」，不展开「怎么调、参数是什么」。
- **子业务文档**：写该业务的目录结构、配置约定、数据转换约定、渲染约定、检查清单、FAQ；需要时链接到公共组件/公共工具 skill。

## 设计原则（对齐 skill-creator）

- **渐进披露**：SKILL.md 只保留业务总览、整体流程摘要与子业务索引；详细流程与条件分支在本文，各子业务细节在各自 reference。
- **顺序 + 条件**：整体为顺序步骤，子业务差异用条件分支表与入口文档区分，避免在总览中堆砌所有子业务细节。
