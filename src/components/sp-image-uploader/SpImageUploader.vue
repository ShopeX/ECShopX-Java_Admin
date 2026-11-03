<template>
  <div class="flex p-0">
    <el-upload
      ref="uploadRef"
      action=""
      accept="image/jpeg,image/png,image/gif"
      :multiple="true"
      :show-file-list="false"
      :http-request="handleUpload"
      :before-upload="beforeAvatarUpload"
      :on-success="handleAvatarSuccess"
      :on-error="uploadError"
    />

    <el-button
      v-if="!isPasteMode"
      type="normal"
      @click.stop="selectImage"
      class="h-[calc(1em+16px)] !border-2 !border-solid !border-purple-700 !mr-2 !flex !items-center !justify-center"
    >
      {{ $t('0248fee0.153fa6') }}
    </el-button>
    <div
      class="w-[300px] h-[calc(1em+16px)] border-2 border-solid border-purple-700 rounded flex items-center justify-center cursor-pointer py-1 px-1 ml-2 hover:bg-purple-50 transition-colors"
      :class="[isPasteMode ? 'color-gray' : '']"
      @drop.prevent="handleDrop"
      @dragover.prevent
      @click="togglePasteMode"
    >
      <div class="flex items-center justify-center">
        <div v-if="isPasteMode" class="hover:cursor-pointer text-gray-400">
          <div v-if="isMac">{{ $t('0248fee0.fcdea3') }}</div>
          <div v-else>{{ $t('0248fee0.5435ce') }}</div>
        </div>
        <div v-else class="hover:cursor-pointer text-gray-400">
          {{ $t('0248fee0.d0c7cb') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UploadUtil from '@/utils/uploadUtil'
import { createAsyncQueue } from '@/utils/asyncQueue'
import { isMac as checkIsMac } from '@/utils'

const UPLOAD_CONCURRENCY = 3

export default {
  name: 'SpImageUploader',
  props: {
    localpostData: {
      type: Object,
      default: () => ({
        token: '',
        key: '',
        fname: ''
      })
    },
    refresh: {
      type: Function,
      default: () => {}
    },
    currentCategory: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      isPasteMode: false,
      pasteListener: null,
      pendingUploads: 0,
      uploadSuccessCount: 0,
      uploadFailCount: 0,
      runUploadTask: createAsyncQueue(UPLOAD_CONCURRENCY)
    }
  },
  computed: {
    isMac() {
      return checkIsMac()
    }
  },
  mounted() {
    this.setupPasteListener()
  },
  beforeDestroy() {
    if (this.pasteListener) {
      document.removeEventListener('paste', this.pasteListener)
    }
  },
  methods: {
    togglePasteMode() {
      this.isPasteMode = !this.isPasteMode
    },
    selectImage() {
      const uploadComponent = this.$refs.uploadRef
      if (uploadComponent) {
        const input = uploadComponent.$el.querySelector('input[type="file"]')
        if (input) {
          input.click()
        }
      }
    },
    handleDrop(event) {
      const files = Array.from(event.dataTransfer.files)
      const imageFiles = files.filter(
        (file) =>
          file.type.startsWith('image/') &&
          ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)
      )
      if (imageFiles.length === 0) return
      imageFiles.forEach((file) => {
        if (!this.beforeAvatarUpload(file)) return
        this.handleUpload({ file }).catch(() => {})
      })
    },

    getImageExtension(mimeType) {
      const mimeMap = {
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif',
        'image/webp': 'webp',
        'image/bmp': 'bmp',
        'image/svg+xml': 'svg'
      }
      return mimeMap[mimeType]
    },

    setupPasteListener() {
      this.pasteListener = (event) => {
        if (!this.isPasteMode) return

        const items = event.clipboardData.items
        if (!items) return

        for (let i = 0; i < items.length; i++) {
          if (items[i].type.startsWith('image/')) {
            event.preventDefault()
            const blob = items[i].getAsFile()
            if (!blob) continue

            const extension = this.getImageExtension(blob.type)
            const fileName = `image-${Date.now()}.${extension}`
            const file = new File([blob], fileName, { type: blob.type })

            this.uploadPasteImage(file)
            setTimeout(() => {
              this.isPasteMode = false
            }, 3000)
            break
          }
        }
      }
      document.addEventListener('paste', this.pasteListener)
    },

    uploadPasteImage(file) {
      if (!this.beforeAvatarUpload(file)) return
      this.handleUpload({ file }).catch(() => {})
    },

    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isGIF = file.type === 'image/gif'
      if (!isJPG && !isPNG && !isGIF) {
        this.$message.error(this.$t('0248fee0.34e969'))
        return false
      }
      return true
    },

    // Element UI success hook: registration already finished in handleUpload.
    handleAvatarSuccess() {},

    /**
     * Capture original file meta immediately, then upload+register under concurrency limit.
     * Returning a Promise lets Element UI attach its own onSuccess once (do not also call e.onSuccess).
     */
    handleUpload(e) {
      const file = e.file
      const imageName = file && file.name
      const imageType = file && file.type
      const imageCatId = this.currentCategory

      this.pendingUploads++

      return this.runUploadTask(async () => {
        try {
          const upload = new UploadUtil()
          const res = await upload.uploadImg(file)
          await this.$api.qiniu.uploadQiniuPic({
            image_cat_id: imageCatId,
            image_name: imageName,
            image_url: res.key,
            image_type: imageType,
            storage: 'image'
          })
          this.uploadSuccessCount++
          return res
        } catch (err) {
          this.uploadFailCount++
          throw err
        } finally {
          this.pendingUploads--
          if (this.pendingUploads === 0) {
            this.finishBatch()
          }
        }
      })
    },

    finishBatch() {
      const success = this.uploadSuccessCount
      const fail = this.uploadFailCount
      this.uploadSuccessCount = 0
      this.uploadFailCount = 0

      if (success > 0) {
        this.refresh(true)
        this.$message.success(this.$t('0248fee0.a7699b'))
      }
      if (fail > 0 && success === 0) {
        this.$message.error(this.$t('0248fee0.54e5de'))
      } else if (fail > 0) {
        this.$message.warning(this.$t('0248fee0.54e5de'))
      }
    },

    uploadError(e) {
      console.error(e)
    }
  }
}
</script>
