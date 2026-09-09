# Plan：ECX-10024 PC 商城语言配置生效

> 来源：TB ECX-10024 / 父任务 ECX-9889 / PRD `ECX-9889-language-settings`  
> 仓库：`ecshopx-web-standard`（当前基线 `master-standard-java`）  
> 原型：无独立 web 原型页（PRD 原型仅覆盖 admin）  
> 依赖：ECX-10021（跨端配置能力，已完成）；与 vshop ECX-10023 共享业务规则  
> 设计稿：**不需要 Figma**（见下方结论）

## Figma 结论

| 检查项 | 结果 |
|--------|------|
| PRD / 任务备注是否引用 Figma | 否，仅 HTML 原型且仅 admin 页 |
| Web 是否新增视觉页面 | 否，改造既有 Header 语言入口与默认语言解析 |
| Teambition 附件/活动是否含设计稿 | 否 |
| 是否阻塞开工 | **不阻塞**；按现有 `BCHeaderBar` 交互 + PRD F-005/F-007 规则实现 |

## 目标

PC 商城读取站点已保存语言配置：语言入口仅展示已启用语言；无个人偏好时用默认语言；配置变更后当即生效；保留用户主动选择的个人偏好规则。

## 现状结论

- 已有四语定义：`app/shared/localeConfig.ts`（`zh` / `en` / `ar` / `zhtw`）。  
- Header 语言菜单：`BCHeaderBar.vue` 当前 **硬编码** `LOCALE_DEFINITIONS` 全量展示。  
- 个人偏好：`localePreference.ts`（sessionStorage）+ `locale-preference.client.global.ts` 中间件。  
- **尚未**调用 `GET /setting/language`（或等价 web 接口）；vshop 已实现可参考：`ecshopx-vshop-standard/src/utils/language-setting.js`。

## 实现步骤

1. **站点语言配置读取层**  
   - 新增 composable/util（可对标 vshop）：拉取并归一化 `defaultLanguage` + `enabledLanguages`；短缓存；失败回落「仅中文默认」。  
   - API code ↔ web locale code 映射与现有 `localeConfig` 对齐（注意 `zh-CN→zh`、`en-US/en-CN→en`、`zh-TW→zhtw`、`ar→ar`）。  
   - verify：无配置/接口失败时行为与 PRD 初始态一致。

2. **语言入口过滤（F-007/AC-001，F-005/AC-005）**  
   - `BCHeaderBar`（及装修头等同类入口）的 `availableLocales` 改为「仅已启用」。  
   - 仅启用一门时仍展示该语言。  
   - verify：admin 关闭某语言并保存后，刷新/当即更新后入口不再出现该语言。

3. **默认语言与个人偏好（F-007/AC-002,003）**  
   - 无 `ecx_web_preferred_locale`（或偏好语言已不在启用列表）时，使用站点 `defaultLanguage`。  
   - 用户主动切换并写入 preference 的，配置保存后不强制改写；若偏好语言被关闭，下次进入回落到站点默认。  
   - 梳理 `locale-preference.client.global.ts`：避免「无偏好时把当前 path locale 写成偏好」与「站点默认语言」冲突。  
   - verify：清偏好后进站落默认；有偏好时保留；偏好被关后回落。

4. **保存后当即生效（F-005/AC-005）**  
   - 已打开页面需刷新启用列表与默认解析（轮询短缓存失效 / 聚焦刷新 / 事件，择一最小改动方案，与 vshop 一致优先）。  
   - verify：admin 保存后，已打开 PC 页语言菜单与默认展示更新，无需整站重新部署。

## 建议测试清单

| # | 场景 | AC |
|---|------|----|
| 1 | 保存后入口仅已启用语言 | F-005/AC-005, F-007/AC-001 |
| 2 | 无个人偏好使用默认语言 | F-007/AC-002 |
| 3 | 有个人偏好不被配置改写；偏好关闭后回落 | F-007/AC-003 |
| 4 | 仅启用一门时入口与默认仍正确 | F-007 边界 |
| 5 | 接口失败回落中文 | 兼容性 |

## 风险与待确认

- Web 调用的具体 API path：是否与 vshop 同为 `GET /setting/language`，还是走 PC 专用域名代理——需联调确认。  
- `locale-preference` 使用 sessionStorage：PRD「个人偏好」是否等同于此；若产品定义为长期偏好，需评估改 localStorage（超出当前任务则先标为待确认，默认保持现有存储介质只改过滤/默认逻辑）。  
- 装修头 `DecorationHeaderSection` 若也有语言切换，需一并过滤，避免双入口不一致。

## 非目标

- 不新做语言设置管理页；不改视觉稿；不新增语言种类；不做翻译内容管理。
