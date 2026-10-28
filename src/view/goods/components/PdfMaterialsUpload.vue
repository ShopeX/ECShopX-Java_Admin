<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="pdf-materials-upload">
    <el-upload
      action=""
      accept=".pdf,application/pdf"
      :disabled="disabled || uploading || materials.length >= max"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :http-request="handleUpload"
      :multiple="false"
    >
      <el-button
        v-if="!disabled && materials.length < max"
        size="small"
        type="primary"
        :loading="uploading"
      >
        {{ $t('de022579.fd15b9') }}
      </el-button>
      <div slot="tip" class="el-upload__tip">{{ $t('de022579.c090dd') }}</div>
    </el-upload>

    <ul v-if="materials.length" class="pdf-materials-list">
      <li v-for="(item, index) in materials" :key="item.url + '-' + index" class="pdf-materials-item">
        <i class="el-icon-document" />
        <a class="pdf-materials-name" href="javascript:;" @click="handlePreview(item)">
          {{ item.name || getFileNameFromUrl(item.url) || `file-${index + 1}.pdf` }}
        </a>
        <i
          v-if="!disabled"
          class="el-icon-close pdf-materials-remove"
          @click="handleRemove(index)"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import UploadUtil from '@/utils/uploadUtil'

export default {
  name: 'PdfMaterialsUpload',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    max: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      uploading: false
    }
  },
  computed: {
    materials() {
      return (this.value || []).filter((item) => item && item.url)
    }
  },
  methods: {
    getFileNameFromUrl(url) {
      if (!url) return ''
      try {
        const path = String(url).split('?')[0]
        return decodeURIComponent(path.substring(path.lastIndexOf('/') + 1))
      } catch (e) {
        return ''
      }
    },
    emitChange(list) {
      this.$emit('input', list)
      this.$emit('change', list)
    },
    beforeUpload(file) {
      const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name || '')
      if (!isPdf) {
        this.$message.error(this.$t('de022579.d75bb6'))
        return false
      }
      if (this.materials.length >= this.max) {
        this.$message.warning(this.$t('de022579.3f0041'))
        return false
      }
      return true
    },
    async handleUpload({ file, onSuccess, onError }) {
      this.uploading = true
      try {
        const upload = new UploadUtil('file')
        const res = await upload.uploadImg(file, file.name)
        const url = (res && (res.url || res.key)) || ''
        if (!url) {
          throw new Error('empty url')
        }
        const material = {
          name: file.name,
          url,
          size: file.size
        }
        const next = [...this.materials, material].slice(0, this.max)
        this.emitChange(next)
        onSuccess && onSuccess(material, file)
      } catch (e) {
        this.$message.error(this.$t('de022579.3a845c'))
        onError && onError(e)
      } finally {
        this.uploading = false
      }
    },
    handleRemove(index) {
      const next = this.materials.filter((_, i) => i !== index)
      this.emitChange(next)
    },
    handlePreview(item) {
      if (item && item.url) {
        window.open(item.url, '_blank')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pdf-materials-upload {
  .el-upload__tip {
    margin-top: 6px;
    line-height: 1.4;
    color: #909399;
  }

  ::v-deep .el-upload-list {
    display: none;
  }
}

.pdf-materials-list {
  width: 280px;
  margin: 8px 0 0;
  padding: 0;
  list-style: none;
}

.pdf-materials-item {
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  padding: 4px 8px;
  color: #606266;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f7fa;

    .pdf-materials-remove {
      display: inline-block;
    }
  }

  .el-icon-document {
    flex-shrink: 0;
    margin-right: 6px;
    color: #909399;
  }
}

.pdf-materials-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  color: var(--themeColor);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pdf-materials-remove {
  display: none;
  margin-left: 8px;
  color: #909399;
  cursor: pointer;

  &:hover {
    color: #f56c6c;
  }
}
</style>
