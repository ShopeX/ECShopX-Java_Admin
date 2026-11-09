<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->
<template>
  <div v-loading="loading" class="flex flex-col gap-4 bg-white border border-[#e6e6e6] rounded-lg p-5 h-full">
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <h3 class="m-0 text-base font-medium text-[#212121]">{{ $t('9f3ca0ff.6f84dd') }}</h3>
      <el-button type="primary" size="small" @click="onCreate">
        {{ $t('9f3ca0ff.b2861e') }}
      </el-button>
    </div>

    <div class="flex items-center gap-2 flex-wrap">
      <el-input
        v-model="filters.name"
        class="w-[220px] max-w-full"
        :placeholder="$t('9f3ca0ff.39834b')"
        clearable
        @keyup.enter.native="onSearch"
      />
      <el-button type="primary" size="small" @click="onSearch">{{ $t('9f3ca0ff.bee912') }}</el-button>
      <el-button size="small" @click="onReset">{{ $t('9f3ca0ff.4b9c32') }}</el-button>
    </div>

    <SpTable
      class="[&_.el-table__row]:cursor-default"
      :data="list"
      :columns="tableColumns"
      row-key="id"
      :show-pager="false"
    />

    <div class="flex justify-end">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next"
        :current-page="page"
        :page-size="pageSize"
        :page-sizes="[10, 20, 50]"
        :total="total"
        @size-change="onSizeChange"
        @current-change="onPageChange"
      />
    </div>

    <ActivityDialog ref="activityDialog" @success="loadList" />
  </div>
</template>

<script>
import SpTable from '@/components/sp-table'
import { getActivityList, stopActivity } from '@/api/memberSignin'
import { unwrap, formatActivityRange, STATUS_MAP } from '../utils'
import ActivityDialog from './ActivityDialog.vue'

export default {
  name: 'ActivityListPanel',
  components: {
    SpTable,
    ActivityDialog
  },
  data() {
    return {
      loading: false,
      filters: {
        name: ''
      },
      page: 1,
      pageSize: 10,
      total: 0,
      list: []
    }
  },
  computed: {
    tableColumns() {
      const vm = this
      return [
        {
          prop: 'id',
          label: 'ID',
          minWidth: 80
        },
        {
          prop: 'name',
          label: vm.$t('9f3ca0ff.39834b'),
          minWidth: 160
        },
        {
          prop: 'time',
          label: vm.$t('9f3ca0ff.c799f5'),
          minWidth: 220,
          render: {
            functional: true,
            render(h, { props: { row } }) {
              return h(
                'span',
                formatActivityRange(row.begin_time, row.end_time)
              )
            }
          }
        },
        {
          prop: 'display_status',
          label: vm.$t('9f3ca0ff.3fea7c'),
          minWidth: 100,
          render: {
            functional: true,
            render(h, { props: { row } }) {
              const status = STATUS_MAP[row.display_status] || {
                label: row.display_status || '-',
                type: 'info'
              }
              return h(
                'el-tag',
                {
                  props: {
                    type: status.type,
                    size: 'small'
                  }
                },
                status.label
              )
            }
          }
        },
        {
          prop: 'actions',
          label: vm.$t('9f3ca0ff.2b6bc0'),
          minWidth: 160,
          render: {
            functional: true,
            render(h, { props: { row } }) {
              return vm.renderActions(h, row)
            }
          }
        }
      ]
    }
  },
  mounted() {
    this.loadList()
  },
  methods: {
    renderActions(h, row) {
      const children = []
      const isEnded = row.display_status === 'ended'

      if (!isEnded) {
        children.push(
          h(
            'span',
            {
              class: 'text-[#409eff] cursor-pointer text-sm mr-3',
              on: {
                click: () => this.onEdit(row)
              }
            },
            this.$t('9f3ca0ff.95b351')
          )
        )
      }

      children.push(
        h(
          'span',
          {
            class: 'text-[#409eff] cursor-pointer text-sm mr-3',
            on: {
              click: () => this.onCopy(row)
            }
          },
          this.$t('9f3ca0ff.79d3ab')
        )
      )

      if (!isEnded) {
        children.push(
          h(
            'span',
            {
              class: 'text-[#f56c6c] cursor-pointer text-sm',
              on: {
                click: () => this.onStop(row)
              }
            },
            this.$t('9f3ca0ff.c6ae34')
          )
        )
      }

      return h('div', { class: 'flex items-center flex-wrap' }, children)
    },
    buildQueryParams() {
      const params = {
        page: this.page,
        page_size: this.pageSize
      }
      const name = (this.filters.name || '').trim()
      if (name) {
        params.name = name
      }
      return params
    },
    async loadList() {
      this.loading = true
      try {
        const res = await getActivityList(this.buildQueryParams())
        const data = unwrap(res) || {}
        this.list = Array.isArray(data.list) ? data.list : []
        this.total = Number(data.total_count) || 0
      } catch (e) {
        this.list = []
        this.total = 0
      } finally {
        this.loading = false
      }
    },
    onSearch() {
      this.page = 1
      this.loadList()
    },
    onReset() {
      this.filters.name = ''
      this.page = 1
      this.loadList()
    },
    onSizeChange(size) {
      this.pageSize = size
      this.page = 1
      this.loadList()
    },
    onPageChange(page) {
      this.page = page
      this.loadList()
    },
    onCreate() {
      this.$refs.activityDialog.openCreate()
    },
    onEdit(row) {
      this.$refs.activityDialog.openEdit(row.id)
    },
    onCopy(row) {
      this.$refs.activityDialog.openCopy(row.id)
    },
    onStop(row) {
      this.$confirm(this.$t('9f3ca0ff.21df58'), this.$t('9f3ca0ff.02d981'), { type: 'warning' })
        .then(() => stopActivity(row.id))
        .then(() => {
          this.$message.success(this.$t('9f3ca0ff.c909aa'))
          this.loadList()
        })
        .catch(() => {})
    }
  }
}
</script>
