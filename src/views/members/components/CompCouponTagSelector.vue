<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-dialog
    title="发放优惠券"
    :visible.sync="dialogVisible"
    width="900px"
    :close-on-click-modal="false"
    :append-to-body="true"
    @close="handleClose"
  >
    <div class="coupon-tag-selector">
      <!-- 选择优惠券按钮 -->
      <div class="mb-4">
        <div class="flex items-center">
          <span style="margin-right: 10px;">优惠券:</span>
          <el-button type="primary" @click="onSelectCoupon">选择</el-button>
        </div>
        <!-- 已选优惠券表格 -->
        <div v-if="localSelectedCoupons.length > 0" class="mt-4">
          <div class="font-medium mb-2 text-[#606266]">已选中优惠券：</div>
          <el-table :data="localSelectedCoupons" border size="small" max-height="200">
            <el-table-column prop="title" label="名称" min-width="150" />
            <el-table-column prop="card_type" label="券类型" width="120">
              <template slot-scope="scope">
                <span v-if="scope.row.card_type === 'cash'">满减券</span>
                <span v-else-if="scope.row.card_type === 'discount'">折扣券</span>
                <span v-else-if="scope.row.card_type === 'new_gift'">兑换券</span>
                <span v-else>{{ scope.row.card_type }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80" align="center">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  class="text-red-500"
                  @click="removeCoupon(scope.$index)"
                >
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 选择标签按钮 -->
      <div class="mb-4">
        <div class="flex items-center">
          <span style="margin-right: 10px;">人群标签:</span>
          <el-button type="primary" @click="showTagDialog = true">选择</el-button>
        </div>
        <!-- 已选标签展示 -->
        <div v-if="localSelectedTags.length > 0" class="mt-4">
          <div class="font-medium mb-2 text-[#606266]">已选中人群标签：</div>
          <div class="flex flex-wrap items-center">
            <el-tag
              v-for="(tag, index) in localSelectedTags"
              :key="index"
              closable
              :disable-transitions="false"
              @close="removeTag(index)"
              class="mr-2 mb-2"
            >
              {{ tag.tag_name }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>

    <!-- 选择标签弹框 -->
    <CompTagsMore
      :visible.sync="showTagDialog"
      :selected-tags="localSelectedTags"
      @confirm="handleTagConfirm"
    />

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import CompTagsMore from './CompTagsMore.vue'

export default {
  name: 'CompCouponTagSelector',
  components: {
    CompTagsMore
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectedCoupons: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      showTagDialog: false,
      localSelectedCoupons: [],
      localSelectedTags: []
    }
  },
  watch: {
    visible(newVal) {
      this.dialogVisible = newVal
      if (newVal) {
        this.localSelectedCoupons = JSON.parse(JSON.stringify(this.selectedCoupons || []))
      }
    },
    dialogVisible(newVal) {
      this.$emit('update:visible', newVal)
    }
  },
  methods: {
    async onSelectCoupon() {
      const { data } = await this.$picker.coupon({
        multiple: true,
        data: this.localSelectedCoupons.map(item => item.card_id)
      })
      console.log(data)
      if (data && data.length > 0) {
        this.localSelectedCoupons = data.map(item => ({
          card_id: item.card_id,
          card_type: item.card_type,
          title: item.title
        }))
      }
    },
    handleTagConfirm(tags) {
      this.localSelectedTags = tags || []
    },
    removeCoupon(index) {
      this.localSelectedCoupons.splice(index, 1)
    },
    removeTag(index) {
      this.localSelectedTags.splice(index, 1)
    },
    handleClose() {
      this.dialogVisible = false
      this.$emit('close')
    },
    handleConfirm() {
      // 返回优惠券ID数组和标签ID数组
      const couponIds = this.localSelectedCoupons.map(coupon => coupon.card_id)
      const tagIds = this.localSelectedTags.map(tag => tag.tag_id)
      
      this.$emit('confirm', {
        couponIds,
        tagIds,
        coupons: this.localSelectedCoupons,
        tags: this.localSelectedTags
      })
      this.handleClose()
    }
  }
}
</script>

<style lang="scss" scoped>
.coupon-tag-selector {
  min-height: 200px;
}

::v-deep .el-dialog__body {
  padding: 20px;
}
</style>

