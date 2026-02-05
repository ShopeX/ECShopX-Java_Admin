# 公共组件使用场景（全项目）

本文档按**业务/模块**列出各公共组件的使用位置与场景，便于检索与复用。

## SpImagePicker 使用场景

| 模块/业务 | 文件 | 场景 |
|-----------|------|------|
| 装修 | 多挂件 config（标题图、背景图、轮播图等）、attr-item、attr-hotsetting、locationModule/contentPartition nav-item、floorImg/attr-imgList、showcase/attr-item | 配置项选图 |
| 商品 | view/goods/index.vue、SkuParams.vue | 商品图、SKU 图 |
| 商品排行榜 | view/mall/goods/ranking/index.vue | 背景图 |
| 会员 | member/ugc/ugcNotesEditor、member/purchase/company、member/comps/cpViplevel/cpLevel、member/promotions（会员卡、注册、满赠等）、member/selfservice、member/groups/add | 头像/背景/活动图 |
| 营销 | marketing/lottery/editorSchema、marketing/employee/purchase | 活动图、分享图 |
| 小程序 | wxapp/home、wxapp/customPage、wxapp/category、wxapp/shopInfo、wxapp/classificationTemplate | 模板图、图标、分类图 |
| 商户 | merchant/store.vue | 店铺图 |
| 积分商城 | applications/pointmall/add.vue | 商品/活动图 |
| 推广 | popularize/setting.vue | 图片 |
| 内容 | content/soft-article（配合 picker） | - |
| 基础 | base/screen/openScreenAD.vue | 开屏广告图 |
| 表单 | components/sp-form-plus/form-field.js | 表单项 type 为图片时渲染 SpImagePicker |
| 模板/富文本 | template_editor/tab_bar_new、sp-rich-text、utils/vue-h5-editor | 编辑器中选图 |
| 组件内部 | components/sp-image-picker/index.vue | 内部调 $picker.image |

## SpVideoPicker 使用场景

| 模块/业务 | 文件 | 场景 |
|-----------|------|------|
| 装修 | wgt_film/config、wgt_slider/sliderDialog | 视频挂件、轮播视频项 |
| 商品 | view/goods/index.vue | 商品视频 |
| 会员 UGC | member/ugc/ugcNotesEditor.vue | 笔记视频 |
| 组件内部 | components/sp-video-picker/index.vue | 内部调 $picker.video |

## CompPickerLink / 路径选择 使用场景

| 模块/业务 | 文件 | 场景 |
|-----------|------|------|
| 装修 | comps/comp-pickerLink.vue、多挂件 config（更多链接）、wgt-page/attr-hotsetting、wgt_slider/attr-item、locationModule/comp_pickerLink、contentPartition/comp_pickerLink | 配置跳转链接（路径或 H5+埋点） |
| 小程序统计 | wxapp/statistics/sourcemanagement/monito_list.vue | 路径选择 |

## CompButton / CompBtn / AttrStore 使用场景

| 组件 | 主要文件 | 场景 |
|------|----------|------|
| CompButton | 装修 wgt_coupon/config、attr-data、attr-store、attr-label、attr-goods、goods-attr/attr-data、wgt-page/attr-hotsetting、wgt_hotzone/attr-hotsetting | 占位+数量展示，点击调 $picker |
| CompBtn | 装修 wgt_coupon/config（领取按钮样式） | 按钮颜色/文字色/图 |
| AttrStore | 装修 wgt_shop、wgt_store 的 config + attr-store.vue | 店铺选择（内部用 CompButton+$picker.store/shop） |

## CompStyle / configsetting 使用场景

| 用途 | 文件 | 场景 |
|------|------|------|
| configsetting | 装修所有挂件 config.js 末尾 | 自动注入 outerMargin、innerPadding、tags、track，并处理 compStyle 配置项 |
| CompStyle | configsetting.js、comp_style.vue（内嵌 SpImagePicker 做背景图） | 边距与背景配置；locationModule/contentPartition 从 outerMargin/navitemarea 读背景与内边距 |

以上为检索得到的实际使用场景；新增业务可参照同类型场景接入。
