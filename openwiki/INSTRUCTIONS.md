# OpenWiki INSTRUCTIONS — ecshopx-admin

User-authored scope and priority brief for `openwiki/`. Routine openwiki init/update should not rewrite this file.

## Scope

Document **ecshopx-admin** (Vue admin) with priority on the **大转盘抽奖** feature set under marketing:

- 列表 / 编辑 / 终止 / 复制 / 统计导出
- 装修路径挂载抽奖活动
- 管理端对接的 promotions 接口契约

Out of scope for this brief: Vshop/H5 用户端交互实现（仅在契约 §2 留联调对照）。

## Priorities

1. **Contract first** — Admin 联调以 `openwiki/api/lottery-wheel-contract.md` 为准；冲突回退 GitLab PRD `ECX-9907-lottery-wheel.md`。
2. **Evidence** — 每个结论引用 `src/...` 真实路径；无证据则标「待验证」。
3. **Task map** — 需求切片以 `openwiki/marketing/lottery/requirements.md` 为准（排除 Vshop 任务）。

## Sources of truth

| 类型 | 来源 |
|------|------|
| 接口契约 | INT-01 / ECX-9971 冻结稿（已落入本 wiki） |
| 产品 PRD | `ecshopx-product` → `prds/active/ECX-9907-lottery-wheel.md` |
| 原型 | Axhub：https://axhub.it.shopex123.com/pro/50zxABEUWFH/ （父任务 ECX-9907） |
| 代码索引 | 本仓 `.codegraph/`（`codegraph init`） |

## Boundaries

- 不把 Vshop 抽奖页实现细节写入 Admin wiki 正文。
- 不把 Operator JWT / 密钥写入 wiki。
- 现有遗留双路由 `/marketing/wheel` 与 `/marketing/interactive/lottery` 需在文档中标明，避免落地时跳错路径。
