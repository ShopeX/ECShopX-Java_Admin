<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <el-tabs v-model="activeName" type="border-card">
      <div class="tip-info">
        <p>
          {{ $t('71375f30.7b5c77') }}<strong>{{ $t('71375f30.d99268') }}</strong
          >。
        </p>
        <p>
          {{ $t('71375f30.41c5ec') }}<strong>{{ $t('71375f30.d99268') }}</strong
          >{{ $t('71375f30.40d0ad') }}
        </p>
      </div>
      <el-tab-pane :label="$t('71375f30.1bfbbc')" :name="FILE_TYPE">
        <el-form label-width="100px">
          <div class="mb-4 flex items-center gap-2.5">
            <el-upload
              action=""
              :on-change="uploadHandleChange"
              :auto-upload="false"
              :show-file-list="false"
            >
              <el-button size="small" type="primary"> {{ $t('71375f30.2c808b') }} </el-button>
            </el-upload>
            <el-button size="small" type="primary" @click="uploadHandleTemplate">
              {{ $t('71375f30.402a67') }}
            </el-button>
          </div>
          <el-table
            v-loading="loading"
            :data="uploadList"
            :height="wheight - 220"
            :element-loading-text="$t('71375f30.f09b12')"
          >
            <el-table-column prop="file_name" :label="$t('71375f30.a6fc9e')" min-width="100" />
            <el-table-column prop="created_date" :label="$t('71375f30.cae255')" min-width="80" />
            <el-table-column
              prop="file_size_format"
              :label="$t('71375f30.396b7d')"
              min-width="60"
            />
            <el-table-column :label="$t('71375f30.21b314')" min-width="50">
              <template slot-scope="scope">
                <span v-if="scope.row.handle_status == 'wait'">{{ $t('71375f30.1e57c1') }}</span>
                <span v-if="scope.row.handle_status == 'processing'">{{
                  $t('71375f30.5d459d')
                }}</span>
                <span v-if="scope.row.handle_status == 'finish'">{{
                  $t('71375f30.7be39b')
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="finish_date" :label="$t('71375f30.475dea')" />
            <el-table-column :label="$t('71375f30.3ba621')">
              <template slot-scope="scope">
                <span v-if="scope.row.handle_message"
                  >{{ scope.row.handle_message.successLine }}{{ $t('71375f30.2d5aef') }}</span
                >
              </template>
            </el-table-column>
            <el-table-column :label="$t('71375f30.1012e0')" min-width="160">
              <template slot-scope="scope">
                <div class="inline-flex items-center gap-1.5 whitespace-nowrap">
                  <span v-if="scope.row.handle_message"
                    >{{ scope.row.handle_message.errorLine }}{{ $t('71375f30.2d5aef') }}</span
                  >
                  <el-button
                    v-if="scope.row.handle_message && scope.row.handle_message.errorLine > 0"
                    type="text"
                    @click="exportErrorFile(scope.row.id, scope.row.file_type)"
                  >
                    {{ $t('71375f30.3798d3') }}
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="total_count > pageSize" class="content-top-padded content-center">
            <el-pagination
              layout="total, prev, pager, next"
              :total="total_count"
              :page-size="pageSize"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  handleUploadFile,
  getUploadLists,
  exportUploadErrorFile,
  exportUploadTemplate
} from '@/api/common'

const FILE_TYPE = 'pos_store_account'

export default {
  data() {
    return {
      FILE_TYPE,
      loading: false,
      total_count: 0,
      pageSize: 20,
      page: 1,
      activeName: FILE_TYPE,
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
    uploadPayload(response) {
      return (response && response.data && response.data.data) || {}
    },
    uploadHandleChange(file) {
      const params = { isUploadFile: true, file_type: this.activeName, file: file.raw }
      handleUploadFile(params).then(() => {
        this.$message({
          type: 'success',
          message: this.$t('71375f30.7bbfaa')
        })
        this.getUploadList()
      })
    },
    uploadHandleTemplate() {
      const params = { file_type: this.activeName, file_name: this.$t('71375f30.c35996') }
      exportUploadTemplate(params).then((response) => {
        const payload = this.uploadPayload(response)
        if (payload.file) {
          const a = document.createElement('a')
          a.href = payload.file
          a.download = payload.name
          document.body.appendChild(a)
          a.click()
          a.remove()
        } else {
          this.$message({
            type: 'error',
            message: this.$t('71375f30.bfd8d5')
          })
        }
      })
    },
    exportErrorFile(id, fileType) {
      const params = { file_type: fileType }
      exportUploadErrorFile(id, params).then((response) => {
        const payload = this.uploadPayload(response)
        if (payload.file) {
          const a = document.createElement('a')
          a.href = payload.file
          a.download = payload.name
          document.body.appendChild(a)
          a.click()
          a.remove()
        } else {
          this.$message({
            type: 'error',
            message: this.$t('71375f30.bfd8d5')
          })
        }
      })
    },
    handleCurrentChange(val) {
      this.page = val
      this.getUploadList()
    },
    getUploadList() {
      this.loading = true
      const params = { file_type: this.activeName, page: this.page, pageSize: this.pageSize }
      getUploadLists(params)
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
