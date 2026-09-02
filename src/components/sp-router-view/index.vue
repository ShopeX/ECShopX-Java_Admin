<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="sp-router-view">
    <!--
      必须用 v-show 而不是 v-if/互斥 render：
      从子路由返回列表时若销毁再挂载 slot，重页面（多 Tab/表格/弹框）会主线程卡死。
      v-show 保活列表，仅切换显示，避免 ECX-9651 / ECX-9845 类问题。
    -->
    <div v-show="!showRouterView" class="sp-router-view__list">
      <slot />
    </div>
    <router-view v-show="showRouterView" :key="routerViewKey" />
  </div>
</template>

<script>
export default {
  name: 'SpRouterView',
  data() {
    return {
      currentRoute: null
    }
  },
  computed: {
    routeViewDepth() {
      const depth = this.$parent?.$vnode?.data?.routerViewDepth
      return typeof depth === 'number' ? depth : null
    },
    showRouterView() {
      const { matched } = this.$route
      if (this.routeViewDepth !== null) {
        return matched.length > this.routeViewDepth + 1
      }
      // SpRouterView 常包在 SpPage 等中间层内，需向上找到真正的路由页面实例
      let parent = this.$parent
      while (parent) {
        const parentIndex = matched.findIndex(
          (record) => record.instances && record.instances.default === parent
        )
        if (parentIndex !== -1) {
          return matched.length > parentIndex + 1
        }
        parent = parent.$parent
      }
      // 兜底：常见列表子页 path（含店铺支付配置等）
      return /\/(editor|detail|info|details|wxpaysetting|alipaysetting|template|storeupload)(?:\/|$)/i.test(
        this.$route.path
      )
    },
    routerViewKey() {
      return this.showRouterView ? this.$route.fullPath : 'sp-router-view-list'
    }
  },
  created() {
    this.currentRoute = this.$route
  },
  methods: {
    onActivated(resetPage) {
      let parent = this.$parent
      while (parent) {
        if (typeof parent.$activated === 'function') {
          parent.$activated(this.currentRoute, this.$route, resetPage)
          return
        }
        parent = parent.$parent
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
