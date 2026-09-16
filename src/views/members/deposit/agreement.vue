<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->
<template>
  <div
    v-loading="pageLoading"
    class="flex flex-col gap-5 bg-white border border-[#e5e7eb] rounded-lg p-8 max-md:p-5 max-md:px-4"
  >
    <div class="grid grid-cols-2 gap-[18px] max-md:grid-cols-1">
      <article class="border border-[#e5e7eb] rounded overflow-hidden">
        <div class="py-3.5 px-4 bg-[#f9fafb] border-b border-[#e5e7eb] font-medium text-sm text-[#1f2937]">
          {{ $t('ecx9887.agreement.protocolTitle') }}
        </div>
        <div class="p-0 min-h-[230px] [&_.sp-rich-text]:!border-0 [&_.tox-tinymce]:!border-0">
          <SpRichText v-model="draft.protocol_content" :disabled="saving" />
        </div>
      </article>
      <article class="border border-[#e5e7eb] rounded overflow-hidden">
        <div class="py-3.5 px-4 bg-[#f9fafb] border-b border-[#e5e7eb] font-medium text-sm text-[#1f2937]">
          {{ $t('ecx9887.agreement.descriptionTitle') }}
        </div>
        <div class="p-0 min-h-[230px] [&_.sp-rich-text]:!border-0 [&_.tox-tinymce]:!border-0">
          <SpRichText v-model="draft.description_content" :disabled="saving" />
        </div>
      </article>
    </div>

    <div class="flex items-center gap-3 justify-end pt-4 max-md:flex-wrap">
      <span v-if="isDirty" class="mr-auto text-[#f56c6c] text-[13px] max-md:w-full max-md:mr-0">{{ $t('ecx9887.agreement.unsaved') }}</span>
      <el-button
        type="primary"
        size="small"
        :loading="saving"
        :disabled="pageLoading"
        @click="onUnifiedSave"
      >
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
