# 大转盘抽奖 — 前后端接口契约

> 主任务：ECX-9883｜切片：INT-01（ECX-9971）  
> SSOT：`docs/prd/抽奖开发逻辑整理.md`（冲突以 PRD 为准）  
> 本仓实现：BE-01～05；本文冻结联调 path / 字段 / 错误码  
> 状态：**可给 ADM/H5 联调**；本仓 BE-01～05 已落地（未默认 push）；冲突以 PRD 为准

通用约定：

- 包装：`ApiResult`；HTTP 协议成功与业务态分离  
- 鉴权：`company_id` / `user_id` **仅**来自 Operator JWT / H5 claims，禁止信任客户端伪造  
- 时间：Unix 秒；业务日切时区 `Asia/Shanghai`（可配置）  
- 字段命名：管理端以 **snake_case** 为主（现网）；用户端抽奖结果以 camelCase 示例为准（与 PRD §6.5 一致），实现时与前端一次冻结

---

## 1. 管理端（AdminAuth）

Base：`/api/v1/promotions`

### 1.1 保存活动 `POST /turntableconfig`

| | |
| --- | --- |
| 鉴权 | AdminAuth / Operator JWT → `company_id` |
| 创建 | body **无** `id`（或 `id=0`） |
| 更新 | body 有正整数 `id`；**必须**带读到的 `config_version` |
| 固定 | `activity_type=wheel`；消耗落库 `cost_type=2`（积分）；不读写业务语义上的 `area_id`/`cost_type` 入参 |

**Request（关键字段）**

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | long | 更新必填 | 创建省略 |
| `config_version` | long | 更新必填 | 乐观锁；与详情/配置读值一致 |
| `begin_time` | long | 是 | 创建后不可改（更新强制沿用库内） |
| `end_time` | long | 是 | **必须** `> now`（普通保存；与手动结束分岔） |
| `cost_value` | long | 是 | `> 0`，每次消耗积分 |
| `limit_total` | long | 是 | `≥0`；`0`=不限 |
| `limit_day` | long | 是 | `≥0`；`0`=不限；当 `limit_total>0` 时不得大于总次数 |
| `activity_name` | string | 建议 | 活动名 |
| `intro` | string | 否 | 说明 |
| `activity_template_config` | object/string | 否 | 页面/转盘样式 JSON |
| `prize_data` | array | 是 | 见 §3 |

**Response `data`**

```json
{ "result": true, "id": 100, "config_version": 1 }
```

更新成功时 `config_version` 为自增后的新版本。

**主要错误**

| 场景 | code / 语义 |
| --- | --- |
| 版本冲突 | `LUCKY_DRAW_CONFIG_VERSION_CONFLICT` |
| 已结束不可编辑 | `LUCKY_DRAW_ENDED` / 文案「活动已结束，不可编辑」 |
| `end_time <= now` | 结束时间必须大于当前时间 |
| 奖项/次数校验失败 | 400 + 中文明细（见 §3） |

### 1.2 读配置 `GET /turntableconfig?id=`

- 须 `company_id` 校验  
- 无数据时现网兼容：`data` 可为 `[]`  
- 响应含 `config_version`；**不含** `area_id` / `cost_type`

### 1.3 活动详情 `GET /getturntable?id=`

- 须 `company_id` 校验  
- 含 `config_version`；奖项可带 `prize_detail`（券/券包展开）

### 1.4 列表 `GET /getturntableList`

Query：`page`、`pageSize`、`activity_id`、`activity_name`、`status`

| `status` | 含义（与时间窗一致） |
| --- | --- |
| `notstart` | `begin_time > now` |
| `online` | `begin_time <= now < end_time` |
| `expire` | `end_time <= now` |

列表行字段含：`id`、`company_id`、时间、`cost_value`、`activity_*`、`prize_data`、`intro`、`config_version`、`limit_*`、计算字段 `status`；**不含** `area_id` / `cost_type`。

### 1.5 手动结束 `GET /down_lucky_draw/byid?activity_id=`

| | |
| --- | --- |
| 语义 | `end_time = now`；**不**递增 `config_version` |
| 允许 | **仅进行中**（`begin <= now < end`） |
| 拒绝 | 已结束 → 不可再次结束；未开始 → 仅进行中可结束 |

成功：`{ "status": true }`

### 1.6 复制 `POST /turntable/copy`

Body：`activity_id`（或 `id`）

- 只复制配置；**全部** `prize_id` 重生  
- 不复制抽奖历史  
- `config_version = 1`；名称追加 ` 副本`  
- Response：`{ "result": true, "id": <newId>, "config_version": 1 }`

### 1.7 统计 / 记录 / 导出（现网 path）

| 能力 | Method | Path |
| --- | --- | --- |
| 统计 | GET | `/getturntable_count/byid?activity_id=` |
| 记录列表 | GET | `/getturntable_log/byid` |
| 导出 | GET | `/down_lucky_draw/export` |

统计口径（PRD §8）：

- 抽奖次数 = `status IN (SUCCESS, GRANT_FAILED)`  
- 中奖次数 = `SUCCESS AND prize_type <> 'thanks'`  
- 中奖人数 = 上述 `COUNT(DISTINCT user_id)`

---

## 2. 用户端（FrontAuth）

Base：`/api/v1/h5app/wxapp`

### 2.1 活动数据 `GET /promotion/getLuckyDrawData?id=`

现网；登录用户可附带 `user_info`（积分等）。公开配置规则见 §4。

### 2.2 用户抽奖记录 `GET /promotion/getLuckyDrawLog?id=`

现网。

### 2.3 抽奖（参与）`POST /promotion/turntable`（冻结；BE-03/04）

| | |
| --- | --- |
| 鉴权 | FrontAuth；`user_id`/`company_id` 来自 H5 claims |
| Body | `{ "activity_id": 100, "requestId": "01J..." }` |
| 兼容 | 旧 GET 可短期保留；**新客户端必须 POST** |

**Response（HTTP 200 = 协议成功）**

成功：

```json
{
  "activityId": 100,
  "recordId": 10001,
  "requestId": "01J...",
  "status": "SUCCESS",
  "prizeId": "xxx",
  "sectorIndex": 2,
  "prizeType": "coupon",
  "prizeTitle": "满100减20",
  "costPoints": 10,
  "remainPoints": 90,
  "isWin": true
}
```

处理中（**禁止**用 HTTP 4xx/5xx 表达 PROCESSING）：

```json
{
  "activityId": 100,
  "recordId": 10001,
  "requestId": "01J...",
  "status": "PROCESSING"
}
```

同 `requestId` 重放：返回已有记录同构结果，**不**当失败。

### 2.4 抽奖结果查询 `GET /promotion/turntable/result`（新增；BE-03）

Query：`requestId` 或 `recordId`（至少其一）；返回体与 §2.3 同构。

---

## 3. `prize_data[]` Schema（保存契约）

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `prize_id` | 是（服务端保证） | 新建生成；编辑按序保留；删除永不复用；复制全重生 |
| `sort` | 是 | 扇区/概率累计顺序 |
| `name` | 是 | ≤5 字 |
| `type` | 是 | `thanks` / `points` / `coupon` / `coupons` |
| `value` | 视类型 | points>0；coupon/coupons 非空 |
| `probability` | 是 | 0～100；总和 ≤100；不足 100 的差额进排序最前 `thanks` |
| `dailyStock` | coupon/coupons 必填 | ≥0；**0=今日不可中** |
| `backgroundColor` / `image` | 否 | 扇区样式 |

兼容：无。管理端提交/回显仅使用上表字段，不做旧键双写。

硬约束：至少 1 个 `thanks`。

---

## 4. 公开配置脱敏（C 端）

可返回：状态、时间、消耗、剩余次数（限额 0 → 表达为不限）、奖项展示（name / image / color / `prizeId` / 扇区顺序）、样式。

**不得返回**：概率、日库存、券总库存等。

未登录可看配置；抽奖须登录。

---

## 5. 错误码（冻结）

| code | 场景 |
| --- | --- |
| `LUCKY_DRAW_ACTIVITY_NOT_FOUND` | 活动不存在或非本公司 |
| `LUCKY_DRAW_NOT_STARTED` | 未开始 |
| `LUCKY_DRAW_ENDED` | 已结束（含结束后只读） |
| `LUCKY_DRAW_TOTAL_LIMIT` | 总次数达上限 |
| `LUCKY_DRAW_DAILY_LIMIT` | 每日次数达上限 |
| `LUCKY_DRAW_POINT_NOT_ENOUGH` | 积分不足 |
| `LUCKY_DRAW_REQUEST_ID_INVALID` | requestId 缺失/非法 |
| `LUCKY_DRAW_GRANT_FAILED` | 发奖失败（用户提示；勿伪装 thanks） |
| `LUCKY_DRAW_COST_FAILED` | 扣费失败 |
| `LUCKY_DRAW_CONFIG_VERSION_CONFLICT` | 配置乐观锁冲突 |

`GRANT_FAILED`：提示发奖处理中/失败可重试，**不要**伪装谢谢参与。

---

## 6. 联调核对清单（INT-01）

按顺序：

1. 后台创建/编辑（含 `config_version`）→ 列表状态 → 详情回填  
2. 复制 → 新 id、新 `prize_id`、无历史  
3. 手动结束 → 只读；不可再结束  
4. C 端活动数据：扇区顺序、图片、颜色、`prizeId`、剩余次数、时区日切  
5. 抽奖 POST：无奖 / 券 / 券包 / 积分；`PROCESSING` 轮询 result  
6. 记录 / 统计 / 导出；模板挂载选活动（他仓）

Mock 场景至少覆盖：thanks、coupon、coupons、points。

---

## 7. 实现进度（本仓）

| 能力 | 状态 |
| --- | --- |
| 表结构 / Schema（BE-01） | 已提交 `ECX-9957` |
| 管理端保存/结束/复制/列表脱敏（BE-02） | 已提交 `ECX-9956` |
| 用户端抽奖 POST + result（BE-03） | 已提交 `ECX-9958` |
| 规则/库存/幂等/PROCESSING 主路径（BE-04） | 已提交 `ECX-9959` |
| 补偿恢复与观测收口（BE-05） | 已提交 `ECX-9960` |

已知余量（不影响前端按本文开发）：`GRANTING` 在发奖结果可查能力完备前，补偿保持 PROCESSING、不盲建发奖单；监控告警可随联调再补。

---

## 8. 修订记录

| 日期 | 说明 |
| --- | --- |
| 2026-09-02 | INT-01 初稿：对齐 PRD §6.5/§6.6 与 BE-02 落地行为 |
| 2026-09-02 | 标记可联调；同步 BE-03～05 已提交；补 GRANTING 余量说明 |
