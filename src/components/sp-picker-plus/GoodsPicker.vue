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

    <SpTable
      ref="table"
      url="/goods/items"
      class="sp-goods-picker__table bg-white"
      :row-key="idKey"
      max-height="420"
      :columns="columns"
      :hooks="{ beforeSearch, afterSearch }"
      :params="searchParams"
      :selection-mode="multiple ? 'multiple' : 'single'"
      :reserve-selection="multiple"
      :selected-rows.sync="selectedRowsValue"
    />

    <div
      v-if="selectedRows.length"
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
import SpFormPlus from '@/components/sp-form-plus'
import SpTable from '@/components/sp-table'
import { getCurrentCountryCode } from '@/i18n'

export default {
  name: 'GoodsPicker',
  components: {
    SpFormPlus,
    SpTable
  },
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    initialSelected: {
      type: [Object, Array],
      default: null
    },
    idKey: {
      type: String,
      default: 'item_id'
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
      selectedMap: {},
      currentPageRows: [],
      brandList: [],
      categoryList: []
    }
  },
  computed: {
    selectedRowsValue: {
      get() {
        return this.multiple
          ? Object.values(this.selectedMap)
          : this.selectedRow
          ? [this.selectedRow]
          : []
      },
      set(rows) {
        if (this.multiple) {
          this.syncMultipleSelection(rows)
          return
        }
        this.selectedRow = rows?.[0] ? this.normalizeProduct(rows[0]) : null
      }
    },
    selectedRows() {
      return this.multiple
        ? Object.values(this.selectedMap)
        : this.selectedRow
        ? [this.selectedRow]
        : []
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
    columns() {
      return [
        {
          name: '图片',
          key: 'pics',
          width: 72,
          render: {
            functional: true,
            render: (h, { props }) =>
              h('SpImage', {
                props: {
                  src: Array.isArray(props.row.pics) ? props.row.pics[0] : props.row.pics,
                  width: 52,
                  height: 52
                }
              })
          }
        },
        { name: '商品名称', key: 'item_name', minWidth: 220 },
        { name: '货号', key: 'item_bn' },
        {
          name: '售价',
          key: 'price',
          width: 100,
          formatter: (value) => `¥${(Number(value || 0) / 100).toFixed(2)}`
        },
        { name: '库存', key: 'store', width: 80 }
      ]
    }
  },
  created() {
    if (this.multiple && Array.isArray(this.initialSelected)) {
      this.selectedMap = this.createSelectedMap(this.initialSelected)
    }
  },
  mounted() {
    this.fetchBrands()
    this.fetchCategories()
  },
  methods: {
    getRowId(row = {}) {
      if (this.idKey === 'goods_id') {
        return row.goods_id ?? row.goodsId
      }
      return row.item_id ?? row.itemId
    },
    normalizeProduct(row = {}) {
      const id = this.getRowId(row)
      const base = {
        item_name: row.item_name || row.itemName,
        pics: row.pics,
        price: row.price
      }
      if (this.idKey === 'goods_id') {
        return { ...base, goods_id: id, goodsId: id }
      }
      return { ...base, item_id: id, itemId: id }
    },
    createSelectedMap(rows = []) {
      return rows.reduce((map, item) => {
        const product = this.normalizeProduct(item)
        const id = this.getRowId(product)
        if (id) map[id] = product
        return map
      }, {})
    },
    beforeSearch(params) {
      const category = this.searchParams.category
      return {
        ...params,
        ...this.searchParams,
        item_type: 'normal',
        audit_status: 'approved',
        is_sku: false,
        country_code: getCurrentCountryCode(),
        category: Array.isArray(category) ? category[category.length - 1] : category
      }
    },
    afterSearch(response) {
      const list = response?.data?.data?.list || response?.data?.list || response?.list || []
      this.currentPageRows = list
      return response
    },
    onSearch() {
      this.$refs.table.refresh(true)
    },
    onReset() {
      this.searchParams = {
        keywords: '',
        approve_status: 'onsale',
        brand_id: '',
        category: ''
      }
      this.$refs.table.refresh(true)
    },
    syncMultipleSelection(rows = []) {
      if (!this.multiple) return
      const nextPageSelectedIds = new Set(
        (rows || []).map((row) => this.getRowId(row)).filter(Boolean)
      )
      ;(this.currentPageRows || []).forEach((row) => {
        const id = this.getRowId(row)
        if (!id) return
        if (!nextPageSelectedIds.has(id)) this.$delete(this.selectedMap, id)
      })
      ;(rows || []).forEach((row) => {
        const id = this.getRowId(row)
        if (id) this.$set(this.selectedMap, id, this.normalizeProduct(row))
      })
    },
    clearSelectedRows() {
      this.selectedRow = null
      this.selectedMap = {}
      this.$refs.table?.clearSelection?.()
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
  .sp-goods-picker__search.sp-form-plus--actions-bottom .sp-form-plus__wrapper {
    grid-template-columns: repeat(4, minmax(180px, 1fr));
  }
}
</style>
