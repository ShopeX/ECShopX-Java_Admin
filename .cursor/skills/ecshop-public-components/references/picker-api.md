# $picker 选择器 API（全项目）

`this.$picker` 为全局选择弹窗，在各业务中用于选择图片、视频、商品、店铺、优惠券、路径等。返回多为 `{ data }`，具体结构依方法不同。

## 方法一览与使用模块

| 方法 | 说明 | 典型使用模块/文件 |
|------|------|-------------------|
| `$picker.image(options)` | 图片选择 | 装修多挂件、商品、会员、营销、小程序、商户、积分商城、推广、富文本、模板编辑、开屏广告、sp-image-picker 内部 |
| `$picker.video(options)` | 视频选择 | 装修、sp-video-picker 内部 |
| `$picker.path(params)` | 路径/链接选择 | 装修 comp-pickerLink、locationModule/contentPartition 本地 comp_pickerLink、小程序统计 monito_list |
| `$picker.coupon(options)` | 优惠券选择 | 装修 wgt_coupon、自动营销 gift-coupon-list |
| `$picker.couponV2` / `$picker.couponPackage` | 优惠券 V2/包 | 营销 lottery/editor |
| `$picker.mobCard(options)` |  mobile 卡券 | 装修 wgt_coupon/attr-data |
| `$picker.store(options)` / `$picker.shop(options)` | 店铺选择 | 装修 attr-store/attr-goods、设置配送/自提、商城商品列表/白名单/售后地址、商户自提、sp-select-shop |
| `$picker.goods(options)` | 商品选择 | 装修 attr-goods、会员满赠、商城社区商品 |
| `$picker.goodsitem(options)` | 商品项选择 | 装修 goods-attr/attr-data、商品主分类 params、内容软文 |
| `$picker.goodsList` / `$picker.goodsSku` | 商品列表/SKU | 营销员工 addGoods |
| `$picker.goodsParams` | 商品参数 | 商品 mainCategory |
| `$picker.category` / `$picker.saleCategory` | 分类/销售分类 | 装修 classify、goods-attr/attr-data |
| `$picker.tag(options)` | 标签选择 | 装修 attr-label、nearbyShop product-label |
| `$picker.editBoard` | 编辑看板 | 装修 attr-goods、attr-label、goodsGrid 等 |
| `$picker.seckill` / `$picker.groups` / `$picker.ranking` / `$picker.activityCollection` | 秒杀/拼团/榜单/活动集合 | 装修 goods-attr/attr-data、wgts attr-goods |
| `$picker.planting(options)` | 软文 | 装修 marquees/attr_vertical |
| `$picker.widget(options)` | 挂件选择 | 装修 locationModule/contentPartition nav-item、pc/index |
| `$picker.pages(options)` | 页面选择 | 设置 publicsetting、小程序 home、store 规则、template_editor tab_bar_new、mallList |
| `$picker.crowds(options)` | 人群选择 | 组件 crowdSelectV2 |
| `$picker.supplier(options)` | 供应商 | 组件 sp-select-supplier |
| `$picker.afterSalesList` | 售后单列表 | 商户 RefundGoodsStore、商城 distributor ReturnGoodsForm |
| `$picker.zitiList(options)` | 自提点列表 | 商户 DaoDianZiti、商城 distributor_editor |
| `$picker.company(params)` | 企业 | 营销员工 purchase |
| `$picker.template(options)` | 模板 | 营销员工 purchase |

## 调用约定

- 常见形式：`const { data } = await this.$picker.xxx({ ...params })`，部分返回 `res` 或直接结构。
- 装修内与表单内常用：传入当前已选值（如 `data: currentValue`）、`multiple`、业务参数（如 `regionauth_id`、`params`）。
- 路径选择：`$picker.path({ data, tab, multiple, guide })`，guide 用于导购模板等。

详细入参以各 picker 组件或业务文件为准；新业务接入时可直接参考同类型已有调用处。
