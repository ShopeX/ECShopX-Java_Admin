<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-dialog
    :title="$t('9a81c391.1bfbbc')"
    :visible.sync="dialogVisible"
    width="779px"
    :close-on-click-modal="false"
    @closed="resetFile"
  >
    <p class="m-0 mb-4 text-sm leading-[22px] text-[#606266]">
      {{ $t('9a81c391.b87a05') }}
    </p>
    <div class="mb-6">
      <el-button @click="downloadTemplate">
        {{ $t('9a81c391.2e505d') }}
        <i class="el-icon-download el-icon--right" />
      </el-button>
    </div>
    <el-upload
      ref="uploader"
      drag
      action=""
      accept=".xlsx,.xls,.csv"
      :auto-upload="false"
      :show-file-list="false"
      :on-change="onFileChange"
      class="w-full [&_.el-upload]:block [&_.el-upload]:w-full [&_.el-upload-dragger]:w-full [&_.el-upload-dragger]:h-40 [&_.el-upload-dragger]:flex [&_.el-upload-dragger]:flex-col [&_.el-upload-dragger]:items-center [&_.el-upload-dragger]:justify-center [&_.el-upload-dragger]:bg-[#fafafa] [&_.el-icon-upload]:hidden"
    >
      <div class="px-4 text-center">
        <div class="text-base leading-6 text-[#303133]">
          {{ fileName || $t('9a81c391.b87e7e') }}
        </div>
        <div class="mt-2 text-sm leading-5 text-[#909399]">{{ $t('9a81c391.7db055') }}</div>
        <div class="mt-1 text-sm leading-5 text-[#909399]">{{ $t('9a81c391.a1d7ca') }}</div>
      </div>
    </el-upload>
    <div slot="footer">
      <el-button @click="dialogVisible = false">{{ $t('9a81c391.625fb2') }}</el-button>
      <el-button type="primary" :loading="submitting" @click="onSubmit">
        {{ $t('9a81c391.7d2ff4') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { downloadFile } from '@/utils'

const FILE_TYPE = 'pos_store_account'
const MAX_SIZE = 5 * 1024 * 1024
const ACCEPT_EXT = ['.xlsx', '.xls', '.csv']

export default {
  name: 'ImportAccountDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      submitting: false,
      file: null,
      fileName: ''
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
    resetFile() {
      this.file = null
      this.fileName = ''
      if (this.$refs.uploader) this.$refs.uploader.clearFiles()
    },
    isAccepted(name) {
      const lower = String(name || '').toLowerCase()
      return ACCEPT_EXT.some((ext) => lower.endsWith(ext))
    },
    onFileChange(uploadFile) {
      const raw = uploadFile && uploadFile.raw
      if (!raw) return
      if (!this.isAccepted(raw.name)) {
        this.$message.warning(this.$t('9a81c391.62f46d'))
        this.resetFile()
        return
      }
      if (raw.size > MAX_SIZE) {
        this.$message.warning(this.$t('9a81c391.a4f067'))
        this.resetFile()
        return
      }
      this.file = raw
      this.fileName = raw.name
    },
    async downloadTemplate() {
      try {
        const res = await this.$api.common.exportUploadTemplate({
          file_type: FILE_TYPE,
          file_name: this.$t('9a81c391.c35996')
        })
        const payload = res && res.file ? res : (res && res.data && res.data.data) || {}
        if (payload.file) {
          downloadFile(payload.file, payload.name || this.$t('9a81c391.c35996'))
        } else {
          this.$message.error(this.$t('9a81c391.3e7635'))
        }
      } catch (error) {
        const msg = this.requestErrorMessage(error)
        this.$message.error(msg || this.$t('9a81c391.3e7635'))
      }
    },
    async onSubmit() {
      if (!this.file) {
        this.$message.warning(this.$t('9a81c391.d86eef'))
        return
      }
      this.submitting = true
      try {
        await this.$api.common.handleUploadFile({
          isUploadFile: true,
          file_type: FILE_TYPE,
          file: this.file
        })
        this.$message.success(this.$t('9a81c391.7bbfaa'))
        this.dialogVisible = false
        this.$emit('success')
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
