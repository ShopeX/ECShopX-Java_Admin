<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage class="merchantAccount">
    <SpFormPlus
      v-if="!isMerchant"
      v-model="filters"
      form-type="searchForm"
      label-width="auto"
      :default-cell-width="300"
      class="mb-4"
      :form-items="searchFormItems"
      @submit="onSearch"
      @reset="onSearch"
    />

    <SpTable
      ref="table"
      url="/merchant/operator"
      row-key="operator_id"
      :columns="tableColumns"
      :params="tableParams"
      :page-size="20"
      :page-sizes="[10, 20, 50]"
    />

    <el-dialog
      :title="$t('6bfa2979.67b76a')"
      :visible.sync="visible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form :model="form" label-width="60px">
        <el-form-item :label="$t('6bfa2979.bb2cdf')">
          <span>{{ form.mobile }}</span>
        </el-form-item>
        <el-form-item :label="$t('6bfa2979.2646b8')">
          <el-input
            v-model="form.password"
            type="password"
            autocomplete="off"
            style="max-width: 160px"
          />
          <span style="color: #999">{{ $t('6bfa2979.c62756') }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">{{ $t('6bfa2979.c08ab9') }}</el-button>
        <el-button type="primary" size="small" @click="fnConfirm">{{
          $t('6bfa2979.aa7527')
        }}</el-button>
      </span>
    </el-dialog>
  </SpPage>
</template>

<script>
import SpFormPlus from '@/components/sp-form-plus'
import SpTable from '@/components/sp-table'
import { setChangePassword, updateTheMerchantInfo } from '@/api/mall/marketing.js'

export default {
  components: {
    SpFormPlus,
    SpTable
  },
  data() {
    return {
      visible: false,
      filters: {
        mobile: '',
        merchant_name: ''
      },
      form: {
        mobile: '',
        password: ''
      },
      currentUser: {
        id: ''
      }
    }
  },
  computed: {
    isMerchant() {
      return this.$store.getters.login_type === 'merchant'
    },
    searchFormItems() {
      return [
        {
          fieldName: 'mobile',
          label: this.$t('bc46a6b6.8098e2'),
          component: 'input',
          componentProps: {
            clearable: true,
            placeholder: this.$t('bc46a6b6.8098e2')
          }
        },
        {
          fieldName: 'merchant_name',
          label: this.$t('bc46a6b6.e6f169'),
          component: 'input',
          componentProps: {
            clearable: true,
            placeholder: this.$t('bc46a6b6.e6f169')
          }
        }
      ]
    },
    tableParams() {
      if (this.isMerchant) return {}
      const params = {}
      if (this.filters.mobile) params.mobile = this.filters.mobile
      if (this.filters.merchant_name) params.merchant_name = this.filters.merchant_name
      return params
    },
    tableColumns() {
      const columns = [
        {
          key: 'actions',
          label: this.$t('ab2cdfe4.2b6bc0'),
          width: 120,
          render: {
            functional: true,
            render: (h, context) => {
              const row = context.props.row
              if (this.isMerchant) {
                return h(
                  'el-button',
                  {
                    props: { type: 'text' },
                    on: { click: () => this.editHandler(row) }
                  },
                  [this.$t('bc46a6b6.95b351')]
                )
              }
              return h(
                'el-button',
                {
                  props: { type: 'text' },
                  on: { click: () => this.fnChangePassword(row) }
                },
                [this.$t('bc46a6b6.0719aa')]
              )
            }
          }
        },
        {
          key: 'mobile',
          label: this.$t('bc46a6b6.99359a'),
          minWidth: 200,
          render: {
            functional: true,
            render: (h, context) => {
              const row = context.props.row
              if (this.isMerchant) {
                const nodes = [
                  h('span', { style: { marginRight: '20px' } }, row.mobile)
                ]
                if (row.is_merchant_main == '1') {
                  nodes.push(
                    h(
                      'el-tag',
                      { props: { type: 'warning', size: 'medium' } },
                      [this.$t('bc46a6b6.302ff0')]
                    )
                  )
                }
                return h('span', nodes)
              }
              const tagType = row.settled_type === 'soletrader' ? 'warning' : 'success'
              const tagText =
                row.settled_type === 'soletrader'
                  ? this.$t('bc46a6b6.a41061')
                  : this.$t('bc46a6b6.04c9e3')
              return h('span', [
                h('span', { style: { marginRight: '20px' } }, row.mobile),
                h('el-tag', { props: { type: tagType, size: 'medium' } }, [tagText])
              ])
            }
          }
        }
      ]
      if (!this.isMerchant) {
        columns.push({
          key: 'merchant_name',
          label: this.$t('bc46a6b6.e6f169'),
          minWidth: 160
        })
      }
      return columns
    }
  },
  methods: {
    onSearch() {
      if (this.$refs.table) {
        this.$refs.table.refresh(true)
      }
    },
    fnChangePassword(row) {
      const merchantName = row.merchant_name || ''
      const message = `<p>${this.$t('6bfa2979.183307', {
        name: merchantName
      })}<br/><span class='tips'>（${this.$t('6bfa2979.1e9e7b')}）</span></p>`
      this.$confirm(message, this.$t('6bfa2979.02d981'), {
        confirmButtonText: this.$t('6bfa2979.38cf16'),
        cancelButtonText: this.$t('6bfa2979.625fb2'),
        type: 'warning',
        dangerouslyUseHTMLString: true,
        center: true
      }).then(async () => {
        const result = await setChangePassword(row.operator_id)
        if (result.data.data.status) {
          this.$message({
            type: 'success',
            message: this.$t('6bfa2979.9844f9')
          })
        }
      })
    },
    async fnConfirm() {
      const result = await updateTheMerchantInfo({
        operator_id: this.currentUser.id,
        password: this.form.password
      })
      if (result.data.data.status) {
        this.$message.success(this.$t('6bfa2979.69be67'))
        this.handleClose()
      }
    },
    editHandler(row) {
      this.visible = true
      this.form.mobile = row.mobile
      this.currentUser.id = row.operator_id
    },
    handleClose() {
      this.visible = false
      this.form.password = ''
      this.currentUser.id = ''
    }
  }
}
</script>

<style lang="scss">
.merchantAccount {
  .el-dialog__header {
    border-bottom: 1px solid #ccc;
  }
  .el-dialog__footer {
    border-top: 1px solid #ccc;
  }
  .el-table th {
    background: #f5f5f5;
    color: #000;
  }
}
</style>

<style lang="scss" scoped>
.merchantAccount {
  .tips {
    .title {
      font-size: 15px;
    }
  }
}
</style>
