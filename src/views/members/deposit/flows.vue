<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->
<template>
  <div v-loading="loading" class="px-6 py-4">
    <SpTabs :tab-list="innerTabList" v-model="flowType" @change="onFlowTypeChange" />

    <div
      v-if="flowType === 'recharge' && summaryLoaded"
      class="mb-4 flex flex-wrap gap-6 rounded border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700"
    >
      <span>{{ $t('ecx9887.flows.directTotal') }}：{{ summary.direct_total_yuan }}</span>
      <span>{{ $t('ecx9887.flows.giftTotal') }}：{{ summary.gift_total_yuan }}</span>
    </div>

    <SpFilterForm :model="filters" @onSearch="onSearch" @onReset="onReset">
      <SpFilterFormItem :label="$t('ecx9887.flows.timeRange')" prop="timeRange">
        <el-date-picker
          v-model="filters.timeRange"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          :range-separator="$t('ecx9887.flows.rangeSep')"
          :start-placeholder="$t('ecx9887.flows.startTime')"
          :end-placeholder="$t('ecx9887.flows.endTime')"
          class="w-full"
        />
      </SpFilterFormItem>
      <SpFilterFormItem :label="$t('ecx9887.flows.memberKeyword')" prop="member_keyword">
        <el-input
          v-model="filters.member_keyword"
          :placeholder="$t('ecx9887.flows.memberKeywordPh')"
          clearable
        />
      </SpFilterFormItem>
      <SpFilterFormItem
        v-if="flowType === 'consume'"
        :label="$t('ecx9887.flows.orderId')"
        prop="order_id"
      >
        <el-input v-model="filters.order_id" :placeholder="$t('ecx9887.flows.orderIdPh')" clearable />
      </SpFilterFormItem>
      <SpFilterFormItem
        v-if="flowType === 'recharge'"
        :label="$t('ecx9887.flows.shopIds')"
        prop="shop_ids"
      >
        <el-input
          v-model="filters.shop_ids"
          :placeholder="$t('ecx9887.flows.shopIdsPh')"
          clearable
        />
      </SpFilterFormItem>
    </SpFilterForm>

    <div class="mb-3 flex justify-end">
      <el-button type="primary" size="small" :loading="exporting" @click="onExport">
        {{ $t('ecx9887.flows.export') }}
      </el-button>
    </div>

    <el-table :data="list" border size="small" @sort-change="onSortChange">
      <el-table-column
        v-for="col in tableColumns"
        :key="col.prop"
        :prop="col.prop"
        :label="col.label"
        :min-width="col.minWidth || 120"
        :sortable="col.sortable ? 'custom' : false"
      >
        <template slot-scope="scope">
          <span v-if="col.prop === 'recharge_method'">
            {{ rechargeMethodLabel(scope.row.recharge_method) }}
          </span>
          <span v-else>{{ scope.row[col.prop] }}</span>
        </template>
      </el-table-column>
    </el-table>

    <div v-if="!loading && !list.length" class="py-10 text-center text-sm text-gray-400">
      {{ loadError ? $t('ecx9887.flows.loadFail') : $t('ecx9887.flows.empty') }}
    </div>

    <div v-if="totalCount > pageSize" class="mt-4 text-center">
      <el-pagination
        layout="prev, pager, next, total"
        :current-page.sync="page"
        :page-size="pageSize"
        :total="totalCount"
        @current-change="fetchList"
      />
    </div>
  </div>
</template>

<script>
import {
  exportDepositFlows,
  getDepositFlowList,
  getDepositRechargeSummary
} from '@/api/deposit'

const SORT_STORAGE_PREFIX = 'ecx9887_flow_sort_'

export default {
  name: 'MemberDepositFlows',
  data() {
    return {
      flowType: 'recharge',
      loading: false,
      exporting: false,
      loadError: false,
      list: [],
      totalCount: 0,
      page: 1,
      pageSize: 20,
      summary: { direct_total_yuan: '0.00', gift_total_yuan: '0.00' },
      summaryLoaded: false,
      filters: {
        timeRange: [],
        member_keyword: '',
        order_id: '',
        shop_ids: ''
      },
      sortField: '',
      sortOrder: ''
    }
  },
  computed: {
    innerTabList() {
      return [
        { label: this.$t('ecx9887.flows.tabRecharge'), name: 'recharge' },
        { label: this.$t('ecx9887.flows.tabConsume'), name: 'consume' },
        { label: this.$t('ecx9887.flows.tabRefund'), name: 'refund' }
      ]
    },
    tableColumns() {
      if (this.flowType === 'recharge') {
        return [
          { prop: 'flow_id', label: this.$t('ecx9887.flows.colFlowId'), minWidth: 160 },
          {
            prop: 'recharge_method',
            label: this.$t('ecx9887.flows.colRechargeMethod'),
            minWidth: 100
          },
          { prop: 'member_no', label: this.$t('ecx9887.flows.colMember'), minWidth: 120 },
          { prop: 'mobile_masked', label: this.$t('ecx9887.flows.colMobile'), minWidth: 120 },
          {
            prop: 'amount_yuan',
            label: this.$t('ecx9887.flows.colAmount'),
            minWidth: 100,
            sortable: true
          },
          {
            prop: 'recharged_at',
            label: this.$t('ecx9887.flows.colTime'),
            minWidth: 160,
            sortable: true
          },
          { prop: 'shop_name', label: this.$t('ecx9887.flows.colShopName'), minWidth: 140 }
        ]
      }
      if (this.flowType === 'consume') {
        return [
          { prop: 'order_id', label: this.$t('ecx9887.flows.colOrderId'), minWidth: 140, sortable: true },
          { prop: 'flow_id', label: this.$t('ecx9887.flows.colFlowId'), minWidth: 160 },
          { prop: 'member_no', label: this.$t('ecx9887.flows.colMember'), minWidth: 120 },
          { prop: 'mobile_masked', label: this.$t('ecx9887.flows.colMobile'), minWidth: 120 },
          {
            prop: 'amount_yuan',
            label: this.$t('ecx9887.flows.colAmount'),
            minWidth: 100,
            sortable: true
          },
          {
            prop: 'consumed_at',
            label: this.$t('ecx9887.flows.colTime'),
            minWidth: 160,
            sortable: true
          }
        ]
      }
      return [
        { prop: 'flow_id', label: this.$t('ecx9887.flows.colRefundFlowId'), minWidth: 160 },
        { prop: 'member_no', label: this.$t('ecx9887.flows.colMember'), minWidth: 120 },
        { prop: 'mobile_masked', label: this.$t('ecx9887.flows.colMobile'), minWidth: 120 },
        {
          prop: 'amount_yuan',
          label: this.$t('ecx9887.flows.colAmount'),
          minWidth: 100,
          sortable: true
        },
        {
          prop: 'refunded_at',
          label: this.$t('ecx9887.flows.colTime'),
          minWidth: 160,
          sortable: true
        }
      ]
    }
  },
  mounted() {
    this.restoreSort()
    this.fetchList()
  },
  methods: {
    rechargeMethodLabel(method) {
      if (method === 'gift') {
        return this.$t('ecx9887.flows.methodGift')
      }
      return this.$t('ecx9887.flows.methodDirect')
    },
    sortStorageKey() {
      return SORT_STORAGE_PREFIX + this.flowType
    },
    restoreSort() {
      try {
        const raw = localStorage.getItem(this.sortStorageKey())
        if (!raw) {
          return
        }
        const parsed = JSON.parse(raw)
        this.sortField = parsed.sort_field || ''
        this.sortOrder = parsed.sort_order || ''
      } catch (e) {
        // ignore
      }
    },
    persistSort() {
      localStorage.setItem(
        this.sortStorageKey(),
        JSON.stringify({ sort_field: this.sortField, sort_order: this.sortOrder })
      )
    },
    buildQueryParams() {
      const params = {
        page: this.page,
        pageSize: this.pageSize
      }
      if (this.filters.timeRange && this.filters.timeRange.length === 2) {
        params.start_time = this.filters.timeRange[0]
        params.end_time = this.filters.timeRange[1]
      }
      if (this.filters.member_keyword) {
        params.member_keyword = this.filters.member_keyword.trim()
      }
      if (this.flowType === 'consume' && this.filters.order_id) {
        params.order_id = this.filters.order_id.trim()
      }
      if (this.flowType === 'recharge' && this.filters.shop_ids) {
        params.shop_ids = this.filters.shop_ids.trim()
      }
      if (this.sortField) {
        params.sort_field = this.sortField
        params.sort_order = this.sortOrder || 'desc'
      }
      return params
    },
    onFlowTypeChange() {
      this.page = 1
      this.loadError = false
      this.restoreSort()
      this.fetchList()
    },
    onSearch() {
      this.page = 1
      this.fetchList()
    },
    onReset() {
      this.filters = {
        timeRange: [],
        member_keyword: '',
        order_id: '',
        shop_ids: ''
      }
      this.page = 1
      this.fetchList()
    },
    onSortChange({ prop, order }) {
      const fieldMap = {
        amount_yuan: 'amount_yuan',
        recharged_at: 'time_start',
        consumed_at: 'time_start',
        refunded_at: 'time_start',
        order_id: 'order_id',
        flow_id: 'flow_id'
      }
      if (!order) {
        this.sortField = ''
        this.sortOrder = ''
      } else {
        this.sortField = fieldMap[prop] || 'time_start'
        this.sortOrder = order === 'ascending' ? 'asc' : 'desc'
      }
      this.persistSort()
      this.fetchList()
    },
    async fetchList() {
      this.loading = true
      this.loadError = false
      try {
        const params = this.buildQueryParams()
        const res = await getDepositFlowList(this.flowType, params)
        const data = (res && res.data) || {}
        this.list = data.list || []
        this.totalCount = Number(data.total_count || 0)
        if (this.flowType === 'recharge') {
          await this.fetchSummary(params)
        } else {
          this.summaryLoaded = false
        }
      } catch (e) {
        this.loadError = true
        this.list = []
        this.totalCount = 0
      } finally {
        this.loading = false
      }
    },
    async fetchSummary(params) {
      try {
        const res = await getDepositRechargeSummary(params)
        const data = (res && res.data) || {}
        this.summary = {
          direct_total_yuan: data.direct_total_yuan || '0.00',
          gift_total_yuan: data.gift_total_yuan || '0.00'
        }
        this.summaryLoaded = true
      } catch (e) {
        this.summaryLoaded = false
      }
    },
    async onExport() {
      this.exporting = true
      try {
        const params = this.buildQueryParams()
        delete params.page
        delete params.pageSize
        const res = await exportDepositFlows(this.flowType, params)
        const data = (res && res.data) || {}
        if (data.url) {
          window.open(data.url, '_blank')
          this.$message.success(this.$t('ecx9887.flows.exportSuccess', { count: this.totalCount }))
        } else {
          this.$message.warning(this.$t('ecx9887.flows.empty'))
        }
      } catch (e) {
        this.$message.error(this.$t('ecx9887.flows.exportFail'))
      } finally {
        this.exporting = false
      }
    }
  }
}
</script>
