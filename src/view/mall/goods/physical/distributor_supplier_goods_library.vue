<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style scoped lang="scss">
.sp-filter-form {
  margin-bottom: 16px;
}
</style>
<template>
  <div class="distributor-supplier-goods-library">
    <SpRouterView>
      <SpPage>
        <SpFilterForm :model="searchParams" @onSearch="onSearch" @onReset="onSearch">
          <SpFilterFormItem prop="keywords" label="商品标题:">
            <el-input v-model="searchParams.keywords" placeholder="商品标题" />
          </SpFilterFormItem>
          <SpFilterFormItem prop="goods_bn" label="SPU编码:">
            <el-input v-model="searchParams.goods_bn" placeholder="请输入SPU编码" />
          </SpFilterFormItem>
          <SpFilterFormItem prop="supplier_name" label="来源供应商:">
            <el-input v-model="searchParams.supplier_name" placeholder="请输入来源供应商" />
          </SpFilterFormItem>
          <SpFilterFormItem prop="main_cat_id" label="管理分类:">
            <el-cascader
              v-model="searchParams.main_cat_id"
              placeholder="请选择"
              clearable
              :options="itemCategoryList"
              :props="{ value: 'category_id', label: 'category_name', checkStrictly: true }"
            />
          </SpFilterFormItem>
          <SpFilterFormItem prop="templates_id" label="运费模板:">
            <el-select v-model="searchParams.templates_id" placeholder="请选择" clearable>
              <el-option
                v-for="item in templatesList"
                :key="item.template_id"
                :label="item.name"
                :value="item.template_id"
              />
            </el-select>
          </SpFilterFormItem>
          <SpFilterFormItem prop="brand_id" label="品牌:">
            <el-select
              v-model="searchParams.brand_id"
              placeholder="商品/商标关键词"
              remote
              filterable
              clearable
              :remote-method="getGoodsBranchList"
            >
              <el-option
                v-for="item in goodsBranchList"
                :key="item.attribute_id"
                :label="item.attribute_name"
                :value="item.attribute_id"
              />
            </el-select>
          </SpFilterFormItem>
          <SpFilterFormItem prop="regions_id" label="商品产地:">
            <el-cascader
              v-model="searchParams.regions_id"
              placeholder="请选择"
              clearable
              :options="regions"
            />
          </SpFilterFormItem>
          <SpFilterFormItem prop="item_bn" label="SKU编码:">
            <el-input v-model="searchParams.item_bn" />
          </SpFilterFormItem>
        </SpFilterForm>

        <div class="action-container">
          <el-button type="primary" plain :loading="syncToShopLoading" @click="syncToShop">
            同步到店铺
          </el-button>
        </div>

        <SpFinder
          ref="finder"
          url="/goods/items"
          fixed-row-action
          row-actions-width="120px"
          :setting="tableList"
          :hooks="{ beforeSearch: beforeSearch }"
          row-actions-fixed-align="left"
          @selection-change="onSelectionChange"
        />

        <SpDrawer
          v-model="showItemSkuDrawer"
          :title="itemSkuDrawerTitle"
          :width="800"
          @confirm="
            () => {
              showItemSkuDrawer = false
            }
          "
        >
          <el-table v-loading="skuLoading" border :data="itemSkuList" height="100%">
            <el-table-column label="规格" prop="item_spec_desc" min-width="120" />
            <el-table-column label="商品货号" prop="supplier_goods_bn" min-width="120" />
            <el-table-column label="税率编码" prop="tax_rate_code" min-width="120" />
            <el-table-column label="税率" prop="tax_rate" min-width="120">
              <template slot-scope="scope">
                <span>{{ `${scope.row.tax_rate}%` }}</span>
              </template>
            </el-table-column>
          </el-table>
        </SpDrawer>
      </SpPage>
    </SpRouterView>
  </div>
</template>

<script>
import moment from 'moment'
import { GOODS_APPLY_STATUS } from '@/consts'
import { batchSyncToShop } from '@/api/goods'

export default {
  data() {
    return {
      syncToShopLoading: false,
      selectionItems: [],
      itemCategoryList: [],
      templatesList: [],
      goodsBranchList: [],
      regions: [],
      skuLoading: false,
      showItemSkuDrawer: false,
      itemSkuDrawerTitle: '',
      itemSkuList: [],
      goodsBranchParams: {
        page: 1,
        pageSize: 1000,
        attribute_type: 'brand',
        attribute_name: ''
      },
      searchParams: {
        keywords: '',
        goods_bn: '',
        supplier_name: '',
        main_cat_id: '',
        templates_id: '',
        brand_id: '',
        regions_id: [],
        item_bn: '',
        audit_status: 'approved'
      },
      tableList: {
        actions: [
          {
            name: '查看',
            key: 'view',
            type: 'button',
            buttonType: 'text',
            action: {
              type: 'link',
              handler: ([row]) => {
                this.$router.push({
                  path: `${this.$route.path}/editor/${row.item_id}`,
                  query: {
                    isSupplierGoods: true,
                    detail: true
                  }
                })
              }
            }
          }
        ],
        columns: [
          { name: '供应商品ID', key: 'item_id', width: 120, align: 'right', headerAlign: 'center' },
          {
            name: '商品ID',
            key: 'main_item_id',
            width: 120,
            align: 'right',
            headerAlign: 'center'
          },
          {
            name: '商品',
            key: 'itemName',
            width: 280,
            render: (h, scope) => {
              return (
                <div>
                  <div style="white-space: normal;">
                    {scope.row.itemName}
                    {!scope.row.nospec && (
                      <el-tag
                        size="mini"
                        effect="plain"
                        type="primary"
                        style="margin-left: 4px; cursor: default;"
                        on-click={() => {
                          this.handleViewSkuInfo(scope.row)
                        }}
                      >
                        多
                        <i
                          class="ecx-icon icon-sousuo"
                          style="font-size: 12px; margin-left: 2px;"
                        ></i>
                      </el-tag>
                    )}
                  </div>
                  <div style="color: #666;">
                    {`SPU编码：${scope.row.goods_bn}`}
                    <el-tooltip effect="dark" content="复制" placement="top-start">
                      <i
                        on-click={() => {
                          this.$copyText(scope.row.goods_bn).then(() => {
                            this.$message.success('复制成功')
                          })
                        }}
                        class="el-icon-document-copy"
                        style="margin-left: 4px;"
                      />
                    </el-tooltip>
                  </div>
                </div>
              )
            }
          },
          { name: 'sku编码', key: 'item_bn', width: 120 },
          { name: '来源供应商', key: 'supplier_name', width: 120 },
          {
            name: '标签',
            key: 'tagList',
            render: (h, scope) => (
              <div style="white-space: normal;">
                {(scope.row.tagList || []).map((item) => (
                  <span
                    style={{
                      color: item.font_color,
                      'background-color': item.tag_color,
                      'font-size': '12px',
                      padding: '2px 5px',
                      'border-radius': '2px',
                      margin: '0 8px 8px 0'
                    }}
                  >
                    {item.tag_name}
                  </span>
                ))}
              </div>
            )
          },
          {
            name: '排序编号',
            key: 'sort',
            width: 120,
            showType: 'editable',
            componentProps: {
              icon: 'el-icon-plus',
              change: async (v, row) => {
                await this.$api.goods.setItemsSort({ sort: v, item_id: row.itemId })
                this.$refs['finder'].refresh()
              }
            }
          },
          { name: '库存', key: 'store', align: 'right', headerAlign: 'center' },
          {
            name: '市场价（¥）',
            key: 'market_price',
            width: 100,
            formatter: (value) => (value / 100).toFixed(2),
            align: 'right',
            headerAlign: 'center'
          },
          {
            name: '销售价（¥）',
            key: 'price',
            width: 100,
            formatter: (value) => (value / 100).toFixed(2),
            align: 'right',
            headerAlign: 'center'
          },
          {
            name: '成本价（¥）',
            key: 'cost_price',
            width: 100,
            formatter: (value) => (value / 100).toFixed(2),
            align: 'right',
            headerAlign: 'center'
          },
          {
            name: '毛利率（%)',
            key: 'gross_profit_rate',
            width: 100,
            align: 'right',
            headerAlign: 'center'
          },
          {
            name: '供应状态',
            key: 'is_market',
            formatter: (value) => (value == '1' ? '可售' : '不可售')
          },
          {
            name: '审核状态',
            key: 'audit_status',
            formatter: (value) => GOODS_APPLY_STATUS[value]
          },
          { name: '销售分类', key: 'itemCatName', minWidth: 120 },
          {
            name: '创建时间',
            key: 'created',
            width: 160,
            formatter: (value) => moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
          },
          {
            name: '审核时间',
            key: 'audit_date',
            width: 160,
            formatter: (value) => (value ? moment(value * 1000).format('YYYY-MM-DD HH:mm:ss') : '')
          },
          {
            name: '更新时间',
            key: 'updated',
            width: 160,
            formatter: (value) => moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
          }
        ]
      }
    }
  },
  mounted() {
    this.getCategory()
    this.getAddress()
    this.getShippingTemplatesList()
    this.getGoodsBranchList()
    this.$activated = () => {
      this.$refs['finder'].refresh()
    }
  },
  methods: {
    beforeSearch(params) {
      return {
        ...params,
        item_type: 'normal',
        operate_source: 'supplier',
        audit_status: 'approved',
        ...this.searchParams
      }
    },
    onSearch() {
      this.$refs['finder'].refresh(true)
    },
    onSelectionChange(selection) {
      this.selectionItems = selection
    },
    async getCategory() {
      this.itemCategoryList = await this.$api.goods.getCategory({ is_main_category: true })
    },
    async getShippingTemplatesList() {
      const { list } = await this.$api.shipping.getShippingTemplatesList({
        page: 1,
        pageSize: 1000
      })
      this.templatesList = list
    },
    async getAddress() {
      this.regions = await this.$api.common.getAddress()
    },
    async getGoodsBranchList(searchVal = '') {
      this.goodsBranchParams.attribute_name = searchVal
      const { list } = await this.$api.goods.getGoodsAttr(this.goodsBranchParams)
      this.goodsBranchList = list
    },
    async handleViewSkuInfo(item) {
      this.skuLoading = true
      const { list } = await this.$api.goods.getItemsList({
        item_type: 'normal',
        operate_source: 'supplier',
        item_id: item.item_id,
        is_sku: true,
        page: 1,
        pageSize: 1000
      })
      this.itemSkuDrawerTitle = `商品【${item.item_name}】`
      this.itemSkuList = list || []
      this.showItemSkuDrawer = true
      this.skuLoading = false
    },
    async syncToShop() {
      if (this.selectionItems.length === 0) {
        this.$message.error('请选择至少一个商品')
        return
      }
      const notApproved = this.selectionItems.filter((item) => item.audit_status !== 'approved')
      if (notApproved.length > 0) {
        this.$message.error('仅审核通过的商品可同步到店铺')
        return
      }
      try {
        await this.$confirm('确定将选中的商品同步到本店？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      } catch (e) {
        return
      }
      this.syncToShopLoading = true
      try {
        await batchSyncToShop({
          item_ids: this.selectionItems.map((item) => item.item_id).join(',')
        })
        this.$message.success('同步成功')
        this.$refs['finder'].refresh()
      } finally {
        this.syncToShopLoading = false
      }
    }
  }
}
</script>
