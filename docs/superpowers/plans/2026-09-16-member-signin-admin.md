# 会员签到 Admin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 Admin 营销 → 互动营销下交付「会员签到」页：左栏日常积分 + SpRichText 规则说明（规则暂不落库），右栏累计签到活动 CRUD/复制/中止。

**Architecture:** 单页左右双栏（对齐 Figma，不用 Tabs）。`src/api/memberSignin.js` 对接 `/promotions/member-signin/*`；主页拆 `DailyPointsPanel` / `ActivityListPanel` / `ActivityDialog`；列表用 `SpTable`；样式 Tailwind + Element 主题色。

**Tech Stack:** Vue 2、Element UI、SpPage/SpTable/SpRichText、Tailwind、现有 `fetch` 请求层。

**Spec:** `docs/superpowers/specs/2026-09-16-member-signin-admin-design.md`

## Global Constraints

- Tailwind First：不新增自定义 SCSS
- API 相对路径（无 `/api/v1` 前缀）：`/promotions/member-signin/...`
- 命名导入 `@/api/memberSignin`，自行 unwrap `res?.data?.data`（对齐 deposit）
- 文案本迭代先用中文硬编码对齐稿；i18n 另开任务
- 提交信息须含 `[TBID:ECX-9884]`（用户明确要求 commit 时再提交）
- 签到规则 HTML：**只存组件 data，保存日常积分不提交该字段**

---

## File Structure

| 文件 | 职责 |
|------|------|
| `src/api/memberSignin.js` | 8 个接口封装 |
| `src/views/marketing/member-signin/index.vue` | SpPage + 左右双栏壳 |
| `src/views/marketing/member-signin/components/DailyPointsPanel.vue` | 日常积分 + SpRichText + 保存 |
| `src/views/marketing/member-signin/components/ActivityListPanel.vue` | 搜索、表格、中止、打开弹窗 |
| `src/views/marketing/member-signin/components/ActivityDialog.vue` | 新建/编辑/复制 + 阶梯表单 |
| `src/views/marketing/member-signin/utils.js` | 日界秒戳、活动天数、状态文案 |
| `src/router/routes/modules/marketing.js` | 注册路由 |

---

### Task 1: API 模块 `memberSignin.js`

**Files:**
- Create: `src/api/memberSignin.js`

**Interfaces:**
- Produces:
  - `getDailyPoints()` → Promise（data: DailyPointsBody）
  - `saveDailyPoints(params)` → Promise
  - `getActivityList(query)` → `{ list, total_count, page, page_size }`
  - `createActivity(params)` → ActivityDetail
  - `getActivityDetail(id)` → ActivityDetail
  - `updateActivity(id, params)` → ActivityDetail（params 含 `config_version`）
  - `stopActivity(id)` → void/data
  - `getCouponCandidates(query)` → `{ list, total_count, ... }`

- [ ] **Step 1: 创建 API 文件**

```js
/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 *
 * 会员签到 Admin：Apifox ECX-JAVA /api/v1/promotions/member-signin/*
 */
import { fetch } from './request'

export function getDailyPoints() {
  return fetch({
    url: '/promotions/member-signin/daily-points',
    method: 'get'
  })
}

export function saveDailyPoints(params) {
  return fetch({
    url: '/promotions/member-signin/daily-points',
    method: 'put',
    params
  })
}

export function getActivityList(query) {
  return fetch({
    url: '/promotions/member-signin/activities',
    method: 'get',
    params: query
  })
}

export function createActivity(params) {
  return fetch({
    url: '/promotions/member-signin/activities',
    method: 'post',
    params
  })
}

export function getActivityDetail(id) {
  return fetch({
    url: `/promotions/member-signin/activities/${id}`,
    method: 'get'
  })
}

export function updateActivity(id, params) {
  return fetch({
    url: `/promotions/member-signin/activities/${id}`,
    method: 'put',
    params
  })
}

export function stopActivity(id) {
  return fetch({
    url: `/promotions/member-signin/activities/${id}/stop`,
    method: 'post'
  })
}

export function getCouponCandidates(query) {
  return fetch({
    url: '/promotions/member-signin/coupons/candidates',
    method: 'get',
    params: query
  })
}
```

- [ ] **Step 2: 确认 `src/api/index.js` 的 `importAll` 会自动挂上 `api.memberSignin`（无需改 index；命名导入可直接用）**

- [ ] **Step 3: 本任务交付物自检** — `memberSignin.js` 存在且导出 8 个函数；用户要求时再 commit：`[TBID:ECX-9884] feat: 会员签到 API 封装`

---

### Task 2: 工具函数 `utils.js`

**Files:**
- Create: `src/views/marketing/member-signin/utils.js`

**Interfaces:**
- Produces:
  - `unwrap(res)` → data
  - `dayStartUnix(dateOrStr)` / `dayEndUnix(dateOrStr)` → number（秒）
  - `activityDayCount(beginUnix, endUnix)` → number（含首尾）
  - `formatActivityRange(begin, end)` → `'YYYY.MM.DD 至 YYYY.MM.DD'`
  - `STATUS_MAP`：`not_started|in_progress|ended` → `{ label, tagType }`

- [ ] **Step 1: 写入 utils**

```js
/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

export function unwrap(res) {
  return res?.data?.data != null ? res.data.data : res?.data ?? res
}

function toDate(input) {
  if (input instanceof Date) return input
  // el-date-picker value-format 'yyyy-MM-dd'
  const s = String(input)
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  return new Date(input)
}

export function dayStartUnix(input) {
  const d = toDate(input)
  return Math.floor(new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0).getTime() / 1000)
}

export function dayEndUnix(input) {
  const d = toDate(input)
  return Math.floor(new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59).getTime() / 1000)
}

export function activityDayCount(beginUnix, endUnix) {
  if (!beginUnix || !endUnix || endUnix < beginUnix) return 0
  const ms = (endUnix - beginUnix) * 1000
  return Math.floor(ms / 86400000) + 1
}

function pad(n) {
  return n < 10 ? `0${n}` : String(n)
}

export function formatActivityRange(beginUnix, endUnix) {
  const fmt = (u) => {
    const d = new Date(u * 1000)
    return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`
  }
  if (!beginUnix || !endUnix) return '-'
  return `${fmt(beginUnix)} 至 ${fmt(endUnix)}`
}

export const STATUS_MAP = {
  not_started: { label: '未开始', type: 'info' },
  in_progress: { label: '进行中', type: '' },
  ended: { label: '已结束', type: 'info' }
}
```

- [ ] **Step 2: 自检** — 导出齐全；commit 可选：`[TBID:ECX-9884] feat: 会员签到工具函数`

---

### Task 3: 左栏 `DailyPointsPanel.vue`

**Files:**
- Create: `src/views/marketing/member-signin/components/DailyPointsPanel.vue`

**Interfaces:**
- Consumes: `getDailyPoints`, `saveDailyPoints`, `unwrap`
- Produces: 自包含面板；无对外事件（保存内部 toast）

- [ ] **Step 1: 实现面板**

要点：
- `WEEK_KEYS = ['points_mon'..'points_sun']`，标签 `周一`～`周日`
- `el-input-number`：`min=0`、`precision=0`、`controls-position` 默认两侧
- `ruleHtml` 本地 `data`，`SpRichText v-model="ruleHtml"`；**save 只 PUT 七个积分字段**
- `mounted`/`created` 拉配置；`saving` / `loading`
- 卡片 Tailwind：白底边框圆角，底部居中「保存设置」`el-button type="primary"`
- 说明文案：「分别设置周一到周日的签到积分，设置为 0 时不赠送，也不在用户端显示。」

结构骨架：

```vue
<template>
  <div v-loading="loading" class="flex flex-col gap-4 bg-white border border-[#e6e6e6] rounded-lg p-5 h-full">
    <div>
      <h3 class="m-0 text-base font-medium text-[#212121]">签到设置</h3>
      <p class="mt-2 mb-0 text-xs text-[#999] leading-5">
        分别设置周一到周日的签到积分，设置为 0 时不赠送，也不在用户端显示。
      </p>
    </div>
    <div class="grid grid-cols-2 gap-x-6 gap-y-3 max-md:grid-cols-1">
      <div v-for="item in weekFields" :key="item.key" class="flex items-center gap-2">
        <span class="w-10 shrink-0 text-sm text-[#606266]">{{ item.label }}</span>
        <el-input-number v-model="points[item.key]" :min="0" :precision="0" :disabled="saving" />
        <span class="text-sm text-[#606266]">积分</span>
      </div>
    </div>
    <div>
      <div class="mb-2 text-sm font-medium text-[#212121]">签到规则说明</div>
      <div class="min-h-[180px] border border-[#e6e6e6] rounded [&_.sp-rich-text]:!border-0 [&_.tox-tinymce]:!border-0">
        <SpRichText v-model="ruleHtml" :disabled="saving" />
      </div>
    </div>
    <div class="flex justify-center pt-2">
      <el-button type="primary" :loading="saving" @click="onSave">保存设置</el-button>
    </div>
  </div>
</template>
```

- [ ] **Step 2: 浏览器冒烟** — 打开页后左栏可加载（接口通时）；改积分保存成功 toast；改规则说明后保存不影响规则持久化（刷新后规则清空为预期，直到后端补字段）

- [ ] **Step 3: commit 可选** — `[TBID:ECX-9884] feat: 会员签到日常积分面板`

---

### Task 4: 弹窗 `ActivityDialog.vue`

**Files:**
- Create: `src/views/marketing/member-signin/components/ActivityDialog.vue`

**Interfaces:**
- Consumes: `createActivity`, `updateActivity`, `getActivityDetail`, `getCouponCandidates`, utils
- Produces:
  - Props: 无（内部 `visible`）
  - Methods（`ref` 调用）: `openCreate()`, `openEdit(id)`, `openCopy(id)`
  - Events: `success`（保存成功后父级刷新列表）

- [ ] **Step 1: 数据模型**

```js
function emptyReward() {
  return { points: null, couponId: null, couponTitle: '' }
}
function emptyTier() {
  return { tier_count: 1, points_reward: null, coupon_id: null, _couponTitle: '' }
}
// form: { name, dateRange: [start, end], tiers: [], config_version, id }
```

奖励 UI：每档维护「已添加的奖励类型」列表；「添加奖励」`el-dropdown` 选项积分/优惠券；已有类型不再出现。映射提交：

```js
tiers.map(t => ({
  tier_count: t.tier_count,
  points_reward: t.points_reward != null ? t.points_reward : null,
  coupon_id: t.coupon_id != null ? t.coupon_id : null
}))
```

- [ ] **Step 2: 校验**

保存前：
1. name 非空且 ≤50  
2. dateRange 两端齐全  
3. tiers.length ≥ 1  
4. 各 `tier_count ≥ 1` 且互不重复  
5. `tier_count ≤ activityDayCount(begin, end)`  
6. 每档至少 `points_reward != null` 或 `coupon_id != null`  

失败用 `this.$message.warning(...)`。

- [ ] **Step 3: 模式**

- `openCreate`：空表单，`mode='create'`  
- `openEdit(id)`：`getActivityDetail` → 回填，`mode='edit'`，保留 `config_version`  
- `openCopy(id)`：详情回填后 `id=null`、`config_version=null`、**清空 dateRange**，`mode='create'`，标题「添加累计签到活动」  

提交：create/copy → `createActivity`；edit → `updateActivity(id, {..., config_version})`。  
409：`this.$message.error('活动配置已变更，请刷新后重试')` 并 `$emit('success')` 或关闭后刷新。

- [ ] **Step 4: 券选择**

`el-select` `filterable` `remote` `remote-method` → `getCouponCandidates({ keyword, page: 1, page_size: 20 })`，`label=title` `value=id`。

- [ ] **Step 5: 模板对齐稿**

- `el-dialog` `width="720px"` `append-to-body`  
- 页脚取消/确定  
- 规则卡：`bg-[#fafafa] border border-[#e6e6e6] rounded p-3`  
- 「删除累计规则」「删除」：`class="text-[#f56c6c] cursor-pointer"` 文字，非按钮  
- 顶部「+ 添加累计签到规则」`el-button type="primary" size="small"`

- [ ] **Step 6: 自检** — 本地打开弹窗可增删规则/奖励；commit 可选

---

### Task 5: 右栏 `ActivityListPanel.vue`

**Files:**
- Create: `src/views/marketing/member-signin/components/ActivityListPanel.vue`

**Interfaces:**
- Consumes: `getActivityList`, `stopActivity`, `ActivityDialog`, `STATUS_MAP`, `formatActivityRange`, `unwrap`
- Produces: 内嵌 dialog；列表刷新

- [ ] **Step 1: 列表 + 搜索**

```js
filters: { name: '' }
page: 1
pageSize: 10
total: 0
list: []
```

- 「重置」：清空 name，page=1，reload  
- 活动名称输入后点查询（稿有搜索框；实现：输入框 + 重置；可加「查询」或 blur/enter 搜索，优先 **回车或旁侧查询按钮**）

- [ ] **Step 2: SpTable 列**

| prop | 说明 |
|------|------|
| id | 不加粗 |
| name | 活动名称 |
| time | slot，用 `formatActivityRange` |
| display_status | slot，`el-tag` |
| actions | slot：编辑/复制/中止 |

操作可见性：`ended` 仅复制；否则 编辑 + 复制 + 中止（红）。

中止：

```js
this.$confirm('确定中止该累计签到活动吗？', '提示', { type: 'warning' })
  .then(() => stopActivity(row.id))
  .then(() => { this.$message.success('已中止'); this.loadList() })
```

- [ ] **Step 3: 分页** — `el-pagination` layout `total, sizes, prev, pager, next`，同步 `page`/`page_size`

- [ ] **Step 4: 挂 `ActivityDialog` ref**，按钮「添加累计签到活动」→ `openCreate`；`@success="loadList"`

- [ ] **Step 5: 自检** — 列表空态/有数据、中止确认、操作列按状态切换

---

### Task 6: 主页 + 路由

**Files:**
- Create: `src/views/marketing/member-signin/index.vue`
- Modify: `src/router/routes/modules/marketing.js`（在 `lotteryList` 路由块附近追加）

**Interfaces:**
- Consumes: DailyPointsPanel, ActivityListPanel

- [ ] **Step 1: index.vue**

```vue
<template>
  <SpPage>
    <div class="grid grid-cols-2 gap-4 items-start max-lg:grid-cols-1 p-1">
      <DailyPointsPanel />
      <ActivityListPanel />
    </div>
  </SpPage>
</template>

<script>
import DailyPointsPanel from './components/DailyPointsPanel.vue'
import ActivityListPanel from './components/ActivityListPanel.vue'

export default {
  name: 'MemberSigninAdmin',
  components: { DailyPointsPanel, ActivityListPanel }
}
</script>
```

- [ ] **Step 2: 注册路由**（插在 lottery 同级）

```js
{
  name: 'memberSignin',
  path: 'interactive/member-signin',
  meta: {
    aliasName: 'member_signin',
    icon: 'calendar',
    title: '会员签到',
    permissions: ['marketing.interactive.member_signin']
  },
  component: () => import('@/views/marketing/member-signin/index.vue')
}
```

注意：本文件已有 `i18n.t(...)` 用于 lottery title；若必须走 i18n，可临时用中文硬编码 title（菜单最终以后台配置为准），或补一条 locale——**本任务允许 title 用中文字符串**，与 Global Constraints 一致。

- [ ] **Step 3: 本地路由冒烟** — 访问 `/marketing/interactive/member-signin` 双栏渲染

- [ ] **Step 4: 全链路自检对照 spec §9**

- [ ] 日常积分读写、0 值保存  
- [ ] 规则说明可编辑且不落库  
- [ ] 列表搜索/分页/状态与操作  
- [ ] 新建多阶梯  
- [ ] 编辑 / 复制  
- [ ] 中止  
- [ ] 阶梯次数校验  

- [ ] **Step 5: 用户要求时统一 commit** — `[TBID:ECX-9884] feat: 会员签到 Admin 页面与路由`

---

## Spec coverage checklist

| Spec 项 | Task |
|---------|------|
| 左右双栏布局 | 6 |
| 日常积分 GET/PUT | 1, 3 |
| SpRichText 规则暂不落库 | 3, Global |
| 活动列表/搜索/分页 | 5 |
| 状态与操作可见性 | 5 |
| 中止 stop | 1, 5 |
| 弹窗阶梯 + 积分/券各限 1 | 4 |
| config_version / 409 | 4 |
| 复制清空 id/时间 | 4 |
| 路由 interactive/member-signin | 6 |
| Tailwind、无新 SCSS | Global |
| Figma 720 弹窗 | 4 |

## Placeholder scan

无 TBD/TODO 步骤；规则字段接线明确推迟到后端补齐后另开任务。
