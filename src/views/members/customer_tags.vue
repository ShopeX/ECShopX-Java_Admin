<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpRouterView>
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
        <el-button type="primary" @click="onAddChange">{{ $t('a190be57.19214e') }}</el-button>
      </div>

      <SpFinder
        ref="finder"
        :setting="finderSetting"
        :row-key="getRowKeys"
        url="/member/tag-group"
        :page-size="pageSize"
        :show-overflow-tooltip="false"
        no-selection
        :hooks="{
          beforeSearch: beforeSearch,
          afterRequest: afterRequest
        }"
      />

      <!-- 新建/编辑标签组弹框 -->
      <CompAddTag
        :visible.sync="addGroupVisible"
        :is-edit="isEdit"
        :form="form"
        @submit="handleSubmit"
        @close="addGroupVisible = false"
      />
    </SpRouterView>
  </SpPage>
</template>

<script>
import { mapGetters } from 'vuex'
import { createSetting } from '@shopex-ui/finder'
import CompTagList from './components/CompTagList'
import CompAddTag from './components/CompAddTag'

export default {
  components: {
    CompTagList,
    CompAddTag
  },
  data() {
    return {
      pageSize: 20,
      params: {
        keyword: ''
      },
      form: {
        group_id: '',
        group_name: '',
        tags: [{ tag_name: '' }]
      },
      isEdit: false,
      addGroupVisible: false,
      finderSetting: null
    }
  },
  computed: {
    ...mapGetters(['wheight']),
    searchFormItems() {
      return [
        {
          formItemClass: 'w-2/4',
          component: 'input',
          componentProps: {
            placeholder: this.$t('a190be57.3605b8'),
            clearable: true
          },
          fieldName: 'keyword',
          label: this.$t('a190be57.60224e')
        }
      ]
    }
  },
  mounted() {
    this.initFinderSetting()
  },
  methods: {
    isSystemGroup(row) {
      return (
        String(row.group_id) === 'system' || row.type === 'system' || row.tag_kind === 'system'
      )
    },
    initFinderSetting() {
      const vm = this
      this.finderSetting = createSetting({
        columns: [
          {
            name: this.$t('a190be57.6c805e'),
            key: 'group_name',
            width: 200,
            render: (h, { row }) => {
              const children = [h('span', row.group_name)]
              if (vm.isSystemGroup(row)) {
                children.push(
                  h(
                    'el-tag',
                    {
                      props: { size: 'mini', type: 'info', effect: 'plain' },
                      class: 'ml-2'
                    },
                    vm.$t('a190be57.730e95')
                  )
                )
              } else if (row.is_wechat) {
                children.push(
                  h(
                    'span',
                    {
                      style: {
                        display: 'inline-block',
                        width: '20px',
                        height: '20px',
                        lineHeight: '20px',
                        textAlign: 'center',
                        backgroundColor: '#409EFF',
                        color: '#fff',
                        borderRadius: '2px',
                        fontSize: '12px',
                        marginLeft: '8px'
                      }
                    },
                    this.$t('a190be57.97401c')
                  )
                )
              }
              return h('div', { class: 'flex items-center' }, children)
            }
          },
          {
            name: this.$t('a190be57.14d342'),
            key: 'tags',
            minWidth: 400,
            render: (h, { row }) => {
              const isSystem = vm.isSystemGroup(row)
              return h(CompTagList, {
                props: {
                  list: row.tags || [],
                  readonly: isSystem
                },
                on: isSystem
                  ? {}
                  : {
                      'add-tag': (value) => vm.handleAddTags(row, value)
                    }
              })
            }
          },
          {
            name: this.$t('a190be57.2b6bc0'),
            key: 'action',
            width: 150,
            fixed: 'right',
            render: (h, { row }) => {
              if (vm.isSystemGroup(row)) {
                return h('span', '-')
              }
              const actions = [
                h(
                  'el-button',
                  {
                    props: { type: 'text' },
                    on: { click: () => vm.handleEdit(row) }
                  },
                  vm.$t('a190be57.95b351')
                ),
                h(
                  'el-button',
                  {
                    props: { type: 'text', style: 'color: #F56C6C;' },
                    on: { click: () => vm.handleDelete(row) }
                  },
                  vm.$t('a190be57.2f4aad')
                )
              ]
              return h('div', actions)
            }
          }
        ]
      })
    },
    getRowKeys(row) {
      return row.group_id || row.id
    },
    beforeSearch(params) {
      if (params.pageSize) {
        this.pageSize = params.pageSize
      }
      const finderParams = {
        page: params.page || 1,
        pageSize: params.pageSize || this.pageSize,
        with_system: 1,
        ...this.params
      }
      if (finderParams.keyword) {
        finderParams.group_name = finderParams.keyword
        finderParams.tag_name = finderParams.keyword
      }
      delete finderParams.keyword
      return finderParams
    },
    async afterRequest(response) {
      const data = response.data.data || response.data
      const { list, total_count } = data

      const processedList = (list || []).map((item) => {
        if (typeof item.tags === 'string') {
          try {
            item.tags = JSON.parse(item.tags)
          } catch (e) {
            item.tags = item.tags ? [item.tags] : []
          }
        }
        return item
      })

      return {
        list: processedList,
        count: total_count || 0
      }
    },
    onSearch() {
      this.$refs.finder.refresh(true)
    },
    onReset() {
      this.params = {
        keyword: ''
      }
      this.$nextTick(() => {
        this.$refs.finder.refresh(true)
      })
    },
    onAddChange() {
      this.isEdit = false
      this.form = {
        group_id: '',
        group_name: '',
        tags: [{ tag_name: '' }]
      }
      this.addGroupVisible = true
    },
    async handleEdit(row) {
      if (this.isSystemGroup(row)) return
      this.isEdit = true
      this.form = {
        group_id: row.group_id,
        group_name: row.group_name,
        tags: row.tags
      }
      this.addGroupVisible = true
    },
    handleDelete(row) {
      if (this.isSystemGroup(row)) return
      this.$confirm(this.$t('a190be57.dda238'), this.$t('a190be57.02d981'), {
        confirmButtonText: this.$t('a190be57.38cf16'),
        cancelButtonText: this.$t('a190be57.625fb2'),
        type: 'warning'
      })
        .then(async () => {
          try {
            await this.$api.member.deleteTagGroup(row.group_id)
            this.$message({
              type: 'success',
              message: this.$t('a190be57.0007d1')
            })
            this.$refs.finder.refresh()
          } catch (error) {
            console.log(error)
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('a190be57.c34281')
          })
        })
    },
    async handleSubmit(submitData) {
      try {
        if (this.isEdit) {
          await this.$api.member.updateTagGroup(submitData.group_id, submitData)
        } else {
          await this.$api.member.createTagGroup(submitData)
        }
        this.$message({
          type: 'success',
          message: this.isEdit ? this.$t('a190be57.3bb47b') : this.$t('a190be57.04a691')
        })
        this.addGroupVisible = false
        this.$refs.finder.refresh(true)
      } catch (error) {
        console.log(error)
      }
    },
    async handleAddTags(row, value) {
      if (this.isSystemGroup(row)) return
      try {
        const params = {
          group_id: row.group_id,
          tag_name: value
        }
        await this.$api.member.saveTag(params)
        this.$message({
          type: 'success',
          message: this.$t('a190be57.78ec37')
        })
        this.$refs.finder.refresh(true)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
