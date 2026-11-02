<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-dialog
    :title="isEdit ? $t('add1a8cb.656e89') : $t('add1a8cb.f04843')"
    :visible.sync="dialogVisible"
    width="772px"
    :close-on-click-modal="false"
    @closed="resetForm"
  >
    <EmployeeInfoCard
      v-if="isEdit"
      :account="form"
      :shop-prefix="$t('add1a8cb.3d490b')"
      class="mb-4"
    />

    <SpFormPlus
      ref="form"
      v-model="form"
      form-type="normalForm"
      label-width="120px"
      class="pr-5"
      :form-items="formItems"
      :show-default-actions="false"
    />

    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">{{ $t('add1a8cb.625fb2') }}</el-button>
      <el-button type="primary" :loading="submitting" @click="onSubmit">
        {{ $t('add1a8cb.be5fbb') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { isMobile, validEmail } from '@/utils/validate'
import EmployeeInfoCard from './EmployeeInfoCard.vue'

const emptyForm = () => ({
  id: '',
  name: '',
  employee_no: '',
  mobile: '',
  email: '',
  role: '',
  distributor_id: '',
  shop_name: '',
  status: 'enabled',
  updated: undefined
})

export default {
  name: 'AccountFormDialog',
  components: { EmployeeInfoCard },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    account: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      submitting: false,
      shopSelect: null,
      form: emptyForm()
    }
  },
  computed: {
    isEdit() {
      return !!(this.account && this.account.id)
    },
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    },
    roleOptions() {
      return [
        { value: 'store_manager', label: this.$t('add1a8cb.4d9232') },
        { value: 'supervisor', label: this.$t('add1a8cb.637872') },
        { value: 'clerk', label: this.$t('add1a8cb.bd2bfc') }
      ]
    },
    formItems() {
      return [
        {
          fieldName: 'name',
          label: this.$t('add1a8cb.60d045'),
          component: 'input',
          componentProps: {
            maxlength: 30,
            placeholder: this.$t('add1a8cb.8093e3')
          }
        },
        {
          fieldName: 'employee_no',
          label: this.$t('add1a8cb.5ff5ab'),
          isShow: () => !this.isEdit,
          component: 'input',
          componentProps: {
            maxlength: 30,
            placeholder: this.$t('add1a8cb.9bd2a4')
          },
          rules: [{ required: true, validator: this.validateEmployeeNo, trigger: 'blur' }]
        },
        {
          fieldName: 'mobile',
          label: this.$t('add1a8cb.8098e2'),
          component: 'input',
          componentProps: {
            maxlength: 11,
            placeholder: this.$t('add1a8cb.6e4f4b')
          },
          tip: this.$t('add1a8cb.d4300c'),
          rules: [{ validator: this.validateMobile, trigger: 'blur' }]
        },
        {
          fieldName: 'email',
          label: this.$t('add1a8cb.3bc5e6'),
          component: 'input',
          componentProps: {
            placeholder: this.$t('add1a8cb.dbf6d0')
          },
          tip: this.$t('add1a8cb.d4300c'),
          rules: [{ validator: this.validateEmail, trigger: 'blur' }]
        },
        {
          fieldName: 'password_hint',
          label: this.$t('add1a8cb.a81052'),
          isShow: () => !this.isEdit,
          component: ({ h }) =>
            h('el-input', {
              props: {
                value: this.$t('add1a8cb.2626bd'),
                disabled: true
              }
            })
        },
        {
          fieldName: 'role',
          label: this.$t('add1a8cb.464f3d'),
          component: 'select',
          componentProps: {
            placeholder: this.$t('add1a8cb.aabcdc'),
            options: this.roleOptions
          },
          rules: [{ required: true, message: this.$t('add1a8cb.aabcdc'), trigger: 'change' }]
        },
        {
          fieldName: 'distributor_id',
          label: this.$t('add1a8cb.a7da92'),
          component: ({ h, value, onInput }) =>
            h('SpSelectShop', {
              props: {
                value,
                clearable: true,
                placeholder: this.$t('add1a8cb.ca95a5')
              },
              on: {
                input: onInput
              },
              hook: {
                insert: (vnode) => {
                  this.shopSelect = vnode.componentInstance
                  this.syncShopSelect()
                }
              }
            }),
          rules: [{ required: true, message: this.$t('add1a8cb.ca95a5'), trigger: 'change' }]
        },
        {
          fieldName: 'status',
          label: this.$t('add1a8cb.3fea7c'),
          component: 'switch',
          componentProps: {
            activeValue: 'enabled',
            inactiveValue: 'disabled',
            disabled: (formData) => formData.status === 'resigned'
          }
        }
      ]
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.fillForm()
      }
    }
  },
  methods: {
    validateEmployeeNo(rule, value, callback) {
      if (!value || !String(value).trim()) {
        callback(new Error(this.$t('add1a8cb.f02d1d')))
        return
      }
      callback()
    },
    validateMobile(rule, value, callback) {
      if (!value) {
        callback()
        return
      }
      if (!isMobile(value)) {
        callback(new Error(this.$t('add1a8cb.a32ab5')))
        return
      }
      callback()
    },
    validateEmail(rule, value, callback) {
      if (!value) {
        callback()
        return
      }
      if (!validEmail(value)) {
        callback(new Error(this.$t('add1a8cb.97e3ac')))
        return
      }
      callback()
    },
    syncShopSelect() {
      if (!this.shopSelect) return
      this.shopSelect.selectValue = this.isEdit ? this.form.shop_name || '' : ''
    },
    fillForm() {
      if (this.isEdit) {
        const row = this.account
        this.form = {
          id: row.id,
          name: row.name || '',
          employee_no: row.employee_no || '',
          mobile: row.mobile || '',
          email: row.email || '',
          role: row.role || '',
          distributor_id: row.distributor_id || '',
          shop_name: row.shop_name || '',
          status:
            row.status === 'disabled'
              ? 'disabled'
              : row.status === 'resigned'
              ? 'resigned'
              : 'enabled',
          updated: row.updated
        }
      } else {
        this.form = emptyForm()
      }
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate()
        this.syncShopSelect()
      })
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
    async onSubmit() {
      try {
        await this.$refs.form.validate()
      } catch (error) {
        return
      }
      this.submitting = true
      try {
        if (this.isEdit) {
          const payload = {
            name: this.form.name,
            email: this.form.email,
            mobile: this.form.mobile,
            role: this.form.role,
            distributor_id: this.form.distributor_id
          }
          if (this.form.status !== 'resigned') {
            payload.status = this.form.status
          }
          if (this.form.updated != null) {
            payload.updated = this.form.updated
          }
          await this.$api.posAccounts.updatePosAccount(this.form.id, payload)
          this.$message.success(this.$t('add1a8cb.3b1083'))
          this.dialogVisible = false
          this.$emit('success', { created: false })
        } else {
          const created = await this.$api.posAccounts.createPosAccount({
            employee_no: String(this.form.employee_no).trim(),
            name: this.form.name,
            email: this.form.email,
            mobile: this.form.mobile,
            role: this.form.role,
            distributor_id: this.form.distributor_id
          })
          if (this.form.status === 'disabled' && created && created.id) {
            try {
              await this.$api.posAccounts.updatePosAccountStatus(created.id, 'disable')
              created.status = 'disabled'
            } catch (statusError) {
              const msg = this.requestErrorMessage(statusError)
              if (msg) this.$message.error(msg)
            }
          }
          this.$message.success(this.$t('add1a8cb.3b1083'))
          this.dialogVisible = false
          this.$emit('success', { created: true, data: created || {} })
        }
      } catch (error) {
        const msg = this.requestErrorMessage(error)
        if (msg) this.$message.error(msg)
      } finally {
        this.submitting = false
      }
    },
    resetForm() {
      this.form = emptyForm()
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate()
        if (this.shopSelect) this.shopSelect.selectValue = ''
      })
    }
  }
}
</script>
