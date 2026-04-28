<template>
  <div class="h-full flex min-h-0 flex-col bg-[#eef1f5]">
    <div
      class="flex min-h-12 items-center justify-between gap-2.5 border-b border-[#e6e9ef] bg-white px-[14px] py-[10px]"
    >
      <div class="text-xs font-semibold text-[#18222f]">
        {{ $t('01f158e9.2f586b') }}
      </div>
      <div
        :class="
          iframeReady
            ? 'inline-flex h-6 items-center rounded-full bg-[rgba(15,157,88,0.12)] px-2.5 text-[11px] text-[#0f9d58]'
            : 'inline-flex h-6 items-center rounded-full bg-[rgba(17,24,39,0.06)] px-2.5 text-[11px] text-[#7d8796]'
        "
      >
        {{ iframeReady ? $t('01f158e9.6bef2d') : $t('01f158e9.3893c8') }}
      </div>
    </div>

    <div class="flex h-full flex-1 overflow-auto p-0">
      <div
        v-if="previewError || !websiteUrl"
        class="m-3 flex min-h-[180px] items-center justify-center rounded-xl border border-dashed border-[#d7dde7] bg-[#fbfbfc] p-6 text-center text-[#6b7785]"
      >
        {{ $t('01f158e9.a4a56e') }}
      </div>

      <div v-else class="flex h-full min-h-full w-full items-stretch box-border p-4">
        <div
          :class="
            device === 'mobile'
              ? 'relative mx-auto my-6 h-full min-h-[720px] w-[420px] max-w-full overflow-hidden rounded-xl bg-white shadow-[0_18px_48px_rgba(15,23,42,0.08)]'
              : 'relative h-full min-h-full w-full overflow-hidden bg-white'
          "
        >
          <iframe ref="previewFrame" class="h-full w-full border-0 bg-white" :src="previewUrl" />
        </div>
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
    globalDsl: {
      type: Object,
      default: () => ({})
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
    },
    selectedSectionId: {
      type: String,
      default: ''
    },
    selectedBlockId: {
      type: String,
      default: ''
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
    },
    globalDsl: {
      deep: true,
      handler() {
        this.scheduleUpdate()
      }
    },
    selectedSectionId() {
      this.scheduleUpdate()
    },
    selectedBlockId() {
      this.scheduleUpdate()
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
        // New protocol: split global/page DSL.
        pageDsl: serializeDsl(this.dsl),
        globalDsl: serializeDsl(this.globalDsl),
        // Backward compatibility for old preview consumers.
        dsl: serializeDsl(this.dsl),
        selection: {
          sectionId: this.selectedSectionId || '',
          blockId: this.selectedBlockId || ''
        }
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
          pageDsl: serializeDsl(this.dsl),
          globalDsl: serializeDsl(this.globalDsl),
          dsl: serializeDsl(this.dsl),
          selection: {
            sectionId: this.selectedSectionId || '',
            blockId: this.selectedBlockId || ''
          }
        })
      }, 120)
    }
  }
}
</script>
