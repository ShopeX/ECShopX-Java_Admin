# 整体需求总结：站点语言设置（ECX-9889 族）

## 一句话

运营在管理后台统一配置「哪些语言可用 + 默认语言」，保存后 admin / vshop / PC web 的语言入口与首次默认展示共用同一份配置；用户已主动选择的个人语言偏好不被覆盖（除非该语言被关闭后回落默认）。

## 任务映射

| TBID | 标题 | 仓库 | 状态 | 本批 |
|------|------|------|------|------|
| ECX-9889 | 站点可以设置默认语言及展示哪些可选语言 | 父需求 | 进行中 | 背景 |
| ECX-10021 | 语言设置跨端配置能力 | API/服务 | **已完成** | 依赖 |
| ECX-10022 | 管理后台语言设置页面 | ecshopx-admin | 待做 | **是** |
| ECX-10023 | vshop 语言配置生效 | ecshopx-vshop | 进行中（代码已有 language-setting） | 参考 |
| ECX-10024 | PC 商城语言配置生效 | ecshopx-web-standard | 待做 | **是** |

PRD：https://ms-git.ishopex.cn/ecshopx/ecshopx_prd/-/blob/master/prds/active/ECX-9889-language-settings.md

## 业务规则（跨端共用）

- 固定四语顺序：`zh-CN` / `en-US` / `ar` / `zh-TW`，不可增删。  
- 至少一门开启；关最后一门立即阻止，提示「至少保持一种语言开启」。  
- 默认语言必须是已开启语言；关闭当前默认时清空并要求重选，不自动指定。  
- 无历史配置：仅中文开启且为默认。  
- 保存成功当即生效；保存前各端继续用上一份已保存配置。  
- 个人偏好：不因配置保存被改写；偏好语言关闭后，下次进入用当前默认。

## 端职责切分

```text
Admin(ECX-10022)  ──写/校验──►  配置服务(ECX-10021✓)  ◄──读──  vshop(ECX-10023)
                                      ▲
                                      └──读──  web(ECX-10024)
```

- **Admin**：菜单 + 配置 UI + 保存校验 + 离开保护 + 后台语言入口过滤。  
- **Web**：只消费配置；过滤 Header 语言列表；默认语言与 preference 规则。  
- **设计**：Admin 用 HTML 原型；Web **不需要 Figma**。

## 建议实施顺序

1. 确认 ECX-10021 接口字段与 admin 写接口（联调契约）。  
2. 并行：Admin 配置页（ECX-10022）与 Web 消费层（ECX-10024），Web 可对照 vshop 实现。  
3. 三端联调：admin 保存 → vshop/web 入口与默认即时变化。

## 计划文档

- [ECX-10022 Admin Plan](./ECX-10022-admin-language-settings.md)  
- [ECX-10024 Web Plan](./ECX-10024-web-language-application.md)

## 说明

本地 `ecshopx-admin/.agents/skills/shopex-tb-task` 目录为空壳，本次按 Teambition 任务 + `ecshopx_prd` PRD/任务草稿/原型完成需求分析。  
临时 PRD 克隆路径：`ecshopx-admin/.tmp-ecshopx_prd`（可删）。
