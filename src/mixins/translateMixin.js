import { getCurrentCountryCode } from '@/i18n/index'

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
    openTranslate(dataId, fields, values) {
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
    },
    onTranslateDone() {
      this.$message.success(this.$t('038c104d.a1b2c3') || '翻译完成')
    }
  }
}
