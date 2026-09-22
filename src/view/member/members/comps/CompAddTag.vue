<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-dialog
    :title="isEdit ? $t('ec391ebb.d3a197') : $t('ec391ebb.19214e')"
    :visible.sync="dialogVisible"
    width="520px"
    :close-on-click-modal="false"
    :append-to-body="true"
    :z-index="3002"
    @close="handleClose"
  >
    <el-form
      ref="tagForm"
      :model="formData"
      :rules="formRules"
      size="small"
      label-width="110px"
      class="[&_.el-form-item__label]:whitespace-nowrap"
    >
      <el-form-item :label="$t('ec391ebb.af6126')" prop="group_name">
        <el-input
          v-model="formData.group_name"
          :placeholder="$t('ec391ebb.1ce7ca')"
          maxlength="15"
          show-word-limit
        />
      </el-form-item>
      <el-form-item :label="$t('ec391ebb.14d342')" prop="tags" required>
        <div class="max-h-[280px] overflow-y-auto pr-1">
          <div
            v-for="(tagItem, index) in formData.tags"
            :key="index"
            class="mb-1.5 flex items-center"
          >
            <el-input
              v-model="tagItem.tag_name"
              :placeholder="$t('ec391ebb.a11cc7')"
              maxlength="10"
              show-word-limit
              class="flex-1 mr-1.5"
            />
            <el-button
              type="text"
              icon="el-icon-delete"
              :disabled="formData.tags.length <= 1"
              class="text-[#F56C6C]"
              @click="removeTag(index, tagItem)"
            />
          </div>
        </div>
        <el-button type="text" icon="el-icon-plus" class="text-[#409EFF] pl-0" @click="addTag">
          {{ $t('ec391ebb.736eaa') }}
        </el-button>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleClose">{{ $t('ec391ebb.c08ab9') }}</el-button>
      <el-button size="small" type="primary" @click="handleSubmit">{{
        $t('ec391ebb.aa7527')
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'CompAddTag',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    form: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      formData: {
        group_id: '',
        group_name: '',
        tags: []
      },
      deleteTagList: [],
      formRules: {
        group_name: [
          { required: true, message: this.$t('ec391ebb.1ce7ca'), trigger: 'blur' },
          { max: 15, message: this.$t('ec391ebb.9b1a67'), trigger: 'blur' }
        ],
        tags: [
          {
            validator: (rule, value, callback) => {
              const tags = value.filter((tag) => tag?.tag_name !== '')
              callback(tags.length === 0 ? new Error(this.$t('ec391ebb.cdb31f')) : undefined)
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    visible(newVal) {
      this.dialogVisible = newVal
      if (newVal) {
        this.initFormData()
      }
    },
    dialogVisible(newVal) {
      this.$emit('update:visible', newVal)
    }
  },
  methods: {
    initFormData() {
      // 初始化表单数据
      this.formData = JSON.parse(JSON.stringify(this.form))
    },
    addTag() {
      this.formData.tags.push({
        tag_name: ''
      })
    },
    removeTag(index, tagItem) {
      this.deleteTagList.push(tagItem.tag_id)
      this.formData.tags.splice(index, 1)
    },
    handleClose() {
      this.dialogVisible = false
      this.$emit('close')
    },
    handleSubmit() {
      this.$refs.tagForm.validate((valid) => {
        if (!valid) return false
        const submitData = {
          group_id: this.isEdit ? this.formData.group_id : undefined,
          group_name: this.formData.group_name,
          tags: this.formData.tags.map((tag) => ({
            tag_name: tag.tag_name,
            tag_id: tag.tag_id || 0
          })),
          deleteids: this.isEdit ? this.deleteTagList : undefined
        }
        this.$emit('submit', submitData)
      })
    }
  }
}
</script>
