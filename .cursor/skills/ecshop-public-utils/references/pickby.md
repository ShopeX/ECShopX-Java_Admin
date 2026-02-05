# pickBy 说明（全项目）

**位置**: `@/utils`（`src/utils/index.js`）

从**对象**或**数组**中按指定映射提取字段，支持嵌套路径、函数与默认值。全项目通用。

## API

```javascript
import { pickBy } from '@/utils'

pickBy(arrOrObj, keyMaps)
```

- **第一个参数** `arrOrObj`：若为**数组**，则对每一项应用 keyMaps，返回新数组；若为**对象**，则对单个对象应用 keyMaps，返回新对象。
- **第二个参数** `keyMaps`：键名到「如何取值」的映射。取值方式：
  - **字符串**：视为 lodash `get` 的路径，如 `'nested.field'`。
  - **函数**：`(item) => value`，自定义取值。
  - **对象**：`{ key: 'path', default: value }`，取 path 失败时用 default。
  - **其他**：直接作为该键的固定值。

## 使用场景（项目内）

| 场景 | 典型位置 | 用法说明 |
|------|----------|----------|
| 挂件 config transformOut | 各 `wgts/*/config.js` | `pickBy(v, { name: 'name', base: (v) => createTransformOutBase(...)(v), data: 'data' })`，只提交需要的字段并做 base 转换 |
| 选择器返回结果整形 | `components/sp-picker/pickers/picker-path.vue` | 对选择结果 `pickBy(data, { id: 'id', title: 'title', ... })` 统一成路径链接所需结构（多处 tab 分支） |
| 嵌套/函数取值 | 部分 config transformOut | `field: 'nested.field'` 或 `field: (v) => v.xxx` |
| 数组批量映射 | 需对列表做字段映射时 | `pickBy(array, { id: 'id', name: 'name' })` 得到新数组 |

## 示例

```javascript
// 对象：只保留部分字段
pickBy(source, {
  name: 'name',
  data: 'nested.data',
  count: (item) => item.list?.length ?? 0
})

// 数组：每项只保留部分字段
pickBy(list, {
  id: 'id',
  title: 'title'
})
```

项目内大量用于装修挂件 `transformOut` 与 picker-path 的结果整形；其他业务只要需「按映射提取/整形数据」均可使用。
