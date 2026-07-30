<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.picker-link {
  .sp-filter-form {
    padding: 8px 8px 0px 8px;
  }
  .sp-finder-hd {
    display: none;
  }
  .sp-finder {
    &.no-multiple {
      .sp-finder-bd {
        .el-table__fixed-header-wrapper {
          table thead {
            tr {
              th {
                &:nth-child(1) {
                  .el-checkbox {
                    display: none;
                  }
                }
              }
            }
          }
        }
      }
      .el-table__fixed-body-wrapper {
        top: 38px !important;
      }
    }
  }
  .el-pagination {
    margin: 0;
    padding: 10px;
  }
}
</style>
<template>
  <div class="picker-link">
    <SpFinder
      ref="finder"
      :show-pager="false"
      :class="['shop-finder', { 'no-multiple': !multiple }]"
      :other-config="{
        'max-height': '580px'
      }"
      :data="list"
      :fixed-row-action="true"
      :setting="{
        columns: [
          { name: 'ID', key: 'id', width: 120 },
          { name: '页面名称', key: 'title' }
        ]
      }"
      @select="onSelect"
      @selection-change="onSelectionChange"
    />
  </div>
</template>

<script>
import BasePicker from './base'
import PageMixin from '../mixins/page'

const BASE_LINK_PAGES = [
  { id: 'vipgrades', title: '会员开通' },
  { id: 'applyChief', title: '社区团长申请' },
  { id: 'recharge', title: '储值卡' },
  { id: 'purchase', title: '内购' },
  { id: 'pointShop', title: '积分商城' },
  { id: 'registActivity', title: '报名活动' },
  { id: 'group', title: '我的拼团' },
  { id: 'coupon_list', title: '领券中心' },
  { id: 'my_coupon', title: '我的优惠券' },
  { id: 'my_collect', title: '我的收藏' },
  { id: 'address', title: '地址管理' },
  { id: 'groups_list', title: '限时团购' },
  { id: 'hottopic', title: '种草列表' },
  { id: 'zitiOrder', title: '自提订单' },
  { id: 'homeSearch', title: '搜索' },
  { id: 'settings', title: '切换语言' },
  { id: 'kujiale', title: '酷家乐案例库' },
  // { id: 'nearby_store', title: '附近商家' },
  { id: 'itemList', title: '商品列表' }
]

export default {
  name: 'PickerLink',
  extends: BasePicker,
  mixins: [PageMixin],
  config: {
    title: '选择页面'
  },
  props: ['value'],
  data() {
    return {
      formData: {
        keywords: ''
      },
      multiple: this.value?.multiple ?? true
    }
  },
  computed: {
    list() {
      if (this.value?.guide === 'share_page') {
        return [
          { id: 'coupon_list', title: '领券中心' },
          { id: 'my_coupon', title: '我的优惠券' },
          { id: 'page_index', title: '首页' },
          { id: 'category', title: '分类' },
          { id: 'hottopic', title: '种草列表' }
        ]
      }

      const items = [...BASE_LINK_PAGES]
      if (!this.VERSION_PLATFORM() && !this.VERSION_B2C()) {
        items.push(
          { id: 'boost_activity', title: '助力活动' },
          { id: 'boost_order', title: '助力订单' }
        )
      }
      if (!this.VERSION_STANDARD()) {
        items.push({ id: 'tenants', title: '商家入驻' })
      }
      if (!this.VERSION_IN_PURCHASE()) {
        items.push({ id: 'community_group_enable', title: '社区团购（H5不支持）' })
      }
      return items
    }
  },
  mounted() {
    const raw = this.value?.data
    if (raw == null || raw === '') return
    const selectedIds = Array.isArray(raw) ? raw : [raw]
    const selectRows = this.list.filter((item) =>
      selectedIds.map(String).includes(String(item.id))
    )
    if (!selectRows.length) return
    const finderTable = this.$refs.finder?.$refs?.finderTable
    if (!finderTable?.$refs?.finderTable) return
    setTimeout(() => {
      finderTable.$refs.finderTable.setSelection(selectRows)
    })
  },
  methods: {
    onSearch() {
      this.$refs.finder.refresh(true)
    },
    onSelect(selection, row) {
      if (!this.multiple) {
        const { finderTable } = this.$refs.finder.$refs
        finderTable.clearSelection()
        setTimeout(() => {
          finderTable.$refs.finderTable.setSelection([row])
        })
      }
    },
    onSelectionChange(selection) {
      this.updateVal(selection)
    }
  }
}
</script>
