<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage v-loading="loading && !dialogVisible" class="user-center-page">
    <el-dialog
      :visible.sync="dialogVisible"
      fullscreen
      custom-class="user-center-app-dialog"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="handleDialogClosed"
    >
      <div v-loading="loading" class="appcenter-embed">
        <div class="appcenter-hero" :style="heroStyle">
          <div class="appcenter-badge">应用中心</div>
          <h1>{{ pageInfo.title || channel }}</h1>
          <p v-if="pageInfo.description">{{ pageInfo.description }}</p>
        </div>

        <div
          v-if="!loading && goodsList.length === 0"
          class="appcenter-empty"
        >
          {{ pageInfo.empty_text || '暂无可展示应用' }}
        </div>
        <div v-else class="appcenter-items appcenter-layout-grid">
          <div
            v-for="item in goodsList"
            :key="item.goods_bn"
            class="appcenter-card"
            :data-goods-bn="item.goods_bn"
          >
            <div class="appcenter-card-main">
              <h2>{{ item.display_name || item.goods?.name }}</h2>
              <p>{{ item.goods_bn }}</p>
              <div class="appcenter-meta">
                <span>商品 BN：{{ item.goods?.bn || item.goods_bn }}</span>
                <span>价格：¥{{ formatPrice(item.goods?.price) }}</span>
              </div>
            </div>
            <form class="appcenter-buy-form" @submit.prevent="handleBuy(item)">
              <button
                type="submit"
                class="appcenter-action"
                :disabled="buyingBn === item.goods_bn"
                data-appcenter-buy="1"
              >
                {{ buyingBn === item.goods_bn ? '处理中...' : '立即购买' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </el-dialog>
  </SpPage>
</template>

<script>
import '@/styles/appcenter-embed.css'
import {
  getAppcenterUrl,
  getUsercenterAuthorizeUrl,
  getAppcenterGoods,
  loginUsercenter
} from '@/api/company'
import {
  isUsercenterLoggedIn,
  setUsercenterLoginSuccess
} from '@/utils/usercenter-storage'

export default {
  data() {
    return {
      dialogVisible: false,
      loading: false,
      buyingBn: '',
      pageInfo: {},
      goodsList: [],
      openBaseUrl: '',
      channel: 'ecshopx'
    }
  },
  computed: {
    heroStyle() {
      const color = this.pageInfo.theme_color || '#2f80ed'
      return { background: color }
    }
  },
  mounted() {
    this.initPage()
  },
  methods: {
    async initPage() {
      const code = (this.$route.query.code || '').trim()
      if (code) {
        const redirected = await this.exchangeCodeAndLogin(code)
        if (redirected) {
          return
        }
      }

      if (isUsercenterLoggedIn()) {
        this.loading = true
        try {
          await this.redirectToAppcenter()
          return
        } catch (error) {
          this.$message.error(this.resolveErrorMessage(error))
        } finally {
          this.loading = false
        }
      }

      this.dialogVisible = true
      await this.loadGoods()
    },
    async exchangeCodeAndLogin(code) {
      this.loading = true
      try {
        await loginUsercenter({ code })
        setUsercenterLoginSuccess()
        await this.$router.replace({ path: this.$route.path, query: {} })
        this.$message.success('授权登录成功')
        await this.redirectToAppcenter()
        return true
      } catch (error) {
        this.$message.error(this.resolveErrorMessage(error))
        await this.$router.replace({ path: this.$route.path, query: {} })
        return false
      } finally {
        this.loading = false
      }
    },
    async redirectToAppcenter() {
      const urlResponse = await getAppcenterUrl()
      const urlData = urlResponse?.data?.data
      const appcenterUrl =
        (typeof urlData === 'string' ? urlData : '') || urlData?.url || ''
      if (!appcenterUrl) {
        throw new Error('获取用户中心地址失败')
      }
      window.location.href = appcenterUrl
    },
    async loadGoods() {
      this.loading = true
      try {
        const goodsRes = await getAppcenterGoods()
        const data = goodsRes?.data?.data || {}
        this.pageInfo = data.page || {}
        this.goodsList = Array.isArray(data.items) ? data.items : []
        this.channel = data.channel || 'ecshopx'
        this.openBaseUrl = (data.open_base_url || '').replace(/\/$/, '')
      } catch (error) {
        this.$message.error(this.resolveErrorMessage(error))
        this.goodsList = []
      } finally {
        this.loading = false
      }
    },
    async handleBuy(item) {
      if (this.buyingBn) return
      this.buyingBn = item.goods_bn
      try {
        const response = await getUsercenterAuthorizeUrl()
        const data = response?.data?.data
        const url = (typeof data === 'string' ? data : '') || data?.url || ''
        if (!url) {
          this.$message.error('获取授权链接失败')
          return
        }
        window.location.href = url
      } catch (error) {
        this.$message.error(this.resolveErrorMessage(error))
      } finally {
        this.buyingBn = ''
      }
    },
    formatPrice(price) {
      const num = Number(price)
      if (Number.isNaN(num)) return price || '0.00'
      return num.toFixed(2)
    },
    resolveErrorMessage(error) {
      return (
        error?.data?.data?.message ||
        error?.data?.message ||
        error?.response?.data?.data?.message ||
        error?.response?.data?.message ||
        error?.message ||
        '操作失败'
      )
    },
    handleDialogClosed() {
      if (this.$route.query.code) return
      this.$router.back()
    }
  }
}
</script>

<style lang="scss">
.user-center-app-dialog {
  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    padding: 0;
    height: 100vh;
    overflow: auto;
    background: #f5f7fb;
  }
}
</style>

<style lang="scss" scoped>
.user-center-page {
  min-height: 0;
}
</style>
