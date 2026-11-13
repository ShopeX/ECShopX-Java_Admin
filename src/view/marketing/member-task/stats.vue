<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
      <h2 class="m-0 text-lg font-medium text-gray-800">{{ $t('128c30ba.5a2a19') }}</h2>
      <el-button type="primary" :loading="exporting" @click="onExport">{{ $t('128c30ba.ed56c9') }}</el-button>
    </div>

    <div v-loading="loading" class="min-h-[260px]">
      <div
        class="flex flex-wrap items-center gap-8 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-5 py-4"
      >
        <span class="text-[13px] text-[#4b5563]">
          {{ $t('128c30ba.344603') }}<strong class="ml-1 text-[#1f2937]">{{ stats.completion_count }}</strong>
        </span>
        <span class="text-[13px] text-[#4b5563]">
          {{ $t('128c30ba.948191') }}<strong class="ml-1 text-[#1f2937]">{{ stats.completion_user_count }}</strong>
        </span>
        <span class="text-[13px] text-[#4b5563]">
          {{ $t('128c30ba.ee8076') }}<strong class="ml-1 text-[#1f2937]">{{ attributedSpendYuan }}</strong>
        </span>
        <span class="text-[13px] text-[#4b5563]">
          {{ $t('128c30ba.57e7eb') }}<strong class="ml-1 text-[#1f2937]">{{ stats.attributed_join_count }}</strong>
        </span>
        <span class="text-[13px] text-[#9ca3af]">{{ $t('128c30ba.140521') }}{{ taskId }}</span>
      </div>

      <div class="mt-5 rounded-lg border border-[#e5e7eb] bg-white">
        <el-tabs v-model="activeGrantStatus" class="px-5 pt-3" @tab-click="onGrantTabClick">
          <el-tab-pane
            v-for="tab in grantStatusTabs"
            :key="tab.value"
            :label="tab.label"
            :name="tab.value"
          />
        </el-tabs>

        <div class="px-5 pb-5">
          <el-table
            v-loading="listLoading"
            :data="completionList"
            border
            :empty-text="$t('128c30ba.11d737')"
          >
            <el-table-column
              prop="nickname"
              :label="$t('128c30ba.aef9b7')"
              min-width="120"
              show-overflow-tooltip
            />
            <el-table-column prop="user_id" :label="$t('128c30ba.6061ba')" width="120" />
            <el-table-column :label="$t('128c30ba.7cbadb')" min-width="170">
              <template slot-scope="{ row }">
                {{ row.completed_at_text || formatCompletedAt(row.completed_at) }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('128c30ba.96aab6')" width="120">
              <template slot-scope="{ row }">
                {{ row.grant_status_label || grantStatusLabel(row.grant_status) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="error_message"
              :label="$t('128c30ba.0341b5')"
              min-width="160"
              show-overflow-tooltip
            />
            <el-table-column :label="$t('4ad97968.2b6bc0')" width="100" fixed="right">
              <template slot-scope="{ row }">
                <el-button
                  v-if="row.grant_status === 'failed' && row.grant_id"
                  type="text"
                  :loading="retryingGrantId === row.grant_id"
                  @click="onRetry(row)"
                >
                  {{ $t('128c30ba.1d8053') }}
                </el-button>
                <span v-else class="text-[#9ca3af]">-</span>
              </template>
            </el-table-column>
          </el-table>

          <div class="mt-4 flex justify-end">
            <el-pagination
              background
              layout="total, prev, pager, next, sizes"
              :current-page="page"
              :page-size="pageSize"
              :page-sizes="[10, 20, 50]"
              :total="totalCount"
              @current-change="onPageChange"
              @size-change="onPageSizeChange"
            />
          </div>
        </div>
      </div>

      <div class="mt-4 flex flex-wrap gap-3">
        <span
          v-for="(count, status) in stats.grant_status_counts"
          :key="status"
          class="rounded border border-[#e5e7eb] bg-white px-3 py-2 text-[13px] text-[#4b5563]"
        >
          {{ grantStatusLabel(status) }}<strong class="ml-1 text-[#1f2937]">{{ count }}</strong>
        </span>
      </div>
    </div>
  </SpPage>
</template>

<script>
import moment from 'moment'
import { getExportListPathWithTab } from '@/utils'
import { GRANT_STATUS_LABELS, GRANT_STATUS_TABS } from './constants'

/** 与 Apifox / 导出中心一致 */
const EXPORT_TYPE = 'export_member_task_completion'

const GRANT_TAB_I18N = {
  all: '128c30ba.a8b0c2',
  granted: '128c30ba.1f3bde',
  failed: '128c30ba.bb44ce'
}

const GRANT_STATUS_I18N = {
  pending: '128c30ba.78a7c2',
  granted: '128c30ba.43d640',
  failed: '128c30ba.9338d5',
  cancelled: '128c30ba.2111cc'
}

function createEmptyStats() {
  return {
    task_id: null,
    completion_count: 0,
    completion_user_count: 0,
    attributed_spend_fen: 0,
    attributed_join_count: 0,
    grant_status_counts: {}
  }
}

export default {
  name: 'MemberTaskStats',
  data() {
    return {
      loading: false,
      listLoading: false,
      exporting: false,
      retryingGrantId: null,
      activeGrantStatus: 'all',
      page: 1,
      pageSize: 20,
      totalCount: 0,
      completionList: [],
      stats: createEmptyStats()
    }
  },
  computed: {
    taskId() {
      return this.$route.params.id
    },
    grantStatusTabs() {
      return GRANT_STATUS_TABS.map((tab) => ({
        ...tab,
        label: this.$t(GRANT_TAB_I18N[tab.value] || tab.label)
      }))
    },
    attributedSpendYuan() {
      const fen = Number(this.stats.attributed_spend_fen) || 0
      return (fen / 100).toFixed(2)
    }
  },
  created() {
    this.loadStats()
    this.loadCompletions()
  },
  methods: {
    grantStatusLabel(status) {
      const key = GRANT_STATUS_I18N[status]
      if (key) return this.$t(key)
      return GRANT_STATUS_LABELS[status] || status || '-'
    },
    formatCompletedAt(ts) {
      if (!ts) return '-'
      return moment(Number(ts) * 1000).format('YYYY-MM-DD HH:mm:ss')
    },
    async loadStats() {
      this.loading = true
      try {
        const data = await this.$api.memberTask.getMemberTaskStats(this.taskId)
        this.stats = { ...createEmptyStats(), ...(data || {}) }
      } catch (err) {
        const msg =
          (err && err.data && err.data.message) ||
          (err && err.message) ||
          this.$t('128c30ba.017e24')
        this.$message.error(msg)
      } finally {
        this.loading = false
      }
    },
    async loadCompletions() {
      this.listLoading = true
      try {
        const params = {
          page: this.page,
          page_size: this.pageSize
        }
        if (this.activeGrantStatus && this.activeGrantStatus !== 'all') {
          params.grant_status = this.activeGrantStatus
        } else {
          params.grant_status = 'all'
        }
        const data = await this.$api.memberTask.getMemberTaskCompletions(this.taskId, params)
        this.completionList = (data && data.list) || []
        this.totalCount = (data && data.total_count) || 0
        if (data && data.page) this.page = data.page
        if (data && data.page_size) this.pageSize = data.page_size
      } catch (err) {
        this.completionList = []
        this.totalCount = 0
        const msg =
          (err && err.data && err.data.message) ||
          (err && err.message) ||
          this.$t('128c30ba.07eae6')
        this.$message.error(msg)
      } finally {
        this.listLoading = false
      }
    },
    onGrantTabClick(tab) {
      if (tab && tab.name) this.activeGrantStatus = tab.name
      this.page = 1
      this.loadCompletions()
    },
    onPageChange(page) {
      this.page = page
      this.loadCompletions()
    },
    onPageSizeChange(size) {
      this.pageSize = size
      this.page = 1
      this.loadCompletions()
    },
    async onExport() {
      this.exporting = true
      try {
        const params = {}
        if (this.activeGrantStatus && this.activeGrantStatus !== 'all') {
          params.grant_status = this.activeGrantStatus
        }
        await this.$api.memberTask.exportMemberTask(this.taskId, params)
        this.$message.success(this.$t('128c30ba.85afb7'))
        this.$router.push(getExportListPathWithTab(EXPORT_TYPE))
      } catch (err) {
        const msg =
          (err && err.data && err.data.message) ||
          (err && err.message) ||
          this.$t('128c30ba.489373')
        this.$message.error(msg)
      } finally {
        this.exporting = false
      }
    },
    onRetry(row) {
      if (!row || !row.grant_id) return
      this.$confirm(this.$t('128c30ba.3e75e4'), this.$t('4ad97968.02d981'), { type: 'warning' })
        .then(() => {
          this.retryingGrantId = row.grant_id
          return this.$api.memberTask.retryMemberTaskGrant(this.taskId, row.grant_id)
        })
        .then(() => {
          this.$message.success(this.$t('128c30ba.59948c'))
          this.loadStats()
          this.loadCompletions()
        })
        .catch((err) => {
          if (err === 'cancel' || err === 'close') return
          const msg =
            (err && err.data && err.data.message) ||
            (err && err.message) ||
            this.$t('128c30ba.160107')
          this.$message.error(msg)
        })
        .finally(() => {
          this.retryingGrantId = null
        })
    }
  }
}
</script>
