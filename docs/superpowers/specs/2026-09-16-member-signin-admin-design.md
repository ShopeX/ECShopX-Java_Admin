# 会员签到 Admin 设计（ECX-9884 / ECX-10225）

日期：2026-09-16  
范围：Admin 全量（签到设置 + 累计签到活动列表 + 弹窗阶梯 + 中止）  
Figma：

- 列表页：https://www.figma.com/design/IUFfr3uRGtIO3cXlmoadje/会员签到?node-id=297-905&m=dev
- 弹窗：https://www.figma.com/design/IUFfr3uRGtIO3cXlmoadje/会员签到?node-id=351-8257&m=dev

## 1. 目标

在营销 → 互动营销下新增「会员签到」管理页，对接 Apifox「会员签到」模块接口，支持：

1. 配置周一～周日日常签到积分并保存  
2. 管理累计签到活动（查 / 增 / 改 / 复制 / 中止）  
3. 活动内配置多条累计阶梯，每档可配积分与优惠券（各限 1）

非目标：C 端签到页、数据统计看板、删除活动（接口无 delete，仅 stop）。

## 2. 信息架构与布局

单页左右双栏（**不用 Tabs**，对齐 Figma）：

```
SpPage
└─ flex 双栏（窄屏纵向堆叠）
   ├─ 左：签到设置
   │   · 说明文案
   │   · 周一～周日 el-input-number +「积分」
   │   · 签到规则说明（SpRichText，后端字段待补）
   │   · 保存设置
   └─ 右：累计签到活动
       · 标题 +「添加累计签到活动」
       · 活动名称搜索 + 重置
       · SpTable + 分页
```

弹窗：`el-dialog` 宽约 720px，标题随模式切换（添加 / 编辑 / 复制）。

## 3. 路由与权限

| 项 | 值 |
|----|-----|
| path | `/marketing/interactive/member-signin` |
| 菜单位置 | 营销 → 互动营销 → 会员签到（与抽奖同级） |
| permissions | `marketing.interactive.member_signin`（若菜单未下发，先挂路由，权限码按后台实际微调） |
| 路由文件 | `src/router/routes/modules/marketing.js`（对齐 lottery） |
| 页面目录 | `src/views/marketing/member-signin/` |

## 4. 文件结构

```
src/api/memberSignin.js
src/views/marketing/member-signin/
  index.vue              # 左右双栏主页
  components/
    DailyPointsPanel.vue # 左栏签到设置
    ActivityListPanel.vue
    ActivityDialog.vue   # 新增/编辑/复制
```

样式：Tailwind + Element UI 主题色；不新增自定义 SCSS。

## 5. API 映射

基路径：`/api/v1/promotions/member-signin`

| 能力 | Method | Path |
|------|--------|------|
| 读日常积分 | GET | `/daily-points` |
| 保存日常积分 | PUT | `/daily-points` |
| 活动列表 | GET | `/activities?name&page&page_size` |
| 新增活动 | POST | `/activities` |
| 活动详情 | GET | `/activities/{id}` |
| 编辑活动 | PUT | `/activities/{id}`（需 `config_version`） |
| 中止活动 | POST | `/activities/{id}/stop` |
| 券候选 | GET | `/coupons/candidates?keyword&page&page_size` |

### 5.1 日常积分 body

```json
{
  "points_mon": 0,
  "points_tue": 0,
  "points_wed": 0,
  "points_thu": 0,
  "points_fri": 0,
  "points_sat": 0,
  "points_sun": 0
}
```

约束：非负整数；缺省按 0；0 表示不赠送且 C 端不展示。

### 5.2 活动保存 body

```json
{
  "name": "string ≤50",
  "begin_time": 1720000000,
  "end_time": 1721000000,
  "tiers": [
    {
      "tier_count": 3,
      "points_reward": 10,
      "coupon_id": 123
    }
  ],
  "config_version": 1
}
```

- `begin_time` / `end_time`：秒级 Unix  
- `points_reward` / `coupon_id` 可为 `null`；同档积分、优惠券各限 1（UI 约束）  
- 编辑必带 `config_version`；409 → 提示刷新后重试  
- 已结束活动不可编辑（422）

### 5.3 列表字段

- `display_status`: `not_started` | `in_progress` | `ended`  
- 分页：`list` / `total_count` / `page` / `page_size`

## 6. UI 行为细则

### 6.1 左栏 · 签到设置

- 进入页拉取 GET daily-points 回填  
- 保存：PUT；成功 toast；失败展示服务端 msg  
- 文案：按稿「分别设置周一到周日…设置为 0 时不赠送…」

### 6.2 右栏 · 列表

列：ID、活动名称、活动时间（起止格式化）、状态、操作。

| 状态 | 展示 | 操作 |
|------|------|------|
| not_started | 未开始（浅蓝标签） | 编辑、复制、中止 |
| in_progress | 进行中（蓝标签） | 编辑、复制、中止 |
| ended | 已结束（灰标签） | 仅复制 |

- 搜索：活动名称；按钮「重置」清空并重新拉第一页  
- 中止：二次确认 → POST stop → 刷新列表（ECX-10225）  
- ID 不加粗

### 6.3 弹窗 · 活动表单

1. **活动标题***：必填，≤50  
2. **活动时间***：daterange → 转秒级 Unix  
3. **累计签到奖励**  
   - 「+ 添加累计签到规则」追加规则卡片  
   - 说明：「累计次数不得超过活动周期天数，同一活动内不可重复。」  
   - 每卡：累计签到 N 次*；「添加奖励」下拉（积分 / 优惠券）；右侧「删除累计规则」（红）  
   - 积分：`el-input-number` +「删除」  
   - 优惠券：`el-select` 远程 `coupons/candidates`（展示 title）+「删除」  
   - 积分、优惠券各限 1；已选类型从下拉禁用或隐藏  

校验（前端）：

- 至少一条规则；每条 `tier_count ≥ 1`  
- 同活动 `tier_count` 不重复  
- `tier_count` ≤ 活动天数（按起止日期差，含首尾）  
- 每条至少一种奖励（积分或券）  

模式：

- **新建**：POST  
- **编辑**：GET 详情回填 + PUT（带 config_version）  
- **复制**：GET 详情 → 清空 id / config_version / 时间可清空或保留由实现选「清空时间强制重填」；保存走 POST  

## 7. 组件与实现对齐

- 容器：`SpPage`；表：`SpTable`  
- 富文本：项目已有 `SpRichText`（同储值协议页）  
- 数字：`el-input-number`；日期：`el-date-picker type="datetimerange"` 或 `daterange`（与稿一致优先 daterange，提交时取日起 00:00 / 日末 23:59:59 秒戳，实现计划中定一种并写死）  
- 破坏性操作（中止、删除规则/奖励）红色文字链 `#F56C6C`  
- 主色按钮走 Element `type="primary"`，不自定义紫色

## 8. 已决决策与剩余开放项

### 已决：签到规则说明

- UI **先放 `SpRichText`**，对齐 Figma。  
- 当前 `daily-points` 无规则字段：**保存时只提交七个 `points_*`，规则 HTML 暂存本地组件状态、不请求后端**。  
- 后端字段补齐后：扩展 GET/PUT `daily-points`（或独立接口）再接线；接口契约以届时 Apifox 为准。

### 仍开放

1. 菜单权限码是否已在权限系统配置；未配置时先用 `marketing.interactive.member_signin`，联调时改。  
2. 活动时间精度：实现默认 **daterange + 日界秒戳**（日起 00:00:00 / 日末 23:59:59），除非联调要求 datetime。

## 9. 测试要点

- [ ] 日常积分读写、0 值保存  
- [ ] 活动列表搜索 / 分页 / 状态标签与操作可见性  
- [ ] 新建含多阶梯（仅积分 / 仅券 / 两者）  
- [ ] 编辑乐观锁 409  
- [ ] 复制不带原 id，保存为新活动  
- [ ] 中止仅改 end_time，列表变已结束  
- [ ] 阶梯次数重复、超过活动天数被拦截  
- [ ] 券候选远程搜索可选

## 10. 成功标准

- 页面视觉与 Figma 双栏 + 弹窗结构一致（Element 主题色）  
- 上述 8 个接口均有对应调用，无 mock 残留  
- 中止链路可用（ECX-10225）  
- 无新增 scoped 自定义 SCSS（Tailwind First）
