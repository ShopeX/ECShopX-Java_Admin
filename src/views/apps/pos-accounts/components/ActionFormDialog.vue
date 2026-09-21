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
    @opened="$emit('opened')"
    @closed="$emit('closed')"
  >
    <EmployeeInfoCard :account="account" :shop-prefix="shopPrefix" class="mb-4" />
    <SpFormPlus
      ref="form"
      :value="form"
      form-type="normalForm"
      label-width="120px"
      :form-items="formItems"
      :show-default-actions="false"
      @input="syncForm"
    />
    <div slot="footer">
      <el-button @click="dialogVisible = false">{{ cancelText }}</el-button>
      <el-button type="primary" :loading="submitting" @click="onSubmit">{{ confirmText }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import EmployeeInfoCard from './EmployeeInfoCard.vue'

export default {
  name: 'ActionFormDialog',
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
    form: {
      type: Object,
      default: () => ({})
    },
    formItems: {
      type: Array,
      default: () => []
    },
    title: {
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
    shopPrefix: {
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
  watch: {
    visible(val) {
      if (val) {
        this.$nextTick(() => this.$refs.form && this.$refs.form.clearValidate())
      }
    }
  },
  methods: {
    syncForm(val) {
      Object.keys(val || {}).forEach((key) => {
        this.$set(this.form, key, val[key])
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
      let formData
      try {
        formData = await this.$refs.form.validate()
      } catch (error) {
        return
      }
      this.submitting = true
      try {
        const result = this.submit ? await this.submit(this.account, formData || this.form) : undefined
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
