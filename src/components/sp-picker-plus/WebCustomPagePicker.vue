<template>
  <div class="sp-web-custom-page-picker bg-card text-foreground px-3">
    <SpFormPlus
      ref="searchForm"
      v-model="searchParams"
      class="sp-web-custom-page-picker__search -mt-[12px] !bg-white !px-0"
      :form-items="searchFormItems"
      form-type="searchForm"
      search-actions-layout="inline"
      label-width="80px"
      @submit="onSearch"
      @reset="onReset"
    />

    <SpTable
      ref="table"
      url="/pctemplate/lists"
      class="sp-web-custom-page-picker__table bg-white"
      row-key="theme_pc_template_id"
      max-height="420"
      :columns="columns"
      :hooks="{ beforeSearch, afterSearch }"
      :params="searchParams"
      selection-mode="single"
      :selected-rows.sync="selectedRowsValue"
    />
  </div>
</template>

<script>
import SpFormPlus from '@/components/sp-form-plus'
import SpTable from '@/components/sp-table'

export default {
  name: 'WebCustomPagePicker',
  components: {
    SpFormPlus,
    SpTable
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
        template_title: ''
      },
      selectedRow: null
    }
  },
  watch: {
    initialSelected: {
      immediate: true,
      handler(value) {
        this.selectedRow = value ? this.toSelectionRow(value) : null
      }
    }
  },
  computed: {
    selectedRowsValue: {
      get() {
        return this.selectedRow ? [this.selectedRow] : []
      },
      set(rows) {
        this.selectedRow = rows?.[0] ? this.normalizeSelectedRow(rows[0]) : null
      }
    },
    searchFormItems() {
      return [
        {
          fieldName: 'template_title',
          label: '页面名称',
          component: 'input',
          componentProps: {
            placeholder: '请输入页面名称',
            clearable: true
          }
        }
      ]
    },
    columns() {
      return [
        { name: '页面名称', key: 'template_title', minWidth: 260 },
        {
          name: '页面描述',
          key: 'template_description',
          minWidth: 360,
          render: {
            functional: true,
            render: (h, { props }) =>
              h('span', { class: 'text-muted-foreground' }, props.row.template_description || '—')
          }
        }
      ]
    }
  },
  methods: {
    toSelectionRow(source) {
      if (!source) return null
      const id = source.theme_pc_template_id ?? source.id
      if (id == null || id === '') return null
      const title = source.template_title ?? source.title ?? ''
      return {
        theme_pc_template_id: id,
        id,
        template_title: title,
        title
      }
    },
    beforeSearch(query) {
      return { ...query, ...this.searchParams, page_type: 'custom' }
    },
    afterSearch(response) {
      const list =
        response?.data?.data?.list || response?.data?.list || response?.list || []
      if (!this.selectedRow || !Array.isArray(list) || !list.length) return response
      const targetId = String(this.selectedRow.theme_pc_template_id ?? this.selectedRow.id)
      const matched = list.find((row) => String(row.theme_pc_template_id) === targetId)
      if (matched) {
        this.selectedRow = this.normalizeSelectedRow(matched)
      }
      return response
    },
    onSearch() {
      this.$refs.table.refresh(true)
    },
    onReset() {
      this.searchParams = { template_title: '' }
      this.$refs.table.refresh(true)
    },
    normalizeSelectedRow(row) {
      const id = row.theme_pc_template_id ?? row.id
      const title = row.template_title ?? row.title ?? ''
      return {
        theme_pc_template_id: id,
        id,
        template_title: title,
        title
      }
    },
    submit() {
      if (!this.selectedRow) {
        this.$message.warning('请先选择一个自定义页面')
        return
      }
      this.$emit('close', this.selectedRow)
    },
    // 兼容 $picker.path / PickerPath 的 getVal 协议
    getVal() {
      if (!this.selectedRow) return { data: [] }
      return {
        data: [
          {
            id: this.selectedRow.id,
            page_name: this.selectedRow.title
          }
        ]
      }
    }
  }
}
</script>

<style scoped lang="scss">
.sp-web-custom-page-picker__search ::v-deep {
  .sp-form-plus__wrapper .form-field {
    width: 280px;
    max-width: 100%;
  }
}
</style>
