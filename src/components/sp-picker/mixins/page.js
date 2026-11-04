/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
export default {
  data() {
    return {
      pageCur: 1,
      pageCount: 0,
      loading: false
    }
  },
  created() {
    // 允许组件用 prop / 自身 data 覆盖；都没有时默认 18
    if (typeof this.pageSize !== 'number' || this.pageSize <= 0) {
      this.$set(this, 'pageSize', 18)
    }
  },
  computed: {
    pageTotal() {
      if (this.pageCount <= 0) return 1

      const total = Math.ceil(this.pageCount / this.pageSize)
      return total
    }
  },
  methods: {
    async refresh(isReset) {
      if (isReset) {
        this.resetPage()
      }
      await this.goPage(this.pageCur)
    },
    resetPage() {
      this.pageCur = 1
      this.pageCount = -1
    },
    nextPage() {
      return this.goPage(1)
    },
    async goPage(page = 1) {
      if (page > this.pageTotal && this.pageCount !== -1) {
        this.pageCur = this.pageTotal
      } else if (page < 0) {
        this.pageCur = 0
      } else {
        this.pageCur = page
      }
      this.loading = true
      const { count } = await this.fetch({
        page_no: this.pageCur,
        page_size: this.pageSize
      })
      this.loading = false
      this.pageCount = count
    }
  }
}
