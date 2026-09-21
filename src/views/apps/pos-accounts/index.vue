<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage bg-color="#f5f7fa">
    <div class="flex items-start justify-between mb-6">
      <div>
        <h2 class="m-0 text-[20px] leading-[26px] font-medium text-[#303133]">
          {{ $t('03d9e6f1.f3b728') }}
        </h2>
        <p class="m-0 mt-2 text-sm text-[#909399]">{{ $t('03d9e6f1.46901f') }}</p>
      </div>
      <div class="flex items-center gap-2.5">
        <el-button :loading="exporting" @click="onExport">{{ $t('03d9e6f1.55405e') }}</el-button>
        <el-button @click="openImport">{{ $t('03d9e6f1.1bfbbc') }}</el-button>
        <el-button type="primary" @click="openCreate">{{ $t('03d9e6f1.f04843') }}</el-button>
      </div>
    </div>

    <div class="grid grid-cols-4 gap-4 mb-4">
      <div class="bg-white rounded-lg px-5 py-5">
        <div class="text-sm text-[#909399]">{{ $t('03d9e6f1.5e0ed4') }}</div>
        <div class="mt-2 text-[28px] leading-[34px] font-medium text-[#303133]">
          {{ stats.total }}
        </div>
      </div>
      <div class="bg-white rounded-lg px-5 py-5">
        <div class="text-sm text-[#909399]">{{ $t('03d9e6f1.c16e2e') }}</div>
        <div class="mt-2 flex items-end">
          <span class="text-[28px] leading-[34px] font-medium text-[#303133]">{{
            stats.enabled
          }}</span>
          <span class="ml-1 mb-1 text-xs text-[#909399]">{{ $t('03d9e6f1.bc0dc4') }}</span>
        </div>
      </div>
      <div class="bg-white rounded-lg px-5 py-5">
        <div class="text-sm text-[#909399]">{{ $t('03d9e6f1.1c1ed9') }}</div>
        <div class="mt-2 flex items-end">
          <span class="text-[28px] leading-[34px] font-medium text-[#303133]">{{
            stats.disabled
          }}</span>
          <span class="ml-1 mb-1 text-xs text-[#909399]">{{ $t('03d9e6f1.7719a1') }}</span>
        </div>
      </div>
      <div class="bg-white rounded-lg px-5 py-5">
        <div class="text-sm text-[#909399]">{{ $t('03d9e6f1.683919') }}</div>
        <div class="mt-2 flex items-end">
          <span class="text-[28px] leading-[34px] font-medium text-[#303133]">{{
            stats.resigned
          }}</span>
          <span class="ml-1 mb-1 text-xs text-[#909399]">{{ $t('03d9e6f1.13c88c') }}</span>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg p-6">
      <div class="flex items-center justify-between mb-4">
        <div class="text-base font-medium text-[#303133]">{{ $t('03d9e6f1.3b5352') }}</div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-[#909399]">{{
            $t('03d9e6f1.f0564b', { n: selectedIds.length })
          }}</span>
          <el-button
            size="mini"
            :disabled="!selectedIds.length || batching"
            @click="batchStatus('enable')"
          >
            {{ $t('03d9e6f1.31bfc7') }}
          </el-button>
          <el-button
            size="mini"
            :disabled="!selectedIds.length || batching"
            @click="batchStatus('disable')"
          >
            {{ $t('03d9e6f1.d8086f') }}
          </el-button>
          <el-button
            size="mini"
            :disabled="!selectedIds.length || batching"
            @click="batchStatus('resign')"
          >
            {{ $t('03d9e6f1.40165c') }}
          </el-button>
        </div>
      </div>
      <SpFormPlus
        ref="searchForm"
        v-model="filters"
        form-type="searchForm"
        label-width="auto"
        class="mb-4"
        :form-items="searchFormItems"
        @submit="onSearch"
        @reset="onReset"
      />

      <el-tabs v-model="statusTab" @tab-click="onTabClick">
        <el-tab-pane :label="$t('03d9e6f1.443483')" name="all" />
        <el-tab-pane :label="$t('03d9e6f1.7854b5')" name="enabled" />
        <el-tab-pane :label="$t('03d9e6f1.710ad0')" name="disabled" />
        <el-tab-pane :label="$t('03d9e6f1.583e79')" name="resigned" />
      </el-tabs>

      <SpTable
        ref="table"
        url="/store/pos-accounts"
        row-key="id"
        selection-mode="multiple"
        :columns="tableColumns"
        :params="tableParams"
        :hooks="tableHooks"
        :page-size="20"
        :page-sizes="[20, 50, 100]"
        :selected-rows.sync="selectedRows"
      />
    </div>

    <AccountFormDialog
      :visible.sync="formVisible"
      :account="activeAccount"
      @success="onFormSuccess"
    />
    <PasswordResultDialog
      :visible.sync="passwordVisible"
      :account="passwordAccount"
      :allow-regenerate="passwordAllowRegenerate"
      @regenerate="onRegeneratePassword"
    />
    <ActionFormDialog
      :visible.sync="roleVisible"
      :account="actionAccount"
      :form="roleForm"
      :form-items="roleFormItems"
      :title="$t('3063bd8d.a05d82')"
      :confirm-text="$t('3063bd8d.88a076')"
      :cancel-text="$t('03d9e6f1.625fb2')"
      :success-message="$t('3063bd8d.33130f')"
      :submit="submitChangeRole"
      @success="onActionSuccess"
    />
    <ActionFormDialog
      :visible.sync="shopVisible"
      :account="actionAccount"
      :form="shopForm"
      :form-items="shopFormItems"
      :title="$t('44927948.468c76')"
      :confirm-text="$t('44927948.669108')"
      :cancel-text="$t('03d9e6f1.625fb2')"
      :success-message="$t('44927948.33130f')"
      :shop-prefix="$t('44927948.3d490b')"
      width="568px"
      :submit="submitTransferShop"
      @success="onActionSuccess"
      @opened="echoShopSelect"
      @closed="resetShopSelect"
    />
    <ConfirmActionDialog
      :visible.sync="resignVisible"
      :account="actionAccount"
      :title="$t('d8334f70.e06b58')"
      :warning="$t('d8334f70.16a45b')"
      warning-first
      :message="$t('d8334f70.d47d48')"
      :confirm-text="$t('d8334f70.bb9efd')"
      :cancel-text="$t('03d9e6f1.625fb2')"
      :success-message="$t('d8334f70.33130f')"
      width="571px"
      :submit="submitResign"
      @success="onActionSuccess"
    />
    <ConfirmActionDialog
      :visible.sync="resetVisible"
      :account="actionAccount"
      :title="$t('61a62e50.0719aa')"
      :warning="$t('61a62e50.d03487')"
      :message="$t('61a62e50.35f35f')"
      :confirm-text="$t('61a62e50.3398b2')"
      :cancel-text="$t('03d9e6f1.625fb2')"
      width="600px"
      :submit="submitResetPassword"
      @success="onResetPasswordSuccess"
    />
    <ImportAccountDialog :visible.sync="importVisible" @success="fetchList" />
  </SpPage>
</template>

<script>
import SpTable from '@/components/sp-table'
import AccountFormDialog from './components/AccountFormDialog.vue'
import PasswordResultDialog from './components/PasswordResultDialog.vue'
import ActionFormDialog from './components/ActionFormDialog.vue'
import ConfirmActionDialog from './components/ConfirmActionDialog.vue'
import ImportAccountDialog from './components/ImportAccountDialog.vue'

export default {
  name: 'PosAccounts',
  components: {
    SpTable,
    AccountFormDialog,
    PasswordResultDialog,
    ActionFormDialog,
    ConfirmActionDialog,
    ImportAccountDialog
  },
  data() {
    return {
      stats: {
        total: 0,
        enabled: 0,
        disabled: 0,
        resigned: 0
      },
      filters: {
        keyword: '',
        role: '',
        distributor_id: ''
      },
      statusTab: 'all',
      formVisible: false,
      activeAccount: null,
      passwordVisible: false,
      passwordAccount: {},
      passwordAllowRegenerate: false,
      selectedRows: [],
      batching: false,
      exporting: false,
      actionAccount: {},
      roleVisible: false,
      shopVisible: false,
      resignVisible: false,
      resetVisible: false,
      importVisible: false,
      roleForm: {
        role: ''
      },
      shopForm: {
        distributor_id: ''
      },
      shopSelect: null,
      filterShopSelect: null
    }
  },
  computed: {
    selectedIds() {
      return (this.selectedRows || []).map((row) => row.id).filter((id) => id != null)
    },
    roleOptions() {
      return [
        { value: 'store_manager', label: this.$t('03d9e6f1.4d9232') },
        { value: 'supervisor', label: this.$t('03d9e6f1.637872') },
        { value: 'clerk', label: this.$t('03d9e6f1.bd2bfc') }
      ]
    },
    searchFormItems() {
      return [
        {
          fieldName: 'keyword',
          label: '',
          cellWidth: 1.2,
          component: 'input',
          componentProps: {
            clearable: true,
            placeholder: this.$t('03d9e6f1.2fdcb5')
          }
        },
        {
          fieldName: 'role',
          label: this.$t('03d9e6f1.464f3d'),
          component: 'select',
          componentProps: {
            clearable: true,
            placeholder: this.$t('03d9e6f1.5bcc10'),
            options: this.roleOptions
          }
        },
        {
          fieldName: 'distributor_id',
          label: this.$t('03d9e6f1.a7da92'),
          component: ({ h, value, onInput }) =>
            h('SpSelectShop', {
              props: {
                value,
                size: 'small',
                clearable: true,
                placeholder: this.$t('03d9e6f1.a48948')
              },
              on: {
                input: onInput
              },
              hook: {
                insert: (vnode) => {
                  this.filterShopSelect = vnode.componentInstance
                }
              }
            })
        }
      ]
    },
    roleFormItems() {
      return [
        {
          fieldName: 'role',
          label: this.$t('3063bd8d.4e400f'),
          component: 'select',
          componentProps: {
            size: 'small',
            placeholder: this.$t('3063bd8d.aabcdc'),
            options: this.roleOptions
          },
          rules: [{ required: true, message: this.$t('3063bd8d.aabcdc'), trigger: 'change' }]
        }
      ]
    },
    shopFormItems() {
      return [
        {
          fieldName: 'distributor_id',
          label: this.$t('44927948.b03599'),
          tip: this.$t('44927948.b042b3'),
          component: ({ h, value, onInput }) =>
            h('SpSelectShop', {
              props: {
                value,
                size: 'small',
                clearable: true,
                placeholder: this.$t('44927948.ca95a5')
              },
              on: {
                input: onInput
              },
              hook: {
                insert: (vnode) => {
                  this.shopSelect = vnode.componentInstance
                }
              }
            }),
          rules: [{ required: true, message: this.$t('44927948.ca95a5'), trigger: 'change' }]
        }
      ]
    },
    tableParams() {
      const params = {}
      if (this.filters.keyword) params.keyword = this.filters.keyword
      if (this.filters.role) params.role = this.filters.role
      if (this.filters.distributor_id) params.distributor_id = this.filters.distributor_id
      if (this.statusTab && this.statusTab !== 'all') params.status = this.statusTab
      return params
    },
    tableHooks() {
      return {
        afterSearch: this.afterSearch
      }
    },
    tableColumns() {
      return [
        { key: 'name', label: this.$t('03d9e6f1.60d045'), minWidth: 100 },
        { key: 'employee_no', label: this.$t('03d9e6f1.5ff5ab'), minWidth: 100 },
        { key: 'email', label: this.$t('03d9e6f1.3bc5e6'), minWidth: 180 },
        {
          key: 'role',
          label: this.$t('03d9e6f1.464f3d'),
          minWidth: 85,
          render: {
            functional: true,
            render: (h, context) => {
              const role = context.props.row.role
              return h(
                'el-tag',
                { props: { size: 'mini', type: this.roleTagType(role) } },
                [this.roleLabel(role)]
              )
            }
          }
        },
        { key: 'shop_code', label: this.$t('03d9e6f1.aabf8d'), minWidth: 100 },
        { key: 'shop_name', label: this.$t('03d9e6f1.a7da92'), minWidth: 160 },
        {
          key: 'status',
          label: this.$t('03d9e6f1.3fea7c'),
          width: 80,
          render: {
            functional: true,
            render: (h, context) => {
              const row = context.props.row
              if (row.status === 'resigned') {
                return h(
                  'el-tag',
                  { props: { size: 'mini', type: 'warning' } },
                  [this.$t('03d9e6f1.583e79')]
                )
              }
              return h('el-switch', {
                props: {
                  value: row.status,
                  activeValue: 'enabled',
                  inactiveValue: 'disabled',
                  disabled: !!row._statusLoading
                },
                on: {
                  change: (val) => this.onToggleStatus(row, val)
                }
              })
            }
          }
        },
        {
          key: 'actions',
          label: this.$t('03d9e6f1.2b6bc0'),
          minWidth: 280,
          fixed: 'right',
          render: {
            functional: true,
            render: (h, context) => {
              const row = context.props.row
              const buttons = [
                h(
                  'el-button',
                  { props: { type: 'text' }, on: { click: () => this.openEdit(row) } },
                  [this.$t('03d9e6f1.95b351')]
                ),
                h(
                  'el-button',
                  { props: { type: 'text' }, on: { click: () => this.openChangeRole(row) } },
                  [this.$t('03d9e6f1.a05d82')]
                ),
                h(
                  'el-button',
                  { props: { type: 'text' }, on: { click: () => this.openTransferShop(row) } },
                  [this.$t('03d9e6f1.468c76')]
                ),
                h(
                  'el-button',
                  { props: { type: 'text' }, on: { click: () => this.openResetPassword(row) } },
                  [this.$t('03d9e6f1.0719aa')]
                )
              ]
              if (row.status !== 'resigned') {
                buttons.push(
                  h(
                    'el-button',
                    {
                      props: { type: 'text' },
                      class: '!text-[#f56c6c]',
                      on: { click: () => this.openResign(row) }
                    },
                    [this.$t('03d9e6f1.583e79')]
                  )
                )
              }
              return h('div', buttons)
            }
          }
        }
      ]
    }
  },
  methods: {
    roleLabel(role) {
      const hit = this.roleOptions.find((item) => item.value === role)
      return hit ? hit.label : role
    },
    roleTagType(role) {
      if (role === 'clerk') return ''
      return 'success'
    },
    afterSearch(response) {
      const payload = (response && response.data && response.data.data) || (response && response.data) || {}
      const stats = payload.stats || {}
      this.stats = {
        total: Number(stats.total || 0),
        enabled: Number(stats.enabled || 0),
        disabled: Number(stats.disabled || 0),
        resigned: Number(stats.resigned || 0)
      }
      return response
    },
    fetchList(force = false) {
      if (this.$refs.table) {
        this.$refs.table.refresh(force)
      }
    },
    onSearch() {
      this.fetchList(true)
    },
    onTabClick() {
      this.$nextTick(() => this.onSearch())
    },
    onReset() {
      if (this.filterShopSelect) this.filterShopSelect.selectValue = ''
      this.onSearch()
    },
    clearSelection() {
      this.selectedRows = []
      if (this.$refs.table) {
        this.$refs.table.clearSelection()
      }
    },
    requestErrorMessage(error) {
      if (!error) return ''
      if (typeof error === 'string') return error
      const data = error.response && error.response.data ? error.response.data : error
      return (
        data.msg ||
        (data.data && (data.data.msg || data.data.error || data.data.message)) ||
        data.message ||
        ''
      )
    },
    async batchStatus(action) {
      if (!this.selectedIds.length) {
        this.$message.warning(this.$t('03d9e6f1.932cf4'))
        return
      }
      if (action === 'resign') {
        try {
          await this.$confirm(this.$t('03d9e6f1.d608e2'), this.$t('03d9e6f1.e06b58'), {
            type: 'warning',
            confirmButtonText: this.$t('03d9e6f1.bb9efd'),
            cancelButtonText: this.$t('03d9e6f1.625fb2')
          })
        } catch (error) {
          return
        }
      }
      this.batching = true
      try {
        const data =
          (await this.$api.posAccounts.batchUpdatePosAccountStatus({
            ids: this.selectedIds,
            action
          })) || {}
        const success = (data.success || []).length
        const skipped = (data.skipped || []).length
        const failed = (data.failed || []).length
        if (failed === 0 && skipped === 0) {
          this.$message.success(this.$t('03d9e6f1.33130f'))
        } else {
          this.$message.warning(
            this.$t('03d9e6f1.8154f8', { success, skipped, failed })
          )
        }
        this.clearSelection()
        this.fetchList()
      } catch (error) {
        const msg = this.requestErrorMessage(error)
        if (msg) this.$message.error(msg)
      } finally {
        this.batching = false
      }
    },
    openImport() {
      this.importVisible = true
    },
    async onExport() {
      this.exporting = true
      try {
        await this.$api.posAccounts.exportPosAccounts({ ...this.tableParams })
        this.$message.success(this.$t('03d9e6f1.8a78aa'))
        this.$export_open_blank('pos_store_account')
      } catch (error) {
        const msg = this.requestErrorMessage(error)
        if (msg) this.$message.error(msg)
      } finally {
        this.exporting = false
      }
    },
    async onToggleStatus(row, nextStatus) {
      const prev = row.status
      const action = nextStatus === 'enabled' ? 'enable' : 'disable'
      this.$set(row, 'status', nextStatus)
      this.$set(row, '_statusLoading', true)
      try {
        await this.$api.posAccounts.updatePosAccountStatus(row.id, action)
        this.fetchList()
      } catch (error) {
        this.$set(row, 'status', prev)
        const msg = this.requestErrorMessage(error)
        if (msg) this.$message.error(msg)
      } finally {
        this.$set(row, '_statusLoading', false)
      }
    },
    openCreate() {
      this.activeAccount = null
      this.formVisible = true
    },
    async openEdit(row) {
      try {
        const data = await this.$api.posAccounts.getPosAccountDetail(row.id)
        this.activeAccount = data && data.id ? data : { ...row }
      } catch (error) {
        this.activeAccount = { ...row }
      }
      this.formVisible = true
    },
    openChangeRole(row) {
      this.actionAccount = { ...row }
      this.roleForm.role = row.role || ''
      this.roleVisible = true
    },
    openTransferShop(row) {
      this.actionAccount = { ...row }
      this.shopForm.distributor_id = row.distributor_id || ''
      this.shopVisible = true
    },
    echoShopSelect() {
      if (this.shopSelect) {
        this.shopSelect.selectValue = this.actionAccount.shop_name || ''
      }
    },
    resetShopSelect() {
      this.shopForm.distributor_id = ''
      if (this.shopSelect) this.shopSelect.selectValue = ''
    },
    onActionSuccess() {
      this.fetchList()
    },
    submitChangeRole(account, form) {
      return this.$api.posAccounts.updatePosAccountRole(account.id, form.role)
    },
    submitTransferShop(account, form) {
      return this.$api.posAccounts.transferPosAccountShop(account.id, form.distributor_id)
    },
    submitResign(account) {
      return this.$api.posAccounts.updatePosAccountStatus(account.id, 'resign')
    },
    async submitResetPassword(account) {
      const data = await this.$api.posAccounts.resetPosAccountPassword(account.id)
      return {
        id: account.id,
        name: account.name || '',
        employee_no: account.employee_no || '',
        shop_name: account.shop_name || '',
        password: (data && data.password) || ''
      }
    },
    openResign(row) {
      this.actionAccount = { ...row }
      this.resignVisible = true
    },
    openResetPassword(row) {
      this.actionAccount = { ...row }
      this.resetVisible = true
    },
    onResetPasswordSuccess(account) {
      this.passwordAccount = account || {}
      this.passwordAllowRegenerate = true
      this.passwordVisible = true
    },
    async onRegeneratePassword() {
      if (!this.passwordAccount.id) return
      try {
        const data = await this.$api.posAccounts.resetPosAccountPassword(this.passwordAccount.id)
        this.passwordAccount = {
          ...this.passwordAccount,
          password: (data && data.password) || ''
        }
      } catch (error) {
        const msg = this.requestErrorMessage(error)
        if (msg) this.$message.error(msg)
      }
    },
    onFormSuccess({ created, data }) {
      this.fetchList()
      if (created && data && data.password) {
        this.passwordAccount = {
          id: data.id,
          name: data.name || '',
          employee_no: data.employee_no || '',
          shop_name: data.shop_name || '',
          password: data.password
        }
        this.passwordAllowRegenerate = false
        this.passwordVisible = true
      }
    }
  }
}
</script>
