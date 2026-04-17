<template>
  <div class="decoration-editor-panel preview-canvas">
    <div class="decoration-editor-panel__header">
      <div class="decoration-editor-panel__title">
        {{ $t('decorationeditor.previewTitle') }}
      </div>
      <div :class="['preview-canvas__status', { ready: iframeReady }]">
        {{
          iframeReady
            ? $t('decorationeditor.previewReady')
            : $t('decorationeditor.previewConnecting')
        }}
      </div>
    </div>

    <div class="decoration-editor-panel__body preview-canvas__body">
      <div v-if="previewError || !websiteUrl" class="decoration-editor-empty">
        {{ $t('decorationeditor.previewUnavailable') }}
      </div>

      <div v-else :class="['preview-canvas__stage', `is-${device}`]">
        <iframe
          ref="previewFrame"
          class="preview-canvas__frame"
          :src="previewUrl"
        />
      </div>
    </div>
  </div>
</template>

<script>
const { createDecorationMessenger } = require('../utils/postMessage')
const { serializeDsl } = require('../utils/dsl')

export default {
  name: 'PreviewCanvas',
  props: {
    dsl: {
      type: Object,
      required: true
    },
    pageId: {
      type: String,
      default: ''
    },
    pageType: {
      type: String,
      default: 'home'
    },
    templateId: {
      type: String,
      default: ''
    },
    websiteUrl: {
      type: String,
      default: ''
    },
    device: {
      type: String,
      default: 'desktop'
    }
  },
  data() {
    return {
      iframeReady: false,
      messenger: null,
      previewError: false,
      updateTimer: null,
      removeListener: null
    }
  },
  computed: {
    previewUrl() {
      if (!this.messenger) return ''
      return this.messenger.getPreviewUrl({
        templateId: this.templateId,
        pageType: this.pageType
      })
    }
  },
  watch: {
    dsl: {
      deep: true,
      handler() {
        this.scheduleUpdate()
      }
    }
  },
  mounted() {
    try {
      this.messenger = createDecorationMessenger(this.websiteUrl)
      this.removeListener = this.messenger.onMessage(this.handleIncomingMessage)
    } catch (error) {
      this.previewError = true
    }
  },
  beforeDestroy() {
    if (this.updateTimer) {
      clearTimeout(this.updateTimer)
      this.updateTimer = null
    }
    if (this.removeListener) {
      this.removeListener()
    }
  },
  methods: {
    /** 跨域 iframe 的 contentWindow 不能放进 data（Vue 响应式会访问 Window 属性触发 SecurityError） */
    getPreviewContentWindow() {
      const el = this.$refs.previewFrame
      return el && el.contentWindow ? el.contentWindow : null
    },
    handleIncomingMessage(event) {
      const { data } = event
      if (!data || !data.type) return

      if (data.type === 'PREVIEW_READY') {
        this.iframeReady = true
        this.$emit('preview-ready', true)
        this.sendInit()
        return
      }

      if (data.type === 'SECTION_FOCUSED' && data.payload?.sectionId) {
        this.$emit('focus-section', data.payload.sectionId)
        return
      }

      if (data.type === 'BLOCK_FOCUSED' && data.payload?.sectionId && data.payload?.blockId) {
        this.$emit('focus-block', {
          sectionId: data.payload.sectionId,
          blockId: data.payload.blockId
        })
      }
    },
    sendInit() {
      const win = this.getPreviewContentWindow()
      if (!win || !this.messenger) return
      this.messenger.sendInit(win, {
        pageType: this.pageType,
        pageId: this.pageId,
        dsl: serializeDsl(this.dsl)
      })
    },
    scheduleUpdate() {
      const win = this.getPreviewContentWindow()
      if (!this.iframeReady || !win || !this.messenger) return
      if (this.updateTimer) {
        clearTimeout(this.updateTimer)
      }
      this.updateTimer = setTimeout(() => {
        const w = this.getPreviewContentWindow()
        if (!w) return
        this.messenger.sendUpdate(w, {
          pageType: this.pageType,
          pageId: this.pageId,
          dsl: serializeDsl(this.dsl)
        })
      }, 120)
    }
  }
}
</script>

<style lang="scss" scoped>
.preview-canvas {
  display: flex;
  flex-direction: column;
  background: #eef1f5;
}

.preview-canvas__body {
  flex: 1;
  height: 100%;
  padding: 0;
  overflow: auto;
}

.preview-canvas__stage {
  display: flex;
  justify-content: center;
  height: 100%;
  min-height: 100%;
  padding: 24px 28px 32px;
  box-sizing: border-box;

  &.is-mobile .preview-canvas__frame {
    width: 420px;
    max-width: 100%;
  }
}

.preview-canvas__frame {
  width: 100%;
  height: 100%;
  min-height: 720px;
  border: 0;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.08);
}

.preview-canvas__status {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  font-size: 11px;
  border-radius: 999px;
  background: rgba(17, 24, 39, 0.06);
  color: #7d8796;

  &.ready {
    background: rgba(15, 157, 88, 0.12);
    color: #0f9d58;
  }
}
</style>
