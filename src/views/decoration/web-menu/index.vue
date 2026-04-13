<!--
  Web 端商城 — 导航菜单列表（ThemeBundle /web-menus）
  新增 → /decoration/web-menu/create；编辑 → /decoration/web-menu/:id；删除：Finder api
-->
<template>
  <SpPage>
    <SpFormPlus
      ref="searchForm"
      v-model="searchParams"
      :form-items="searchFormItems"
      form-type="searchForm"
      @submit="onSearch"
    />

    <div class="action-container mt-4">
      <el-button type="primary" @click="goCreate">新增菜单</el-button>
    </div>

    <SpFinder
      ref="finder"
      url="/web-menus"
      fixed-row-action
      no-selection
      row-key="id"
      :setting="finderSetting"
      :hooks="{ beforeSearch: beforeSearch }"
    />
  </SpPage>
</template>

<script>
import { createSetting } from '@shopex-ui/finder'
import SpFormPlus from '@/components/sp-form-plus'

export default {
  name: 'WebMenuIndex',
  components: { SpFormPlus },
  data() {
    return {
      searchParams: { name: '' }
    }
  },
  computed: {
    searchFormItems() {
      return [
        {
          fieldName: 'name',
          label: '菜单名称',
          component: 'input',
          componentProps: {
            placeholder: '请输入菜单名称',
            clearable: true
          }
        }
      ]
    },
    finderSetting() {
      return createSetting({
        columns: [
          { name: 'ID', key: 'id', width: 80 },
          { name: '导航菜单', key: 'name' },
          {
            name: '菜单项',
            key: 'items_count',
            width: 100,
            render: (h, scope) => {
              const n = scope.row.items_count
              const text = n != null && n !== '' ? `${Number(n)} 项` : '0 项'
              return h('span', { style: { color: '#909399' } }, text)
            }
          }
        ],
        actions: [
          {
            name: '编辑',
            key: 'edit',
            type: 'button',
            buttonType: 'text',
            action: {
              type: 'link',
              handler: ([row]) => row && this.$router.push(`/decoration/web-menu/${row.id}`)
            }
          },
          {
            name: '删除',
            key: 'delete',
            type: 'button',
            buttonType: 'text',
            action: {
              type: 'api',
              path: '/web-menus/{id}',
              method: 'delete',
              confirm: true,
              confirmTip: (rows) => {
                const row = Array.isArray(rows) ? rows[0] : rows
                return row ? `确认删除菜单「${row.name}」？其下所有菜单项将一并删除。` : ''
              }
            }
          }
        ]
      })
    }
  },
  methods: {
    goCreate() {
      this.$router.push('/decoration/web-menu/create')
    },
    onSearch() {
      this.$refs.finder.refresh(true)
    },
    beforeSearch(query) {
      const q = { ...query, ...this.searchParams }
      if (q.page_size == null && q.pageSize != null) {
        q.page_size = q.pageSize
      }
      return q
    }
  }
}
</script>
