<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-dialog
    :title="$t('55294008.77c2d0')"
    :visible.sync="dialogVisible"
    width="575px"
    :close-on-click-modal="false"
    append-to-body
    @closed="onClosed"
  >
    <div class="flex items-center px-4 py-3.5 mb-4 rounded bg-[#f5f7fa] text-sm">
      <span class="font-medium text-[#303133]">{{ account.name }}</span>
      <span class="ml-2 text-[#606266]">{{ account.employee_no }} · {{ account.shop_name }}</span>
    </div>
    <div class="flex items-start">
      <div class="w-[120px] h-8 leading-8 text-right text-[#606266] pr-3">
        {{ $t('55294008.763ffe') }}
      </div>
      <div class="min-w-0">
        <div class="flex items-center gap-3">
          <el-input :value="account.password" size="small" readonly class="!w-[331px]" />
          <el-button size="small" @click="copyPassword">{{ $t('55294008.79d3ab') }}</el-button>
        </div>
        <p class="mt-1 text-xs text-[#909399] leading-[18px]">{{ $t('55294008.867e4b') }}</p>
      </div>
    </div>
    <div slot="footer">
      <el-button v-if="allowRegenerate" @click="$emit('regenerate')">
        {{ $t('55294008.b0f57f') }}
      </el-button>
      <el-button type="primary" @click="dialogVisible = false">{{ $t('55294008.769d88') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'PasswordResultDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    account: {
      type: Object,
      default: () => ({})
    },
    allowRegenerate: {
      type: Boolean,
      default: false
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
    copyPassword() {
      const text = this.account.password || ''
      if (!text) return
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard
          .writeText(text)
          .then(() => this.$message.success(this.$t('55294008.20a495')))
          .catch(() => this.fallbackCopy(text))
      } else {
        this.fallbackCopy(text)
      }
    },
    fallbackCopy(text) {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.top = '0'
      textarea.style.left = '0'
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      try {
        if (document.execCommand('copy')) {
          this.$message.success(this.$t('55294008.20a495'))
        } else {
          this.$message.error(this.$t('55294008.41da1c'))
        }
      } catch (e) {
        this.$message.error(this.$t('55294008.41da1c'))
      }
      document.body.removeChild(textarea)
    },
    onClosed() {
      this.$emit('closed')
    }
  }
}
</script>
