/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { VERSION_PLATFORM } from '@/utils'
import WgtSlider from './wgt_slider'
import WgtHotZone from './wgt_hotzone'
import WgtFilm from './wgt_film'
import WgtCoupon from './wgt_coupon'
import WgtShop from './wgt_shop'
import WgtMarquees from './wgt_marquees'
import WgtNearbyShop from './wgt_nearbyShop'
import WgtGoodsCard from './wgt_goodsCard'
import WgtWriting from './wgt_writing'
import WgtHeading from './wgt_heading'
import WgtFullSlider from './wgt_fullSlider'
import wgtOrderNavigation from './wgt_orderNavigation'
import WgtStoreAlphabet from './wgt_store-alphabet'
import WgtClassify from './wgt_classify'
// import WgtShelves from './wgt_shelves'
import WgtLocationModule from './wgt_locationModule'
import WgtSpeedkill from './wgt_speedkill'
import WgtGroup from './wgt_group'
import WgtRanking from './wgt_ranking'
import WgtHotRanking from './wgt_hotranking'
import WgtGoods from './wgt_goods'


// 首页装修
let SCENE_1001 = {
  WgtSlider,
  WgtHotZone,
  WgtFilm,
  WgtCoupon,
  WgtMarquees,
  WgtFullSlider,
  wgtOrderNavigation,
  WgtStoreAlphabet,
  WgtClassify,
  WgtLocationModule,
  WgtSpeedkill,
  WgtGroup,
  WgtRanking,
  WgtHotRanking,
  WgtGoods
}

if (VERSION_PLATFORM()) {
  SCENE_1001 = {
    ...SCENE_1001,
    WgtShop,
    WgtNearbyShop
  }
}

// 商品详情
const SCENE_1002 = {
  WgtSlider,
  WgtFilm,
  WgtHotZone
}

// 店铺装修
const SCENE_1003 = {
  WgtSlider,
  WgtHotZone,
  WgtFilm,
  WgtCoupon,
  WgtMarquees,
  WgtShop,
  WgtNearbyShop,
  WgtStoreAlphabet,
  WgtClassify
}

// 自定义页面装修
const SCENE_1004 = SCENE_1001

// 软文
const SCENE_1005 = {
  WgtSlider,
  WgtFilm,
  WgtGoodsCard,
  WgtWriting,
  WgtHeading
}

// ibs导航
const SCENE_1006 = {
  WgtSlider,
  WgtHotZone,
  WgtFilm,
  WgtCoupon
}

// 个人中心
const SCENE_1008 = {
  WgtSlider,
  WgtHotZone,
  WgtFilm,
  WgtMarquees,
  wgtOrderNavigation
}

// 分类页面
const SCENE_1007 = {
  WgtSlider,
  WgtHotZone,
  WgtFilm,
  WgtShop,
  WgtClassify,
  // WgtTask
}

const SCENE_1009 = {
  WgtSlider,
  WgtHotZone
}

export default {
  1001: SCENE_1001,
  1002: SCENE_1002,
  1003: SCENE_1003,
  1004: SCENE_1004,
  1005: SCENE_1005,
  1006: SCENE_1006,
  1007: SCENE_1007,
  1008: SCENE_1008,
  1009: SCENE_1009
}
