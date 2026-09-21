<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-dialog
    :title="$t('3063bd8d.a05d82')"
    :visible.sync="dialogVisible"
    width="576px"
    :close-on-click-modal="false"
    @closed="resetForm"
  >
    <div class="flex items-center px-4 py-3.5 mb-4 rounded bg-[#f5f7fa] text-sm">
      <span class="font-medium text-[#303133]">{{ account.name }}</span>
      <span class="ml-2 text-[#606266]">{{ account.employee_no }} · {{ account.shop_name }}</span>
    </div>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" @submit.native.prevent>
      <el-form-item :label="$t('3063bd8d.4e400f')" prop="role">
        <el-select
          v-model="form.role"
          class="w-full"
          :placeholder="$t('3063bd8d.aabcdc')"
        >
          <el-option
            v-for="item in roleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="dialogVisible = false">{{ $t('3063bd8d.625fb2') }}</el-button>
      <el-button type="primary" :loading="submitting" @click="onSubmit">
        {{ $t('3063bd8d.88a076') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'ChangeRoleDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    account: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      submitting: false,
      form: { role: '' },
      rules: {
        role: [{ required: true, message: this.$t('3063bd8d.aabcdc'), trigger: 'change' }]
      }
    }
  },
  computed: {
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
        { value: 'store_manager', label: this.$t('3063bd8d.4d9232') },
        { value: 'supervisor', label: this.$t('3063bd8d.637872') },
        { value: 'clerk', label: this.$t('3063bd8d.bd2bfc') }
      ]
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.form.role = this.account.role || ''
        this.$nextTick(() => this.$refs.form && this.$refs.form.clearValidate())
      }
    }
  },
  methods: {
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
        await this.$api.posAccounts.updatePosAccountRole(this.account.id, this.form.role)
        this.$message.success(this.$t('3063bd8d.33130f'))
        this.dialogVisible = false
        this.$emit('success')
      } catch (error) {
        const msg = this.requestErrorMessage(error)
        if (msg) this.$message.error(msg)
      } finally {
        this.submitting = false
      }
    },
    resetForm() {
      this.form.role = ''
    }
  }
}
</script>
