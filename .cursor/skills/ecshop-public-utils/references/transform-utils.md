# transform-utils 说明

**位置**: `src/view/decorate/comps/transform-utils.js`

用于挂件或类似结构的 config 中，统一处理 **base** 内样式字段的 rpx ↔ px 转换及字段提取。**当前主要在装修挂件使用**，可复用于任何采用相同 base 数据结构的业务。

## 单位约定

- 后端存储：rpx（rpx = px × 2）
- 前端使用：px
- transformIn：rpx → px（`transformInBase`）
- transformOut：px → rpx（`createTransformOutBase` 内部）

## API

### transformInBase(base, styleKeys)

将后端 base 中指定样式键从 rpx 转为 px。用于 `transformIn`。

- **base**: 后端返回的 base 对象
- **styleKeys**: 要转换的键数组，如 `['outerMargin', 'innerPadding']`
- **返回**: 新 base 对象（其余键原样保留）

```javascript
transformIn: (v) => {
  const { name, base, data } = v
  const transformedBase = transformInBase(base, ['outerMargin', 'innerPadding'])
  return { name, ...transformedBase, data }
}
```

### createTransformOutBase(baseKeys, styleKeys)

返回函数 `(v) => baseData`：从 value 中提取 base 的指定键，并将样式键从 px 转为 rpx。用于 `transformOut` 的 base 字段。

- **baseKeys**: 要提取的键
- **styleKeys**: 其中需做 px→rpx 的键
- **返回**: 函数，传入当前 value，返回要写回后端的 base 对象

```javascript
transformOut: (v) => {
  return pickBy(v, {
    name: 'name',
    base: (v) => createTransformOutBase(
      ['outerMargin', 'innerPadding', 'outerBackground', 'innerBackground'],
      ['outerMargin', 'innerPadding']
    )(v),
    data: 'data'
  })
}
```

### convertRpxToPx(marginObj) / convertPxToRpx(marginObj)

单对象单位转换；一般直接用 `transformInBase` / `createTransformOutBase` 即可。

## 使用场景（项目内）

- **装修挂件**：所有带 base 的 wgt config 的 transformIn/transformOut（见各 `wgts/*/config.js`）。
- **其他业务**：只要采用相同的 base 结构（含 outerMargin、innerPadding 等），均可复用本工具。
