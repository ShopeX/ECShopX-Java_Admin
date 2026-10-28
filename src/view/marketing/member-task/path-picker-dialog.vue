<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-dialog
    :visible="visible"
    append-to-body
    destroy-on-close
    width="1020px"
    custom-class="member-task-path-dialog"
    :title="$t('d81d8932.4f2c29')"
    @close="close"
  >
    <el-tabs v-if="visible" v-model="tabValue" tab-position="left">
      <el-tab-pane
        v-for="tab in tabs"
        :key="tab.name"
        :label="$t(tab.labelKey)"
        :name="tab.name"
      >
        <component
          :is="tab.component"
          v-if="tabValue === tab.name"
          :ref="tab.name"
          :value="pickerValue(tab.name)"
        />
      </el-tab-pane>
    </el-tabs>
    <span slot="footer">
      <el-button @click="close">{{ $t('8e248734.c08ab9') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('8e248734.aa7527') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import PickerGoods from '@/components/sp-picker/pickers/picker-goods'
import PickerSaleCategory from '@/components/sp-picker/pickers/picker-saleCategory'
import PickerCategory from '@/components/sp-picker/pickers/picker-category'
import PickerRegactivity from '@/components/sp-picker/pickers/picker-regactivity'
import PickerPages from '@/components/sp-picker/pickers/picker-pages'
import MemberTaskPathPageList from './path-page-list.vue'
import {
  MEMBER_TASK_PATH_TABS,
  decodeMemberTaskPath,
  encodeMemberTaskPath
} from './path-value'

function readId(row, keys) {
  if (!row) return ''
  for (let i = 0; i < keys.length; i++) {
    const value = row[keys[i]]
    if (value != null && value !== '') return value
  }
  return ''
}

export default {
  name: 'MemberTaskPathPickerDialog',
  components: {
    PickerGoods,
    PickerSaleCategory,
    PickerCategory,
    PickerRegactivity,
    PickerPages,
    MemberTaskPathPageList
  },
  props: {
    visible: Boolean,
    path: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tabs: MEMBER_TASK_PATH_TABS,
      tabValue: 'goods',
      initialTab: '',
      initialId: ''
    }
  },
  watch: {
    visible(val) {
      if (!val) return
      const parsed = decodeMemberTaskPath(this.path)
      this.tabValue = parsed.linkPage || 'goods'
      this.initialTab = parsed.linkPage
      this.initialId = parsed.id
    }
  },
  methods: {
    pickerValue(name) {
      const id = this.initialTab === name ? this.initialId : ''
      const data = id !== '' && /^\d+$/.test(String(id)) ? Number(id) : id
      return {
        type: 'pickerPath',
        multiple: false,
        data
      }
    },
    close() {
      this.$emit('update:visible', false)
    },
    currentPicker() {
      const ref = this.$refs[this.tabValue]
      return Array.isArray(ref) ? ref[0] : ref
    },
    selectedRow() {
      const raw = this.currentPicker()?.getVal?.()
      const data = raw && Array.isArray(raw.data) ? raw.data : []
      const row = data[0]
      if (!row) {
        if (this.initialTab === this.tabValue && this.initialId) {
          return { id: this.initialId }
        }
        return null
      }
      if (this.tabValue === 'goods') {
        return { id: readId(row, ['itemId', 'item_id']) }
      }
      if (this.tabValue === 'regactivity') {
        return { id: readId(row, ['activity_id', 'id']) }
      }
      return { id: readId(row, ['id']) }
    },
    confirm() {
      const picked = this.selectedRow()
      const path = picked ? encodeMemberTaskPath(this.tabValue, picked.id) : ''
      if (!path) {
        this.$message.warning(this.$t('21703102.9fcdf6'))
        return
      }
      this.$emit('confirm', path)
      this.close()
    }
  }
}
</script>

<style lang="scss">
/* el-dialog 通过 append-to-body 挂到 body，左侧页签样式写在弹层类上 */
.member-task-path-dialog {
  .el-dialog__body {
    padding: 0;
    border-top: 1px solid #dcdcdc;
    border-bottom: 1px solid #dcdcdc;
  }

  .el-tabs--left .el-tabs__header.is-left {
    margin-right: 0;
  }

  .el-tabs__content {
    min-height: 520px;
  }
}
</style>
