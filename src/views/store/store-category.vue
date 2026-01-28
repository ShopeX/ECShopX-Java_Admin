<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpFilterForm :model="searchParams" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem label="分类名称" prop="category_name">
        <el-input
          v-model="searchParams.category_name"
          placeholder="请输入分类名称"
          clearable
        />
      </SpFilterFormItem>
    </SpFilterForm>

    <div class="action-container">
      <el-button type="primary" plain icon="el-icon-plus" @click="handleAdd">
        新增
      </el-button>
    </div>

    <SpFinder
      ref="finder"
      no-selection
      url="/distributor/category"
      :fixed-row-action="true"
      :page-size="20"
      :setting="finderSetting"
      row-actions-fixed-align="left"
      :hooks="{
        beforeSearch: beforeSearch
      }"
    />

    <SpDialog
      ref="categoryDialogRef"
      v-model="categoryDialog"
      :title="categoryForm.category_id ? '编辑分类' : '新增分类'"
      :form="categoryForm"
      :form-list="categoryFormList"
      @onSubmit="onCategoryFormSubmit"
      @input="onDialogInputChange"
    />
  </SpPage>
</template>

<script>
import { createSetting } from '@shopex-ui/finder'

export default {
  name: 'StoreCategory',
  data() {
    return {
      searchParams: {
        category_name: ''
      },
      finderSetting: createSetting({
        columns: [
          { name: '分类名称', key: 'category_name' }
        ],
        actions: [
          {
            name: '编辑',
            key: 'edit',
            type: 'button',
            buttonType: 'text',
            action: {
              type: 'link',
              handler: ([row]) => {
                this.categoryForm.category_id = row.category_id
                this.categoryForm.category_code = row.category_code
                this.categoryForm.category_name = row.category_name
                this.categoryDialog = true
              }
            }
          },
          {
            name: '删除',
            key: 'delete',
            type: 'button',
            buttonType: 'text',
            action: {
              type: 'link',
              handler: ([row]) => {
                this.handleDelete(row)
              }
            }
          }
        ]
      }),
      categoryDialog: false,
      categoryForm: {
        category_id: '',
        category_code: '',
        category_name: ''
      },
      categoryFormList: [
        {
          label: '分类名称',
          key: 'category_name',
          type: 'input',
          required: true,
          message: '请输入分类名称'
        }
      ]
    }
  },
  methods: {
    onSearch() {
      this.$refs.finder.refresh(true)
    },
    beforeSearch(params) {
      return {
        ...params,
        ...this.searchParams
      }
    },
    handleAdd() {
      this.categoryForm = {
        category_id: '',
        category_code: '',
        category_name: ''
      }
      this.categoryDialog = true
    },
    onDialogInputChange() {
      // 弹框关闭时的处理
    },
    async onCategoryFormSubmit() {
      const { category_id, category_code, category_name } = this.categoryForm

      try {
        if (category_id) {
          // 编辑
          await this.$api.store.updateStoreCategory(category_id, { category_code, category_name })
          this.$message.success('更新成功')
        } else {
          // 新增
          await this.$api.store.createStoreCategory({ category_name })
          this.$message.success('添加成功')
        }
        this.categoryDialog = false
        this.$refs.finder.refresh(true)
      } catch (error) {
        // 错误已在拦截器中处理
        console.error('保存失败:', error)
      }
    },
    async handleDelete(row) {
      try {
        await this.$confirm('此操作将删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        await this.$api.store.deleteStoreCategory(row.category_id)
        this.$message.success('删除成功')
        this.$refs.finder.refresh(true)
      } catch (error) {
        if (error !== 'cancel') {
          // 错误已在拦截器中处理
          console.error('删除失败:', error)
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.sp-filter-form {
  margin-bottom: 16px;
}

.action-container {
  margin-bottom: 16px;
}

::v-deep(.sp-finder-actions__wrap) {
  justify-content: center !important;
}
</style>
