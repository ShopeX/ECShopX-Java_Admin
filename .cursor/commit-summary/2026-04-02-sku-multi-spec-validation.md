## 本次变更总结

**时间**: 2026-04-02

**涉及文件**:
- `src/view/goods/index.vue` (修改)
- `src/view/mall/goods/physical/add.vue` (修改)
- `src/view/mall/goods/physical/add.standard.vue` (修改)
- `src/view/mall/goods/audit/add.vue` (修改)
- `src/i18n/locales/zh-CN.json` (修改)
- `src/i18n/locales/en.json` (修改)
- `src/i18n/locales/ar.json` (修改)

**主要改动**:
- 多规格校验由「每组规格都必须勾选」改为「至少一组规格勾选规格值」；`goods/index.vue` 中失败时 `callback` 后 `return`。
- 商城实物新增/标准版/审核：`handleSave` 前增加同上校验；`cartesianProductOf` 与 `getSpecName`、`item_spec` 组装与 physical `add.vue` 对齐，支持部分规格组未选时的笛卡尔积与提交数据。
- i18n：`de022579.d78fc6` 文案更新为中/英/阿。

**一句话概括**: feat: 多规格仅需至少一组勾选规格值并修正商城 SKU 组合逻辑
