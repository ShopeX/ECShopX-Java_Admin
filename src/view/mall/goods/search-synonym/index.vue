<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <template v-if="!isImportRoute">
    <div class="action-container">
      <el-button type="primary" icon="el-icon-plus" @click="openDialog()"> 新增同义词组 </el-button>
      <el-button @click="downloadTemplate">下载模板</el-button>
      <el-button type="primary" plain @click="goImport">导入</el-button>
    </div>

    <el-table v-loading="loading" class="mt-4" border :data="list" row-key="id">
      <el-table-column label="ID" prop="id" width="100" />
      <el-table-column label="同义词组标识" prop="group_key" min-width="160" show-overflow-tooltip />
      <el-table-column label="同义词" min-width="320">
        <template slot-scope="scope">
          <el-tag
            v-for="word in scope.row.words || []"
            :key="word"
            size="small"
            class="synonym-word-tag"
          >
            {{ word }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="openDialog(scope.row)">编辑</el-button>
          <el-button type="text" class="text-danger" @click="confirmDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="560px"
      :close-on-click-modal="false"
      @closed="resetDialog"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="组标识" prop="group_key">
          <el-input
            v-model="form.group_key"
            :disabled="!!editingId"
            placeholder="英文字母、数字或下划线，同一标识下为一组同义词"
            maxlength="64"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="同义词" prop="words">
          <div class="words-tag-editor">
            <el-tag
              v-for="tag in form.words"
              :key="tag"
              closable
              :disable-transitions="false"
              @close="removeWord(tag)"
            >
              {{ tag }}
            </el-tag>
            <el-input
              v-if="wordInputVisible"
              ref="wordInputRef"
              v-model="wordInputValue"
              class="input-new-tag"
              size="small"
              placeholder="输入后回车"
              @keyup.enter.native="confirmWordInput"
              @blur="confirmWordInput"
            />
            <el-button v-else class="button-new-tag" size="small" @click="showWordInput">
              + 添加词语
            </el-button>
          </div>
          <div class="form-tip">至少保留一个词语；保存后将同步至搜索索引（热更新）。</div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="submitForm">保存</el-button>
      </span>
    </el-dialog>
    </template>
    <router-view />
  </SpPage>
</template>

<script>
import { exportUploadTemplate, getFileBlob } from '@/api/common'
import { listSynonyms, saveSynonymGroup, removeSynonymGroup } from '@/api/searchSynonym'

const SUCCESS_HOT_RELOAD_MSG = '保存成功，已提交热更新'

export default {
  name: 'SearchSynonymConfig',
  data() {
    const validateWords = (rule, value, callback) => {
      if (!value || !value.length) {
        callback(new Error('请至少添加一个同义词'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      saving: false,
      list: [],
      dialogVisible: false,
      dialogTitle: '新增同义词组',
      editingId: null,
      form: {
        group_key: '',
        words: []
      },
      rules: {
        group_key: [{ required: true, message: '请填写组标识', trigger: 'blur' }],
        words: [{ validator: validateWords, trigger: 'change' }]
      },
      wordInputVisible: false,
      wordInputValue: ''
    }
  },
  computed: {
    isImportRoute() {
      return this.$route.name === 'searchSynonymImport'
    }
  },
  watch: {
    isImportRoute(val, oldVal) {
      if (oldVal === true && val === false) {
        this.loadList()
      }
    }
  },
  mounted() {
    if (!this.isImportRoute) {
      this.loadList()
    }
  },
  methods: {
    goImport() {
      this.$router.push({ name: 'searchSynonymImport' })
    },
    downloadTemplate() {
      exportUploadTemplate({
        file_type: 'search_synonym',
        file_name: '搜索同义词导入模板'
      }).then((response) => {
        const data = response.data && response.data.data
        if (!data || !data.file) {
          this.$message({ type: 'error', message: '模板下载失败' })
          return
        }
        getFileBlob(data.file)
          .then((arrayBuffer) => {
            const blob = new Blob([arrayBuffer], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = data.name || '搜索同义词导入模板.xlsx'
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
      })
    },
    loadList() {
      this.loading = true
      listSynonyms()
        .then((res) => {
          const payload = res.data && res.data.data
          this.list = Array.isArray(payload) ? payload : []
        })
        .catch(() => {
          this.list = []
        })
        .finally(() => {
          this.loading = false
        })
    },
    openDialog(row) {
      if (row) {
        this.editingId = row.id
        this.dialogTitle = '编辑同义词组'
        this.form = {
          group_key: row.group_key,
          words: [...(row.words || [])]
        }
      } else {
        this.editingId = null
        this.dialogTitle = '新增同义词组'
        this.form = { group_key: '', words: [] }
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        if (this.$refs.formRef) {
          this.$refs.formRef.clearValidate()
        }
      })
    },
    resetDialog() {
      this.editingId = null
      this.wordInputVisible = false
      this.wordInputValue = ''
      this.form = { group_key: '', words: [] }
    },
    removeWord(tag) {
      this.form.words.splice(this.form.words.indexOf(tag), 1)
      this.$refs.formRef && this.$refs.formRef.validateField('words')
    },
    showWordInput() {
      this.wordInputVisible = true
      this.$nextTick(() => {
        const ref = this.$refs.wordInputRef
        if (ref && ref.$refs && ref.$refs.input) {
          ref.$refs.input.focus()
        }
      })
    },
    confirmWordInput() {
      const val = (this.wordInputValue || '').trim()
      if (val && this.form.words.indexOf(val) === -1) {
        this.form.words.push(val)
        this.$refs.formRef && this.$refs.formRef.validateField('words')
      }
      this.wordInputVisible = false
      this.wordInputValue = ''
    },
    submitForm() {
      this.$refs.formRef.validate((valid) => {
        if (!valid) {
          return
        }
        this.saving = true
        saveSynonymGroup({
          group_key: this.form.group_key.trim(),
          words: this.form.words
        })
          .then(() => {
            this.$message({ type: 'success', message: SUCCESS_HOT_RELOAD_MSG, duration: 5000 })
            this.dialogVisible = false
            this.loadList()
          })
          .finally(() => {
            this.saving = false
          })
      })
    },
    confirmDelete(row) {
      this.$confirm(`确定删除同义词组「${row.group_key}」？删除后将提交热更新。`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => removeSynonymGroup(row.id))
        .then(() => {
          this.$message({ type: 'success', message: '删除成功，已提交热更新', duration: 5000 })
          this.loadList()
        })
        .catch((err) => {
          if (err !== 'cancel' && err !== 'close') {
            // 错误由 request 拦截器提示
          }
        })
    }
  }
}
</script>

<style scoped>
.action-container {
  margin-bottom: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.mt-4 {
  margin-top: 16px;
}
.synonym-word-tag + .synonym-word-tag {
  margin-left: 6px;
}
.words-tag-editor .el-tag + .el-tag {
  margin-left: 8px;
}
.button-new-tag {
  margin-left: 8px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 120px;
  margin-left: 8px;
  vertical-align: bottom;
}
.form-tip {
  font-size: 12px;
  color: #909399;
  line-height: 1.4;
  margin-top: 6px;
}
.text-danger {
  color: #f56c6c;
}
</style>
