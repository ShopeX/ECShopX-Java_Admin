/**
 * 装修编辑页共用：加载/保存（有 templateId 时走 pctemplate API，否则 session 草稿）
 */
import SpWebDecoration from '@/components/sp-web-decoration/index.vue'
import {
  loadPageDslFromApi,
  loadHeaderFooterDslFromApi,
  savePageDslToApi,
  saveHeaderDslToApi,
  saveFooterDslToApi
} from '@/components/sp-web-decoration/adapters/apiPersistence'

const {
  loadHomeDecoration,
  saveHomeDecoration,
  loadGlobalDecoration,
  saveGlobalDecoration
} = require('@/components/sp-web-decoration/adapters/homeDecoration')

export default {
  components: {
    SpWebDecoration
  },
  data() {
    return {
      initialDsl: null,
      isLoading: true,
      /** 来自 API 的模板内容行 id，保存时回传 */
      contentRowId: 0
    }
  },
  methods: {
    async decorationBootstrap() {
      if (!this.isSupportedScene) {
        this.initialDsl = null
        this.isLoading = false
        return
      }

      this.isLoading = true
      try {
        if (this.templateId) {
          const page = await loadPageDslFromApi({
            templateId: this.templateId,
            scene: this.scene
          })
          const headerFooter = await loadHeaderFooterDslFromApi()
          this.contentRowId = page.contentRowId || 0
          this.initialDsl = {
            dsl: page.dsl,
            headerDsl: headerFooter.headerDsl,
            footerDsl: headerFooter.footerDsl
          }
        } else {
          const { dsl } = await loadHomeDecoration({
            templateId: this.templateId,
            scene: this.scene
          })
          const global = await loadGlobalDecoration()
          this.contentRowId = 0
          this.initialDsl = {
            dsl,
            headerDsl: global.headerDsl,
            footerDsl: global.footerDsl,
            globalDsl: global.dsl
          }
        }
      } finally {
        this.isLoading = false
      }
    },
    async decorationHandleSave({ dsl, headerDsl, footerDsl, editingScope }) {
      this.$store.commit('decoration/setSaving', true)
      try {
        console.log('[sp-web-decoration] save target payload', {
          templateId: this.templateId,
          scene: this.scene,
          editingScope,
          dsl,
          headerDsl,
          footerDsl
        })
        if (this.templateId) {
          await Promise.all([
            saveHeaderDslToApi({ dsl: headerDsl }),
            savePageDslToApi({
              templateId: this.templateId,
              dsl,
              contentRowId: this.contentRowId
            }),
            saveFooterDslToApi({ dsl: footerDsl })
          ])
          this.$message.success(this.$t('732e5057.3b1083'))
        } else {
          const result = await saveHomeDecoration({
            templateId: this.templateId,
            dsl
          })
          await saveGlobalDecoration({ headerDsl, footerDsl })
          this.$message.success(this.$t(result.messageKey))
        }
      } finally {
        this.$store.commit('decoration/setSaving', false)
      }
    },
    decorationHandleBack() {
      this.$router.go(-1)
    }
  }
}
