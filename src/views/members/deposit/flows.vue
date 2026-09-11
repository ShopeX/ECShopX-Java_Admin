<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->
<template>
  <div v-loading="loading" class="ecx9887-deposit__section">
    <div class="ecx9887-deposit__section-head">
      <div>
        <h1>{{ $t('ecx9887.flows.sectionTitle') }}</h1>
        <p>{{ $t('ecx9887.flows.sectionDesc') }}</p>
      </div>
    </div>

    <div
      v-if="flowType === 'recharge' && summaryLoaded"
      class="ecx9887-deposit__flow-overview"
    >
      <div class="ecx9887-deposit__flow-overview-card">
        <span>{{ $t('ecx9887.flows.directTotalLabel') }}</span>
        <strong>{{ summary.direct_total_yuan }}{{ $t('ecx9887.flows.yuanUnit') }}</strong>
      </div>
      <div class="ecx9887-deposit__flow-overview-card">
        <span>{{ $t('ecx9887.flows.giftTotalLabel') }}</span>
        <strong>{{ summary.gift_total_yuan }}{{ $t('ecx9887.flows.yuanUnit') }}</strong>
      </div>
    </div>

    <div class="ecx9887-deposit__flow-toolbar" :class="flowToolbarClass">
      <div class="ecx9887-deposit__flow-filter-field">
        <label for="flow-start">{{ $t('ecx9887.flows.startTime') }}</label>
        <el-date-picker
          id="flow-start"
          v-model="filters.start_time"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          :placeholder="$t('ecx9887.flows.startTime')"
          style="width: 100%"
        />
      </div>
      <div class="ecx9887-deposit__flow-filter-field">
        <label for="flow-end">{{ $t('ecx9887.flows.endTime') }}</label>
        <el-date-picker
          id="flow-end"
          v-model="filters.end_time"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          :placeholder="$t('ecx9887.flows.endTime')"
          style="width: 100%"
        />
      </div>
      <div class="ecx9887-deposit__flow-filter-field">
        <label for="flow-member">{{ memberFilterLabel }}</label>
        <el-input
          id="flow-member"
          v-model="filters.member_keyword"
          :placeholder="memberFilterLabel"
          clearable
        />
      </div>
      <div v-if="flowType === 'consume'" class="ecx9887-deposit__flow-filter-field">
        <label for="flow-order">{{ $t('ecx9887.flows.orderId') }}</label>
        <el-input
          id="flow-order"
          v-model="filters.order_id"
          :placeholder="$t('ecx9887.flows.orderIdPh')"
          clearable
        />
      </div>
      <div v-if="flowType === 'recharge'" class="ecx9887-deposit__flow-filter-field">
        <label for="flow-store">{{ $t('ecx9887.flows.shopLabel') }}</label>
        <button
          id="flow-store"
          type="button"
          class="ecx9887-deposit__flow-store-filter"
          @click="openStorePicker"
        >
          {{ storePickerLabel }}
        </button>
      </div>
      <div class="ecx9887-deposit__flow-actions">
        <button
          type="button"
          class="ecx9887-deposit__btn ecx9887-deposit__flow-action"
          @click="onSearch"
        >
          {{ $t('ecx9887.flows.search') }}
        </button>
        <button
          type="button"
          class="ecx9887-deposit__btn ecx9887-deposit__flow-action"
          :disabled="exporting"
          @click="onExport"
        >
          {{ $t('ecx9887.flows.export') }}
        </button>
      </div>
    </div>

    <div class="ecx9887-deposit__flow-types" role="tablist">
      <button
        v-for="tab in innerTabList"
        :key="tab.name"
        type="button"
        role="tab"
        class="ecx9887-deposit__flow-type"
        :class="{ 'is-active': flowType === tab.name }"
        @click="onFlowTypeChange(tab.name)"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="ecx9887-deposit__flow-table">
      <el-table v-if="list.length" :data="list" @sort-change="onSortChange">
        <el-table-column
          v-for="col in tableColumns"
          :key="col.prop"
          :prop="col.prop"
          :label="col.label"
          :min-width="col.minWidth || 120"
          :sortable="col.sortable ? 'custom' : false"
        >
          <template slot-scope="scope">
            <span
              v-if="col.prop === 'flow_id' || col.prop === 'order_id'"
              class="ecx9887-deposit__flow-id"
            >
              {{ displayCell(scope.row, col.prop) }}
            </span>
            <span v-else-if="col.prop === 'recharge_method'">
              {{ rechargeMethodLabel(scope.row.recharge_method) }}
            </span>
            <span v-else>{{ displayCell(scope.row, col.prop) }}</span>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="!loading && !list.length" class="ecx9887-deposit__empty">
        <strong>{{ loadError ? $t('ecx9887.flows.loadFail') : $t('ecx9887.flows.emptyTitle') }}</strong>
        <span v-if="!loadError">{{ $t('ecx9887.flows.emptyHint') }}</span>
      </div>
    </div>

    <div v-if="totalCount > 0" class="ecx9887-deposit__flow-pagination">
      <span>{{ $t('ecx9887.flows.totalSummary', { count: totalCount }) }}</span>
      <el-pagination
        v-if="totalCount > pageSize"
        layout="prev, pager, next"
        :current-page.sync="page"
        :page-size="pageSize"
        :total="totalCount"
        small
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
      selectedShopIds: [],
      storePickerLabelText: '',
      filters: {
        start_time: '',
        end_time: '',
        member_keyword: '',
        order_id: ''
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
    memberFilterLabel() {
      return this.$t('ecx9887.flows.memberKeywordPh')
    },
    flowToolbarClass() {
      if (this.flowType === 'recharge') {
        return 'is-recharge'
      }
      if (this.flowType === 'consume') {
        return 'is-consume'
      }
      return 'is-refund'
    },
    storePickerLabel() {
      if (this.storePickerLabelText) {
        return this.storePickerLabelText
      }
      if (this.selectedShopIds.length) {
        return this.$t('ecx9887.flows.storeSelected', { count: this.selectedShopIds.length })
      }
      return this.$t('ecx9887.flows.storePickerBtn')
    },
    tableColumns() {
      if (this.flowType === 'recharge') {
        return [
          { prop: 'flow_id', label: this.$t('ecx9887.flows.colRechargeFlowId'), minWidth: 170 },
          { prop: 'recharge_method', label: this.$t('ecx9887.flows.colRechargeMethod'), minWidth: 100 },
          { prop: 'member_display', label: this.$t('ecx9887.flows.colRechargeMember'), minWidth: 180 },
          {
            prop: 'amount_yuan',
            label: this.$t('ecx9887.flows.colRechargeAmount'),
            minWidth: 110,
            sortable: true
          },
          { prop: 'shop_name', label: this.$t('ecx9887.flows.colShopName'), minWidth: 140 },
          {
            prop: 'recharged_at',
            label: this.$t('ecx9887.flows.colRechargeTime'),
            minWidth: 160,
            sortable: true
          }
        ]
      }
      if (this.flowType === 'consume') {
        return [
          { prop: 'order_id', label: this.$t('ecx9887.flows.colOrderId'), minWidth: 140, sortable: true },
          { prop: 'member_display', label: this.$t('ecx9887.flows.colConsumeMember'), minWidth: 180 },
          {
            prop: 'amount_yuan',
            label: this.$t('ecx9887.flows.colConsumeAmount'),
            minWidth: 110,
            sortable: true
          },
          {
            prop: 'consumed_at',
            label: this.$t('ecx9887.flows.colConsumeTime'),
            minWidth: 160,
            sortable: true
          }
        ]
      }
      return [
        { prop: 'flow_id', label: this.$t('ecx9887.flows.colRefundFlowId'), minWidth: 170 },
        { prop: 'member_display', label: this.$t('ecx9887.flows.colRefundMember'), minWidth: 180 },
        {
          prop: 'amount_yuan',
          label: this.$t('ecx9887.flows.colRefundAmount'),
          minWidth: 110,
          sortable: true
        },
        {
          prop: 'refunded_at',
          label: this.$t('ecx9887.flows.colRefundTime'),
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
    formatMemberDisplay(row) {
      const no = row.member_no || ''
      const mobile = row.mobile_masked || ''
      if (no && mobile) {
        return `${no}（${mobile}）`
      }
      return no || mobile || ''
    },
    displayCell(row, prop) {
      if (prop === 'member_display') {
        return this.formatMemberDisplay(row)
      }
      if (prop === 'amount_yuan' && row.amount_yuan != null) {
        return `${row.amount_yuan}${this.$t('ecx9887.flows.yuanUnit')}`
      }
      return row[prop] != null ? row[prop] : ''
    },
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
      if (this.filters.start_time) {
        params.start_time = this.filters.start_time
      }
      if (this.filters.end_time) {
        params.end_time = this.filters.end_time
      }
      if (this.filters.member_keyword) {
        params.member_keyword = this.filters.member_keyword.trim()
      }
      if (this.flowType === 'consume' && this.filters.order_id) {
        params.order_id = this.filters.order_id.trim()
      }
      if (this.flowType === 'recharge' && this.selectedShopIds.length) {
        params.shop_ids = this.selectedShopIds.join(',')
      }
      if (this.sortField) {
        params.sort_field = this.sortField
        params.sort_order = this.sortOrder || 'desc'
      }
      return params
    },
    onFlowTypeChange(name) {
      if (name === this.flowType) {
        return
      }
      this.flowType = name
      this.page = 1
      this.loadError = false
      this.restoreSort()
      this.fetchList()
    },
    async openStorePicker() {
      if (!this.$picker || !this.$picker.shop) {
        return
      }
      const { data } = await this.$picker.shop({
        multiple: true,
        data: this.selectedShopIds.slice()
      })
      if (data) {
        this.selectedShopIds = data.map((item) => String(item.distributor_id))
        if (data.length === 1) {
          this.storePickerLabelText = data[0].name
        } else if (data.length > 1) {
          this.storePickerLabelText = this.$t('ecx9887.flows.storeSelected', { count: data.length })
        } else {
          this.storePickerLabelText = ''
        }
      } else {
        this.selectedShopIds = []
        this.storePickerLabelText = ''
      }
    },
    onSearch() {
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
    unwrapApiData(res) {
      return res?.data?.data != null ? res.data.data : res?.data ?? res ?? {}
    },
    async fetchList() {
      this.loading = true
      this.loadError = false
      try {
        const params = this.buildQueryParams()
        const res = await getDepositFlowList(this.flowType, params)
        const data = this.unwrapApiData(res)
        const rows = (data.list || []).map((row) => ({
          ...row,
          member_display: this.formatMemberDisplay(row)
        }))
        this.list = rows
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
        const summaryParams = { ...params }
        delete summaryParams.page
        delete summaryParams.pageSize
        const res = await getDepositRechargeSummary(summaryParams)
        const data = this.unwrapApiData(res)
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
        const data = this.unwrapApiData(res)
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
