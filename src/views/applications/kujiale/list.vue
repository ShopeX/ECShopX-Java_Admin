<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->
<template>
  <SpPage>
    <SpRouterView>
      <!-- 搜索表单 -->
      <SpFormPlus
        ref="searchForm"
        v-model="searchParams"
        form-type="searchForm"
        :inline="true"
        label-width="100px"
        :form-items="searchFormItems"
        @submit="handleSearch"
        @reset="handleReset"
      />

      <!-- 操作按钮 -->
      <div class="action-container mt-4">
        <el-button type="primary" @click="handleSelectProduct">选品关联方案</el-button>
      </div>

      <!-- 商品列表 -->
      <SpFinder
        ref="finder"
        :setting="finderSetting"
        :row-key="getRowKey"
        url="/kujiale/designer-works/items"
        fixed-row-action
        :hooks="{
          beforeSearch: beforeSearch,
          afterRequest: afterRequest
        }"
        @selection-change="handleSelectionChange"
      />

      <!-- 选品关联弹框 -->
      <el-dialog
        :visible.sync="selectProductVisible"
        title="选品关联"
        width="900px"
        :close-on-click-modal="false"
        @close="handleDialogClose"
      >
        <!-- 第一部分：选择酷家乐案例 -->
        <div class="dialog-section">
          <div class="section-header">
            <h3 class="section-title">1、选择酷家乐案例</h3>
            <div class="section-actions">
              <el-select
                v-model="design_id"
                placeholder="可输入方案名称或下拉选择方案"
                filterable
                clearable
                style="width: 300px; margin-right: 10px;margin-left: 30px;"
                @change="handleSelecteChange"
              >
                <el-option
                  v-for="item in allCaseList"
                  :key="item.design_id"
                  :label="item.design_name"
                  :value="item.design_id"
                >
                  <span>{{ item.design_id }} - {{ item.design_name }}</span>
                </el-option>
              </el-select>
            </div>
          </div>
        </div>

        <!-- 第二部分：选择酷家乐案例关联商品 -->
        <div class="dialog-section" style="margin-top: 24px">
          <div class="section-header">
            <h3 class="section-title">2、选择酷家乐案例关联商品</h3>
          </div>
          <div style="margin-top: 16px;margin-left: 40px;">
            <SkuSelector :data="relItems" @change="handleGoodsChange" />
          </div>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="handleDialogClose">取消</el-button>
          <el-button type="primary" :loading="confirmLoading" @click="handleConfirm">确认</el-button>
        </span>
      </el-dialog>
    </SpRouterView>
  </SpPage>
</template>

<script>
import { createSetting } from '@shopex-ui/finder'
import SkuSelector from '@/components/function/skuSelector'

export default {
  name: 'KuJiaLeList',
  components: {
    SkuSelector
  },
  data() {
    return {
      searchParams: {
        item_name: '', // 商品标题
        item_bn: '', // SKU编码
        plan_id: '', // 方案ID
        plan_name: '', // 方案名称
        approve_status: '', // 商品状态
        main_cat_id: '' // 管理分类
      },
      // 选品关联弹框相关
      selectProductVisible: false,
      allCaseList: [], // 所有案例列表（用于下拉选项）
      design_id: '', // 选中的案例ID（单选）
      relItems: [], // SkuSelector 组件使用的商品列表
      selectedSkus: [], // 最终选中的SKU列表（从SkuSelector的change事件获取）
      confirmLoading: false,
      searchFormItems: [
        {
          component: 'input',
          componentProps: {
            placeholder: '请输入商品标题',
            clearable: true,
            size: 'medium'
          },
          fieldName: 'item_name',
          label: '商品标题'
        },
        {
          component: 'input',
          componentProps: {
            placeholder: '请输入SKU编码',
            clearable: true
          },
          fieldName: 'item_bn',
          label: 'SKU编码'
        },
        {
          component: 'input',
          componentProps: {
            placeholder: '请输入方案ID',
            clearable: true
          },
          fieldName: 'plan_id',
          label: '方案ID'
        },
        {
          component: 'input',
          componentProps: {
            placeholder: '请输入方案名称',
            clearable: true
          },
          fieldName: 'plan_name',
          label: '方案名称'
        },
        {
          component: 'select',
          componentProps: {
            placeholder: '请选择',
            clearable: true,
            options: [
              { label: '全部', value: '' },
              { label: '前台可销售', value: 'onsale' },
              { label: '不可销售', value: 'instock' },
              { label: '前台仅展示', value: 'only_show' },
              { label: '前台不展示', value: 'offline_sale' },
            ]
          },
          fieldName: 'approve_status',
          label: '商品状态'
        },
        {
          component: ({ h, value, onInput, props: componentProps }) => {
            return h('el-cascader', {
              attrs: {
                size: 'small',
                style: 'width:100%'
              },
              props: {
                value: value,
                placeholder: '请选择',
                clearable: true,
                options: componentProps.options || [],
                props: {
                  value: 'category_id',
                  label: 'category_name',
                  checkStrictly: true
                }
              },
              on: {
                input: onInput
              }
            })
          },
          componentProps: {
            options: []
          },
          fieldName: 'main_cat_id',
          label: '管理分类'
        }
      ],
      finderSetting: null,
      selectedRows: []
    }
  },
  mounted() {
    this.initFinderSetting()
    this.getCategory()
  },
  methods: {
    initFinderSetting() {
      this.finderSetting = createSetting({
        columns: [
          {
            name: '商品ID',
            key: 'item_id',
            width: 100
          },
          {
            name: '商品标题',
            key: 'item_name',
            minWidth: 200,
            showOverflowTooltip: true
          },
          {
            name: 'SKU编码',
            key: 'item_bn',
            width: 150
          },
          {
            name: '方案ID',
            key: 'design_id',
            width: 120,
            render: (h, { row }) => {
              return h('span', row.design.design_id)
            }
          },
          {
            name: '方案名称',
            key: 'design_name',
            minWidth: 150,
            showOverflowTooltip: true,
            render: (h, { row }) => {
              return h('span', row.design.design_name)
            }
          },
          {
            name: '标签',
            key: 'tags',
            width: 150,
            render: (h, { row }) => {
              const tags = row.tags || []
              if (tags.length === 0) {
                return h('span', '-')
              }
              return h(
                'div',
                tags.map((tag, index) => {
                  return h('el-tag', {
                    key: index,
                    props: {
                      size: 'small',
                      style: { marginRight: '5px', marginBottom: '5px' }
                    }
                  }, tag)
                })
              )
            }
          },
          {
            name: '库存',
            key: 'store',
            width: 100,
            formatterType: 'number'
          },
          {
            name: '销售价',
            key: 'price',
            width: 100,
            formatterType: 'price'
          },
          {
            name: '市场价',
            key: 'mktprice',
            width: 100,
            formatterType: 'price'
          },
          {
            name: '成本价',
            key: 'cost',
            width: 100,
            formatterType: 'price'
          },
          {
            name: '商品状态',
            key: 'approve_status',
            width: 100,
            render: (h, { row }) => {
              const statusMap = {
                onsale: { text: '前台可销售', type: 'success' },
                instock: { text: '不可销售', type: 'info' },
                only_show: { text: '前台仅展示', type: 'info' },
                offline_sale: { text: '前台不展示', type: 'warning' },
              }
              const status = statusMap[row.approve_status] || { text: '-', type: 'info' }
              return h('el-tag', {
                props: {
                  type: status.type,
                  size: 'small'
                }
              }, status.text)
            }
          },
          {
            name: '销售分类',
            key: 'category_name',
            minWidth: 150,
            showOverflowTooltip: true
          }
        ]
      })
    },
    getRowKey(row) {
      return row.goods_id || row.item_id || row.id
    },
    beforeSearch(params) {
      // 合并搜索参数
      return {
        ...params,
        ...this.searchParams
      }
    },
    afterRequest(response) {
      const data = response.data.data || response.data
      const { list, total_count, count } = data
      return {
        list: list || [],
        count: total_count || count || 0
      }
    },
    handleSearch() {
      this.$refs.finder.refresh(true)
    },
    handleReset() {
      this.searchParams = {
        item_name: '',
        item_bn: '',
        plan_id: '',
        plan_name: '',
        approve_status: '',
        main_cat_id: ''
      }
      this.$nextTick(() => {
        this.$refs.finder.refresh(true)
      })
    },
    // 获取管理分类
    async getCategory() {
      try {
        const itemCategoryList = await this.$api.goods.getCategory({ is_main_category: true })
        // 更新搜索表单中的选项
        const categoryItem = this.searchFormItems.find(item => item.fieldName === 'main_cat_id')
        if (categoryItem) {
          categoryItem.componentProps.options = itemCategoryList
        }
      } catch (error) {
        console.log(error, '加载管理分类失败')
      }
    },
    handleSelectionChange(selection) {
      this.selectedRows = selection
    },
    handleSelectProduct() {
      this.selectProductVisible = true
      this.loadCaseList()
    },
    // 加载案例列表
    async loadCaseList() {
      try {
        const params = {}
        const res = await this.$api.goods.getKjlList(params)
        const list = res.list || (res.data && res.data.list) || []
        this.allCaseList = list
      } catch (error) {
        this.$message.error('加载案例列表失败')
      }
    },
    handleSelecteChange(value) {
      if (value) {
        this.design_id = value
      } else {
        this.design_id = ''
      }
    },
    handleGoodsChange(data) {
      this.selectedSkus = data || []
    },
    // 确认关联
    async handleConfirm() {
      if (!this.design_id) {
        this.$message.warning('请先选择酷家乐案例')
        return
      }
      if (this.selectedSkus.length === 0) {
        this.$message.warning('请至少选择一个关联商品')
        return
      }
      this.confirmLoading = true
      try {
        const itemIds = this.selectedSkus.map(item => item.itemId)
        await this.$api.goods.kjlBindItem({
          design_id: this.design_id,
          item_id: itemIds
        })
        this.$message.success('关联成功')
        this.handleDialogClose()
        this.$refs.finder.refresh(true)
      } catch (error) {
        this.$message.error(error.message || '关联失败')
      } finally {
        this.confirmLoading = false
      }
    },
    // 关闭弹框
    handleDialogClose() {
      this.selectProductVisible = false
      this.allCaseList = []
      this.design_id = ''
      this.relItems = []
      this.selectedSkus = []
      this.confirmLoading = false
    }
  }
}
</script>

<style scoped lang="scss">
// .action-container {
//   margin-bottom: 16px;
//   .el-button {
//     margin-right: 10px;
//   }
// }

.dialog-section {
  .section-header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    margin-left: 30px;
    
    .section-title {
      font-size: 16px;
      font-weight: bold;
      margin: 0;
      color: #333;
    }
    
    .section-actions {
      display: flex;
      align-items: center;
    }
  }
}
</style>
