# style-utils 说明

**位置**: `src/view/decorate/comps/style-utils.js`

根据挂件或配置的 **value**（含 outerMargin、outerBackground、innerPadding、innerBackground）计算可直接绑定到 DOM 的 style 对象。**当前主要在装修挂件使用**，可复用于任何采用相同 value 结构的组件。

## 数据格式

- **outerMargin / innerPadding**: `{ paddedt, paddedb, paddedl, paddedr }`（单位 px）
- **outerBackground**: `{ color, image }`
- **innerBackground**: `{ type: 'solid'|'gradient', color, startColor, endColor }`

同时支持「新格式」（单独 outerBackground/innerBackground）与「旧格式」（背景在 outerMargin/innerPadding 的 bgType、bgColor、bgPic 等）。

## API

### getOuterStyle(value)

计算外层样式（外边距 + 外背景）。返回含 padding、backgroundColor、backgroundImage 等 style 对象。

### getInnerStyle(value)

计算内层样式（内边距 + 内背景）。返回结构同上。

```javascript
import { getOuterStyle, getInnerStyle } from '../../comps/style-utils'
computed: {
  outerStyle() { return getOuterStyle(this.value) },
  innerStyle() { return getInnerStyle(this.value) }
}
```

模板中 `:style="outerStyle"`、`:style="innerStyle"`。

## 使用场景（项目内）

- **装修挂件**：多数 wgt 的 index.vue（wgt_film、wgt_coupon、wgt_shop、wgt_speedkill、wgt_ranking、wgt_classify、wgt_store-alphabet 等）在 computed 中调用并绑定到根/内层节点。
- **其他业务**：任何组件若 value 结构与上述一致，可直接复用 getOuterStyle/getInnerStyle。
