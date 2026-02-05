# 单 Skill 结构与约定

适用于：新建与三大块平级的 skill、或维护现有 skill 时统一写法。

## 目录结构

```
.cursor/skills/
├── ecshop-skill-creation-spec/   # 本规范（创建 skill 的 skill）
│   ├── SKILL.md
│   └── references/
│       ├── decision-flow.md
│       └── structure-conventions.md
├── ecshop-public-components/
│   ├── SKILL.md
│   └── references/
│       ├── components.md
│       ├── picker-api.md
│       └── usage-scenarios.md
├── ecshop-public-utils/
│   ├── SKILL.md
│   └── references/
│       └── ...
└── ecshop-business-implementation/
    ├── SKILL.md
    └── references/
        └── ...
```

- 每个 skill **一个目录**，目录名 = skill 名（Cursor 会扫描）。
- 根目录必须有 **`SKILL.md`**。
- 详细内容放在 **`references/`** 下，按主题拆成多个 md，便于引用与维护。

## SKILL.md 约定（对齐 skill-creator）

1. **YAML frontmatter（必须）**
   - `name`：与目录名一致（如 `ecshop-public-components`）。
   - `description`：**主要触发依据**，Cursor 仅通过 name + description 判断是否加载本 skill；须包含「本 skill 做什么」与**「在什么场景下使用本 skill」**。body 在触发后才加载，故「何时使用」写在 body 里对触发无帮助，应放在 description 中。

2. **正文（保持精简，渐进披露）**
   - 简短总览（本 skill 的定位）。
   - **三大块中的位置**（若是三大块之一）：与另外两块的关系。
   - **核心流程或索引**：顺序步骤摘要、或组件/工具/子业务索引表，并链接到 references。
   - **使用方式**：1～3 条简要用法，细节链到 references。
   - 不重复 references 中的长内容；长篇 API、示例、全项目用法、详细工作流均在 references 中，SKILL 只做索引与入口。

## references 约定

- **命名**：小写、连字符，见名知意（如 `picker-api.md`、`usage-scenarios.md`、`decorate-widget-creation.md`）。
- **内容**：一个文件一个主题；可包含 API、参数、示例、在项目中的使用场景与文件路径。
- **公共类**（public-components、public-utils）：**必须检索全项目使用方式与场景**，把用到的场景、细节写全，而不是只写某一业务；若某工具/组件目前只在某业务用，也需注明「当前主要在 xxx，可复用于 xxx」。
- **业务类**（business-implementation 下的子业务文档）：可引用公共组件、公共工具 skill，不重复贴组件/工具 API；重点写业务流程、目录结构、配置约定、检查清单、FAQ。

## 三大块归属与内容要求

| 块 | 目录 | 内容要求 |
|----|------|----------|
| 公共组件 | ecshop-public-components | 组件、选择器、$picker；**全项目**使用场景与引用路径，不限于装修或单一业务 |
| 公共工具 | ecshop-public-utils | 工具函数；**全项目**使用场景与细节，并注明可复用范围（如「装修及相同 base 结构的业务」） |
| 业务实现 | ecshop-business-implementation | **须含业务整体实现逻辑**（通用顺序流程 + 按子业务分支，见该 skill 下 references/business-implementation-workflow.md）；子业务列表 + 各子业务文档；子业务内引用公共 skill，不重复写组件/工具 |

与 skill-creator 的渐进披露、工作流、输出模式等对齐细节见 [skill-creator-alignment.md](skill-creator-alignment.md)。

## 命名约定

- 项目级公共：`ecshop-public-components`、`ecshop-public-utils`。
- 业务总览：`ecshop-business-implementation`。
- 新建与三大块平级的 skill 时：名称需与上述区分，且能表达「独立一大类」（例如若将来有 `ecshop-workflow-spec` 等）。
