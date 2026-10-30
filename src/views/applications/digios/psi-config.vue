<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage :title="$t('f7623e85.35b94e')">
    <div v-loading="loading">
      <SpFormPlus
        ref="form"
        v-model="form"
        form-type="form"
        :form-items="formItems"
        label-width="150px"
        :show-default-actions="false"
      />
      <div class="section-footer with-border content-center">
        <el-button type="primary" :loading="saveLoading" @click="handleSave">
          {{ $t('f7623e85.4323be') }}
        </el-button>
      </div>
    </div>
  </SpPage>
</template>

<script>
export default {
  name: 'DigiosPsiConfig',
  data() {
    return {
      loading: false,
      saveLoading: false,
      form: {
        is_enabled: false,
        base_url: '',
        client_id: '',
        app_secret: ''
      }
    }
  },
  computed: {
    formItems() {
      const vm = this
      return [
        {
          fieldName: 'is_enabled',
          label: this.$t('f7623e85.249e5b'),
          component: 'switch',
          tip: this.$t('f7623e85.a02513'),
          componentProps: {
            onChange: (enabled) => {
              vm.onEnabledChange(enabled)
            }
          }
        },
        {
          fieldName: 'base_url',
          label: this.$t('f7623e85.18862f'),
          component: 'input',
          tip: this.$t('f7623e85.6247c1'),
          componentProps: {
            clearable: true,
            placeholder: this.$t('f7623e85.6b4465'),
            style: { width: '480px' }
          }
        },
        {
          fieldName: 'client_id',
          label: this.$t('f7623e85.76525f'),
          component: 'input',
          tip: this.$t('f7623e85.76df4c'),
          componentProps: {
            clearable: true,
            autocomplete: 'off',
            placeholder: this.$t('f7623e85.ef65c7'),
            style: { width: '480px' }
          }
        },
        {
          fieldName: 'app_secret',
          label: this.$t('f7623e85.61be04'),
          tip: this.$t('f7623e85.c186c9'),
          component: ({ value, onInput }) => {
            return (
              <el-input
                value={value}
                type='password'
                show-password
                clearable
                autocomplete='new-password'
                placeholder={vm.$t('f7623e85.5eace4')}
                style='width: 480px'
                on-input={onInput}
              />
            )
          }
        }
      ]
    }
  },
  mounted() {
    this.loadConfig()
  },
  methods: {
    applyConfigPayload(data) {
      if (!data || typeof data !== 'object') return
      this.form.is_enabled = Number(data.is_enabled) === 1
      this.form.base_url = data.base_url != null ? String(data.base_url) : ''
      this.form.client_id = data.client_id != null ? String(data.client_id) : ''
      this.form.app_secret = data.app_secret != null ? String(data.app_secret) : ''
    },
    async loadConfig() {
      this.loading = true
      try {
        const data = await this.$api.digios.getDigiosCompanyConfig()
        this.applyConfigPayload(data)
      } catch (e) {
        const msg =
          e?.response?.data?.data?.message ||
          e?.data?.message ||
          e?.data?.error ||
          this.$t('f7623e85.49fd59')
        this.$message.error(msg)
      } finally {
        this.loading = false
      }
    },
    isHttpUrl(url) {
      return /^https?:\/\//i.test(String(url || '').trim())
    },
    validateForEnable() {
      const baseUrl = String(this.form.base_url || '').trim()
      const clientId = String(this.form.client_id || '').trim()
      const appSecret = String(this.form.app_secret || '').trim()
      if (!baseUrl || !clientId || !appSecret) {
        this.$message.error(this.$t('f7623e85.983a22'))
        return false
      }
      if (!this.isHttpUrl(baseUrl)) {
        this.$message.error(this.$t('f7623e85.7c1a79'))
        return false
      }
      return true
    },
    onEnabledChange(enabled) {
      if (enabled && !this.validateForEnable()) {
        this.$nextTick(() => {
          this.form.is_enabled = false
        })
      }
    },
    async handleSave() {
      if (this.form.is_enabled && !this.validateForEnable()) {
        return
      }
      this.saveLoading = true
      try {
        const payload = {
          is_enabled: this.form.is_enabled ? 1 : 0,
          base_url: String(this.form.base_url || '').trim(),
          client_id: String(this.form.client_id || '').trim(),
          app_secret: String(this.form.app_secret || '').trim()
        }
        const data = await this.$api.digios.saveDigiosCompanyConfig(payload)
        this.applyConfigPayload(data)
        this.$message.success(this.$t('f7623e85.3b1083'))
      } catch (e) {
        const msg =
          e?.response?.data?.data?.message ||
          e?.data?.message ||
          e?.data?.error ||
          this.$t('f7623e85.6de920')
        this.$message.error(msg)
      } finally {
        this.saveLoading = false
      }
    }
  }
}
</script>
