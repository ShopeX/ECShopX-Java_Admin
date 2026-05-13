<template>
  <el-form label-position="top" size="small" class="space-y-3">
    <el-form-item label="Tab 名称">
      <el-input :value="settings.tab_label" @input="updateField('tab_label', $event)" />
    </el-form-item>

    <el-form-item label="最多展示商品数">
      <el-input-number
        :value="settings.limit"
        :min="1"
        :max="20"
        controls-position="right"
        @change="updateField('limit', $event)"
      />
    </el-form-item>

    <el-form-item label="已选商品">
      <div v-if="selectedProducts.length === 0" class="py-2 text-xs text-gray-400">
        暂未选择商品，点击下方按钮添加
      </div>
      <div v-else class="mb-2 flex flex-col gap-1.5">
        <div
          v-for="(productId, index) in selectedProducts"
          :key="productId"
          class="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs"
        >
          <span class="min-w-0 flex-1 truncate text-gray-700">{{ productId }}</span>
          <el-button type="text" class="!p-0 text-red-400" @click="removeProduct(index)">
            <X :size="14" />
          </el-button>
        </div>
      </div>

      <el-button plain size="small" @click="openProductPicker">
        <Plus :size="14" class="mr-1" />选择商品
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { Plus, X } from 'lucide-vue'
import { GoodsPicker } from '@/components/sp-picker-plus'
import { normalizeProductTabBlockSettings } from '../utils/panelState.js'

export default {
  name: 'ProductTabBlockPanel',
  components: { Plus, X },
  props: {
    section: { type: Object, default: null },
    block: { type: Object, default: null },
    value: { type: Object, default: () => ({}) }
  },
  computed: {
    settings() {
      return normalizeProductTabBlockSettings(this.value)
    },
    selectedProducts() {
      return Array.isArray(this.settings.product_ids) ? this.settings.product_ids : []
    }
  },
  methods: {
    updateField(field, value) {
      this.$emit('change', { [field]: value })
    },
    removeProduct(index) {
      const next = [...this.selectedProducts]
      next.splice(index, 1)
      this.updateField('product_ids', next)
    },
    async openProductPicker() {
      const result = await this.$dialog.open(GoodsPicker, {
        parent: this,
        title: '选择商品',
        width: '760px',
        props: {
          multiple: true,
          initialSelected: this.selectedProducts.map((id) => ({ item_id: id, item_name: '' }))
        }
      })
      if (!result) return

      const existingIds = new Set(this.selectedProducts)
      const newIds = result.map((product) => product.item_id).filter((id) => !existingIds.has(id))
      this.updateField('product_ids', [...this.selectedProducts, ...newIds])
    }
  }
}
</script>
