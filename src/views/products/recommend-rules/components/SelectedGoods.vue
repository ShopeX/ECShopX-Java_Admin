<template>
  <div class="goods-column">
    <div class="goods-column-head">
      <strong>{{ title }}</strong>
      <el-button size="small" icon="el-icon-plus" @click="$emit('add')">{{ addText }}</el-button>
    </div>
    <div v-if="items.length" class="goods-list">
      <div v-for="item in items" :key="item.itemId" class="selected-good">
        <div class="good-info">
          <div class="good-image">
            <img
              v-if="item.image"
              :src="item.image"
              :alt="item.itemName"
              @error="handleImageError"
            />
            <i class="el-icon-picture-outline" />
          </div>
          <div class="good-detail">
            <strong :title="item.itemName">{{ item.itemName }}</strong>
            <small>
              <span>{{ itemIdLabel }}：{{ item.itemId }}</span>
              <template v-if="item.price !== undefined && item.price !== null">
                <span class="good-divider"> </span>
                <span>{{ priceLabel }}：¥{{ formatPrice(item.price) }}</span>
              </template>
            </small>
          </div>
        </div>
        <el-button
          class="remove-good"
          type="text"
          icon="el-icon-delete"
          @click="$emit('remove', item.itemId)"
        />
      </div>
    </div>
    <div v-else class="goods-empty">{{ emptyText }}</div>
    <div class="goods-column-footer">
      <span class="goods-total"
        >{{ totalLabel }}：<strong>{{ items.length }}</strong></span
      >
    </div>
  </div>
</template>
<script>
export default {
  name: 'SelectedGoods',
  props: {
    title: String,
    items: { type: Array, default: () => [] },
    emptyText: String,
    addText: String,
    itemIdLabel: { type: String, default: 'ID' },
    priceLabel: { type: String, default: 'Price' },
    totalLabel: { type: String, default: 'Total' }
  },
  methods: {
    handleImageError(event) {
      event.target.style.display = 'none'
      event.target.nextElementSibling.style.display = 'block'
    },
    formatPrice(value) {
      const amount = Number(value)
      if (!Number.isFinite(amount)) return value
      return (amount / 100).toFixed(2)
    }
  }
}
</script>
<style scoped>
.goods-column {
  display: flex;
  flex-direction: column;
  height: 580px;
  box-sizing: border-box;
  overflow: hidden;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background: #fff;
}
.goods-column-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 0 0 auto;
  min-height: 52px;
  padding: 8px 14px;
  box-sizing: border-box;
  border-bottom: 1px solid #ebeef5;
  background: #f6f7f9;
  color: #303133;
}
.goods-list {
  flex: 1 1 auto;
  min-height: 0;
  padding: 12px 10px 12px 14px;
  overflow-y: auto;
  scrollbar-width: thin;
}
.selected-good {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 72px;
  padding: 10px 12px;
  margin-bottom: 8px;
  box-sizing: border-box;
  border-radius: 4px;
  background: #f6f7f9;
}
.good-info {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}
.good-image {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 52px;
  width: 52px;
  height: 52px;
  margin-right: 12px;
  overflow: hidden;
  border-radius: 3px;
  background: #ebeef5;
  color: #c0c4cc;
  font-size: 22px;
}
.good-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.good-image img + i {
  display: none;
}
.good-detail {
  flex: 1;
  min-width: 0;
}
.good-info strong,
.good-info small {
  display: block;
}
.good-info strong {
  margin-bottom: 3px;
  overflow: hidden;
  color: #303133;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.good-info small,
.goods-empty {
  color: #909399;
}
.good-info small {
  line-height: 18px;
}
.good-divider {
  display: inline-block;
  width: 12px;
}
.remove-good {
  flex: 0 0 auto;
  margin-left: 12px;
  color: #8b46de;
}
.goods-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 auto;
  min-height: 0;
  text-align: center;
}
.goods-column-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 0 0 auto;
  min-height: 42px;
  padding: 0 14px;
  box-sizing: border-box;
  border-top: 1px solid #ebeef5;
  background: #fafafa;
  color: #909399;
  font-size: 13px;
}
.goods-total {
  color: #909399;
}
.goods-total strong {
  color: #303133;
  font-weight: 500;
}
</style>
