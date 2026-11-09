<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :width="width"
    :close-on-click-modal="false"
  >
    <div
      v-if="warning && warningFirst"
      class="mb-4 rounded px-4 py-2.5 text-sm leading-[22px] text-[#e6a23c] bg-[#fdf6ec]"
    >
      {{ warning }}
    </div>
    <EmployeeInfoCard :account="account" :class="warningFirst ? 'mt-4 mb-4' : 'mb-4'" />
    <div
      v-if="warning && !warningFirst"
      class="mb-4 rounded px-4 py-2.5 text-sm leading-[22px] text-[#e6a23c] bg-[#fdf6ec]"
    >
      {{ warning }}
    </div>
    <p class="mt-4 mb-0 text-sm text-[#303133]">{{ message }}</p>
    <div slot="footer">
      <el-button @click="dialogVisible = false">{{ cancelText }}</el-button>
      <el-button type="primary" :loading="submitting" @click="onSubmit">{{ confirmText }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import EmployeeInfoCard from './EmployeeInfoCard.vue'

export default {
  name: 'ConfirmActionDialog',
  components: { EmployeeInfoCard },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    account: {
      type: Object,
      default: () => ({})
    },
    title: {
      type: String,
      default: ''
    },
    warning: {
      type: String,
      default: ''
    },
    warningFirst: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: ''
    },
    confirmText: {
      type: String,
      default: ''
    },
    cancelText: {
      type: String,
      default: ''
    },
    successMessage: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '576px'
    },
    submit: {
      type: Function,
      default: null
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
        const result = this.submit ? await this.submit(this.account) : undefined
        if (this.successMessage) this.$message.success(this.successMessage)
        this.dialogVisible = false
        this.$emit('success', result)
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
