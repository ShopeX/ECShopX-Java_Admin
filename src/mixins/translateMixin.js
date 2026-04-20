import { LANGUAGES, getCurrentCountryCode } from '@/i18n/index'

export default {
  data() {
    return {
      translateContext: {
        dataId: '',
        fields: [],
        values: [],
        sourceLang: getCurrentCountryCode()
      }
    }
  },
  methods: {
    getDefaultCountryCode() {
      const defaultLangKey = process.env.VUE_APP_DEFAULT_LANG || 'zhcn'
      const defaultLangConfig = LANGUAGES[defaultLangKey] || LANGUAGES.zhcn || {}
      return defaultLangConfig.countryCode || 'zh-CN'
    },
    shouldOpenTranslatePopup() {
      // 仅当当前编辑语言不等于系统默认语言时，才提示同步翻译
      return getCurrentCountryCode() == this.getDefaultCountryCode()
    },
    openTranslate(dataId, fields, values) {
      if (!this.shouldOpenTranslatePopup()) {
        return false
      }
      this.translateContext = {
        dataId,
        fields,
        values,
        sourceLang: getCurrentCountryCode()
      }
      this.$nextTick(() => {
        if (this.$refs.translatePopup) {
          this.$refs.translatePopup.open()
        }
      })
      return true
    },
    onTranslateDone() {
      this.$message.success(this.$t('038c104d.a1b2c3') || '翻译完成')
    }
  }
}
