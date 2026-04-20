## 本次变更总结

**时间**: 2026-04-20

**涉及文件**:
- `src/view/member/cardticket/detail/receive.vue`、`src/view/member/cardticket/detail/used.vue`
- `src/views/settings/systemConfig/wdtSetting.vue`、`src/views/settings/systemConfig/jstSetting.vue`
- `src/i18n/locales/zh-CN.json`、`src/i18n/locales/en.json`、`src/i18n/locales/ar.json`

**主要改动**:
- 优惠券数据列表新增手机号查询（搜索按钮、回车搜索、清空重查）。
- 旺店通/聚水潭页面新增服务商接口模式提示，并采用 `SpPlatformTip` 顶部展示样式。
- 新增对应三语 i18n 提示文案键，保证国际化一致。

**一句话概括**: feat: 优惠券数据列表支持手机号查询并补充 ERP 服务商提示
