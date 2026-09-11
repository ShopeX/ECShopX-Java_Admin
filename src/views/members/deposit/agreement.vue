<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->
<template>
  <div v-loading="pageLoading" class="ecx9887-deposit__section">
    <div class="ecx9887-deposit__section-head">
      <div>
        <h1>{{ $t('ecx9887.agreement.sectionTitle') }}</h1>
        <p>{{ $t('ecx9887.agreement.sectionDesc') }}</p>
      </div>
    </div>

    <div class="ecx9887-deposit__agreement-grid">
      <article class="ecx9887-deposit__editor-card">
        <div class="ecx9887-deposit__editor-title">{{ $t('ecx9887.agreement.protocolTitle') }}</div>
        <div class="ecx9887-deposit__editor-body">
          <SpRichText v-model="draft.protocol_content" :disabled="saving" />
        </div>
      </article>
      <article class="ecx9887-deposit__editor-card">
        <div class="ecx9887-deposit__editor-title">{{ $t('ecx9887.agreement.descriptionTitle') }}</div>
        <div class="ecx9887-deposit__editor-body">
          <SpRichText v-model="draft.description_content" :disabled="saving" />
        </div>
      </article>
    </div>

    <div class="ecx9887-deposit__save-bar">
      <span v-if="isDirty" class="ecx9887-deposit__dirty">{{ $t('ecx9887.agreement.unsaved') }}</span>
      <button
        type="button"
        class="ecx9887-deposit__btn is-primary"
        :disabled="saving || pageLoading"
        @click="onUnifiedSave"
      >
        {{ saving ? '...' : $t('ecx9887.agreement.unifiedSave') }}
      </button>
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
