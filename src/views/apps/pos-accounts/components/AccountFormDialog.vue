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
    <div
      v-if="isEdit"
      class="flex items-center px-4 py-3.5 mb-4 rounded bg-[#f5f7fa] text-sm"
    >
      <span class="font-medium text-[#303133]">{{ form.name }}</span>
      <span class="ml-2 text-[#606266]">
        {{ form.employee_no }} · {{ $t('add1a8cb.3d490b') }}{{ form.shop_name }}
      </span>
    </div>

    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="120px"
      class="pr-5"
      @submit.native.prevent
    >
      <el-form-item :label="$t('add1a8cb.60d045')" prop="name">
        <el-input v-model="form.name" maxlength="30" :placeholder="$t('add1a8cb.8093e3')" />
      </el-form-item>

      <el-form-item v-if="!isEdit" :label="$t('add1a8cb.5ff5ab')" prop="employee_no">
        <el-input
          v-model="form.employee_no"
          maxlength="30"
          :placeholder="$t('add1a8cb.9bd2a4')"
        />
      </el-form-item>

      <el-form-item :label="$t('add1a8cb.8098e2')" prop="mobile">
        <el-input v-model="form.mobile" maxlength="11" :placeholder="$t('add1a8cb.6e4f4b')" />
        <p class="text-xs text-[#909399] leading-[18px]">{{ $t('add1a8cb.d4300c') }}</p>
      </el-form-item>

      <el-form-item :label="$t('add1a8cb.3bc5e6')" prop="email">
        <el-input v-model="form.email" :placeholder="$t('add1a8cb.dbf6d0')" />
        <p class="text-xs text-[#909399] leading-[18px]">{{ $t('add1a8cb.d4300c') }}</p>
      </el-form-item>

      <el-form-item v-if="!isEdit" :label="$t('add1a8cb.a81052')">
        <el-input disabled :value="$t('add1a8cb.2626bd')" />
      </el-form-item>

      <el-form-item :label="$t('add1a8cb.464f3d')" prop="role">
        <el-select v-model="form.role" class="w-full" :placeholder="$t('add1a8cb.aabcdc')">
          <el-option
            v-for="item in roleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('add1a8cb.a7da92')" prop="distributor_id">
        <SpSelectShop
          ref="shopSelect"
          v-model="form.distributor_id"
          clearable
          class="w-full"
          :placeholder="$t('add1a8cb.ca95a5')"
        />
      </el-form-item>

      <el-form-item :label="$t('add1a8cb.3fea7c')" prop="status">
        <el-switch
          v-model="form.status"
          active-value="enabled"
          inactive-value="disabled"
          :disabled="form.status === 'resigned'"
        />
      </el-form-item>
    </el-form>

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
    const validateEmployeeNo = (rule, value, callback) => {
      if (!value || !String(value).trim()) {
        callback(new Error(this.$t('add1a8cb.f02d1d')))
        return
      }
      callback()
    }
    const validateMobile = (rule, value, callback) => {
      if (!value) {
        callback()
        return
      }
      if (!isMobile(value)) {
        callback(new Error(this.$t('add1a8cb.a32ab5')))
        return
      }
      callback()
    }
    const validateEmail = (rule, value, callback) => {
      if (!value) {
        callback()
        return
      }
      if (!validEmail(value)) {
        callback(new Error(this.$t('add1a8cb.97e3ac')))
        return
      }
      callback()
    }
    return {
      submitting: false,
      form: emptyForm(),
      rules: {
        employee_no: [{ required: true, validator: validateEmployeeNo, trigger: 'blur' }],
        mobile: [{ validator: validateMobile, trigger: 'blur' }],
        email: [{ validator: validateEmail, trigger: 'blur' }],
        role: [{ required: true, message: this.$t('add1a8cb.aabcdc'), trigger: 'change' }],
        distributor_id: [{ required: true, message: this.$t('add1a8cb.ca95a5'), trigger: 'change' }]
      }
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
          status: row.status === 'disabled' ? 'disabled' : row.status === 'resigned' ? 'resigned' : 'enabled',
          updated: row.updated
        }
      } else {
        this.form = emptyForm()
      }
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate()
        const shopSelect = this.$refs.shopSelect
        if (shopSelect) {
          shopSelect.selectValue = this.isEdit ? this.form.shop_name : ''
        }
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
      const valid = await this.$refs.form.validate().catch(() => false)
      if (!valid) return
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
        if (this.$refs.shopSelect) {
          this.$refs.shopSelect.selectValue = ''
        }
      })
    }
  }
}
</script>
