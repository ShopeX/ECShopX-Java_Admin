<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->
<template>
  <div class="flex flex-col gap-5 bg-white border border-[#e5e7eb] rounded-lg p-8 max-md:p-5 max-md:px-4">
    <div class="flex gap-2 border-b border-[#e5e7eb] -mb-1 overflow-x-auto max-md:overflow-x-auto" role="tablist">
      <button
        v-for="tab in innerTabList"
        :key="tab.name"
        type="button"
        role="tab"
        class="border-0 bg-transparent text-[#303133] py-[9px] px-5 first:pl-0 pb-[11px] font-medium text-sm leading-[22px] cursor-pointer border-b-2 -mb-px transition-colors max-md:whitespace-nowrap"
        :class="
          flowType === tab.name
            ? 'text-[var(--primary)] border-b-[var(--primary)]'
            : 'border-b-transparent'
        "
        @click="onFlowTypeChange(tab.name)"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="grid gap-3 items-end max-md:grid-cols-1" :class="flowToolbarClass">
      <div class="flex flex-col gap-1.5 min-w-0">
        <label for="flow-start" class="text-[#6b7280] text-xs leading-tight">{{ $t('ecx9887.flows.startTime') }}</label>
        <el-date-picker
          id="flow-start"
          v-model="filters.start_time"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          :placeholder="$t('ecx9887.flows.startTime')"
          style="width: 100%"
        />
      </div>
      <div class="flex flex-col gap-1.5 min-w-0">
        <label for="flow-end" class="text-[#6b7280] text-xs leading-tight">{{ $t('ecx9887.flows.endTime') }}</label>
        <el-date-picker
          id="flow-end"
          v-model="filters.end_time"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          :placeholder="$t('ecx9887.flows.endTime')"
          style="width: 100%"
        />
      </div>
      <div class="flex flex-col gap-1.5 min-w-0">
        <label for="flow-member" class="text-[#6b7280] text-xs leading-tight">{{ memberFilterLabel }}</label>
        <el-input
          id="flow-member"
          v-model="filters.member_keyword"
          :placeholder="memberFilterLabel"
          clearable
        />
      </div>
      <div v-if="flowType === 'consume'" class="flex flex-col gap-1.5 min-w-0">
        <label for="flow-order" class="text-[#6b7280] text-xs leading-tight">{{ $t('ecx9887.flows.orderId') }}</label>
        <el-input
          id="flow-order"
          v-model="filters.order_id"
          :placeholder="$t('ecx9887.flows.orderIdPh')"
          clearable
        />
      </div>
      <div v-if="flowType === 'recharge'" class="flex flex-col gap-1.5 min-w-0">
        <label for="flow-store" class="text-[#6b7280] text-xs leading-tight">{{ $t('ecx9887.flows.shopLabel') }}</label>
        <el-input
          id="flow-store"
          readonly
          :value="storePickerDisplay"
          :placeholder="$t('ecx9887.flows.storePickerBtn')"
          clearable
          class="cursor-pointer"
          @click.native="openStorePicker"
          @clear="clearStoreSelection"
        />
      </div>
      <div class="flex items-end gap-2 max-md:grid max-md:grid-cols-2 max-md:w-full">
        <el-button type="primary" size="small" @click="onSearch">
          {{ $t('ecx9887.flows.search') }}
        </el-button>
        <el-button type="primary" plain size="small" :loading="exporting" @click="onExport">
          {{ $t('ecx9887.flows.export') }}
        </el-button>
      </div>
    </div>

    <div
      v-if="flowType === 'recharge' && summaryLoaded"
      class="grid grid-cols-[repeat(2,minmax(180px,240px))] gap-3 -mt-2 max-md:grid-cols-1"
    >
      <div class="border border-[#e5e7eb] rounded p-3.5 px-4 bg-[#f9fafb]">
        <span class="block text-[#6b7280] text-xs">{{ $t('ecx9887.flows.directTotalLabel') }}</span>
        <strong class="block mt-1.5 text-[#1f2937] text-xl font-bold">{{ summary.direct_total_yuan }}{{ $t('ecx9887.flows.yuanUnit') }}</strong>
      </div>
      <div class="border border-[#e5e7eb] rounded p-3.5 px-4 bg-[#f9fafb]">
        <span class="block text-[#6b7280] text-xs">{{ $t('ecx9887.flows.giftTotalLabel') }}</span>
        <strong class="block mt-1.5 text-[#1f2937] text-xl font-bold">{{ summary.gift_total_yuan }}{{ $t('ecx9887.flows.yuanUnit') }}</strong>
      </div>
    </div>

    <SpTable
      :key="flowType"
      ref="flowTable"
      class="[&_.el-table__row]:cursor-default"
      :url="flowListUrl"
      :params="flowTableParams"
      :hooks="flowTableHooks"
      :columns="tableColumns"
      :row-key="flowRowKey"
      :page-size="20"
      :page-sizes="[20, 50, 100]"
      @sort-change="onSortChange"
    />
  </div>
</template>

<script>
import SpTable from '@/components/sp-table'
import { exportDepositFlows, getDepositRechargeSummary } from '@/api/deposit'

const SORT_STORAGE_PREFIX = 'ecx9887_flow_sort_'

export default {
  name: 'MemberDepositFlows',
  components: {
    SpTable
  },
  data() {
    return {
      flowType: 'recharge',
      exporting: false,
      totalCount: 0,
      lastSearchParams: {},
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
        return 'grid-cols-[180px_180px_minmax(220px,300px)_minmax(160px,220px)_auto]'
      }
      if (this.flowType === 'consume') {
        return 'grid-cols-[180px_180px_minmax(220px,300px)_minmax(160px,220px)_auto]'
      }
      return 'grid-cols-[180px_180px_minmax(220px,300px)_auto]'
    },
    storePickerDisplay() {
      if (this.storePickerLabelText) {
        return this.storePickerLabelText
      }
      if (this.selectedShopIds.length) {
        return this.$t('ecx9887.flows.storeSelected', { count: this.selectedShopIds.length })
      }
      return ''
    },
    flowListUrl() {
      return `/deposit/flows/${this.flowType}`
    },
    flowTableParams() {
      const params = {}
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
    flowTableHooks() {
      const vm = this
      return {
        beforeSearch(params) {
          vm.lastSearchParams = { ...params }
          return params
        },
        afterSearch(response) {
          const data = vm.unwrapApiData(response)
          vm.totalCount = Number(data.total_count || 0)
          const list = (data.list || []).map((row) => ({
            ...row,
            member_display: vm.formatMemberDisplay(row)
          }))
          if (response?.data?.data != null) {
            response.data.data.list = list
            response.data.data.total_count = vm.totalCount
          } else if (response?.data) {
            response.data.list = list
            response.data.total_count = vm.totalCount
          }
          if (vm.flowType === 'recharge') {
            vm.fetchSummaryFromLastParams()
          } else {
            vm.summaryLoaded = false
          }
          return response
        }
      }
    },
    tableColumns() {
      const vm = this
      const amountFormatter = (_value, row) =>
        row.amount_yuan != null ? `${row.amount_yuan}${vm.$t('ecx9887.flows.yuanUnit')}` : ''
      if (this.flowType === 'recharge') {
        return [
          { prop: 'flow_id', label: this.$t('ecx9887.flows.colRechargeFlowId'), minWidth: 170 },
          {
            prop: 'recharge_method',
            label: this.$t('ecx9887.flows.colRechargeMethod'),
            minWidth: 100,
            formatter: (_value, row) => vm.rechargeMethodLabel(row.recharge_method)
          },
          { prop: 'member_display', label: this.$t('ecx9887.flows.colRechargeMember'), minWidth: 180 },
          {
            prop: 'amount_yuan',
            label: this.$t('ecx9887.flows.colRechargeAmount'),
            minWidth: 110,
            sortable: 'custom',
            formatter: amountFormatter
          },
          { prop: 'shop_name', label: this.$t('ecx9887.flows.colShopName'), minWidth: 140 },
          {
            prop: 'recharged_at',
            label: this.$t('ecx9887.flows.colRechargeTime'),
            minWidth: 160,
            sortable: 'custom'
          }
        ]
      }
      if (this.flowType === 'consume') {
        return [
          { prop: 'order_id', label: this.$t('ecx9887.flows.colOrderId'), minWidth: 140, sortable: 'custom' },
          { prop: 'member_display', label: this.$t('ecx9887.flows.colConsumeMember'), minWidth: 180 },
          {
            prop: 'amount_yuan',
            label: this.$t('ecx9887.flows.colConsumeAmount'),
            minWidth: 110,
            sortable: 'custom',
            formatter: amountFormatter
          },
          {
            prop: 'consumed_at',
            label: this.$t('ecx9887.flows.colConsumeTime'),
            minWidth: 160,
            sortable: 'custom'
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
          sortable: 'custom',
          formatter: amountFormatter
        },
        {
          prop: 'refunded_at',
          label: this.$t('ecx9887.flows.colRefundTime'),
          minWidth: 160,
          sortable: 'custom'
        }
      ]
    }
  },
  mounted() {
    this.restoreSort()
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
    flowRowKey(row) {
      return row.flow_id || row.order_id || row.id
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
    onFlowTypeChange(name) {
      if (name === this.flowType) {
        return
      }
      this.flowType = name
      this.restoreSort()
    },
    clearStoreSelection() {
      this.selectedShopIds = []
      this.storePickerLabelText = ''
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
      this.$refs.flowTable?.refresh(true)
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
      this.$refs.flowTable?.refresh(true)
    },
    unwrapApiData(res) {
      return res?.data?.data != null ? res.data.data : res?.data ?? res ?? {}
    },
    async fetchSummaryFromLastParams() {
      try {
        const summaryParams = { ...this.lastSearchParams }
        delete summaryParams.page
        delete summaryParams.pageNum
        delete summaryParams.pageSize
        delete summaryParams.page_size
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
        const params = { ...this.flowTableParams }
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
