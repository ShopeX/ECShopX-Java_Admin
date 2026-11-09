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
        <div v-if="tabValue === tab.name">
          <div v-if="tab.name === 'custom_page'" class="member-task-path-custom-page">
            <div class="member-task-path-custom-page__toolbar">
              <el-radio-group
                :value="customPagePlatform"
                size="small"
                @input="onCustomPagePlatformChange"
              >
                <el-radio-button label="mp">{{ $t('67a8e492.8c3f01') }}</el-radio-button>
                <el-radio-button label="web">{{ $t('67a8e492.9d4e12') }}</el-radio-button>
              </el-radio-group>
              <div class="member-task-path-custom-page__summary text-sm text-[#909399]">
                <span>
                  {{ $t('67a8e492.8c3f01') }}：{{
                    customPageDraft.title || customPageDraft.mpId || $t('67a8e492.f0409e')
                  }}
                </span>
                <span class="mx-3 text-[#dcdfe6]">|</span>
                <span>
                  {{ $t('67a8e492.9d4e12') }}：{{
                    customPageDraft.webTitle || customPageDraft.webId || $t('67a8e492.f0409e')
                  }}
                </span>
              </div>
            </div>
            <PickerPages
              v-if="customPagePlatform === 'mp'"
              ref="custom_page_mp"
              :value="mpPickerValue"
            />
            <WebCustomPagePicker
              v-else
              ref="custom_page_web"
              :initial-selected="webInitialSelected"
            />
          </div>
          <component
            :is="tab.component"
            v-else
            :ref="tab.name"
            :value="pickerValue(tab.name)"
          />
        </div>
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
import WebCustomPagePicker from '@/components/sp-picker-plus/WebCustomPagePicker.vue'
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

function emptyCustomDraft() {
  return {
    mpId: '',
    webId: '',
    title: '',
    webTitle: ''
  }
}

export default {
  name: 'MemberTaskPathPickerDialog',
  components: {
    PickerGoods,
    PickerSaleCategory,
    PickerCategory,
    PickerRegactivity,
    PickerPages,
    WebCustomPagePicker,
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
      initialId: '',
      initialTitle: '',
      customPagePlatform: 'mp',
      customPageDraft: emptyCustomDraft()
    }
  },
  computed: {
    mpPickerValue() {
      const id = this.customPageDraft.mpId
      const data = id !== '' && /^\d+$/.test(String(id)) ? Number(id) : id
      return {
        type: 'pickerPath',
        multiple: false,
        data
      }
    },
    webInitialSelected() {
      const { webId, webTitle } = this.customPageDraft
      if (!webId) return null
      return {
        id: webId,
        theme_pc_template_id: webId,
        title: webTitle || '',
        template_title: webTitle || ''
      }
    }
  },
  watch: {
    visible(val) {
      if (!val) return
      const parsed = decodeMemberTaskPath(this.path)
      this.tabValue = parsed.linkPage || 'goods'
      this.initialTab = parsed.linkPage
      this.initialId = parsed.id
      this.initialTitle = parsed.title || ''
      this.customPageDraft = {
        mpId: parsed.id || '',
        webId: parsed.webId || '',
        title: parsed.title || '',
        webTitle: parsed.webTitle || ''
      }
      if (parsed.linkPage === 'custom_page' && parsed.webId && !parsed.id) {
        this.customPagePlatform = 'web'
      } else {
        this.customPagePlatform = 'mp'
      }
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
    onCustomPagePlatformChange(next) {
      this.syncCustomPageFromActivePicker()
      this.customPagePlatform = next
    },
    syncCustomPageFromActivePicker() {
      if (this.tabValue !== 'custom_page') return
      if (this.customPagePlatform === 'mp') {
        const ref = this.$refs.custom_page_mp
        const picker = Array.isArray(ref) ? ref[0] : ref
        const raw = picker?.getVal?.()
        const row = raw?.data?.[0]
        if (row) {
          this.customPageDraft.mpId = String(readId(row, ['id']))
          this.customPageDraft.title = row.page_name || row.title || ''
        }
      } else {
        const ref = this.$refs.custom_page_web
        const picker = Array.isArray(ref) ? ref[0] : ref
        const raw = picker?.getVal?.()
        const row = raw?.data?.[0]
        if (row) {
          this.customPageDraft.webId = String(readId(row, ['id', 'theme_pc_template_id']))
          this.customPageDraft.webTitle = row.page_name || row.title || ''
        }
      }
    },
    currentPicker() {
      if (this.tabValue === 'custom_page') {
        const refName = this.customPagePlatform === 'mp' ? 'custom_page_mp' : 'custom_page_web'
        const ref = this.$refs[refName]
        return Array.isArray(ref) ? ref[0] : ref
      }
      const ref = this.$refs[this.tabValue]
      return Array.isArray(ref) ? ref[0] : ref
    },
    selectedRow() {
      const raw = this.currentPicker()?.getVal?.()
      const data = raw && Array.isArray(raw.data) ? raw.data : []
      const row = data[0]
      if (!row) {
        if (this.tabValue === 'custom_page') {
          return null
        }
        if (this.initialTab === this.tabValue && this.initialId) {
          return { id: this.initialId, title: this.initialTitle || '' }
        }
        return null
      }
      if (this.tabValue === 'goods') {
        return {
          id: readId(row, ['itemId', 'item_id']),
          title: row.itemName || row.item_name || ''
        }
      }
      if (this.tabValue === 'regactivity') {
        return {
          id: readId(row, ['activity_id', 'id']),
          title: row.activity_name || row.title || ''
        }
      }
      if (this.tabValue === 'sale_category' || this.tabValue === 'category') {
        return {
          id: readId(row, ['id']),
          title: row.title || row.name || ''
        }
      }
      if (this.tabValue === 'link') {
        return {
          id: readId(row, ['id']),
          title: row.title || ''
        }
      }
      if (this.tabValue === 'custom_page') {
        if (this.customPagePlatform === 'web') {
          return {
            id: readId(row, ['id', 'theme_pc_template_id']),
            title: row.page_name || row.title || ''
          }
        }
      }
      return {
        id: readId(row, ['id']),
        title: row.page_name || row.title || ''
      }
    },
    confirm() {
      if (this.tabValue === 'custom_page') {
        this.syncCustomPageFromActivePicker()
        const { mpId, webId, title, webTitle } = this.customPageDraft
        if (!mpId || !webId) {
          this.$message.warning(this.$t('67a8e492.ae5f23'))
          return
        }
        const path = encodeMemberTaskPath('custom_page', mpId, { webId, title, webTitle })
        this.$emit('confirm', path)
        this.close()
        return
      }
      const picked = this.selectedRow()
      const path = picked
        ? encodeMemberTaskPath(this.tabValue, picked.id, { title: picked.title })
        : ''
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

.member-task-path-custom-page__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 16px;
  padding: 12px 12px 0;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 4px;
}

.member-task-path-custom-page__summary {
  flex: 1;
  min-width: 200px;
}
</style>
