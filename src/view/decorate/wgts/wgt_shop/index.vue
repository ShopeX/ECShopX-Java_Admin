<style lang="scss" src="./index.scss"></style>
<template>
  <div class="wgt-shop" :style="outerStyle">
    <div v-if="value.displayType == 'horizontal'" :class="['wgt-shop-container-list', { 'wgt-shop-container-list-single': value.data.length == 1 }]">
      <div
        v-for="(item, index) in value.data"
        :key="index"
        class="wgt-shop-item"
        :style="innerStyle"
      >
        <div class="shop-header">
          <div class="shop-info">
            <div class="shop-logo">
              <img :src="value.distributor?.logo || defaultShopLogo" alt="店铺logo">
            </div>
            <div class="shop-name">{{ item?.name || 'ADIDAS' }}</div>
          </div>
          <div class="shop-actions">
            <div class="favorite-btn">
              <i class="el-icon-star-off" />
            </div>
            <div class="enter-shop-btn">进店逛逛</div>
          </div>
        </div>
        <div class="shop-products">
          <div v-for="(item, index) in distributorData" :key="index" class="product-item">
            <div class="product-image">
              <el-image
                :src="item?.pics && item?.pics.length > 0 ? item?.pics[0] : ''"
                alt="商品图片"
              >
                <div slot="error" class="image-slot" />
              </el-image>
            </div>
            <div class="product-title">{{ item?.item_name || '商品名称' }}</div>
            <div class="product-tags">
              <span
                v-for="(tag, tagIndex) in item?.tags || ['4折', '活动标']"
                :key="tagIndex"
                class="tag"
                :class="'tag-' + tagIndex"
                >{{ tag }}</span
              >
            </div>
            <div class="product-price">
              <span class="current-price-symbol">¥</span>
              <span class="current-price">{{ item?.price / 100 }}</span>
              <span class="original-price">{{ item?.market_price / 100 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="wgt-shop-container-alphabet">
      <div class="brand-list" :style="innerStyle">
        <!-- 品牌组A -->
        <div v-for="(item, index) in brandList" :key="index" class="brand-group">
          <div class="category-header">
            <div class="letter-index">{{ item.title }}</div>
            <span v-if="index == 0" class="all-category">全部品类</span>
          </div>
          <div v-for="(item, index) in item.items" :key="index" class="brand-items">
            <div class="brand-item">
              <el-image :src="item?.imgUrl" alt="品牌图片" class="brand-image">
                <div slot="error" class="image-slot" />
              </el-image>
              <div class="brand-info">
                <div class="brand-info-top">
                  <div class="brand-name">{{ item.name }}</div>
                  <div class="brand-tag">{{ item.tag }}</div>
                </div>
                <div class="brand-meta">{{ item.meta }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧字母导航 -->
      <div class="alphabet-nav">
        <div v-for="letter in letterList" :key="letter" class="letter-item">
          {{ letter }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from './config'
const defaultShopLogo = require('@/assets/imgs/decorate/default-shop-logo.png')
export default {
  name: 'Shop',
  wgtName: '店铺',
  wgtDesc: '',
  wgtIcon: 'wgt-store',
  wgtType: 2,
  config: config,
  props: {
    value: [Object, Array]
  },
  data() {
    return {
      currentIndex: 1,
      defaultShopLogo,
      defaultBrandList: [
        {
          imgUrl: '',
          name: 'AW 品牌名称',
          tag: '品牌活动标签',
          first_letter: 'A',
          meta: '品牌分类 | 在售200件商品',
          isAuto: true
        },
        {
          imgUrl: '',
          name: 'ACNE STUDIOS',
          tag: '低至6.7折',
          first_letter: 'A',
          meta: '品牌分类 | 在售200件商品',
          highlight: true
        },
        {
          imgUrl: '',
          name: 'ADIDAS',
          tag: '低至6.7折',
          first_letter: 'A',
          meta: '品牌分类 | 在售200件商品'
        },
        {
          imgUrl: '',
          name: 'BRANDNAME',
          tag: '品牌活动标签',
          first_letter: 'B',
          meta: '品牌分类 | 在售200件商品',
          isAuto: true
        },
        {
          imgUrl: '',
          name: 'CELINE',
          tag: '品牌活动标签',
          first_letter: 'C',
          meta: '品牌分类 | 在售200件商品'
        },
        {
          imgUrl: '',
          name: 'CHAMPION',
          tag: '满300减50',
          first_letter: 'C',
          meta: '品牌分类 | 在售200件商品'
        },
        {
          imgUrl: '',
          name: 'CALVIN KLEIN',
          tag: '三件7折',
          first_letter: 'C',
          meta: '品牌分类 | 在售200件商品'
        }
      ],
      distributorData: null
    }
  },
  computed: {
    outerStyle() {
      const { outerMargin = {}, outerBackground = {} } = this.value || {}
      console.log(outerMargin, 'outerMargin')
      return {
        paddingTop: (outerMargin.paddedt || 0) + 'px',
        paddingBottom: (outerMargin.paddedb || 0) + 'px',
        backgroundColor: outerMargin?.bgType == 'solid' ? outerMargin.color : undefined,
        backgroundImage:
        outerMargin?.bgType == 'gradient'
            ? `linear-gradient(${outerMargin.startColor}, ${outerMargin.endColor})`
            : outerMargin?.bgType === 'pic' ? `url(${outerMargin.bgPic})` : undefined,
        backgroundSize: outerMargin?.bgType === 'pic' ? 'cover' : undefined,
        backgroundPosition: outerMargin?.bgType === 'pic' ? 'center' : undefined,
        backgroundRepeat: outerMargin?.bgType === 'pic' ? 'no-repeat' : undefined
      }
    },
    innerStyle() {
      const { innerPadding = {}, innerBackground } = this.value || {}
      console.log(innerPadding, 'innerPadding')
      return {
        paddingLeft: (innerPadding.paddedl || 0) + 'px',
        paddingRight: (innerPadding.paddedr || 0) + 'px',
        paddingTop: (innerPadding.paddedt || 0) + 'px',
        paddingBottom: (innerPadding.paddedb || 0) + 'px',
        backgroundColor: innerPadding?.bgType == 'solid' ? innerPadding.color : undefined,
        backgroundSize: innerPadding?.bgType === 'pic' ? 'cover' : undefined,
        backgroundPosition: innerPadding?.bgType === 'pic' ? 'center' : undefined,
        backgroundRepeat: innerPadding?.bgType === 'pic' ? 'no-repeat' : undefined,
        backgroundImage:
        innerPadding?.bgType == 'gradient'
            ? `linear-gradient(${innerPadding.startColor}, ${innerPadding.endColor})`
            : innerPadding?.bgType === 'pic' ? `url(${innerPadding.bgPic})` : undefined
            
      }
    },
    categoryTitleStyle() {
      const { outerMargin, outerBackground } = this.value
      return {
        top: '0px'
      }
    },
    brandList() {
      // 按字母分组店铺数据
      let list = this.defaultBrandList
      if (this.value.dataType == 'specify') {
        list = this.value?.data || []
      }
      const letterGroups = {}
      if (list.length == 0) {
        return []
      }

      list?.forEach((shop) => {
        const letter = shop.first_letter || '#'
        if (!letterGroups[letter]) {
          letterGroups[letter] = {
            title: letter,
            key: letter,
            items: []
          }
        }

        letterGroups[letter].items.push({
          name: shop.name,
          desc: shop.online_goods_num ? `热卖中 | 在售${shop.online_goods_num}件商品` : '热卖中',
          tag: shop.tag_name && shop.tag_name.length > 0 ? shop.tag_name[0] : '',
          img: shop.logo,
          distributor_id: shop.distributor_id
        })
      })

      // 转换为数组并按字母排序
      const sortedList = Object.values(letterGroups).sort((a, b) => {
        if (a.key < b.key) return -1
        if (a.key > b.key) return 1
        return 0
      })
      return sortedList
    },
    letterList() {
      if (this.value.dataType == 'specify') {
        return this.brandList.map((item) => item.title)
      }
      return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('')
    }
  },
  watch: {
    value:{
      handler(newVal) {
      
      console.log('store-value',newVal)
    },
    immediate: true,
    deep: true
    },
    'value.data': {
      handler(newVal) {
      
        if (newVal.length > 0) {
          this.getList()
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {},
  methods: {
    async getList() {
      const query = {
        data_type: 'distributor',
        data_value: this.value?.data[0]?.distributor_id
      }
      console.log(this.value?.data, 'getSeckdistributorilldata')
      const res = await this.$api.template.getShelvesGoods(query)
      console.log(res, 'getSeckdistributorilldata')
      this.distributorData = res
    }
  }
}
</script>
