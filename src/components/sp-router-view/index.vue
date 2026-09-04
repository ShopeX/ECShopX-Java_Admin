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
function findHostMatchedIndex(vm, matched) {
  let parent = vm.$parent
  while (parent) {
    const index = matched.findIndex(
      (record) => record.instances && record.instances.default === parent
    )
    if (index !== -1) return index
    parent = parent.$parent
  }
  return -1
}

function findHostRouterViewDepth(vm) {
  let parent = vm.$parent
  while (parent) {
    const depth = parent.$vnode?.data?.routerViewDepth
    if (typeof depth === 'number') return depth
    parent = parent.$parent
  }
  return null
}

export default {
  name: 'SpRouterView',
  data() {
    return {
      currentRoute: null
    }
  },
  computed: {
    // 只看「当前匹配是否深过本列表页」，不看路径叫 editor 还是 alipaysetting
    showRouterView() {
      const { matched } = this.$route
      const hostIndex = findHostMatchedIndex(this, matched)
      if (hostIndex !== -1) {
        return hostIndex < matched.length - 1
      }
      const depth = findHostRouterViewDepth(this)
      if (depth !== null) {
        return matched.length > depth + 1
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
