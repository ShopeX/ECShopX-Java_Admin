# 与 skill-creator 规范的对齐说明

本项目的 skill 创建规范对齐 **skill-creator**（`.claude/skills/skill-creator/`）的以下要点，创建或补全 skill 时应一致遵循。

## 1. 渐进披露（Progressive Disclosure）

- **Metadata（name + description）**：始终在上下文中；description 是**主要触发依据**，须包含「本 skill 做什么」与「在什么场景下使用」。
- **SKILL.md body**：仅在 skill 被触发后加载；保持精简（建议 <500 行），只保留核心流程、索引与「何时读哪个 reference」的指引。
- **references/**：按需加载；详细流程、API、示例、子业务细节放在 references，不堆在 SKILL 正文。

**本规范要求**：SKILL 正文不重复 references 中的长内容；references 一层从 SKILL 直接链接，不深嵌套。

## 2. 工作流（Workflows）

- **顺序流程**：多步骤任务在 SKILL 或 reference 开头给出清晰顺序步骤（如：1. 确定类型 2. 选用能力 3. 约定配置 4. 实现渲染 5. 检查清单）。
- **条件分支**：存在多种业务或多种做法时，用决策点 + 分支表或链接到不同 reference（如「装修挂件 → decorate-widget-creation.md」「其他子业务 → 对应文档」）。

**本规范要求**：**业务实现** skill 必须包含「业务整体实现的逻辑」——在 reference 中写清通用顺序流程与按子业务的条件分支（见 **ecshop-business-implementation** 的 [business-implementation-workflow.md](../../ecshop-business-implementation/references/business-implementation-workflow.md)）。

## 3. 输出与内容组织（Output Patterns）

- **模板/结构**：需要一致产出时，在 reference 中给出结构或模板（如检查清单、config 基本结构）。
- **示例**：质量依赖示例时，提供输入/输出对或典型示例，而非仅文字描述。

**本规范要求**：子业务文档中应包含检查清单、必要时代码/配置结构示例；与公共组件/工具相关的示例可链到 ecshop-public-*，不重复粘贴。

## 4. Frontmatter 与 Body

- **Frontmatter**：仅使用 `name`、`description`。**所有「何时使用」类信息放在 description 中**，因为 body 在触发后才加载，写在 body 里的「何时使用」对触发无帮助。
- **Body**：使用祈使/不定式；写操作指引、流程概要、索引表、以及「详见 references/xxx」的链接。

**本规范要求**：见 [structure-conventions.md](structure-conventions.md) 的 SKILL.md 约定；description 务必写清「在以下场景使用本 skill：……」。

## 5. References 使用

- **何时放 reference**：领域知识、API/结构说明、详细工作流、多变体/多子业务的具体内容。
- **避免重复**：同一信息只存在于 SKILL 或某一 reference 一处，不两处都写；SKILL 以索引与入口为主。

**本规范要求**：公共类 skill 的 references 需检索全项目使用场景；业务类 skill 的 references 含「业务整体实现逻辑」与各子业务细项，并引用公共 skill 而非复制其内容。

## 6. 不纳入的内容

与 skill-creator 一致：不在 skill 内放 README、INSTALLATION_GUIDE、QUICK_REFERENCE、CHANGELOG 等辅助文档；仅保留 AI 执行任务所需的信息。

## 参考路径

- skill-creator 根文档：`.claude/skills/skill-creator/SKILL.md`
- 工作流模式：`.claude/skills/skill-creator/references/workflows.md`
- 输出模式：`.claude/skills/skill-creator/references/output-patterns.md`
