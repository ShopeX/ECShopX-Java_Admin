## 本次变更总结

**时间**: 2026-04-21

**涉及文件**:
- `src/view/mall/goods/physical/list.vue`
- `src/i18n/locales/zh-CN.json`
- `src/i18n/locales/en.json`
- `src/i18n/locales/ar.json`

**主要改动**:
- 修复“商品管理 > 自营商品”中点击“同步至所有店铺”时确认弹窗文案误显示为“审核失败”的问题。
- 新增独立文案 key `6f19b2ab.6b3d7e` 用于同步确认提示，避免复用 key 产生语义冲突。
- 补齐中/英/阿三语文案并统一确认框标题为提示文案。

**一句话概括**: fix: 修复自营商品同步所有店铺时弹窗误显示审核失败
