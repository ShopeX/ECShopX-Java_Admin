<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div v-loading="loading" class="order-list-table">
    <div class="order-list-table__track">
      <div class="order-list-table__head">
        <div class="col col--goods order-list-table__head-goods">
          <el-checkbox
            v-if="showSelection"
            :value="isAllSelected"
            :indeterminate="isIndeterminate"
            class="order-card__check"
            :disabled="!list.length"
            @change="onToggleAll"
          />
          <span>{{ $t('b64cb62b.b433e6') }}</span>
        </div>
        <div class="col col--amount">{{ $t('b64cb62b.bf7eab') }}</div>
        <div class="col col--buyer">{{ $t('b64cb62b.bd8cfd') }}</div>
        <div class="col col--delivery">{{ $t('c95ea121.edfe4c') }}</div>
        <div class="col col--status">{{ $t('c95ea121.86f6cf') }}</div>
        <div class="col col--actions">{{ $t('c95ea121.2b6bc0') }}</div>
      </div>

      <div v-if="!list.length && !loading" class="order-list-table__empty">
        <el-empty :description="$t('abb938aa.21efd8')" />
      </div>

      <div v-for="row in list" :key="row.order_id" class="order-card">
        <div class="order-card__meta-left">
          <el-checkbox
            v-if="showSelection"
            :value="isSelected(row)"
            class="order-card__check"
            @change="(val) => onToggle(row, val)"
          />
          <span class="order-card__id"> {{ $t('b64cb62b.a1e65c') }}{{ row.order_id }} </span>
          <a
            v-clipboard:copy="row.order_id"
            v-clipboard:success="onCopySuccess"
            class="order-card__chip"
            href="javascript:;"
          >
            {{ $t('b64cb62b.79d3ab') }}
          </a>
          <span class="order-card__sep">|</span>
          <span class="order-card__shop">
            {{ $t('b64cb62b.8ceef6') }}{{ row.distributor_name
            }}<template v-if="row.distributor_id"> ({{ row.distributor_id }})</template>
          </span>
          <span class="order-card__sep">|</span>
          <span class="order-card__time">
            {{ $t('b64cb62b.15f438') }}{{ row.create_time | datetime('YYYY-MM-DD HH:mm:ss') }}
          </span>
          <span class="order-card__sep">|</span>
          <span class="order-card__type">{{ getOrderHolderLabel(row) }}</span>
        </div>
        <div class="order-card__meta-right">
          <router-link
            class="order-card__chip"
            :to="`${detailBase}/detail?orderId=${row.order_id}&resource=${resolvedDetailResource}`"
          >
            {{ $t(detailLabel) }}
          </router-link>
          <a
            v-if="hasAction(row, 'remark')"
            class="order-card__chip"
            href="javascript:;"
            @click.prevent="$emit('action', row, { key: 'remark', name: 'c95ea121.2432b5' })"
          >
            {{ $t('c95ea121.2432b5') }}
          </a>
          <router-link
            v-if="showProcess"
            class="order-card__chip"
            :to="`${detailBase}/process?orderId=${row.order_id}&resource=${$route.path}`"
          >
            {{ $t(processLabel) }}
          </router-link>
        </div>

        <div class="col col--goods">
          <div
            v-for="(item, idx) in getItems(row)"
            :key="`${row.order_id}-${idx}`"
            class="goods-row"
          >
            <div class="goods-row__pic-wrap">
              <el-image class="goods-row__pic" :src="item.pic || item.item_pic" fit="cover" />
              <span v-if="isItemShipped(item)" class="goods-row__shipped">{{
                $t('e3a5dbf4.355409')
              }}</span>
            </div>
            <div class="goods-row__info">
              <div class="goods-row__name" :title="item.item_name">
                {{ item.item_name || item.name }}
              </div>
              <div v-if="item.item_spec_desc || item.spec_desc" class="goods-row__spec">
                {{ item.item_spec_desc || item.spec_desc }}
              </div>
            </div>
            <div class="goods-row__price">
              <div class="goods-row__fee">
                {{
                  getItemPriceText
                    ? getItemPriceText(item)
                    : `￥${formatFee(item.price != null ? item.price : item.total_fee / (item.num || 1))}`
                }}
              </div>
              <div class="goods-row__num">{{ item.num }}{{ $t('b64cb62b.f7edf5') }}</div>
            </div>
          </div>
          <div v-if="!getItems(row).length" class="goods-row goods-row--empty">-</div>
        </div>

        <div class="col col--amount">
          <div class="amount-cell">
            <div class="amount-main">
            {{ getAmountText ? getAmountText(row) : formatFee(getTotalFee(row)) }}
          </div>
            <div v-if="getPayType(row)" class="amount-pay">{{ getPayType(row) }}</div>
          </div>
        </div>

        <div class="col col--buyer">
          <div class="buyer-cell">
            <div class="buyer-row">
              <span class="buyer-label">{{ $t('b64cb62b.f7f68c') }}</span>
              <span class="buyer-name">{{ getBuyerName(row) }}</span>
            </div>
            <div class="buyer-receiver">
              <span class="buyer-label">{{ $t('b64cb62b.5721ab') }}</span>
              <span class="buyer-receiver__value">
                {{ row.receiver_name || '-' }}
                <template v-if="row.receiver_mobile">　{{ row.receiver_mobile }}</template>
              </span>
            </div>
          </div>
        </div>

        <div class="col col--delivery">
          <span class="delivery-text">{{ getDeliveryLabel(row) }}</span>
        </div>

        <div class="col col--status">
          <span class="status-text">{{ row.order_status_msg }}</span>
        </div>

        <div class="col col--actions">
          <div class="action-btns">
            <el-button
              v-for="(btn, index) in visibleActions(row)"
              :key="`act-${index}`"
              :type="isPrimaryAction(btn.key) ? 'primary' : 'default'"
              size="mini"
              class="action-btn"
              :class="isPrimaryAction(btn.key) ? 'action-btn--primary' : 'action-btn--default'"
              @click="$emit('action', row, btn)"
            >
              {{ actionLabel(btn) }}
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { PAY_TYPE } from '@/consts'

const HEADER_ACTION_KEYS = ['remark']
const PRIMARY_ACTION_KEYS = [
  'deliverGoods',
  'writeOff',
  'takeOrder',
  'updatedelivery',
  'confirmpackag'
]
// 发货、自提核销固定靠前
const FRONT_ACTION_KEYS = ['deliverGoods', 'writeOff']

export default {
  name: 'OrderListTable',
  props: {
    list: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Array,
      default: () => []
    },
    getDistributionType: {
      type: Function,
      required: true
    },
    getOrderCategoryName: {
      type: Function,
      default: () => () => ''
    },
    showSelection: {
      type: Boolean,
      default: true
    },
    showProcess: {
      type: Boolean,
      default: true
    },
    detailLabel: {
      type: String,
      default: 'b64cb62b.5b48db'
    },
    processLabel: {
      type: String,
      default: 'c95ea121.456d29'
    },
    detailResource: {
      type: String,
      default: ''
    },
    // 自定义金额展示（如积分订单：积分 + 现金），不传时按 ￥xx.xx 展示
    getAmountText: {
      type: Function,
      default: null
    },
    // 自定义商品行价格展示，不传时按 ￥xx.xx 展示
    getItemPriceText: {
      type: Function,
      default: null
    }
  },
  computed: {
    detailBase() {
      return this.$route.path
    },
    resolvedDetailResource() {
      return this.detailResource || this.$route.path
    },
    selectedIds() {
      return new Set((this.selected || []).map((item) => item.order_id))
    },
    isAllSelected() {
      return this.list.length > 0 && this.list.every((row) => this.selectedIds.has(row.order_id))
    },
    isIndeterminate() {
      if (!this.list.length || this.isAllSelected) return false
      return this.list.some((row) => this.selectedIds.has(row.order_id))
    }
  },
  methods: {
    formatFee(fee) {
      const n = Number(fee || 0) / 100
      return n.toFixed(2)
    },
    getTotalFee(row) {
      return row.total_fee != null ? row.total_fee : row.item_fee
    },
    getPayType(row) {
      const key = row.pay_channel || row.pay_type
      return (key && PAY_TYPE[key]) || ''
    },
    getItems(row) {
      if (row.items && row.items.length) return row.items
      if (row.orderInfo?.items && row.orderInfo.items.length) return row.orderInfo.items
      if (row.item_name) {
        return [
          {
            item_name: row.item_name,
            item_spec_desc: row.item_spec_desc,
            item_pic: row.item_pic || row.pic,
            price: row.item_fee,
            num: row.num || 1,
            item_point: row.item_point,
            item_fee: row.item_fee,
            fee_symbol: row.fee_symbol
          }
        ]
      }
      return []
    },
    getDeliveryLabel(row) {
      return this.getDistributionType(row) || '-'
    },
    getBuyerName(row) {
      return row.username || row.nickname || row.member_uname || row.mobile || '-'
    },
    getOrderHolderLabel(row) {
      if (row.order_holder === 'supplier') {
        return this.$t('b64cb62b.185202')
      }
      const category = this.getOrderCategoryName(row.order_holder)
      return category || this.$t('b64cb62b.aae16d')
    },
    isItemShipped(item) {
      return (
        item.delivery_status === 'DONE' ||
        item.delivery_status === 'PARTAIL' ||
        item.ship_status === 1
      )
    },
    hasAction(row, key) {
      return (row.actionBtns || []).some((btn) => btn.key === key)
    },
    visibleActions(row) {
      const list = (row.actionBtns || []).filter((btn) => !HEADER_ACTION_KEYS.includes(btn.key))
      const front = FRONT_ACTION_KEYS.map((key) => list.find((btn) => btn.key === key)).filter(
        Boolean
      )
      const rest = list.filter((btn) => !FRONT_ACTION_KEYS.includes(btn.key))
      return [...front, ...rest]
    },
    isPrimaryAction(key) {
      return PRIMARY_ACTION_KEYS.includes(key)
    },
    actionLabel(btn) {
      return this.$te(btn.name) ? this.$t(btn.name) : btn.name
    },
    isSelected(row) {
      return this.selectedIds.has(row.order_id)
    },
    onToggle(row, checked) {
      let next = [...this.selected]
      if (checked) {
        if (!next.find((item) => item.order_id === row.order_id)) {
          next.push(row)
        }
      } else {
        next = next.filter((item) => item.order_id !== row.order_id)
      }
      this.$emit('selection-change', next)
    },
    onToggleAll(checked) {
      if (!this.showSelection) return
      this.$emit('selection-change', checked ? [...this.list] : [])
    },
    onCopySuccess() {
      this.$message.success(this.$t('b2fe051e.20a495'))
    }
  }
}
</script>

<style lang="scss" scoped>
.order-list-table {
  width: 100%;
  overflow-x: auto;
}

// 最后一列 max-content：操作列宽度至少等于 meta-right（同列取较大值）
$order-grid-cols: minmax(395px, 1fr) 107px 254px 110px 119px max-content;

.order-list-table__track {
  display: grid;
  grid-template-columns: $order-grid-cols;
  width: 100%;
}

.order-list-table__head {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: subgrid;
  align-items: center;
  height: 43px;
  background: #f2f3f5;
  color: #444;
  font-size: 15px;
  border: 1px solid #ebeef5;
  border-bottom: none;

  .col {
    white-space: nowrap;
  }
}

.order-list-table__empty {
  grid-column: 1 / -1;
  padding: 48px 0;
  border: 1px solid #ebeef5;
  background: #fff;
}

.col {
  padding: 0 12px;
  box-sizing: border-box;
}

.col--goods {
  min-width: 0;
}

.order-list-table__head-goods {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 14px;
}

.col--amount,
.col--buyer,
.col--delivery,
.col--status {
  min-width: 0;
}

.order-card > .col--buyer {
  padding: 12px 0 12px 17px;
}

.delivery-text {
  font-size: 14px;
  line-height: 22px;
  color: #606266;
  text-align: right;
}

.status-text {
  font-size: 14px;
  line-height: 22px;
  color: #606266;
  text-align: right;
}

.col--actions {
  padding-left: 12px;
  padding-right: 12px;
  box-sizing: border-box;
  text-align: left;
  min-width: 0;
}

.order-list-table__head .col--actions {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.order-card {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: subgrid;
  grid-template-rows: auto auto;
  border: 1px solid #ebeef5;
  margin-bottom: 10px;
  background: #fff;
  overflow: hidden;
}

.order-card__meta-left {
  grid-column: 1 / 6;
  grid-row: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  height: 44px;
  padding: 0 12px 0 14px;
  background: #f7f8fa;
  border-bottom: 1px solid #ebeef5;
  font-size: 12px;
  color: #444;
  box-sizing: border-box;
}

.order-card__meta-right {
  grid-column: 6;
  grid-row: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  height: 44px;
  padding: 0 12px;
  background: #f7f8fa;
  border-bottom: 1px solid #ebeef5;
  font-size: 12px;
  color: #444;
  box-sizing: border-box;
}

.order-card__check {
  margin-right: 0;
  ::v-deep .el-checkbox__inner {
    width: 16px;
    height: 16px;
    border-radius: 2px;
  }
}

.order-card__id {
  color: #444;
  font-size: 13px;
  line-height: 22px;
  white-space: nowrap;
}

.order-card__sep {
  color: #ddd;
  flex-shrink: 0;
}

.order-card__shop,
.order-card__time,
.order-card__type {
  color: #444;
  font-size: 12px;
  line-height: 22px;
  white-space: nowrap;
}

.order-card__chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 2px 8px;
  background: #f1f3f8;
  border-radius: 2px;
  color: #355fc2;
  font-size: 12px;
  line-height: 22px;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    opacity: 0.85;
  }
}

.order-card > .col {
  grid-row: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-self: stretch;
  min-height: 96px;
  padding-top: 12px;
  padding-bottom: 12px;
  border-right: 1px solid #ebeef5;
  font-size: 14px;
  color: #606266;
  box-sizing: border-box;

  &:last-child {
    border-right: none;
  }
}

.order-card > .col--goods {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  padding: 12px;
  gap: 8px;
}

.order-card > .col--amount,
.order-card > .col--delivery,
.order-card > .col--status {
  padding: 9px 12px;
  align-items: flex-end;
}

.order-card > .col--buyer {
  justify-content: center;
  align-items: flex-start;
}

.order-card > .col--actions {
  padding: 9px 12px;
  justify-content: center;
  align-items: flex-start;
}

.goods-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
}

.goods-row__pic-wrap {
  position: relative;
  width: 63px;
  height: 63px;
  flex-shrink: 0;
  border-radius: 2px;
  overflow: hidden;
  background: #f5f5f5;
}

.goods-row__pic {
  width: 63px;
  height: 63px;
}

.goods-row__shipped {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 20px;
  line-height: 20px;
  text-align: center;
  font-size: 12px;
  color: #fff;
  background: rgba(0, 0, 0, 0.45);
}

.goods-row__info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.goods-row__name {
  font-size: 14px;
  line-height: 22px;
  color: #355fc2;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.goods-row__spec {
  font-size: 12px;
  line-height: 20px;
  color: #909399;
}

.goods-row__price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex-shrink: 0;
  color: #444;
}

.goods-row__fee {
  font-size: 15px;
  line-height: 22px;
}

.goods-row__num {
  font-size: 12px;
  line-height: 20px;
  color: #444;
}

.amount-cell {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.amount-main {
  font-size: 14px;
  line-height: 22px;
  color: #606266;
}

.amount-pay {
  font-size: 12px;
  line-height: 20px;
  color: #909399;
}

.buyer-cell {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.buyer-row {
  display: flex;
  align-items: center;
  gap: 5px;
}

.buyer-label {
  color: #999;
  font-size: 15px;
  line-height: 22px;
  flex-shrink: 0;
}

.buyer-name {
  color: #444;
  font-size: 15px;
  line-height: 22px;
}

.buyer-receiver {
  font-size: 15px;
  line-height: 22px;
  color: #444;
}

.buyer-receiver__value {
  color: #444;
}

.action-btns {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
  gap: 5px;
  width: 100%;
  margin: 0;
  padding: 0;
}

.action-btn {
  margin: 0 !important;
  padding: 2px 12px;
  height: 24px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 4px;
  flex-shrink: 0;
  white-space: nowrap;
}

.action-btn--default {
  color: #606266;
  background: #fff;
  border-color: #dcdfe6;
}
</style>
