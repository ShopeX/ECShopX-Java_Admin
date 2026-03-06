## 本次变更总结

**时间**: 2025-03-06

**涉及文件**:
- `.cursor/commit-summary/commit-convention.md` (新增)
- `.cursor/skills/commit-summary/SKILL.md` (新增)
- `src/view/decorate/index.vue` (修改)
- `src/view/decorate/pc/index.vue` (修改)
- `src/view/decorate/wgts/wgt_*` 共 30 个挂件 index.vue (修改)

**主要改动**:
- **装修挂件 i18n**：所有挂件 `wgtName` 从字面 key 改为 `i18n.t('key')`，缺 i18n 的补全 `import { i18n } from '@/i18n'`；装修主入口与 PC 端改为直接展示 `wgtName`（不再包一层 `$t()`）。
- **Cursor 技能**：新增 commit-summary 技能，支持「总结变更并直接 commit」流程及可选 commit 约定。

**一句话概括**: i18n: 装修挂件 wgtName 改为 i18n.t() 并统一展示，新增变更总结提交技能
