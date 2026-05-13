<template>
  <div class="sp-web-nav-picker bg-card text-foreground">
    <SpFormPlus
      ref="searchForm"
      v-model="searchParams"
      class="sp-web-nav-picker__search -mt-[12px] !bg-white"
      :form-items="searchFormItems"
      form-type="searchForm"
      @submit="onSearch"
      @reset="onReset"
    />

    <SpFinder
      ref="finder"
      url="/web-menus"
      class="sp-web-nav-picker__finder bg-white"
      row-key="id"
      no-selection
      highlight-current-row
      :setting="finderSetting"
      :hooks="{ beforeSearch }"
      :row-class-name="rowClassName"
      @row-click="onRowClick"
    />
  </div>
</template>

<script>
import { createSetting } from '@shopex-ui/finder'
import SpFormPlus from '@/components/sp-form-plus'

export default {
  name: 'WebNavPicker',
  components: {
    SpFormPlus
  },
  props: {
    initialSelected: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      searchParams: {
        name: ''
      },
      selectedRow: this.initialSelected ? { ...this.initialSelected } : null
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
          {
            name: '',
            key: '__picker_checkbox__',
            width: 72,
            align: 'center',
            render: (h, { row }) => {
              const checked = row.id === this.selectedRow?.id
              return h(
                'span',
                {
                  class: [
                    'inline-flex h-4 w-4 items-center justify-center rounded border border-solid transition-colors',
                    checked
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-card text-transparent'
                  ],
                  on: {
                    click: (event) => {
                      event.stopPropagation()
                      this.onRowClick(row)
                    }
                  }
                },
                [h('i', { class: 'el-icon-check text-xs font-bold leading-none' })]
              )
            }
          },
          { name: '导航菜单', key: 'name', minWidth: 260 },
          {
            name: '菜单项',
            key: 'top_level_item_names',
            minWidth: 420,
            render: (h, { row }) =>
              h(
                'span',
                {
                  class: 'text-muted-foreground',
                  attrs: {
                    title: this.getMenuItemText(row)
                  }
                },
                this.getMenuItemText(row)
              )
          }
        ]
      })
    }
  },
  methods: {
    beforeSearch(query) {
      const params = { ...query, ...this.searchParams }
      if (params.page_size == null && params.pageSize != null) {
        params.page_size = params.pageSize
      }
      return params
    },
    onSearch() {
      this.$refs.finder.refresh(true)
    },
    onReset() {
      this.searchParams = { name: '' }
      this.$refs.finder.refresh(true)
    },
    onRowClick(row) {
      this.selectedRow = {
        id: row.id,
        name: row.name,
        key: row.key
      }
    },
    getMenuItemText(row) {
      const text = row.top_level_item_names ?? row.menu_item_names ?? row.item_names ?? ''
      return String(text).trim() || '—'
    },
    rowClassName({ row }) {
      return row.id === this.selectedRow?.id ? 'is-picker-selected' : ''
    },
    submit() {
      if (!this.selectedRow) {
        this.$message.warning('请先选择一个导航菜单')
        return
      }
      this.$emit('close', this.selectedRow)
    }
  }
}
</script>

<style scoped lang="scss">
.sp-web-nav-picker ::v-deep {
  .el-table__row {
    cursor: pointer;
  }

  .el-table__body tr.current-row > td,
  .el-table__body tr.is-picker-selected > td,
  .el-table__body tr:hover > td {
    background: hsl(var(--primary) / 0.08);
  }
}
</style>
