## 最近一次变更摘要

**时间**: 2026-04-14

**需求**: ECX-8283、ECX-8282

**文件**:
- `src/view/member/selfservice/registrationrecord.vue`
- `src/view/member/cardticket/coupon/gift.vue`

**概要**:
1. 报名记录：导出使用 `getParams()`；结束日为 23:59:59；筛选用「申请时间」文案。
2. 兑换券：VIP 勾选 `lv_type`；详情解析等级 ID JSON；先加载等级再 init。

**一句话**: fix: 报名记录导出与筛选一致、兑换券 VIP 等级按 lv_type 回显（ECX-8283/8282）
