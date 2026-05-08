<template>
  <div class="h-full flex min-h-0 flex-col bg-[#eef1f5]">
    <div
      class="relative flex min-h-12 shrink-0 items-center gap-2 border-b border-[#e6e9ef] bg-white px-[14px] py-[10px]"
    >
      <div class="min-w-0 max-w-[38%] truncate text-xs font-semibold text-[#18222f]">
        {{ $t('01f158e9.2f586b') }}
      </div>
      <div
        class="absolute left-1/2 top-1/2 z-[1] flex -translate-x-1/2 -translate-y-1/2 items-center gap-0.5 rounded-lg border border-[rgba(17,24,39,0.08)] bg-[rgba(250,251,253,0.95)] p-0.5"
      >
        <el-button
          class="!flex !h-7 !w-7 !items-center !justify-center !p-0"
          circle
          size="mini"
          :type="device === 'desktop' ? 'primary' : 'default'"
          :aria-label="$t('30ac5b9e.2828b7')"
          @click="$emit('select-device', 'desktop')"
        >
          <Monitor :size="16" class="text-current" :stroke-width="2" />
        </el-button>
        <el-button
          class="!flex !h-7 !w-7 !items-center !justify-center !p-0"
          circle
          size="mini"
          :type="device === 'mobile' ? 'primary' : 'default'"
          :aria-label="$t('30ac5b9e.68d982')"
          @click="$emit('select-device', 'mobile')"
        >
          <Smartphone :size="16" class="text-current" :stroke-width="2" />
        </el-button>
      </div>
      <div class="relative z-[1] ml-auto flex shrink-0 items-center gap-1">
        <el-button
          class="!flex !h-7 !w-7 !items-center !justify-center !p-0"
          circle
          size="mini"
          :disabled="!canUndo"
          :aria-label="$t('30ac5b9e.bd9fcf')"
          @click="$emit('undo')"
        >
          <RotateCcw :size="16" class="text-[#606266]" :stroke-width="2" />
        </el-button>
        <el-button
          class="!flex !h-7 !w-7 !items-center !justify-center !p-0"
          circle
          size="mini"
          :disabled="!canRedo"
          :aria-label="$t('30ac5b9e.c7db6d')"
          @click="$emit('redo')"
        >
          <RotateCw :size="16" class="text-[#606266]" :stroke-width="2" />
        </el-button>
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
    </div>

    <div class="preview-canvas-scroll flex h-full flex-1 p-0">
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
          <iframe
            ref="previewFrame"
            class="h-full w-full border-0 bg-white"
            :src="previewUrl"
            @load="onPreviewIframeLoad"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createDecorationMessenger } from '../utils/postMessage.js'
import { serializeDsl } from '../utils/dsl.js'

export default {
  name: 'PreviewCanvas',
  props: {
    dsl: {
      type: Object,
      required: true
    },
    headerDsl: {
      type: Object,
      default: () => ({})
    },
    footerDsl: {
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
    canUndo: {
      type: Boolean,
      default: false
    },
    canRedo: {
      type: Boolean,
      default: false
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
      initRetryTimer: null,
      removeRawDebugListener: null,
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
    headerDsl: {
      deep: true,
      handler() {
        this.scheduleUpdate()
      }
    },
    footerDsl: {
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
      console.log('[sp-web-decoration] PreviewCanvas mounted', {
        websiteUrl: this.websiteUrl,
        previewUrl: this.previewUrl,
        previewOrigin: this.messenger.previewOrigin,
      })
      this.removeRawDebugListener = this.bindRawDebugListener()
      this.removeListener = this.messenger.onMessage(this.handleIncomingMessage)
    } catch (error) {
      console.warn('[sp-web-decoration] PreviewCanvas init failed', error)
      this.previewError = true
    }
  },
  beforeDestroy() {
    if (this.updateTimer) {
      clearTimeout(this.updateTimer)
      this.updateTimer = null
    }
    if (this.initRetryTimer) {
      clearTimeout(this.initRetryTimer)
      this.initRetryTimer = null
    }
    if (this.removeListener) {
      this.removeListener()
    }
    if (this.removeRawDebugListener) {
      this.removeRawDebugListener()
      this.removeRawDebugListener = null
    }
  },
  methods: {
    bindRawDebugListener() {
      const listener = (event) => {
        if (!event.data || typeof event.data !== 'object') return
        console.log('[sp-web-decoration] raw message before filter', {
          origin: event.origin,
          expectedOrigin: this.messenger?.previewOrigin || '',
          type: event.data.type,
          data: event.data,
        })
      }
      window.addEventListener('message', listener)
      return () => window.removeEventListener('message', listener)
    },
    /** 跨域 iframe 的 contentWindow 不能放进 data（Vue 响应式会访问 Window 属性触发 SecurityError） */
    getPreviewContentWindow() {
      const el = this.$refs.previewFrame
      return el && el.contentWindow ? el.contentWindow : null
    },
    handleIncomingMessage(event) {
      const { data } = event
      if (!data || !data.type) return

      if (process.env.NODE_ENV === 'development') {
        console.log('[sp-web-decoration] incoming message', {
          origin: event.origin,
          type: data.type,
          previewOrigin: this.messenger?.previewOrigin || '',
        })
      }

      if (data.type === 'PREVIEW_READY') {
        this.iframeReady = true
        this.sendPreviewReadyAck()
        this.$emit('preview-ready', true)
        this.flushInitToPreview()
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
    /** 子帧发出 PREVIEW_READY 时 ref/contentWindow 可能尚未就绪，需 nextTick + 短重试，避免 null.postMessage */
    onPreviewIframeLoad() {
      if (this.iframeReady) {
        this.flushInitToPreview()
      }
    },
    flushInitToPreview() {
      if (!this.iframeReady || !this.messenger) return
      if (process.env.NODE_ENV === 'development') {
        console.log('[sp-web-decoration] flush init', {
          iframeReady: this.iframeReady,
          previewOrigin: this.messenger.previewOrigin,
          previewUrl: this.previewUrl,
        })
      }
      if (this.initRetryTimer) {
        clearTimeout(this.initRetryTimer)
        this.initRetryTimer = null
      }
      const payload = {
        pageType: this.pageType,
        pageId: this.pageId,
        pageDsl: serializeDsl(this.dsl),
        headerDsl: serializeDsl(this.headerDsl),
        footerDsl: serializeDsl(this.footerDsl),
        sections: {
          sectionId: this.selectedSectionId || '',
          blockId: this.selectedBlockId || ''
        }
      }
      const maxAttempts = 40
      const delayMs = 50
      const trySend = (attempt) => {
        const win = this.getPreviewContentWindow()
        if (win && this.messenger) {
          if (process.env.NODE_ENV === 'development') {
            console.log('[sp-web-decoration] send init payload', payload)
          }
          this.messenger.sendInit(win, payload)
          return
        }
        if (attempt + 1 < maxAttempts) {
          this.initRetryTimer = setTimeout(() => trySend(attempt + 1), delayMs)
        }
      }
      this.$nextTick(() => trySend(0))
    },
    sendPreviewReadyAck() {
      const win = this.getPreviewContentWindow()
      if (!win || !this.messenger) return
      this.messenger.sendMessage(win, 'PREVIEW_READY_ACK', {
        pageType: this.pageType,
        pageId: this.pageId,
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
          headerDsl: serializeDsl(this.headerDsl),
          footerDsl: serializeDsl(this.footerDsl),
          sections: {
            sectionId: this.selectedSectionId || '',
            blockId: this.selectedBlockId || ''
          }
        })
      }, 120)
    }
  }
}
</script>

<style scoped>
/* 保留滚动能力，仅隐藏滚动条，预览区更干净 */
.preview-canvas-scroll {
  overflow: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.preview-canvas-scroll::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}
</style>
