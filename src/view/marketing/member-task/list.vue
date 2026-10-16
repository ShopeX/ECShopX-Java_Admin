<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpRouterView>
      <SpFormPlus
        ref="searchForm"
        v-model="searchParams"
        class="mb-4"
        form-type="searchForm"
        :form-items="searchFormItems"
        @submit="onSearch"
        @reset="onReset"
      />

      <div class="action-container mb-3">
        <el-button type="primary" icon="el-icon-plus" @click="onAdd">{{ $t('4ad97968.482d9d') }}</el-button>
        <el-button
          type="primary"
          icon="el-icon-download"
          :loading="exportingOverview"
          @click="onExportOverview"
        >
          {{ $t('4ad97968.20b7d8') }}
        </el-button>
      </div>

      <el-tabs v-model="activeStatus" class="mb-3" @tab-click="onTabClick">
        <el-tab-pane
          v-for="tab in statusTabs"
          :key="tab.name"
          :label="tab.label"
          :name="tab.name"
        />
      </el-tabs>

      <SpTable
        ref="table"
        url="/promotions/member-tasks"
        :params="tableParams"
        :columns="tableColumns"
        :hooks="{ beforeSearch }"
        :page-size="20"
        row-key="task_id"
        selection-mode="multiple"
      />
    </SpRouterView>
  </SpPage>
</template>

<script>
import SpTable from '@/components/sp-table'
import { getExportListPathWithTab } from '@/utils'
import {
  DISPLAY_STATUS_MAP,
  STATUS_TABS,
  TYPE_CASCADER_OPTIONS,
  formatReward,
  formatTaskTime,
  formatTypeLabel
} from './constants'

const OVERVIEW_EXPORT_TYPE = 'export_member_task_overview'

export default {
  name: 'MemberTaskList',
  components: { SpTable },
  data() {
    return {
      activeStatus: 'all',
      statusTabs: STATUS_TABS,
      exportingOverview: false,
      searchParams: {
        task_id: '',
        name: '',
        type_detail: '',
        timeRange: []
      },
      appliedFilter: {
        task_id: '',
        name: '',
        type_detail: '',
        filter_begin: undefined,
        filter_end: undefined
      }
    }
  },
  created() {
    // SpRouterView 保活列表；子页保存返回时通过 onActivated → $activated 刷新
    // resetPage=true 回第 1 页（新建）；false 保留当前页（编辑）
    this.$activated = (_from, _to, resetPage = false) => {
      this.$nextTick(() => {
        if (this.$refs.table) this.$refs.table.refresh(!!resetPage)
      })
    }
  },
  computed: {
    searchFormItems() {
      const t = this.$t.bind(this)
      return [
        {
          fieldName: 'task_id',
          label: t('4ad97968.3a3778'),
          component: 'input',
          cellWidth: 1.3,
          componentProps: {
            clearable: true,
            placeholder: t('4ad97968.624dd1')
          }
        },
        {
          fieldName: 'name',
          label: t('4ad97968.78caf7'),
          component: 'input',
          cellWidth: 1.3,
          componentProps: {
            clearable: true,
            placeholder: t('4ad97968.64615c')
          }
        },
        {
          fieldName: 'type_detail',
          label: t('4ad97968.bb763c'),
          component: 'cascader',
          cellWidth: 1.3,
          componentProps: {
            clearable: true,
            placeholder: t('4ad97968.217528'),
            options: TYPE_CASCADER_OPTIONS,
            props: {
              expandTrigger: 'hover',
              emitPath: false
            }
          }
        },
        {
          fieldName: 'timeRange',
          label: t('4ad97968.b341f9'),
          component: 'datetimepicker',
          cellWidth: 2,
          componentProps: {
            type: 'datetimerange'
          }
        }
      ]
    },
    tableParams() {
      const params = { ...this.appliedFilter }
      if (this.activeStatus && this.activeStatus !== 'all') {
        params.display_status = this.activeStatus
      }
      return params
    },
    tableColumns() {
      const vm = this
      return [
        { key: 'task_id', label: 'ID', width: 80 },
        { key: 'name', label: vm.$t('4ad97968.78caf7'), minWidth: 220 },
        {
          key: 'type_label',
          label: vm.$t('4ad97968.bb763c'),
          minWidth: 180,
          formatter: (_value, row) => formatTypeLabel(row)
        },
        {
          key: 'display_status',
          label: vm.$t('4ad97968.3fea7c'),
          width: 100,
          render: {
            functional: true,
            render(h, { props }) {
              const status = props.row.display_status
              const meta = DISPLAY_STATUS_MAP[status] || { label: status || '-', tagType: 'info' }
              return h('el-tag', { props: { type: meta.tagType, size: 'small' } }, [meta.label])
            }
          }
        },
        {
          key: 'task_time',
          label: vm.$t('4ad97968.b341f9'),
          minWidth: 320,
          formatter: (_value, row) => formatTaskTime(row)
        },
        {
          key: 'rewards',
          label: vm.$t('4ad97968.897b3c'),
          minWidth: 140,
          formatter: (_value, row) => formatReward(row)
        },
        {
          key: 'actions',
          label: vm.$t('4ad97968.2b6bc0'),
          width: 280,
          fixed: 'right',
          render: {
            functional: true,
            render(h, { props }) {
              const row = props.row
              const status = row.display_status
              const children = []
              // 文档 1.1.6：活动发布后不可修改，仅待发布（draft）可编辑；其余状态走只读详情
              if (status === 'draft') {
                children.push(
                  h(
                    'el-button',
                    { props: { type: 'text' }, on: { click: () => vm.onEdit(row) } },
                    [vm.$t('4ad97968.95b351')]
                  )
                )
              } else {
                children.push(
                  h(
                    'el-button',
                    { props: { type: 'text' }, on: { click: () => vm.onDetail(row) } },
                    [vm.$t('4ad97968.f26225')]
                  )
                )
              }
              children.push(
                h(
                  'el-button',
                  { props: { type: 'text' }, on: { click: () => vm.onCopy(row) } },
                  [vm.$t('4ad97968.79d3ab')]
                ),
                h(
                  'el-button',
                  { props: { type: 'text' }, on: { click: () => vm.onStats(row) } },
                  [vm.$t('4ad97968.d7656a')]
                )
              )
              if (status === 'draft') {
                children.push(
                  h(
                    'el-button',
                    {
                      props: { type: 'primary', size: 'mini' },
                      class: 'ml-1',
                      on: { click: () => vm.onPublish(row) }
                    },
                    [vm.$t('4ad97968.83611a')]
                  )
                )
              }
              if (status === 'pending_start' || status === 'in_progress') {
                children.push(
                  h(
                    'el-button',
                    {
                      props: { type: 'text' },
                      style: { color: '#F56C6C' },
                      on: { click: () => vm.onOffShelf(row) }
                    },
                    [vm.$t('4ad97968.d2379a')]
                  )
                )
              }
              return h('div', { class: 'table-actions' }, children)
            }
          }
        }
      ]
    }
  },
  methods: {
    beforeSearch(params) {
      const next = { ...params }
      Object.keys(next).forEach((key) => {
        if (next[key] === '' || next[key] === undefined || next[key] === null) {
          delete next[key]
        }
      })
      return next
    },
    toUnixSeconds(value) {
      if (value === null || value === undefined || value === '') return undefined
      if (typeof value === 'object' && typeof value.getTime === 'function') {
        return Math.floor(value.getTime() / 1000)
      }
      const num = Number(value)
      if (Number.isNaN(num)) return undefined
      // datetimepicker timestamp 可能是毫秒
      return num > 1e12 ? Math.floor(num / 1000) : Math.floor(num)
    },
    buildAppliedFilter() {
      const { task_id, name, type_detail, timeRange } = this.searchParams

      let filter_begin
      let filter_end
      if (Array.isArray(timeRange) && timeRange.length === 2 && timeRange[0] && timeRange[1]) {
        filter_begin = this.toUnixSeconds(timeRange[0])
        filter_end = this.toUnixSeconds(timeRange[1])
      }

      return {
        task_id: (task_id || '').trim(),
        name: (name || '').trim(),
        type_detail: type_detail || '',
        filter_begin,
        filter_end
      }
    },
    validateTimeRange() {
      const range = this.searchParams.timeRange
      if (!range) return true
      if (!Array.isArray(range)) return true
      const [start, end] = range
      const hasStart = start !== null && start !== undefined && start !== ''
      const hasEnd = end !== null && end !== undefined && end !== ''
      if (hasStart !== hasEnd) {
        this.$message.warning(this.$t('4ad97968.a6c0e0'))
        return false
      }
      return true
    },
    onSearch() {
      if (!this.validateTimeRange()) return
      this.appliedFilter = this.buildAppliedFilter()
      this.$nextTick(() => {
        if (this.$refs.table) this.$refs.table.refresh(true)
      })
    },
    onReset() {
      this.searchParams = {
        task_id: '',
        name: '',
        type_detail: '',
        timeRange: []
      }
      this.appliedFilter = {
        task_id: '',
        name: '',
        type_detail: '',
        filter_begin: undefined,
        filter_end: undefined
      }
      this.$nextTick(() => {
        if (this.$refs.table) this.$refs.table.refresh(true)
      })
    },
    onTabClick() {
      this.$nextTick(() => {
        if (this.$refs.table) this.$refs.table.refresh(true)
      })
    },
    onAdd() {
      this.$router.push({ path: this.matchRoutePath('editor') })
    },
    onEdit(row) {
      this.$router.push({
        path: this.matchRoutePath(`editor/${row.task_id}`),
        query: { display_status: row.display_status || 'draft' }
      })
    },
    /** 非草稿只读查看（编辑页 readonly 已按 display_status 处理） */
    onDetail(row) {
      this.$router.push({
        path: this.matchRoutePath(`editor/${row.task_id}`),
        query: { display_status: row.display_status || 'in_progress' }
      })
    },
    onCopy(row) {
      this.$router.push({
        path: this.matchRoutePath('editor'),
        query: { clone_id: row.task_id }
      })
    },
    onStats(row) {
      this.$router.push({ path: this.matchRoutePath(`stats/${row.task_id}`) })
    },
    async onExportOverview() {
      if (!this.validateTimeRange()) return
      this.exportingOverview = true
      try {
        const params = this.beforeSearch({ ...this.tableParams })
        await this.$api.memberTask.exportMemberTaskOverview(params)
        this.$message.success(this.$t('4ad97968.c94697'))
        this.$router.push(getExportListPathWithTab(OVERVIEW_EXPORT_TYPE))
      } catch (err) {
        const msg =
          (err && err.data && err.data.message) ||
          (err && err.message) ||
          this.$t('128c30ba.489373')
        this.$message.error(msg)
      } finally {
        this.exportingOverview = false
      }
    },
    onPublish(row) {
      this.$confirm(this.$t('4ad97968.bae6d5'), this.$t('4ad97968.02d981'), { type: 'warning' })
        .then(() => this.$api.memberTask.publishMemberTask(row.task_id))
        .then(() => {
          this.$message.success(this.$t('4ad97968.2fff07'))
          if (this.$refs.table) this.$refs.table.refresh()
        })
        .catch((err) => {
          if (err === 'cancel' || err === 'close') return
          const msg =
            (err && err.data && err.data.message) ||
            (err && err.message) ||
            this.$t('4ad97968.250688')
          this.$message.error(msg)
        })
    },
    onOffShelf(row) {
      this.$confirm(this.$t('4ad97968.205ab6'), this.$t('4ad97968.02d981'), { type: 'warning' })
        .then(() => this.$api.memberTask.offShelfMemberTask(row.task_id))
        .then(() => {
          this.$message.success(this.$t('4ad97968.0c6d64'))
          if (this.$refs.table) this.$refs.table.refresh()
        })
        .catch((err) => {
          if (err === 'cancel' || err === 'close') return
          const msg =
            (err && err.data && err.data.message) ||
            (err && err.message) ||
            this.$t('4ad97968.0991fa')
          this.$message.error(msg)
        })
    }
  }
}
</script>

<style scoped>
.table-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0 4px;
}
.ml-1 {
  margin-left: 4px;
}
</style>
