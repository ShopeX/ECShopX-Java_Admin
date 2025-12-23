<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpRouterView>
    <SpPage class="page-order-order-setting">
      <SpFormPlus
        ref="searchForm"
        v-model="params"
        form-type="searchForm"
        :inline="true"
        label-width="100px"
        :form-items="searchFormItems"
        @submit="onSearch"
        @reset="onReset"
      />

      <div class="action-container mt-4">
        <el-button type="primary" @click="handleCreate"> 创建人群圈选 </el-button>
      </div>

      <SpFinder
        ref="finder"
        :setting="finderSetting"
        :row-key="getRowKeys"
        url="/member/segment-rule"
        :hooks="{
          beforeSearch: beforeSearch,
          afterRequest: afterRequest
        }"
        @selection-change="handleSelectionChange"
      />
    </SpPage>
  </SpRouterView>
</template>

<script>
import { mapGetters } from 'vuex'
import { createSetting } from '@shopex-ui/finder'

export default {
  provide() {
    return {
      refresh: () => {
        // 在调用时才访问 finder，确保 ref 已经初始化
        if (this.$refs.finder && this.$refs.finder.refresh) {
          this.$refs.finder.refresh()
        }
      }
    }
  },
  data() {
    return {
      params: {
        tag_id: '',
        created: []
      },
      tagOptions: [
        { label: '标签1', value: 1 },
        { label: '标签2', value: 2 },
        { label: '标签3', value: 3 }
      ],
      searchFormItems: [
        {
          formItemClass: 'w-1/3',
          component: 'select',
          componentProps: {
            placeholder: '请选择',
            clearable: true,
            options: []
          },
          fieldName: 'tag_id',
          label: '分群标签'
        },
        {
          formItemClass: 'w-2/4',
          component: 'datetimepicker',
          componentProps: {
            type: 'daterange',
            rangeSeparator: '至',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            format: 'yyyy-MM-dd',
            valueFormat: 'yyyy-MM-dd'
          },
          fieldName: 'created',
          label: '创建时间',
          size: 'small'
        }
      ],
      finderSetting: null,
      selectedRows: []
    }
  },
  computed: {
    ...mapGetters(['wheight']),
    formList() {
      return [
        {
          label: '分群标签名称',
          key: 'name',
          type: 'input',
          required: true,
          placeholder: '请输入分群标签名称'
        },
        {
          label: '人群说明',
          key: 'description',
          type: 'textarea',
          required: true,
          placeholder: '请输入人群说明',
          component: ({ key }, value) => {
            return (
              <el-input
                type="textarea"
                v-model={value[key]}
                placeholder="请输入人群说明"
                rows={4}
              />
            )
          }
        }
      ]
    }
  },
  mounted() {
    this.initFinderSetting()
    this.initSearchFormItems()
  },
  methods: {
    initFinderSetting() {
      const vm = this
      this.finderSetting = createSetting({
        columns: [
          {
            name: '分群标签名称',
            key: 'rule_name',
            width: 200
          },
          {
            name: '人群说明',
            key: 'description',
            minWidth: 300
          },
          {
            name: '人群数量',
            key: 'count',
            width: 120,
            render: (h, { row }) => {
              return h('span', row.count || 0)
            }
          },
          {
            name: '创建时间',
            key: 'created',
            width: 180
          }
        ],
        actions: [
          {
            name: '详情',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: ([row]) => vm.handleDetail(row)
            }
          }
        ]
      })
    },
    getRowKeys(row) {
      return row.rule_id
    },
    initSearchFormItems() {
      // 更新标签选项
      const tagItem = this.searchFormItems.find(item => item.fieldName === 'tag_id')
      if (tagItem) {
        tagItem.componentProps.options = this.tagOptions
      }
    },
    beforeSearch(params) {
      const finderParams = {
        page: params.page || 1,
        pageSize: params.pageSize || 20,
        ...this.params
      }
      // 处理日期范围
      if (finderParams.created && Array.isArray(finderParams.created) && finderParams.created.length === 2) {
        finderParams.created_start = finderParams.created[0]
        finderParams.created_end = finderParams.created[1]
      } else {
        finderParams.created_start = ''
        finderParams.created_end = ''
      }
      delete finderParams.created
      return finderParams
    },
    async afterRequest(response) {
      const data = response.data.data || response.data
      const { list, total_count } = data
      
      return {
        list: list || [],
        count: total_count || 0
      }
    },
    onSearch() {
      this.$refs.finder.refresh(true)
    },
    onReset() {
      this.params = {
        tag_id: '',
        created: []
      }
      this.$nextTick(() => {
        this.$refs.finder.refresh(true)
      })
    },
    handleCreate() {
      this.$router.push({ path: this.matchRoutePath('editor') })
    },
    handleDetail(row) {
      this.$router.push({ path: this.matchRoutePath('editor'), query: { id: row.rule_id } })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该人群圈选,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          try {
            // await this.$api.member.deleteAudience(row.id)
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.$refs.finder.refresh()
          } catch (error) {
            this.$message({
              type: 'error',
              message: '删除失败'
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleSelectionChange(selection) {
      this.selectedRows = selection
    },
    async handleSubmit() {
      try {
        this.$refs.finder.refresh(true)
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page-order-order-setting {
  .action-container {
    margin-bottom: 16px;
    .el-button {
      margin-right: 10px;
    }
  }
}
</style>
