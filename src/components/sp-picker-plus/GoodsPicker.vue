<template>
  <div class="sp-goods-picker bg-card text-foreground">
    <SpFormPlus
      ref="searchForm"
      v-model="searchParams"
      class="sp-goods-picker__search -mt-[12px] !bg-white !px-0"
      :form-items="searchFormItems"
      form-type="searchForm"
      label-position="top"
      @submit="onSearch"
      @reset="onReset"
    />

    <SpFinder
      ref="finder"
      url="/goods/items"
      class="sp-goods-picker__finder bg-white"
      row-key="item_id"
      :other-config="{ 'max-height': 420 }"
      :setting="finderSetting"
      :hooks="{ beforeSearch, afterSearch }"
      :row-class-name="rowClassName"
      v-bind="finderExtraProps"
      @select="onSelect"
      @selection-change="onSelectionChange"
      @row-click="onRowClick"
    />

    <div
      v-if="multiple && selectedRows.length"
      class="mt-3 flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground"
    >
      <span>已选 {{ selectedRows.length }} 个商品</span>
      <el-button type="text" class="!p-0 !text-muted-foreground" @click="clearSelectedRows">
        清空
      </el-button>
    </div>
  </div>
</template>

<script>
import { createSetting } from '@shopex-ui/finder'
import SpFormPlus from '@/components/sp-form-plus'

function normalizeProduct(row = {}) {
  return {
    item_id: row.item_id,
    item_name: row.item_name,
    pics: row.pics,
    price: row.price
  }
}

function createSelectedMap(rows = []) {
  return rows.reduce((map, item) => {
    const product = normalizeProduct(item)
    if (product.item_id) map[product.item_id] = product
    return map
  }, {})
}

export default {
  name: 'GoodsPicker',
  components: {
    SpFormPlus
  },
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    initialSelected: {
      type: [Object, Array],
      default: null
    }
  },
  data() {
    return {
      searchParams: {
        keywords: '',
        approve_status: 'onsale',
        brand_id: '',
        category: ''
      },
      selectedRow:
        !this.multiple && this.initialSelected && !Array.isArray(this.initialSelected)
          ? { ...this.initialSelected }
          : null,
      selectedMap:
        this.multiple && Array.isArray(this.initialSelected)
          ? createSelectedMap(this.initialSelected)
          : {},
      currentPageRows: [],
      brandList: [],
      categoryList: []
    }
  },
  computed: {
    selectedRows() {
      return Object.values(this.selectedMap)
    },
    searchFormItems() {
      return [
        {
          fieldName: 'keywords',
          label: '商品名称',
          component: 'input',
          componentProps: {
            placeholder: '请输入商品名称',
            clearable: true
          }
        },
        {
          fieldName: 'approve_status',
          label: '销售状态',
          component: 'select',
          componentProps: {
            clearable: true,
            placeholder: '请选择',
            options: [
              { label: '在售', value: 'onsale' },
              { label: '下架', value: 'offsale' }
            ]
          }
        },
        {
          fieldName: 'brand_id',
          label: '品牌',
          component: 'select',
          componentProps: {
            clearable: true,
            filterable: true,
            remote: true,
            placeholder: '请选择品牌',
            remoteMethod: this.fetchBrands,
            options: this.brandList.map((item) => ({
              label: item.attribute_name,
              value: item.attribute_id
            }))
          }
        },
        {
          fieldName: 'category',
          label: '分类',
          component: 'cascader',
          componentProps: {
            clearable: true,
            placeholder: '请选择分类',
            options: this.categoryList,
            props: {
              value: 'category_id',
              label: 'category_name',
              checkStrictly: true
            }
          }
        }
      ]
    },
    finderExtraProps() {
      return this.multiple
        ? { 'reserve-selection': true }
        : { 'no-selection': true, 'highlight-current-row': true }
    },
    finderSetting() {
      return createSetting({
        columns: [
          ...(!this.multiple
            ? [
                {
                  name: '',
                  key: '__picker_check__',
                  width: 48,
                  align: 'center',
                  render: (h, { row }) => {
                    const checked = row.item_id === this.selectedRow?.item_id
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
                }
              ]
            : []),
          {
            name: '图片',
            key: 'pics',
            width: 72,
            render: (h, { row }) =>
              h('SpImage', {
                props: {
                  src: Array.isArray(row.pics) ? row.pics[0] : row.pics,
                  width: 52,
                  height: 52
                }
              })
          },
          { name: '商品名称', key: 'item_name', minWidth: 220 },
          { name: '货号', key: 'item_bn', width: 140 },
          {
            name: '售价',
            key: 'price',
            width: 100,
            render: (h, { row }) => h('span', {}, `¥${(Number(row.price) / 100).toFixed(2)}`)
          },
          { name: '库存', key: 'store', width: 80 }
        ]
      })
    }
  },
  mounted() {
    this.fetchBrands()
    this.fetchCategories()
  },
  methods: {
    beforeSearch(params) {
      const category = this.searchParams.category
      return {
        ...params,
        ...this.searchParams,
        item_type: 'normal',
        audit_status: 'approved',
        is_sku: false,
        category: Array.isArray(category) ? category[category.length - 1] : category
      }
    },
    afterSearch(response) {
      if (!this.multiple || !this.selectedRows.length) return response

      const selectedIds = new Set(this.selectedRows.map((item) => item.item_id))
      const list = response?.data?.data?.list || []
      this.currentPageRows = list
      const selectedRows = list.filter((item) => selectedIds.has(item.item_id))

      this.$nextTick(() => {
        const table = this.$refs.finder?.$refs?.finderTable?.$refs?.finderTable
        if (table && selectedRows.length) table.setSelection(selectedRows)
      })

      return response
    },
    onSearch() {
      this.$refs.finder.refresh(true)
    },
    onReset() {
      this.searchParams = {
        keywords: '',
        approve_status: 'onsale',
        brand_id: '',
        category: ''
      }
      this.$refs.finder.refresh(true)
    },
    rowClassName({ row }) {
      return !this.multiple && row.item_id === this.selectedRow?.item_id ? 'is-picker-selected' : ''
    },
    onRowClick(row) {
      if (this.multiple) return
      this.selectedRow = this.selectedRow?.item_id === row.item_id ? null : normalizeProduct(row)
    },
    onSelect() {},
    onSelectionChange(rows) {
      if (!this.multiple) return
      const nextPageSelectedIds = new Set((rows || []).map((row) => row.item_id).filter(Boolean))
      ;(this.currentPageRows || []).forEach((row) => {
        if (!row?.item_id) return
        if (!nextPageSelectedIds.has(row.item_id)) this.$delete(this.selectedMap, row.item_id)
      })
      ;(rows || []).forEach((row) => {
        if (row?.item_id) this.$set(this.selectedMap, row.item_id, normalizeProduct(row))
      })
    },
    clearSelectedRows() {
      this.selectedMap = {}
      const table = this.$refs.finder?.$refs?.finderTable?.$refs?.finderTable
      table?.clearSelection?.()
    },
    submit() {
      if (!this.multiple) {
        if (!this.selectedRow) {
          this.$message.warning('请先选择商品')
          return
        }
        this.$emit('close', this.selectedRow)
        return
      }

      if (!this.selectedRows.length) {
        this.$message.warning('请至少选择一个商品')
        return
      }
      this.$emit('close', this.selectedRows)
    },
    async fetchBrands(name = '') {
      try {
        const { list } = await this.$api.goods.getGoodsAttr({
          page: 1,
          pageSize: 100,
          attribute_type: 'brand',
          attribute_name: name
        })
        this.brandList = list || []
      } catch (error) {
        this.brandList = []
      }
    },
    async fetchCategories() {
      try {
        this.categoryList = (await this.$api.goods.getCategory({ is_show: false })) || []
      } catch (error) {
        this.categoryList = []
      }
    }
  }
}
</script>

<style scoped lang="scss">
.sp-goods-picker ::v-deep {
  .el-table__row {
    cursor: pointer;
  }

  .el-table__body tr.is-picker-selected > td,
  .el-table__body tr:hover > td {
    background: hsl(var(--primary) / 0.08);
  }
}
</style>
