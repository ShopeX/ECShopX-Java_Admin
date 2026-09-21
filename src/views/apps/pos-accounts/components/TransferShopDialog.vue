<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-dialog
    :title="$t('44927948.468c76')"
    :visible.sync="dialogVisible"
    width="568px"
    :close-on-click-modal="false"
    @closed="resetForm"
  >
    <div class="flex items-center px-4 py-3.5 mb-4 rounded bg-[#f5f7fa] text-sm">
      <span class="font-medium text-[#303133]">{{ account.name }}</span>
      <span class="ml-2 text-[#606266]">
        {{ account.employee_no }} · {{ $t('44927948.3d490b') }}{{ account.shop_name }}
      </span>
    </div>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" @submit.native.prevent>
      <el-form-item :label="$t('44927948.b03599')" prop="distributor_id">
        <SpSelectShop
          ref="shopSelect"
          v-model="form.distributor_id"
          size="small"
          clearable
          class="w-full"
          :placeholder="$t('44927948.ca95a5')"
        />
        <p class="text-xs text-[#909399] leading-[18px]">{{ $t('44927948.b042b3') }}</p>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="dialogVisible = false">{{ $t('44927948.625fb2') }}</el-button>
      <el-button type="primary" :loading="submitting" @click="onSubmit">
        {{ $t('44927948.669108') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'TransferShopDialog',
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
      form: { distributor_id: '' },
      rules: {
        distributor_id: [{ required: true, message: this.$t('44927948.ca95a5'), trigger: 'change' }]
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
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.form.distributor_id = this.account.distributor_id || ''
        this.$nextTick(() => {
          this.$refs.form && this.$refs.form.clearValidate()
          if (this.$refs.shopSelect) {
            this.$refs.shopSelect.selectValue = this.account.shop_name || ''
          }
        })
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
        await this.$api.posAccounts.transferPosAccountShop(
          this.account.id,
          this.form.distributor_id
        )
        this.$message.success(this.$t('44927948.33130f'))
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
      this.form.distributor_id = ''
      if (this.$refs.shopSelect) this.$refs.shopSelect.selectValue = ''
    }
  }
}
</script>
