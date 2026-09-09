<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->
<template>
  <SpPage>
    <div v-loading="pageLoading" class="px-6 py-4">
      <div class="mb-4">
        <h2 class="m-0 text-xl font-medium text-gray-900">语言设置</h2>
        <p class="mt-2 mb-0 text-sm text-gray-500">
          配置管理后台和用户前端可使用的语言，以及进入时默认展示的语言。
        </p>
      </div>

      <div
        v-if="configWarning"
        class="mb-4 rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
      >
        {{ configWarning }}
      </div>

      <div class="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
        <span>已启用语言：{{ enabledCount }}</span>
        <span>
          当前默认语言：
          <template v-if="draft.defaultLanguage">
            {{ displayNameOf(draft.defaultLanguage) }}
          </template>
          <template v-else>
            <span class="text-amber-600">请选择新的默认语言</span>
          </template>
        </span>
        <span v-if="isDirty" class="text-amber-600">有未保存的变更</span>
      </div>

      <div class="overflow-hidden rounded border border-gray-200 bg-white">
        <div
          v-for="row in draft.languages"
          :key="row.code"
          class="flex flex-wrap items-center gap-4 border-b border-gray-100 px-4 py-4 last:border-b-0"
          :class="row.enabled ? 'bg-white' : 'bg-gray-50'"
        >
          <div class="min-w-[160px] flex-1">
            <div class="font-medium text-gray-900">{{ row.displayName }}</div>
            <div class="mt-1 text-xs text-gray-400">{{ row.code }}</div>
            <div class="mt-1 text-xs text-gray-400">作用范围：管理后台、用户前端</div>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">启用</span>
            <el-switch
              :value="row.enabled"
              active-color="var(--color-primary, #722ed1)"
              inactive-color="#d1d5db"
              @change="(val) => onToggleEnabled(row.code, val)"
            />
          </div>

          <div class="flex items-center gap-2">
            <el-radio
              v-model="draft.defaultLanguage"
              :label="row.code"
              :disabled="!row.enabled"
              @change="onSelectDefault(row.code)"
            >
              默认语言
            </el-radio>
          </div>
        </div>
      </div>

      <p class="mt-4 mb-6 text-xs leading-5 text-gray-400">
        关闭语言后，管理后台和用户前端将不再提供该语言的选择入口；已使用该语言的用户将在下一次进入时使用当前默认语言。
      </p>

      <div class="flex justify-center gap-3 border-t border-gray-100 pt-4">
        <el-button :disabled="!isDirty || saving" @click="onReset">恢复</el-button>
        <el-button type="primary" :loading="saving" :disabled="!canSave" @click="onSave">
          保存
        </el-button>
      </div>
    </div>
  </SpPage>
</template>

<script>
import { getLanguageSetting, saveLanguageSetting } from '@/api/language'
import {
  createDefaultAdminLanguageSetting,
  clearLanguageSettingCache,
  normalizeAdminLanguageSetting,
  writeLanguageSettingCache
} from '@/utils/languageSetting'

function snapshotOf(setting) {
  return JSON.stringify({
    defaultLanguage: setting.defaultLanguage || '',
    languages: setting.languages.map((l) => ({
      code: l.code,
      enabled: Boolean(l.enabled)
    }))
  })
}

export default {
  name: 'LanguageSetting',
  data() {
    const initial = createDefaultAdminLanguageSetting()
    return {
      pageLoading: false,
      saving: false,
      allowLeave: false,
      saved: initial,
      draft: JSON.parse(JSON.stringify(initial)),
      configWarning: null
    }
  },
  computed: {
    enabledCount() {
      return this.draft.languages.filter((l) => l.enabled).length
    },
    isDirty() {
      return snapshotOf(this.draft) !== snapshotOf(this.saved)
    },
    canSave() {
      if (!this.isDirty || this.saving) return false
      if (this.enabledCount < 1) return false
      if (!this.draft.defaultLanguage) return false
      const defaultRow = this.draft.languages.find((l) => l.code === this.draft.defaultLanguage)
      return Boolean(defaultRow && defaultRow.enabled)
    }
  },
  mounted() {
    this.loadConfig()
    window.addEventListener('beforeunload', this.onBeforeUnload)
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.onBeforeUnload)
  },
  beforeRouteLeave(to, from, next) {
    if (this.allowLeave || !this.isDirty) {
      next()
      return
    }
    this.$confirm('当前有未保存的语言设置，是否放弃变更？', '提示', {
      confirmButtonText: '放弃变更',
      cancelButtonText: '继续编辑',
      type: 'warning',
      distinguishCancelAndClose: true
    })
      .then(() => {
        this.restoreDraftFromSaved()
        next()
      })
      .catch((action) => {
        if (action === 'cancel' || action === 'close') {
          next(false)
        } else {
          next(false)
        }
      })
  },
  methods: {
    displayNameOf(code) {
      const row = this.draft.languages.find((l) => l.code === code)
      return row ? row.displayName : code
    },
    restoreDraftFromSaved() {
      this.draft = JSON.parse(JSON.stringify(this.saved))
    },
    applySetting(normalized) {
      this.saved = normalized
      this.draft = JSON.parse(JSON.stringify(normalized))
      this.configWarning = normalized.configWarning || null
      writeLanguageSettingCache(normalized)
    },
    loadConfig() {
      this.pageLoading = true
      getLanguageSetting()
        .then((res) => {
          const inner = res?.data?.data != null ? res.data.data : res?.data ?? res
          const normalized = normalizeAdminLanguageSetting(inner)
          this.applySetting(normalized)
        })
        .catch(() => {
          this.applySetting(createDefaultAdminLanguageSetting())
        })
        .finally(() => {
          this.pageLoading = false
        })
    },
    onToggleEnabled(code, enabled) {
      const row = this.draft.languages.find((l) => l.code === code)
      if (!row) return

      if (!enabled) {
        const otherEnabled = this.draft.languages.some((l) => l.code !== code && l.enabled)
        if (!otherEnabled) {
          this.$message.warning('至少保持一种语言开启')
          // 强制回刷开关受控态
          this.draft.languages = this.draft.languages.map((item) => ({ ...item }))
          return
        }
        row.enabled = false
        if (this.draft.defaultLanguage === code) {
          this.draft.defaultLanguage = ''
          this.$message.warning('请选择新的默认语言')
        }
        return
      }

      row.enabled = true
    },
    onSelectDefault(code) {
      const row = this.draft.languages.find((l) => l.code === code)
      if (!row || !row.enabled) return
      this.draft.defaultLanguage = code
    },
    validateBeforeSave() {
      if (this.enabledCount < 1) {
        this.$message.error('至少开启一种语言后才能保存')
        return false
      }
      if (!this.draft.defaultLanguage) {
        this.$message.error('请选择默认语言后再保存')
        return false
      }
      const defaultRow = this.draft.languages.find((l) => l.code === this.draft.defaultLanguage)
      if (!defaultRow || !defaultRow.enabled) {
        this.$message.error('默认语言必须是已开启语言')
        return false
      }
      return true
    },
    onReset() {
      this.restoreDraftFromSaved()
    },
    async onSave() {
      if (!this.validateBeforeSave()) return
      this.saving = true
      try {
        const payload = {
          version: this.saved.version,
          defaultLanguage: this.draft.defaultLanguage,
          languages: this.draft.languages.map((l) => ({
            code: l.code,
            enabled: Boolean(l.enabled)
          }))
        }
        const res = await saveLanguageSetting(payload)
        const inner = res?.data?.data != null ? res.data.data : res?.data ?? res
        if (inner?.message) {
          this.$message.success(inner.message)
        } else {
          this.$message.success('语言设置已保存')
        }
        clearLanguageSettingCache()
        // 保存成功后重新拉取，保证 version / 列表与服务端一致
        await this.reloadAfterSave()
        // 通知语言入口刷新
        this.$root.$emit('site-language-setting-updated')
      } catch (error) {
        // 422 等由拦截器提示；保留未保存状态
      } finally {
        this.saving = false
      }
    },
    reloadAfterSave() {
      return getLanguageSetting()
        .then((res) => {
          const inner = res?.data?.data != null ? res.data.data : res?.data ?? res
          this.applySetting(normalizeAdminLanguageSetting(inner))
        })
        .catch(() => {})
    },
    onBeforeUnload(e) {
      if (!this.isDirty) return
      e.preventDefault()
      e.returnValue = ''
    }
  }
}
</script>
