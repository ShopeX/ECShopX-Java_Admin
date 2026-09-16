<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-dropdown @command="handleCommand" trigger="click">
    <SpIcon class="p-2" button radius name="earth" :size="16">
      <slot />
    </SpIcon>

    <el-dropdown-menu slot="dropdown" style="width: 130px">
      <el-dropdown-item v-for="item in languageList" :key="item.value" :command="item.value">
        <div class="flex items-center gap-1">
          <div class="w-[14px] h-[14px] flex items-center justify-center">
            <SpIcon v-show="lang === item.value" name="dot" :size="14" />
          </div>
          <span>{{ item.label }}</span>
        </div>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { LANGUAGES, getStoredLang } from '@/i18n'
import { getBasePath } from '@/utils'
import { getLanguageSetting } from '@/api/language'
import {
  createDefaultAdminLanguageSetting,
  getEnabledStoreLangs,
  mapApiCodeToStoreLang,
  normalizeAdminLanguageSetting,
  readLanguageSettingCache,
  writeLanguageSettingCache
} from '@/utils/languageSetting'

const USER_PREFERRED_KEY = 'admin_lang_user_preferred'

/** 管理端语言入口：展示全部已接入语言包，便于运营切换后台界面语言 */
function buildLanguageList() {
  return Object.entries(LANGUAGES).map(([key, cfg]) => ({
    label: cfg.label,
    value: key
  }))
}

export default {
  name: 'SpLanguage',
  data() {
    return {
      languageList: buildLanguageList(),
      siteDefaultStoreLang: 'zhcn'
    }
  },
  computed: {
    lang() {
      return this.$store.state.system.lang
    }
  },
  created() {
    this.loadSiteLanguageSetting()
    this.$root.$on('site-language-setting-updated', this.loadSiteLanguageSetting)
  },
  beforeDestroy() {
    this.$root.$off('site-language-setting-updated', this.loadSiteLanguageSetting)
  },
  methods: {
    applySetting(normalized) {
      const enabled = getEnabledStoreLangs(normalized)
      this.siteDefaultStoreLang = mapApiCodeToStoreLang(normalized.defaultLanguage) || 'zhcn'
      this.languageList = buildLanguageList()
      this.ensureCurrentLangValid(enabled)
    },
    ensureCurrentLangValid(enabledStoreLangs) {
      const current = getStoredLang()
      // 管理端已接入的语言包均可使用，不因站点未启用而强制回落
      if (LANGUAGES[current]) return

      // 非法 lang 值：清偏好并回落站点默认或简体中文
      try {
        window.localStorage.removeItem(USER_PREFERRED_KEY)
      } catch (e) {
        // ignore
      }
      const next =
        (enabledStoreLangs.includes(this.siteDefaultStoreLang) && this.siteDefaultStoreLang) ||
        enabledStoreLangs[0] ||
        'zhcn'
      if (next !== current) {
        window.localStorage.setItem('lang', next)
        this.$store.commit('system/updateLang', { lang: next })
        window.location.reload()
      }
    },
    loadSiteLanguageSetting() {
      const cached = readLanguageSettingCache()
      if (cached) {
        this.applySetting(cached)
      }
      getLanguageSetting()
        .then((res) => {
          const inner = res?.data?.data != null ? res.data.data : res?.data ?? res
          const normalized = normalizeAdminLanguageSetting(inner)
          writeLanguageSettingCache(normalized)
          this.applySetting(normalized)
        })
        .catch(() => {
          if (!cached) {
            this.applySetting(createDefaultAdminLanguageSetting())
          }
        })
    },
    async handleCommand(command) {
      if (!this.languageList.some((item) => item.value === command)) return
      const basePath = getBasePath()
      window.localStorage.setItem('lang', command)
      try {
        window.localStorage.setItem(USER_PREFERRED_KEY, '1')
      } catch (e) {
        // ignore
      }
      await this.$store.commit('system/updateLang', { lang: command })
      if (this.$route.path != (basePath ? `/${basePath}/login` : '/login')) {
        await this.$store.dispatch('user/fetchAccessMenus')
        await this.$store.dispatch('user/fetchAccountInfo')
      }
      window.location.reload()
    }
  }
}
</script>

<style lang="scss" scoped></style>
