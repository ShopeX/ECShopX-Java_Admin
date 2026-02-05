# 判断流程：修改已有 skill vs 新建 skill

补全或新建 skill 时，按下列顺序判断，可避免重复建目录、也保证新内容归位正确。

## 1. 我要写的内容属于哪一类？

先对号入座：

| 内容类型 | 归属 | 操作 |
|----------|------|------|
| 某个**组件**或**选择器**的用法、Props、在项目中的使用场景（如新加一个 Picker、或补全现有组件的使用场景） | 公共组件 | **修改** `ecshop-public-components` |
| **$picker** 新方法、或已有方法的入参/使用模块补充 | 公共组件 | **修改** `ecshop-public-components`（如 picker-api.md、usage-scenarios.md） |
| 某个**工具函数**的 API、参数、在项目中的使用场景（如新的 utils、或补全 pickBy/transform/style 的用法） | 公共工具 | **修改** `ecshop-public-utils` |
| **某一类业务的实现规范**（如「装修挂件」「小程序页面配置」「营销活动配置」） | 业务实现 | 见下节 |

## 2. 若是「业务类」内容

- **该业务是否已有子业务文档？**
  - **有**（例如装修挂件已有 `decorate-widget-creation.md`）→ **修改** `ecshop-business-implementation/references/` 下对应文档，必要时在 SKILL 子业务列表中更新说明。
  - **无**（例如要新增「营销活动配置」规范）→ **在 business 下新建**：在 `ecshop-business-implementation/references/` 下新建一份子业务文档（如 `marketing-activity-config.md`），并在 `ecshop-business-implementation/SKILL.md` 的「子业务列表」中增加一行入口。**不**新建与三大块平级的目录。

## 3. 何时才「新建」一个与三大块平级的 skill？

仅当出现**全新的一大类**，且同时满足：

- 既不是「公共组件/选择器」，也不是「公共工具」；
- 也不是「某一类业务实现」（业务实现一律归入 `ecshop-business-implementation` 作为子业务）；

例如：未来若增加「项目通用工作流/发布规范」这类与组件、工具、具体业务都平行的独立维度，才考虑新建一个平级 skill 目录。新建时命名需与 `ecshop-public-*`、`ecshop-business-*` 区分，并按 [structure-conventions.md](structure-conventions.md) 搭好 SKILL.md 与 references。

## 4. 小结

- **修改已有**：补全组件/选择器/工具用法、补全 $picker、新增或扩展子业务文档 → 都在现有三大块内完成。
- **新建**：仅在「全新大类」且不属于三大块时，新建平级 skill；新业务类型一律在 `ecshop-business-implementation` 下新建 reference + 登记，不新建业务目录。
