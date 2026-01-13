<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpRouterView>
    <SpPage>
      <SpFormPlus
        v-model="queryParams"
        form-type="searchForm"
        :form-items="formItems"
        @submit="onSearch"
        @reset="onSearch"
        :inline="true"
        class="search-form-spacing"
        label-width="95px"
      />
      <SpFinder
        ref="finder"
        url="/datapass"
        no-selection
        :fixed-row-action="true"
        row-actions-align="left"
        :setting="setting"
        :hooks="{
          beforeSearch: beforeSearch
        }"
      />
    </SpPage>
  </SpRouterView>
</template>
<script>
import moment from 'moment'
import { createSetting } from '@shopex-ui/finder'
export default {
  data() {
    return {
      queryParams: {
        login_name: '',
        status: '',
        queryTime: []
      },
      approveStatusList: [
        { name: '全部', value: undefined },
        { name: '待审批', value: '0' },
        { name: '已通过', value: '1' },
        { name: '未通过', value: '2' }
      ],
      setting: createSetting({
        actions: [
          {
            name: '详情',
            key: 'apply',
            type: 'button',
            buttonType: 'text',
            // visible: (row) => {
            //   return row.status == '0'
            // },
            action: {
              handler: async ([row]) => {
                const { pass_id, operator_id } = row
                this.$router.push({
                  path: this.matchRoutePath('approve'),
                  query: { pass_id, operator_id }
                })
              }
            }
          }
        ],
        columns: [
          {
            name: '账户名称',
            key: 'login_name'
          },
          {
            name: '账户角色',
            key: 'operator_type',
            formatter: (value, row, col) => {
              return value === 'staff'
                ? '平台管理员'
                : value === 'distributor'
                ? '店铺管理员'
                : '供应商管理员'
            }
          },
          {
            name: '申请时间',
            key: 'create_time',
            formatter: (value, row, col) => {
              return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
            }
          },
          {
            name: '申请结果',
            key: 'status',
            render: (h, scope) => {
              if (scope.row.status == '1' || scope.row.status == '2') {
                return h(
                  'el-tag',
                  {
                    props: {
                      type: scope.row.status == '1' ? 'success' : 'danger',
                      size: 'small'
                    }
                  },
                  scope.row.status == '1' ? '通过' : '拒绝'
                )
              } else {
                return ''
              }
            }
          }
        ]
      })
    }
  },
  computed: {
    formItems() {
      return [
        {
          fieldName: 'status',
          label: '审批状态',
          component: 'select',
          formItemClass: 'w-1/3',
          componentProps: {
            placeholder: '请选择审批状态',
            options: this.approveStatusList.map(item => ({
              label: item.name,
              value: item.value
            }))
          }
        },
        {
          fieldName: 'login_name',
          label: '账户名称',
          component: 'input',
          formItemClass: 'w-1/3',
          componentProps: {
            placeholder: '请输入账户名称'
          }
        },
        {
          fieldName: 'queryTime',
          label: '申请日期',
          formItemClass: 'w-2/3',
          component: (context) => {
            const { value, props, onInput, h } = context
            return h('el-date-picker', {
              props: {
                value,
                type: 'daterange',
                format: 'yyyy-MM-dd',
                valueFormat: 'yyyy-MM-dd',
                startPlaceholder: '开始',
                endPlaceholder: '结束',
                size: 'small',
                ...props
              },
              on: {
                input: onInput
              }
            })
          },
          componentProps: {},
          formItemClass: 'flex-1'
        }
      ]
    }
  },
  methods: {
    beforeSearch(params) {
      let _params = {
        ...params,
        ...this.queryParams
      }
      const [startTime, endTime] = this.queryParams.queryTime || []
      if (startTime) {
        _params['start_time'] = moment(startTime).unix()
      }
      if (endTime) {
        _params['end_time'] = moment(endTime).unix()
      }
      delete _params.queryTime
      return _params
    },
    onSearch() {
      this.$refs.finder.refresh(true)
    }
  }
}
</script>
<style lang="scss">
.search-form-spacing {
  margin-bottom: 15px;
}
</style>
