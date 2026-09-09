<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->
<template>
  <div v-loading="pageLoading" class="px-6 py-4">
    <div v-if="isDirty" class="mb-4 text-sm text-amber-600">
      {{ $t('ecx9887.agreement.unsaved') }}
    </div>

    <div class="mb-8">
      <h3 class="mb-3 text-sm font-medium text-gray-900">
        {{ $t('ecx9887.agreement.protocolTitle') }}
      </h3>
      <SpRichText v-model="draft.protocol_content" :disabled="saving" />
    </div>

    <div class="mb-8">
      <h3 class="mb-3 text-sm font-medium text-gray-900">
        {{ $t('ecx9887.agreement.descriptionTitle') }}
      </h3>
      <SpRichText v-model="draft.description_content" :disabled="saving" />
    </div>

    <div class="flex justify-center border-t border-gray-100 pt-4">
      <el-button type="primary" :loading="saving" @click="onUnifiedSave">
        {{ $t('ecx9887.agreement.unifiedSave') }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { getDepositAgreement, saveDepositAgreement } from '@/api/deposit'

function snapshotOf(state) {
  return JSON.stringify({
    protocol_content: state.protocol_content || '',
    description_content: state.description_content || ''
  })
}

function isHtmlBlank(html) {
  if (!html) return true
  const text = String(html)
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .trim()
  return text.length === 0
}

export default {
  name: 'MemberDepositAgreement',
  data() {
    return {
      pageLoading: false,
      saving: false,
      saved: {
        protocol_content: '',
        description_content: ''
      },
      draft: {
        protocol_content: '',
        description_content: ''
      }
    }
  },
  computed: {
    isDirty() {
      return snapshotOf(this.draft) !== snapshotOf(this.saved)
    }
  },
  mounted() {
    this.loadAgreement()
  },
  methods: {
    unwrapPayload(res) {
      return res?.data?.data != null ? res.data.data : res?.data ?? res
    },
    applyAgreement(payload) {
      const protocol = payload?.protocol_content ?? ''
      const description = payload?.description_content ?? ''
      this.saved = {
        protocol_content: protocol,
        description_content: description
      }
      this.draft = {
        protocol_content: protocol,
        description_content: description
      }
    },
    async loadAgreement() {
      this.pageLoading = true
      try {
        const res = await getDepositAgreement()
        this.applyAgreement(this.unwrapPayload(res))
      } catch (e) {
        this.applyAgreement({ protocol_content: '', description_content: '' })
      } finally {
        this.pageLoading = false
      }
    },
    validateBeforeSave() {
      if (isHtmlBlank(this.draft.protocol_content) && isHtmlBlank(this.draft.description_content)) {
        this.$message.error(this.$t('ecx9887.agreement.err.empty'))
        return false
      }
      return true
    },
    async onUnifiedSave() {
      if (!this.validateBeforeSave()) return
      this.saving = true
      try {
        const res = await saveDepositAgreement({
          protocol_content: this.draft.protocol_content || '',
          description_content: this.draft.description_content || ''
        })
        this.applyAgreement(this.unwrapPayload(res))
        this.$message.success(this.$t('ecx9887.agreement.saveSuccess'))
        this.$emit('saved')
      } catch (e) {
        this.$message.error(this.$t('ecx9887.agreement.saveFail'))
      } finally {
        this.saving = false
      }
    },
    hasUnsavedChanges() {
      return this.isDirty
    },
    revertToSaved() {
      this.draft = JSON.parse(JSON.stringify(this.saved))
    }
  }
}
</script>
