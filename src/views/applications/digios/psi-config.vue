<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage :title="$t('f7623e85.35b94e')">
    <div v-loading="loading" class="digios-psi-settings">
      <section class="settings-section">
        <div class="settings-row">
          <div class="settings-row__main">
            <div class="settings-label">{{ $t('f7623e85.249e5b') }}</div>
            <div class="settings-desc">{{ $t('f7623e85.a02513') }}</div>
          </div>
          <el-switch v-model="form.is_enabled" @change="onEnabledChange" />
        </div>
      </section>

      <div class="settings-divider" />

      <form
        v-if="credentialsRendered"
        class="digios-psi-credentials"
        autocomplete="off"
        @submit.prevent
      >
        <section class="settings-section">
          <div class="settings-label settings-label--block">{{ $t('f7623e85.18862f') }}</div>
          <el-input
            v-model="form.base_url"
            class="settings-input"
            clearable
            :placeholder="$t('f7623e85.6b4465')"
          />
          <div class="settings-hint">{{ $t('f7623e85.6247c1') }}</div>
        </section>

        <div class="settings-divider" />

        <section class="settings-section">
          <div class="settings-label settings-label--block">{{ $t('f7623e85.76525f') }}</div>
          <el-input
            v-model="form.client_id"
            class="settings-input"
            clearable
            autocomplete="off"
            :placeholder="$t('f7623e85.ef65c7')"
          />
          <div class="settings-hint">{{ $t('f7623e85.76df4c') }}</div>
        </section>

        <div class="settings-divider" />

        <section class="settings-section">
          <div class="settings-label settings-label--block">{{ $t('f7623e85.61be04') }}</div>
          <el-input
            v-model="form.app_secret"
            class="settings-input"
            clearable
            show-password
            autocomplete="new-password"
            :placeholder="$t('f7623e85.5eace4')"
          />
          <div class="settings-hint">{{ $t('f7623e85.c186c9') }}</div>
        </section>

        <div class="settings-divider" />

        <el-button
          type="primary"
          class="settings-save"
          native-type="button"
          :loading="saveLoading"
          @click="handleSave"
        >
          {{ $t('f7623e85.4323be') }}
        </el-button>
      </form>
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
      credentialsRendered: false,
      form: {
        is_enabled: false,
        base_url: '',
        client_id: '',
        app_secret: ''
      }
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
        this.$nextTick(() => {
          this.credentialsRendered = true
        })
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

<style lang="scss" scoped>
.digios-psi-settings {
  max-width: 720px;
  padding-bottom: 48px;
}

.digios-psi-credentials {
  margin: 0;
  padding: 0;
  border: 0;
  display: block;
}

.settings-section {
  padding: 24px 0;
}

.settings-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}

.settings-row__main {
  flex: 1;
  min-width: 0;
}

.settings-label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  line-height: 22px;
}

.settings-label--block {
  margin-bottom: 12px;
}

.settings-desc {
  margin-top: 4px;
  font-size: 13px;
  line-height: 20px;
  color: #999;
}

.settings-divider {
  height: 1px;
  background: #ebeef5;
}

.settings-hint {
  margin-top: 8px;
  font-size: 13px;
  line-height: 20px;
  color: #999;
}

.settings-input {
  max-width: 480px;

  ::v-deep .el-input__inner {
    border-radius: 8px;
    background-color: #f5f7fa;
  }
}

.settings-save {
  margin-top: 8px;
  border-radius: 6px;
}
</style>
