<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->
<template>
  <SpPage>
    <div v-loading="pageLoading">
      <SpFormPlus
        ref="form"
        v-model="form"
        :form-items="formItems"
        form-type="form"
        label-width="160px"
        :show-default-actions="false"
      />
      <div class="section-footer with-border content-center">
        <el-button v-loading="saving" type="primary" @click="onSubmit">
          {{ $t('0677a420.be5fbb') }}
        </el-button>
      </div>
    </div>
  </SpPage>
</template>

<script>
import { getMailSetting, saveMailSetting } from '@/api/mail'
import { validEmail } from '@/utils/validate'

const emptyForm = () => ({
  EMAIL_SMTP_PORT: '',
  EMAIL_RELAY_HOST: '',
  EMAIL_SENDER: '',
  EMAIL_USER: '',
  EMAIL_PASSWORD: ''
})

export default {
  name: 'MailServiceSetting',
  data() {
    return {
      pageLoading: false,
      saving: false,
      form: emptyForm()
    }
  },
  computed: {
    formItems() {
      const vm = this

      const validateSenderFormat = (rule, value, callback) => {
        if (value && !validEmail(String(value).trim())) {
          callback(new Error(vm.$t('0677a420.f02628')))
        } else {
          callback()
        }
      }

      return [
        {
          fieldName: 'EMAIL_SMTP_PORT',
          label: vm.$t('0677a420.fdcadf'),
          component: 'input',
          componentProps: {
            placeholder: vm.$t('0677a420.6076bf'),
            clearable: true,
            style: { width: '420px' }
          },
          rules: [{ required: true, message: vm.$t('0677a420.6076bf'), trigger: 'blur' }]
        },
        {
          fieldName: 'EMAIL_RELAY_HOST',
          label: vm.$t('0677a420.114c66'),
          component: 'input',
          componentProps: {
            placeholder: vm.$t('0677a420.13e53b'),
            clearable: true,
            style: { width: '420px' }
          },
          rules: [{ required: true, message: vm.$t('0677a420.13e53b'), trigger: 'blur' }]
        },
        {
          fieldName: 'EMAIL_SENDER',
          label: vm.$t('0677a420.b9d830'),
          component: 'input',
          componentProps: {
            placeholder: vm.$t('0677a420.6eb7a0'),
            clearable: true,
            style: { width: '420px' }
          },
          rules: [
            { required: true, message: vm.$t('0677a420.6eb7a0'), trigger: 'blur' },
            { validator: validateSenderFormat, trigger: 'blur' }
          ]
        },
        {
          fieldName: 'EMAIL_USER',
          label: vm.$t('0677a420.e2df57'),
          component: 'input',
          componentProps: {
            placeholder: vm.$t('0677a420.999f45'),
            clearable: true,
            style: { width: '420px' }
          },
          rules: [{ required: true, message: vm.$t('0677a420.999f45'), trigger: 'blur' }]
        },
        {
          fieldName: 'EMAIL_PASSWORD',
          label: vm.$t('0677a420.42c048'),
          component: 'input',
          componentProps: {
            type: 'password',
            'show-password': true,
            autocomplete: 'new-password',
            placeholder: vm.$t('0677a420.b0322a'),
            clearable: true,
            style: { width: '420px' }
          },
          rules: [{ required: true, message: vm.$t('0677a420.b0322a'), trigger: 'blur' }]
        }
      ]
    }
  },
  mounted() {
    this.loadConfig()
  },
  methods: {
    normalizePayload(raw) {
      const d = raw && typeof raw === 'object' ? raw : {}
      return {
        EMAIL_SMTP_PORT: d.EMAIL_SMTP_PORT != null ? String(d.EMAIL_SMTP_PORT) : '',
        EMAIL_RELAY_HOST: d.EMAIL_RELAY_HOST != null ? String(d.EMAIL_RELAY_HOST) : '',
        EMAIL_SENDER: d.EMAIL_SENDER != null ? String(d.EMAIL_SENDER) : '',
        EMAIL_USER: d.EMAIL_USER != null ? String(d.EMAIL_USER) : '',
        EMAIL_PASSWORD: d.EMAIL_PASSWORD != null ? String(d.EMAIL_PASSWORD) : ''
      }
    },
    loadConfig() {
      this.pageLoading = true
      getMailSetting()
        .then((res) => {
          const inner = res?.data?.data != null ? res.data.data : res?.data
          this.form = this.normalizePayload(inner)
        })
        .catch(() => {})
        .finally(() => {
          this.pageLoading = false
        })
    },
    async onSubmit() {
      try {
        await this.$refs.form.validate()
        this.saving = true
        await saveMailSetting({ ...this.form })
        this.$message.success(this.$t('0677a420.3b1083'))
        this.loadConfig()
      } catch (error) {
        // 校验失败或接口错误（接口错误由 request 拦截器提示）
      } finally {
        this.saving = false
      }
    }
  }
}
</script>
