<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpRouterView>
    <SpPage>
      <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app alipay />

      <SpFormPlus
        ref="searchForm"
        class="mb-4"
        v-model="searchParams"
        form-type="searchForm"
        :inline="true"
        :form-items="searchFormItems"
        @submit="handleSearch"
        @reset="handleSearch"
      />

      <SpTabs :tab-list="tabList" v-model="activeTab" @change="handleTabChange" />

      <OrderListTable
        :list="tableList"
        :loading="loading"
        :show-selection="false"
        :show-process="false"
        detail-label="2345face.f26225"
        :detail-resource="isSelfOrderList ? $route.path : '/mall/trade/normalorders'"
        :get-distribution-type="getDistributionType"
        :get-order-category-name="getOrderCategoryName"
        @action="handleAction"
      />

      <template #page-footer>
        <div class="order-list-page-footer">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :current-page.sync="page.pageIndex"
            :page-sizes="[10, 20, 50]"
            :total="page.total"
            :page-size="page.pageSize"
            @current-change="onCurrentChange"
            @size-change="onSizeChange"
          />
        </div>
      </template>
    </SpPage>
  </SpRouterView>
</template>

<script>
import _map from 'lodash/map'
import { ORDER_TYPE, DISTRIBUTION_TYPE, ORDER_CATEGORY } from '@/consts'
import { IS_ADMIN, formatPrice } from '@/utils'
import { useForm } from '@/composables'
import hqbdlycorp from '@/common/hqbdlycorp.json'
import { i18n } from '@/i18n'
import OrderListTable from '@/view/mall/trade/normalorders/components/OrderListTable'

const LOCAL_ORDER_TYPE = _map(ORDER_TYPE, (item) => ({ label: item.title, value: item.value }))

const [DeliveryForm, DeliveryFormApi] = useForm({
  formItems: [
    {
      component: ({ h, value }) => {
        return <div>{value}</div>
      },
      label: i18n.t('2345face.1e8dc2'),
      fieldName: 'order_id'
    },
    {
      component: ({ h, value }) => {
        return (
          <el-table border data={value} style='width: 100%'>
            <el-table-column prop='item_name' label={i18n.t('2345face.de5472')} />
            <el-table-column prop='num' label={i18n.t('2345face.0bf60b')} width='80' />
            <el-table-column
              label={i18n.t('2345face.4df53f')}
              width='160'
              scopedSlots={{
                default: (scope) => <span>{formatPrice(scope.row.total_fee)}</span>
              }}
            />
          </el-table>
        )
      },
      label: i18n.t('2345face.b433e6'),
      fieldName: 'goods_info',
      value: []
    },
    {
      component: 'Select',
      label: i18n.t('2345face.f3af96'),
      fieldName: 'delivery_corp',
      formItemClass: 'w-1/3',
      componentProps: {
        filterable: true,
        options: _map(hqbdlycorp, (item) => ({
          label: item.name,
          value: item.value
        }))
      },
      rules: [{ required: true, message: i18n.t('2345face.8367e8') }]
    },
    {
      component: 'Input',
      label: i18n.t('2345face.3c016d'),
      fieldName: 'delivery_no',
      formItemClass: 'w-1/3',
      rules: [{ required: true, message: i18n.t('2345face.a8318c') }]
    }
  ],
  showDefaultActions: false
})

export default {
  components: { OrderListTable },
  data() {
    return {
      searchParams: {
        mobile: '',
        order_id: '',
        order_class: '',
        create_time: []
      },
      datapass_block: 1,
      tableList: [],
      loading: false,
      page: { pageIndex: 1, pageSize: 20, total: 0 },
      activeTab: 'all',
      tabList: [
        { label: this.$t('2345face.dbb4d8'), name: 'all' },
        { label: this.$t('2345face.d8476e'), name: 'notship' },
        { label: this.$t('2345face.fad522'), name: 'done' },
        { label: this.$t('2345face.608afd'), name: 'notpay' },
        { label: this.$t('2345face.2111cc'), name: 'cancel' }
      ]
    }
  },
  computed: {
    isSelfOrderList() {
      return this.$route.meta?.aliasName === 'tradenormalshoporders'
    },
    searchFormItems() {
      return [
        {
          fieldName: 'mobile',
          label: this.$t('2345face.8098e2'),
          component: 'input',
          cellWidth: 1.3,
          componentProps: {
            placeholder: this.$t('2345face.6e4f4b')
          }
        },
        {
          fieldName: 'order_id',
          label: this.$t('2345face.1e8dc2'),
          component: 'input',
          cellWidth: 1.3,
          componentProps: {
            placeholder: this.$t('2345face.e9e836')
          }
        },
        {
          fieldName: 'order_class',
          label: this.$t('2345face.5cd56b'),
          component: 'select',
          cellWidth: 1.3,
          componentProps: {
            clearable: true,
            placeholder: this.$t('2345face.249ee7'),
            options: this.isSelfOrderList
              ? LOCAL_ORDER_TYPE.filter((item) => item.value !== 'employee_purchase')
              : LOCAL_ORDER_TYPE
          }
        },
        {
          fieldName: 'create_time',
          label: this.$t('2345face.56e3f8'),
          component: 'datetimepicker',
          cellWidth: 2,
          componentProps: {
            type: 'datetimerange'
          }
        }
      ]
    }
  },
  mounted() {
    this.fetchList()
  },
  methods: {
    beforeSearch(params) {
      const { create_time, mobile, order_id, order_class, distributor_id } = this.searchParams
      const _params = {
        ...params,
        order_type: 'normal'
      }

      if (this.isSelfOrderList) {
        // 自营订单：仅线上店铺订单，对齐旧 shopList 筛选
        _params.order_class_exclude = 'drug,pointsmall,employee_purchase'
        _params.order_holder = 'self,self_supplier'
        _params.distributor_id = 0
      } else {
        _params.order_class_exclude = 'community'
        _params.is_distribution = 1
      }

      if (create_time && create_time.length > 0) {
        const start = create_time[0]
        const end = create_time[1]
        _params.time_start_begin =
          typeof start?.getTime === 'function' ? start.getTime() / 1000 : start / 1000
        _params.time_start_end =
          typeof end?.getTime === 'function' ? end.getTime() / 1000 : end / 1000
      }

      order_id && (_params.order_id = order_id)
      mobile && (_params.mobile = mobile)
      order_class && (_params.order_class = order_class)
      distributor_id && (_params.distributor_id = distributor_id)

      if (this.activeTab !== 'all') {
        _params['order_status'] = this.activeTab
      }
      return _params
    },
    getDistributionType({ receipt_type }) {
      return DISTRIBUTION_TYPE.find((item) => item.value == receipt_type)?.title || ''
    },
    getOrderCategoryName(order_holder) {
      return ORDER_CATEGORY.find((item) => item.value == order_holder)?.title || ''
    },
    async fetchList() {
      this.loading = true
      try {
        const params = this.beforeSearch({
          page: this.page.pageIndex,
          pageSize: this.page.pageSize
        })
        const { list, pager } = await this.$api.trade.getOrderList(params)
        this.tableList = (list || []).map((row) => ({
          ...row,
          actionBtns:
            row.receipt_type == 'logistics' &&
            row.order_status == 'PAYED' &&
            row.delivery_status != 'DONE' &&
            !IS_ADMIN()
              ? [{ name: '2345face.045315', key: 'delivery' }]
              : []
        }))
        this.page.total = pager?.count || 0
      } finally {
        this.loading = false
      }
    },
    onCurrentChange(pageIndex) {
      this.page.pageIndex = pageIndex
      this.fetchList()
    },
    onSizeChange(pageSize) {
      this.page.pageSize = pageSize
      this.page.pageIndex = 1
      this.fetchList()
    },
    async handleAction(row, btn) {
      if (btn.key !== 'delivery') return
      const { orderInfo } = await this.$api.trade.getOrderDetail(row.order_id)
      await this.$dialog.open({
        title: this.$t('2345face.045315'),
        content: (
          <DeliveryForm value={{ order_id: row.order_id, goods_info: orderInfo?.items || [] }} />
        ),
        confirmBefore: async () => {
          try {
            await DeliveryFormApi.validate()
          } catch (error) {
            throw new Error(this.$t('2345face.53aadf'))
          }
        }
      })
      const res = await DeliveryFormApi.getFieldsValue()
      await this.$api.trade.delivery({
        order_id: row.order_id,
        delivery_corp: res.delivery_corp,
        delivery_code: res.delivery_code
      })
      this.$message.success(this.$t('2345face.2c8dba'))
      this.fetchList()
    },
    handleTabChange(tab) {
      this.page.pageIndex = 1
      this.fetchList()
    },
    handleSearch() {
      this.page.pageIndex = 1
      this.fetchList()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .sp-page__footer {
  border-top: 1px solid #ebeef5;
  background: #fff !important;
  z-index: 10;
}

::v-deep .sp-page__footer .footer-content {
  padding: 12px 0 !important;
  background: #fff !important;
}

.order-list-page-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 16px;
  background: #fff;
}
</style>
