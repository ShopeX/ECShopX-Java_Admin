<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <div class="tip-info mb-4">
      <p>单次导入最多 <strong>5000</strong> 行。</p>
      <p>相同「同义词组标识」将覆盖已有配置；导入完成后将自动热更新搜索同义词。</p>
    </div>
    <el-form label-width="100px">
      <div class="upload-actions">
        <el-upload
          action=""
          :on-change="uploadHandleChange"
          :auto-upload="false"
          :show-file-list="false"
        >
          <el-button size="small" type="primary">上传文件</el-button>
        </el-upload>
        <el-button size="small" type="primary" @click="uploadHandleTemplate">下载模板</el-button>
        <el-button size="small" @click="goBack">返回列表</el-button>
      </div>
      <el-table
        v-loading="loading"
        class="mt-4"
        border
        :data="uploadList"
        :height="wheight - 280"
        element-loading-text="加载中..."
      >
        <el-table-column prop="file_name" label="文件名" min-width="120" show-overflow-tooltip />
        <el-table-column prop="created_date" label="上传时间" min-width="100" />
        <el-table-column prop="file_size_format" label="大小" min-width="80" />
        <el-table-column label="处理状态" min-width="200">
          <template slot-scope="scope">
            <div>
              <span v-if="scope.row.handle_status === 'wait'">等待处理</span>
              <span v-else-if="scope.row.handle_status === 'processing'">处理中</span>
              <span v-else-if="scope.row.handle_status === 'finish'">已完成</span>
              <span v-else>{{ scope.row.handle_status }}</span>
              <el-alert
                v-if="scope.row.handle_message && scope.row.handle_message.esReloadWarning"
                class="es-reload-warn"
                :title="scope.row.handle_message.esReloadWarning"
                type="warning"
                :closable="false"
                show-icon
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="finish_date" label="完成时间" min-width="100" />
        <el-table-column label="成功行数" min-width="90">
          <template slot-scope="scope">
            <span v-if="scope.row.handle_message">{{ scope.row.handle_message.successLine }} 行</span>
          </template>
        </el-table-column>
        <el-table-column label="失败行数" min-width="140">
          <template slot-scope="scope">
            <span v-if="scope.row.handle_message">{{ scope.row.handle_message.errorLine }} 行</span>
            <el-button
              v-if="scope.row.handle_message && scope.row.handle_message.errorLine > 0"
              type="text"
              @click="exportErrorFile(scope.row.id, scope.row.file_type)"
            >
              下载失败明细
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="total_count > pageSize" class="content-center mt-4">
        <el-pagination
          layout="total, prev, pager, next"
          :total="total_count"
          :page-size="pageSize"
          :current-page="page"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-form>
  </SpPage>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  handleUploadFile,
  getUploadLists,
  exportUploadErrorFile,
  exportUploadTemplate,
  getFileBlob
} from '@/api/common'

const FILE_TYPE = 'search_synonym'
const TEMPLATE_NAME = '搜索同义词导入模板'

export default {
  name: 'SearchSynonymUpload',
  data() {
    return {
      loading: false,
      total_count: 0,
      pageSize: 20,
      page: 1,
      uploadList: []
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    this.getUploadList()
  },
  methods: {
    goBack() {
      this.$router.push({ name: 'searchSynonym' })
    },
    uploadPayload(response) {
      return (response && response.data && response.data.data) || {}
    },
    uploadHandleChange(file) {
      const params = { isUploadFile: true, file_type: FILE_TYPE, file: file.raw }
      handleUploadFile(params).then(() => {
        this.$message({ type: 'success', message: '上传成功，后台处理中' })
        this.getUploadList()
      })
    },
    saveTemplateBlob(data) {
      return getFileBlob(data.file)
        .then((arrayBuffer) => {
          const blob = new Blob([arrayBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = data.name || `${TEMPLATE_NAME}.xlsx`
          document.body.appendChild(a)
          a.click()
          a.remove()
          window.URL.revokeObjectURL(url)
        })
        .catch((err) => {
          this.$message({
            type: 'error',
            message: typeof err === 'string' ? err : '模板下载失败'
          })
        })
    },
    uploadHandleTemplate() {
      exportUploadTemplate({ file_type: FILE_TYPE, file_name: TEMPLATE_NAME }).then((response) => {
        const data = this.uploadPayload(response)
        if (data.file) {
          this.saveTemplateBlob(data)
        } else {
          this.$message({ type: 'error', message: '模板下载失败' })
        }
      })
    },
    exportErrorFile(id, fileType) {
      exportUploadErrorFile(id, { file_type: fileType }).then((response) => {
        const data = this.uploadPayload(response)
        if (data.file) {
          return this.saveTemplateBlob(data)
        }
        this.$message({ type: 'error', message: '失败明细下载失败' })
      })
    },
    handleCurrentChange(val) {
      this.page = val
      this.getUploadList()
    },
    getUploadList() {
      this.loading = true
      getUploadLists({ file_type: FILE_TYPE, page: this.page, pageSize: this.pageSize })
        .then((response) => {
          const payload = this.uploadPayload(response)
          this.uploadList = payload.list || []
          this.total_count = payload.total_count || 0
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style scoped>
.upload-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.tip-info {
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
}
.tip-info p {
  margin: 0 0 4px;
}
.mt-4 {
  margin-top: 16px;
}
.mb-4 {
  margin-bottom: 16px;
}
.content-center {
  text-align: center;
}
.es-reload-warn {
  margin-top: 6px;
  padding: 4px 0;
}
.es-reload-warn >>> .el-alert__title {
  font-size: 12px;
  line-height: 1.4;
}
</style>
