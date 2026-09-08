---
type: index
title: ecshopx-admin OpenWiki Quickstart
description: Admin 仓知识入口；当前优先大转盘抽奖（Admin + API 契约，不含 Vshop）
tags: [index, quickstart, lottery, admin]
---

# ecshopx-admin OpenWiki

本 wiki 以 **大转盘抽奖 Admin 落地** 为第一优先级。代码与测试为准；wiki 为证据索引。

## Quick map

| Topic | Page |
|-------|------|
| 整套需求清单（Admin+API，排除 Vshop） | [marketing/lottery/requirements.md](marketing/lottery/requirements.md) |
| 接口契约（INT-01） | [api/lottery-wheel-contract.md](api/lottery-wheel-contract.md) |
| 现有代码落点 / gap | [marketing/lottery/code-map.md](marketing/lottery/code-map.md) |
| 范围说明 | [INSTRUCTIONS.md](INSTRUCTIONS.md) |

## Task routing

| Intent | Look at | Entrypoints |
|--------|---------|-------------|
| 列表 / Tab / 行操作 | requirements §ECX-9936/9937/9938 | `src/view/marketing/lottery/list.vue` |
| 编辑 / 保存 / 复制 | requirements §ECX-9935 + 契约 §1.1/1.6 | `editor.vue` / `editorSchema.js` |
| 装修选活动 | requirements §ECX-9939 | `sp-path-selector` / `picker-lottery.vue` |
| 联调 path / 错误码 | contract §1 / §5 | `src/api/marketing.js` |

## Tooling

- CodeGraph：本仓已 `codegraph init`（`.codegraph/`）。新会话后 MCP 可用。
- 原型：Axhub（父任务 ECX-9907）；Admin 页以现有后台样式 + 契约字段为准落地。
