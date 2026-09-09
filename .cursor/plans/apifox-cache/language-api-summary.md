# Apifox 语言设置接口摘要（ECX-JAVA / 8796324）

> 拉取时间：2026-09-09  
> 来源：Apifox OpenAPI / http-apis（MCP `Ecshopx-guide` 不可用；语言接口不在 guide 项目 7640476）  
> 原始缓存：`apifox-cache/ECX-JAVA-language-setting.openapi.json`、`front-language-list.api.json`、`admin-language-save.api.json`

## 接口清单

| 端 | 方法 | 路径 | 名称 | 用途 |
|----|------|------|------|------|
| Admin | GET | `/api/v1/setting/language` | 读取语言配置（配置页） | ECX-10022 回显 |
| Admin | POST | `/api/v1/setting/language` | 保存语言配置 | ECX-10022 保存 |
| Front | GET | `/api/v1/h5app/wxapp/setting/language` | 已启用语言列表 | ECX-10024 / vshop 只读 |

LanguageCode 枚举：`zh-CN` | `en-CN` | `ar-SA` | `zh-TW`（注意 English 为 `en-CN`，非 PRD 文案里的 `en-US`）

## Admin GET 示例

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "version": 0,
    "configValid": true,
    "configWarning": null,
    "defaultLanguage": "zh-CN",
    "enabledCount": 1,
    "languages": [
      { "code": "zh-CN", "displayName": "中文", "enabled": true, "sort": 1 },
      { "code": "en-CN", "displayName": "English", "enabled": false, "sort": 2 },
      { "code": "ar-SA", "displayName": "العربية", "enabled": false, "sort": 3 },
      { "code": "zh-TW", "displayName": "中文繁体", "enabled": false, "sort": 4 }
    ]
  }
}
```

要点：固定返回 4 条（含 `enabled=false`）；无 Redis 时 `version=0` 且仅 zh-CN 启用。

## Admin POST

- 全量替换；已有配置时 `body.version` 必填且与 GET 一致（乐观锁）。
- 成功 `message`: `语言设置已保存`；冲突 422：`配置已被他人修改，请刷新后重试`。
- Request 必填：`defaultLanguage`、`languages`（4 项，`code`+`enabled`）；`version` 首次可省略或 0。

## Front GET 示例

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "defaultLanguage": "zh-CN",
    "enabledLanguages": [
      { "code": "zh-CN", "name": "中文", "sort": 1 },
      { "code": "en-CN", "name": "English", "sort": 2 }
    ],
    "updatedAt": 1725123456789
  }
}
```

要点：只返回已启用语言；不返回 `version`；无配置时仅 zh-CN。
