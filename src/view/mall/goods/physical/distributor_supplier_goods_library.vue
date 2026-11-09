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
          <SpFilterFormItem prop="keywords" :label="$t('aa50e3a2.16eddb')">
            <el-input v-model="searchParams.keywords" :placeholder="$t('aa50e3a2.07ec01')" />
          </SpFilterFormItem>
          <SpFilterFormItem prop="goods_bn" :label="$t('aa50e3a2.288587')">
            <el-input v-model="searchParams.goods_bn" :placeholder="$t('aa50e3a2.36438f')" />
          </SpFilterFormItem>
          <SpFilterFormItem prop="supplier_name" :label="$t('aa50e3a2.a54fd2')">
            <el-input
              v-model="searchParams.supplier_name"
              :placeholder="$t('aa50e3a2.1542c0')"
            />
          </SpFilterFormItem>
          <SpFilterFormItem prop="is_market" :label="$t('aa50e3a2.63d68b')">
            <el-select
              v-model="searchParams.is_market"
              :placeholder="$t('aa50e3a2.708c9d')"
              clearable
            >
              <el-option :label="$t('aa50e3a2.434e17')" :value="1" />
              <el-option :label="$t('aa50e3a2.b37fb8')" :value="0" />
            </el-select>
          </SpFilterFormItem>
          <SpFilterFormItem prop="main_cat_id" :label="$t('aa50e3a2.e73602')">
            <el-cascader
              v-model="searchParams.main_cat_id"
              :placeholder="$t('aa50e3a2.708c9d')"
              clearable
              :options="itemCategoryList"
              :props="{ value: 'category_id', label: 'category_name', checkStrictly: true }"
            />
          </SpFilterFormItem>
          <SpFilterFormItem prop="templates_id" :label="$t('aa50e3a2.63fc58')">
            <el-select
              v-model="searchParams.templates_id"
              :placeholder="$t('aa50e3a2.708c9d')"
              clearable
            >
              <el-option
                v-for="item in templatesList"
                :key="item.template_id"
                :label="item.name"
                :value="item.template_id"
              />
            </el-select>
          </SpFilterFormItem>
          <SpFilterFormItem prop="brand_id" :label="$t('aa50e3a2.dab469')">
            <el-select
              v-model="searchParams.brand_id"
              :placeholder="$t('aa50e3a2.2dd7e1')"
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
          <SpFilterFormItem prop="regions_id" :label="$t('aa50e3a2.efcb2d')">
            <el-cascader
              v-model="searchParams.regions_id"
              :placeholder="$t('aa50e3a2.708c9d')"
              clearable
              :options="regions"
            />
          </SpFilterFormItem>
          <SpFilterFormItem prop="item_bn" :label="$t('aa50e3a2.8dd62f')">
            <el-input v-model="searchParams.item_bn" />
          </SpFilterFormItem>
        </SpFilterForm>

        <div class="action-container">
          <el-button type="primary" plain :loading="syncToShopLoading" @click="syncToShop">
            {{ $t('aa50e3a2.9cf126') }}
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
            <el-table-column
              :label="$t('aa50e3a2.ea887b')"
              prop="item_spec_desc"
              min-width="120"
            />
            <el-table-column
              :label="$t('aa50e3a2.e9de29')"
              prop="supplier_goods_bn"
              min-width="120"
            />
            <el-table-column
              :label="$t('aa50e3a2.c927ea')"
              prop="tax_rate_code"
              min-width="120"
            />
            <el-table-column :label="$t('aa50e3a2.2a79a7')" prop="tax_rate" min-width="120">
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
        is_market: '',
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
            name: this.$t('aa50e3a2.607e7a'),
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
          {
            name: this.$t('aa50e3a2.b9c2e7'),
            key: 'item_id',
            width: 120,
            align: 'right',
            headerAlign: 'center'
          },
          {
            name: this.$t('aa50e3a2.858526'),
            key: 'main_item_id',
            width: 120,
            align: 'right',
            headerAlign: 'center'
          },
          {
            name: this.$t('aa50e3a2.9897d8'),
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
                        {this.$t('aa50e3a2.7b1568')}
                        <i
                          class="ecx-icon icon-sousuo"
                          style="font-size: 12px; margin-left: 2px;"
                        ></i>
                      </el-tag>
                    )}
                  </div>
                  <div style="color: #666;">
                    {`${this.$t('aa50e3a2.2c8af9')}${scope.row.goods_bn}`}
                    <el-tooltip
                      effect="dark"
                      content={this.$t('aa50e3a2.79d3ab')}
                      placement="top-start"
                    >
                      <i
                        on-click={() => {
                          this.$copyText(scope.row.goods_bn).then(() => {
                            this.$message.success(this.$t('aa50e3a2.20a495'))
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
          { name: this.$t('aa50e3a2.0888fc'), key: 'item_bn', width: 120 },
          { name: this.$t('aa50e3a2.a54fd2').replace(':', ''), key: 'supplier_name', width: 120 },
          {
            name: this.$t('aa50e3a2.14d342'),
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
            name: this.$t('aa50e3a2.e8373a'),
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
          {
            name: this.$t('aa50e3a2.0eac88'),
            key: 'store',
            align: 'right',
            headerAlign: 'center'
          },
          {
            name: this.$t('aa50e3a2.5cd87e'),
            key: 'market_price',
            width: 100,
            formatter: (value) => (value / 100).toFixed(2),
            align: 'right',
            headerAlign: 'center'
          },
          {
            name: this.$t('aa50e3a2.cf0170'),
            key: 'price',
            width: 100,
            formatter: (value) => (value / 100).toFixed(2),
            align: 'right',
            headerAlign: 'center'
          },
          {
            name: this.$t('aa50e3a2.066804'),
            key: 'cost_price',
            width: 100,
            formatter: (value) => (value / 100).toFixed(2),
            align: 'right',
            headerAlign: 'center'
          },
          {
            name: this.$t('aa50e3a2.4d02c7'),
            key: 'gross_profit_rate',
            width: 100,
            align: 'right',
            headerAlign: 'center'
          },
          {
            name: this.$t('aa50e3a2.63d68b'),
            key: 'is_market',
            formatter: (value) =>
              value == '1' ? this.$t('aa50e3a2.434e17') : this.$t('aa50e3a2.b37fb8')
          },
          {
            name: this.$t('aa50e3a2.b6d0e9'),
            key: 'audit_status',
            formatter: (value) => GOODS_APPLY_STATUS[value]
          },
          { name: this.$t('aa50e3a2.392d49'), key: 'itemCatName', minWidth: 120 },
          {
            name: this.$t('aa50e3a2.eca37c'),
            key: 'created',
            width: 160,
            formatter: (value) => moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
          },
          {
            name: this.$t('aa50e3a2.e6f070'),
            key: 'audit_date',
            width: 160,
            formatter: (value) => (value ? moment(value * 1000).format('YYYY-MM-DD HH:mm:ss') : '')
          },
          {
            name: this.$t('aa50e3a2.a001a2'),
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
      this.itemSkuDrawerTitle = this.$t('aa50e3a2.396a82', { name: item.item_name })
      this.itemSkuList = list || []
      this.showItemSkuDrawer = true
      this.skuLoading = false
    },
    async syncToShop() {
      if (this.selectionItems.length === 0) {
        this.$message.error(this.$t('aa50e3a2.ace302'))
        return
      }
      const notApproved = this.selectionItems.filter((item) => item.audit_status !== 'approved')
      if (notApproved.length > 0) {
        this.$message.error(this.$t('aa50e3a2.f4a841'))
        return
      }
      try {
        await this.$confirm(this.$t('aa50e3a2.1886ba'), this.$t('aa50e3a2.02d981'), {
          confirmButtonText: this.$t('aa50e3a2.38cf16'),
          cancelButtonText: this.$t('aa50e3a2.625fb2'),
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
        this.$message.success(this.$t('aa50e3a2.52b85c'))
        this.$refs['finder'].refresh()
      } finally {
        this.syncToShopLoading = false
      }
    }
  }
}
</script>
