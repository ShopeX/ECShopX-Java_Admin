# Skill 文档索引

本项目按 **skill-creator 规范** 将 **全项目** 拆成 **三个大目录** 的 skill，放在 **`.cursor/skills/`** 下。

## 补全或新建 Skill 时必读

**在补全或新建任何 skill 之前**，请先看 **`.cursor/skills/ecshop-skill-creation-spec/`**（创建 skill 的规范）：

1. **判断是「修改已有」还是「新建」**：绝大多数情况是修改现有三大块内的 skill 或子业务文档，只有全新大类才新建平级目录。详见 `ecshop-skill-creation-spec/references/decision-flow.md`。
2. **按规范搭结构与写法**：目录结构、SKILL.md frontmatter、references 命名与内容要求。详见 `ecshop-skill-creation-spec/references/structure-conventions.md`。

Cursor 会自动扫描 `.cursor/skills/`，因此 `ecshop-skill-creation-spec` 会作为项目 skill 被加载；需要做「修改已有 vs 新建」判断时，可直接引用该 skill。

## Cursor 如何发现 Skill

根据 [Cursor 文档](https://cursor.com/docs/context/skills)，以下位置会被**自动扫描**：

| 位置 | 作用域 |
|------|--------|
| `.cursor/skills/` | 项目级 |
| `.claude/skills/` | 项目级（兼容 Claude） |
| `~/.cursor/skills/` | 用户级全局 |

**放在 `.cursor` 或 `.claude` 下的 `skills/` 都会被 Cursor 自动扫描**。本项目三大块统一放在 `.cursor/skills/`。

## 项目级三大块（三个大目录）

| 目录 | 说明 | 何时使用 |
|------|------|----------|
| **ecshop-public-components** | **公共组件模块**（全项目）：SpImagePicker/SpVideoPicker 在各业务中的用法、CompPickerLink、CompButton、CompBtn、AttrStore、configsetting、**$picker 全部方法及使用模块**。含使用场景与引用路径。 | 选用组件、查 Props、查 $picker 某方法在项目中的用法 |
| **ecshop-public-utils** | **公共工具模块**（全项目）：**pickBy** 的 API 与使用场景（transformOut、选择器结果整形等）、transform-utils、style-utils。含使用场景与细节。 | 数据提取/映射、rpx/px 转换、outerStyle/innerStyle 计算 |
| **ecshop-business-implementation** | **业务实现模块**（总览）：子业务列表与入口。当前子业务：装修挂件创建（目录结构、config/index 规范、检查清单、FAQ）。 | 新建或改造某一业务、核对业务规范、查装修挂件规范 |

- **公共组件**、**公共工具** 覆盖全项目使用方式与场景，不限于装修。
- **业务实现** 为总览，具体子业务（如装修挂件）在 skill 内 references 下单独说明；做业务时配合公共组件与公共工具 skill。

**路径**：`.cursor/skills/ecshop-public-components/`、`.cursor/skills/ecshop-public-utils/`、`.cursor/skills/ecshop-business-implementation/`。  
**创建/维护规范**：`.cursor/skills/ecshop-skill-creation-spec/`（修改已有 vs 新建、三大块归属、单 skill 结构约定；补全或新建 skill 前必读）。

## 本目录（skill/）下的 Markdown

- `decorate-widget-public-components.md`、`decorate-widget-creation.md`：与上述 skill 内容对应的长文档，可单独阅读；**与 AI 协作时优先使用 .cursor/skills/ 下对应 skill**。
