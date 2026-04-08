<!--
  AI翻译设置页（图5）
  字段：自动翻译开关、平台Key、所在国家地区、接口地址、服务标识
  不含 target_languages 配置
-->
<template>
  <SpPage v-loading="loading">
    <div class="ai-translate-setting">
      <el-form ref="form" :model="formData" :rules="rules" label-width="160px" class="setting-form">
        <el-form-item :label="$t('038c104d.10de12')">
          <el-switch
            v-model="formData.enabled"
            :active-text="$t('038c104d.cc42dd')"
            :inactive-text="$t('038c104d.b15d91')"
          />
        </el-form-item>

        <el-form-item label="API Key" prop="api_key">
          <el-input
            v-model="formData.api_key"
            :placeholder="$t('038c104d.83150f')"
            clearable
            style="max-width: 480px"
          />
        </el-form-item>

        <el-form-item :label="$t('038c104d.540ab1')" prop="location">
          <el-input
            v-model="formData.location"
            :placeholder="$t('038c104d.a6dc24')"
            clearable
            style="max-width: 480px"
          />
          <div class="form-tip">{{ $t('038c104d.517d25') }}</div>
        </el-form-item>

        <el-form-item :label="$t('038c104d.85624c')">
          <el-input
            v-model="formData.api_url"
            placeholder="https://agents.shopexai.com/api/v1/run"
            clearable
            style="max-width: 480px"
          />
          <div class="form-tip">{{ $t('038c104d.84446f') }}</div>
        </el-form-item>

        <el-form-item :label="$t('038c104d.fda8af')">
          <el-input
            v-model="formData.ai_service"
            placeholder="translation"
            clearable
            style="max-width: 480px"
          />
          <div class="form-tip">{{ $t('038c104d.84446f') }}</div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="submitting" @click="handleSubmit">{{ $t('038c104d.be5fbb') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </SpPage>
</template>

<script>
export default {
  name: 'AiTranslateSetting',
  data() {
    return {
      loading: false,
      submitting: false,
      formData: {
        enabled: false,
        api_key: '',
        location: '',
        api_url: '',
        ai_service: ''
      },
      rules: {
        api_key: [
          { required: true, message: this.$t('038c104d.58aacc'), trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getConfig()
  },
  methods: {
    async getConfig() {
      this.loading = true
      try {
        const data = await this.$api.translation.getTranslationConfig()
        if (data) {
          this.formData.enabled = !!data.enabled
          this.formData.api_key = data.api_key || ''
          this.formData.location = data.location || ''
          this.formData.api_url = data.api_url || ''
          this.formData.ai_service = data.ai_service || ''
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    async handleSubmit() {
      try {
        await this.$refs.form.validate()
      } catch {
        return
      }
      this.submitting = true
      try {
        await this.$api.translation.saveTranslationConfig(this.formData)
        this.$message.success(this.$t('038c104d.3b1083'))
        await this.getConfig()
      } catch (e) {
        this.$message.error(this.$t('038c104d.78d235') + (e.message || this.$t('038c104d.974e74')))
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style scoped>
.ai-translate-setting {
  max-width: 720px;
  padding: 24px;
}
.setting-form .form-tip {
  color: #999;
  font-size: 12px;
  line-height: 1.4;
  margin-top: 4px;
}
</style>
