<template>
  <div class="decoration-route">
    <div v-if="!isSupportedScene" class="decoration-route__unsupported">
      <div class="decoration-route__unsupported-card">
        <div class="decoration-route__unsupported-title">
          {{ $t('decorationeditor.unsupportedScene') }}
        </div>
        <div class="decoration-route__unsupported-copy">
          {{ $t('decorationeditor.unsupportedSceneDesc') }}
        </div>
        <el-button plain @click="handleBack">
          {{ $t('decorationeditor.back') }}
        </el-button>
      </div>
    </div>

    <DecorationEditor
      v-else
      :initial-dsl="initialDsl"
      :loading="isLoading"
      :page-type="'home'"
      :scene="scene"
      :template-id="templateId"
      :title="$t('decorationeditor.pageTitle')"
      @back="handleBack"
      @save="handleSave"
    />
  </div>
</template>

<script>
import DecorationEditor from '@/components/DecorationEditor/index.vue'

const {
  loadHomeDecoration,
  saveHomeDecoration,
  loadGlobalDecoration,
  saveGlobalDecoration
} = require('@/components/DecorationEditor/adapters/homeDecoration')

export default {
  name: 'HomeDecorationRoute',
  components: {
    DecorationEditor
  },
  data() {
    return {
      initialDsl: null,
      isLoading: true
    }
  },
  computed: {
    templateId() {
      return String(this.$route.query.id || '')
    },
    scene() {
      return String(this.$route.query.scene || '1001')
    },
    isSupportedScene() {
      return this.scene === '1001'
    }
  },
  watch: {
    '$route.fullPath': {
      immediate: true,
      handler() {
        this.bootstrap()
      }
    }
  },
  methods: {
    async bootstrap() {
      if (!this.isSupportedScene) {
        this.initialDsl = null
        this.isLoading = false
        return
      }

      this.isLoading = true
      const { dsl } = await loadHomeDecoration({
        templateId: this.templateId,
        scene: this.scene
      })
      const { dsl: globalDsl } = await loadGlobalDecoration()
      this.initialDsl = {
        dsl,
        globalDsl
      }
      this.isLoading = false
    },
    async handleSave({ dsl, globalDsl, editingScope }) {
      this.$store.commit('decoration/setSaving', true)
      try {
        const result =
          editingScope === 'global'
            ? await saveGlobalDecoration({ dsl: globalDsl })
            : await saveHomeDecoration({
                templateId: this.templateId,
                dsl
              })
        this.$message.success(this.$t(result.messageKey))
      } finally {
        this.$store.commit('decoration/setSaving', false)
      }
    },
    handleBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.decoration-route {
  min-height: 100%;
}

.decoration-route__unsupported {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(180deg, #f8faff, #eef3fb);
}

.decoration-route__unsupported-card {
  width: min(480px, 100%);
  padding: 32px;
  text-align: center;
  background: #fff;
  border: 1px solid #e7ebf3;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(31, 45, 61, 0.08);
}

.decoration-route__unsupported-title {
  font-size: 20px;
  font-weight: 600;
  color: #18222f;
}

.decoration-route__unsupported-copy {
  margin: 10px 0 20px;
  line-height: 22px;
  color: #6b7785;
}
</style>
