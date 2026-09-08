---
type: spec
title: 大转盘抽奖 — Admin + API 需求清单
description: 父任务 ECX-9907 下排除 Vshop 后的整套需求；对齐 INT-01 接口契约与 PRD 0.1.1 对照决议
tags: [lottery, requirements, admin, api]
---

# 大转盘抽奖需求清单（Admin + API，不含 Vshop）

> 父任务：ECX-9907 `[PM]抽奖大转盘`  
> 接口契约 SSOT：[`../api/lottery-wheel-contract.md`](../api/lottery-wheel-contract.md)（INT-01 / ECX-9971）  
> 产品 PRD：GitLab `prds/active/ECX-9907-lottery-wheel.md` **0.1.1**  
> 冲突裁决：**业务规则跟 PRD；HTTP path / 错误码跟 INT-01**  
> 排除：ECX-9940 / 9941 / 9942（Vshop）

通用约定：

- Base（Admin）：`/api/v1/promotions`
- 鉴权：`company_id` 仅来自 Operator JWT
- 时间：Unix 秒；业务日切 `Asia/Shanghai`
- 字段：管理端 **snake_case**
- 固定：`activity_type=wheel`；消耗 `cost_type=2`（积分）；**不**读写业务语义 `area_id`

---

## PRD 对照决议（相对契约/旧草稿）

| 主题 | 决议 |
|------|------|
| 所属区域 | **本期不恢复** `area_id` |
| `cost_value` | **允许 ≥0**（0=免费抽）；跟 PRD |
| 消耗类型 | 只做积分 `cost_type=2`；跟 INT-01 |
| `intro` | **必填**富文本；跟 PRD |
| 限额空/0 | 均表示不限；提交转 `0` |
| 复制 | **草稿复制** `?clone_id=` → 编辑页填表、清 id，保存才生成新 ID；`POST /turntable/copy` 不作主路径 |
| 创建后只读 | `begin_time`、`cost_value`、`activity_type` |
| 并发保存 | `config_version` 乐观锁；跟 INT-01 |
| 视觉 F-004 | 顶部高度默认 150、内边距 20、恢复默认、规则/记录按钮 |
| 统计明细 | 用户 ID、会员编码、奖品、类型、时间；thanks 进日志 |
| 装修 F-008 | 已结束/终止可选；支持 ID/名称搜索 |

---

## A. Admin 任务切片

### ECX-9936 — 列表（F-001）

- Tab：`all`（不传 status）/ `notstart` / `online` / `expire`
- 搜索：`activity_id`、`activity_name`
- 行操作：编辑 / 终止（仅 online）/ 草稿复制 / 统计；添加 → `/marketing/wheel/editor`

### ECX-9935 — 编辑（F-002～F-005）

- 创建/更新：`POST /turntableconfig`；更新必带 `config_version`
- 错误：`LUCKY_DRAW_CONFIG_VERSION_CONFLICT`、`LUCKY_DRAW_ENDED`
- 奖项：至少 1 thanks；概率和 (0,100]；券日库存 ≤ 券总库存；双写新旧键
- 已结束只读；取消回列表

### ECX-9937 — 终止（F-006）

- 确认弹窗 → `GET /down_lucky_draw/byid` → 刷新；错误提示齐全

### ECX-9938 — 统计（F-007 / F-014）

- 四汇总 + 明细五列 + 导出
- 口径：抽奖次数含 SUCCESS/GRANT_FAILED；中奖次数排除 thanks

### ECX-9939 — 装修挂载（F-008）

- 路径类型 `lottery`；picker 可搜 ID/名称；**不过滤**状态

---

## C. 联调核对（契约 §6）

1. 创建/编辑（含 version）→ 列表状态 → 详情回填  
2. 草稿复制 → 保存后新 id  
3. 手动结束 → 只读；不可再结束  
4. 记录 / 统计 / 导出口径一致  
5. 装修挂载含已结束活动  
6. `cost_value=0`、限额空、概率和 80/0  

Mock 奖项：`thanks` / `coupon` / `coupons` / `points`。
