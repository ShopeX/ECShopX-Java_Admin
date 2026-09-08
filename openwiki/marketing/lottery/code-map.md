---
type: code-map
title: 大转盘抽奖 — Admin 代码落点
description: feature/ECX-9939 落地后的文件与行为对照
tags: [lottery, code-map, admin]
---

# 代码落点

> 对照：[`../../api/lottery-wheel-contract.md`](../../api/lottery-wheel-contract.md)  
> 需求：[`requirements.md`](requirements.md)  
> 分支：`feature/ECX-9939`

## 入口与路由

| 路径 | 文件 | 说明 |
|------|------|------|
| `/marketing/wheel` | `src/router/src/route-marketing.js` | 列表主入口 |
| `/marketing/wheel/editor/:id?` | 同上 | 编辑；支持 `?clone_id=` |
| `/marketing/interactive/lottery` | 同上 | **redirect** → `/marketing/wheel` |
| 装修类型 `lottery` | `sp-path-selector/config.js` + `PickerDialog.vue` | DSL：`id` + `title(activity_name)` |
| 活动选择器 | `picker-lottery.vue` | 列表不过滤 status；可搜 ID/名称 |

## API

| 能力 | 封装 | 备注 |
|------|------|------|
| 保存 | `editTurntableConfig` | 更新带 `config_version` |
| 详情 | `getTurntableDetail` | 编辑/克隆回填 |
| 列表 | Finder url `getturntableList` | |
| 终止 | `downLuckyDrawById` | |
| 统计/日志/导出 | `getTurntableCountById` / Finder log / `exportLuckyDrawData` | |
| `copyTurntable` | 已封装 | **非**主复制路径（PRD 草稿复制） |

## 页面行为摘要

| 模块 | 文件 | 要点 |
|------|------|------|
| 列表 | `list.vue` + `schema.js` | all 删 status；终止确认；复制 → `?clone_id=` |
| 编辑 | `editor.vue` + `editorSchema.js` | 锁定 begin/cost/type；intro 必填；thanks；version 冲突；高度 150/边距 20 |
| 统计 | `schema.js` `outputSchema` | 五列：用户ID / 会员编码 / 奖品 / 类型 / 时间 |
| 常量 | `constants.js` | `gameMarginTop` 默认 `150px` |

## 已知联调风险

- BE 若仍强制 `cost_value > 0`，与 PRD 免费抽冲突  
- 日志「会员编码」字段名可能因 BE 返回 `username` / `user_card_code` / `mobile` 不一，前端已做兜底展示  
- F-004 规则按钮 UI 仍部分注释，记录按钮已支持恢复默认
