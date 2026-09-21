<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-dialog
    :title="$t('61a62e50.0719aa')"
    :visible.sync="dialogVisible"
    width="600px"
    :close-on-click-modal="false"
  >
    <div class="flex items-center px-4 py-3.5 mb-4 rounded bg-[#f5f7fa] text-sm">
      <span class="font-medium text-[#303133]">{{ account.name }}</span>
      <span class="ml-2 text-[#606266]">{{ account.employee_no }} · {{ account.shop_name }}</span>
    </div>
    <div class="mb-4 rounded px-4 py-2.5 text-sm leading-[22px] text-[#e6a23c] bg-[#fdf6ec]">
      {{ $t('61a62e50.d03487') }}
    </div>
    <p class="mt-4 mb-0 text-sm text-[#303133]">{{ $t('61a62e50.35f35f') }}</p>
    <div slot="footer">
      <el-button @click="dialogVisible = false">{{ $t('61a62e50.625fb2') }}</el-button>
      <el-button type="primary" :loading="submitting" @click="onSubmit">
        {{ $t('61a62e50.3398b2') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'ResetPasswordDialog',
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
      submitting: false
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
      this.submitting = true
      try {
        const data = await this.$api.posAccounts.resetPosAccountPassword(this.account.id)
        this.dialogVisible = false
        this.$emit('success', {
          id: this.account.id,
          name: this.account.name || '',
          employee_no: this.account.employee_no || '',
          shop_name: this.account.shop_name || '',
          password: (data && data.password) || ''
        })
      } catch (error) {
        const msg = this.requestErrorMessage(error)
        if (msg) this.$message.error(msg)
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>
