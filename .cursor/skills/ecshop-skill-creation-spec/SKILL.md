---
name: ecshop-skill-creation-spec
description: 本项目的 Skill 创建与维护规范，对齐 skill-creator（渐进披露、工作流、description 为触发依据）。包含：(1) 判断流程——何时「修改已有 skill」、何时「新建 skill」；(2) 三大块归属——新内容应归入公共组件、公共工具还是业务实现；(3) 单 skill 目录结构、SKILL.md 与 references 的约定；(4) 业务板块须含业务整体实现逻辑（顺序流程与子业务分支）。在以下场景使用本 skill：补全或新建 skill 前做判断、新建 skill 时按规范搭目录与文档、评审或统一现有 skill 写法。
---

# Skill 创建与维护规范

本 skill 约定：**如何判断修改已有 vs 新建**、**新内容归入哪一块**、**单 skill 的结构与写法**。补全或新建任何 skill 前请先走判断流程。

## 第一步：修改已有 vs 新建

**先判断：当前要写的内容是否属于现有三大块中的某一块？**

| 情况 | 做法 | 详见 |
|------|------|------|
| 属于「公共组件/选择器」 | **修改** `ecshop-public-components`（在 references 中增补或新增文档） | [references/decision-flow.md](references/decision-flow.md) |
| 属于「公共工具函数/能力」 | **修改** `ecshop-public-utils`（在 references 中增补或新增文档） | [references/decision-flow.md](references/decision-flow.md) |
| 属于「某一类业务的实现方式」 | 若该业务已有子业务文档 → **修改** `ecshop-business-implementation` 对应 reference；若无 → **在 business 下新建** reference，并在 SKILL 子业务列表中登记 | [references/decision-flow.md](references/decision-flow.md) |
| 全新的「一大块」（既非公共组件也非公共工具，且非现有业务子类） | **新建** 与三大块平级的 skill 目录，并按本规范搭结构 | [references/structure-conventions.md](references/structure-conventions.md) |

结论：**绝大多数补全/扩展都是「修改已有」**；只有出现全新大类时才新建与三大块平级的 skill。

## 第二步：三大块归属（仅当确定要写进三大块时）

| 归属 | 目录 | 内容要求 |
|------|------|----------|
| **公共组件** | ecshop-public-components | 组件、选择器、$picker 等；**需检索全项目使用方式与场景**，不限于单一业务 |
| **公共工具** | ecshop-public-utils | 工具函数、数据/样式转换；**需检索全项目使用场景与细节**，并注明可复用范围 |
| **业务实现** | ecshop-business-implementation | 子业务规范（如装修挂件）；子业务文档内**引用**公共组件、公共工具，不重复写组件/工具细节 |

详见 [references/structure-conventions.md](references/structure-conventions.md#三大块归属与内容要求)。

## 第三步：单 skill 结构约定

- 每 skill 一个目录，目录名即 skill 名（如 `ecshop-public-components`）。
- 根目录必有 **`SKILL.md`**（含 YAML frontmatter：`name`、`description`）。**description 是主要触发依据**，须包含「何时使用本 skill」；body 仅在触发后加载，保持精简。
- 详细内容放在 **`references/`** 下，一个主题一个 md；SKILL.md 中给出索引与链接。**业务实现** skill 须在 reference 中写清**业务整体实现的逻辑**（通用顺序流程 + 按子业务分支）。
- 命名：公共类用 `ecshop-public-*`，业务总览用 `ecshop-business-*`；新建独立大类时命名需与三大块区分。

详见 [references/structure-conventions.md](references/structure-conventions.md)。与 **skill-creator** 的对齐说明（渐进披露、工作流、输出模式）见 [references/skill-creator-alignment.md](references/skill-creator-alignment.md)。

## 何时使用本 skill

- 准备**补全**或**新建** skill 时：先看 [references/decision-flow.md](references/decision-flow.md) 做「修改已有 vs 新建」判断。
- **新建** skill 或新子业务文档时：按 [references/structure-conventions.md](references/structure-conventions.md) 搭目录、写 SKILL.md 与 references。
- 评审或统一现有 skill 写法时：以本规范为基准。
