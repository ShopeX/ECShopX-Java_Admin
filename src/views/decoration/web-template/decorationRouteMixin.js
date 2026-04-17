/**
 * 装修编辑页共用：加载/保存（有 templateId 时走 pctemplate API，否则 session 草稿）
 */
import SpWebDecoration from '@/components/sp-web-decoration/index.vue'
import {
  loadPageDslFromApi,
  loadGlobalDslFromApi,
  savePageDslToApi,
  saveGlobalDslToApi
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
          const global = await loadGlobalDslFromApi()
          this.contentRowId = page.contentRowId || 0
          this.initialDsl = {
            dsl: page.dsl,
            globalDsl: global.dsl
          }
        } else {
          const { dsl } = await loadHomeDecoration({
            templateId: this.templateId,
            scene: this.scene
          })
          const { dsl: globalDsl } = await loadGlobalDecoration()
          this.contentRowId = 0
          this.initialDsl = { dsl, globalDsl }
        }
      } finally {
        this.isLoading = false
      }
    },
    async decorationHandleSave({ dsl, globalDsl, editingScope }) {
      this.$store.commit('decoration/setSaving', true)
      try {
        if (this.templateId) {
          if (editingScope === 'global') {
            await saveGlobalDslToApi({ globalDsl })
          } else {
            await savePageDslToApi({
              templateId: this.templateId,
              dsl,
              contentRowId: this.contentRowId
            })
          }
          this.$message.success(this.$t('732e5057.3b1083'))
        } else {
          const result =
            editingScope === 'global'
              ? await saveGlobalDecoration({ dsl: globalDsl })
              : await saveHomeDecoration({
                  templateId: this.templateId,
                  dsl
                })
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
