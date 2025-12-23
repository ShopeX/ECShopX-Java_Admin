<style lang="scss" src="./index.scss"></style>
<template>
  <div class="wgt-shop" :style="outerStyle">
    <div :class="['wgt-shop-container-list', { 'wgt-shop-container-list-single': (value.data || []).length === 1 }]">
      <div
        v-for="(item, index) in (value.data || [])"
        :key="index"
        class="wgt-shop-item"
        :style="innerStyle"
      >
        <div class="shop-header">
          <div class="shop-info">
            <div class="shop-logo">
              <img :src="item?.logo || item?.distributor?.logo || defaultShopLogo" alt="店铺logo">
            </div>
            <div class="shop-name">{{ item?.name || item?.distributor_name || 'ADIDAS' }}</div>
          </div>
          <div class="shop-actions">
            <div class="favorite-btn">
              <i class="el-icon-star-off" />
            </div>
            <div class="enter-shop-btn">进店逛逛</div>
          </div>
        </div>
        <div class="shop-products">
          <div v-for="(product, productIndex) in distributorData" :key="productIndex" class="product-item">
            <div class="product-image">
              <el-image
                :src="product?.pics && product?.pics.length > 0 ? product?.pics[0] : ''"
                alt="商品图片"
              >
                <div slot="error" class="image-slot" />
              </el-image>
            </div>
            <div class="product-title">{{ product?.item_name || '商品名称' }}</div>
            <div class="product-tags">
              <span
                v-for="(tag, tagIndex) in product?.tags || ['4折', '活动标']"
                :key="tagIndex"
                class="tag"
                :class="'tag-' + tagIndex"
                >{{ tag }}</span
              >
            </div>
            <div class="product-price">
              <span class="current-price-symbol">¥</span>
              <span class="current-price">{{ product?.price ? (product.price / 100) : '0.00' }}</span>
              <span v-if="product?.market_price" class="original-price">{{ product.market_price / 100 }}</span>
            </div>
          </div>
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
      defaultShopLogo,
      distributorData: []
    }
  },
  computed: {
    outerStyle() {
      const { outerMargin, outerBackground } = this.value
      return {
        paddingTop: outerMargin.paddedt + 'px',
        paddingBottom: outerMargin.paddedb + 'px',
        backgroundColor: outerBackground.color,
        backgroundImage: outerBackground.image ? `url(${outerBackground.image})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    },
    innerStyle() {
      const { innerPadding, innerBackground } = this.value
      return {
        paddingLeft: innerPadding.paddedl + 'px',
        paddingRight: innerPadding.paddedr + 'px',
        paddingTop: innerPadding.paddedt + 'px',
        paddingBottom: innerPadding.paddedb + 'px',
        backgroundColor: innerBackground?.type == 'solid' ? innerBackground.color : 'none',
        backgroundImage:
          innerBackground?.type == 'gradient'
            ? `linear-gradient(${innerBackground.startColor}, ${innerBackground.endColor})`
            : 'none'
      }
    }
  },
  watch: {
    'value.data': {
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          this.getList()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    async getList() {
      if (!this.value?.data || this.value.data.length === 0) {
        this.distributorData = []
        return
      }
      
      const query = {
        data_type: 'distributor',
        data_value: this.value.data[0]?.distributor_id
      }
      // TODO: 调用接口获取商品数据
      // const res = await this.$api.template.getShelvesGoods(query)
      // this.distributorData = res?.data || []
      this.distributorData = [1,2,3,4]
    }
  }
}
</script>
