<template>
  <div class="flex h-full min-h-screen flex-col bg-[#f3f4f7]">
    <div
      class="box-border flex min-h-14 items-center justify-between gap-3 border-b border-[#e6e9ef] bg-white/95 px-[14px] py-2 max-[1360px]:flex-wrap max-[1360px]:items-stretch"
    >
      <div class="flex min-w-0 items-center gap-2.5">
        <el-button class="!shrink-0" circle size="mini" @click="$emit('back')">
          <ArrowLeft :size="16" class="text-[#606266]" :stroke-width="2" />
        </el-button>
        <div class="flex min-w-0 flex-col items-start gap-0.5">
          <div class="text-sm font-semibold leading-5 text-[#18222f]">{{ titleText }}</div>
          <div class="flex items-center gap-2 whitespace-nowrap text-[11px] text-[#6b7785]">
            <span>{{ $t('30ac5b9e.425e37') }}</span>
            <span v-if="templateId">#{{ templateId }}</span>
          </div>
        </div>
      </div>
      <div
        class="flex min-w-0 flex-1 items-center justify-center gap-2.5 max-[1180px]:order-3 max-[1180px]:w-full max-[1180px]:justify-start max-[1180px]:overflow-x-auto"
      >
        <div
          class="flex min-h-[34px] items-center gap-1.5 rounded-[10px] border border-[rgba(17,24,39,0.08)] bg-[rgba(250,251,253,0.95)] px-2 py-1"
        >
          <span class="whitespace-nowrap text-[11px] text-[#6b7785]">{{
            $t('30ac5b9e.59ceff')
          }}</span>
          <el-select class="w-[120px]" size="small" :value="pageType" disabled>
            <el-option :label="$t('30ac5b9e.db1c89')" value="home" />
          </el-select>
        </div>
        <div
          class="flex min-h-[34px] items-center gap-1.5 rounded-[10px] border border-[rgba(17,24,39,0.08)] bg-[rgba(250,251,253,0.95)] px-2 py-1"
        >
          <span class="whitespace-nowrap text-[11px] text-[#6b7785]">{{
            $t('30ac5b9e.f55f17')
          }}</span>
          <el-button-group class="!inline-flex !items-center gap-1.5">
            <el-button
              class="!inline-flex !h-7 !min-h-7 !items-center !justify-center !rounded-lg !px-2.5 !text-xs !leading-none"
              size="small"
              :type="viewMode === 'desktop' ? 'primary' : 'default'"
              @click="viewMode = 'desktop'"
            >
              {{ $t('30ac5b9e.2828b7') }}
            </el-button>
            <el-button
              class="!inline-flex !h-7 !min-h-7 !items-center !justify-center !rounded-lg !px-2.5 !text-xs !leading-none"
              size="small"
              :type="viewMode === 'mobile' ? 'primary' : 'default'"
              @click="viewMode = 'mobile'"
            >
              {{ $t('30ac5b9e.68d982') }}
            </el-button>
          </el-button-group>
        </div>
        <div
          class="flex min-h-[34px] items-center gap-1.5 rounded-[10px] border border-[rgba(17,24,39,0.08)] bg-[rgba(250,251,253,0.95)] px-2 py-1"
        >
          <span class="whitespace-nowrap text-[11px] text-[#6b7785]">{{
            $t('30ac5b9e.c827d8')
          }}</span>
          <el-button-group class="!inline-flex !items-center gap-1.5">
            <el-button
              class="!inline-flex !h-7 !min-h-7 !items-center !justify-center !rounded-lg !px-2.5 !text-xs !leading-none"
              size="small"
              :disabled="!canUndo"
              @click="handleUndo"
            >
              {{ $t('30ac5b9e.bd9fcf') }}
            </el-button>
            <el-button
              class="!inline-flex !h-7 !min-h-7 !items-center !justify-center !rounded-lg !px-2.5 !text-xs !leading-none"
              size="small"
              :disabled="!canRedo"
              @click="handleRedo"
            >
              {{ $t('30ac5b9e.c7db6d') }}
            </el-button>
          </el-button-group>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <el-button
          class="!min-w-20 !rounded-lg"
          type="primary"
          size="small"
          :loading="isSaving || loading"
          @click="handleSave"
        >
          {{ $t('30ac5b9e.be5fbb') }}
        </el-button>
      </div>
    </div>

    <div
      v-loading="loading"
      class="grid flex-1 min-h-0 grid-cols-[260px_minmax(0,1fr)_304px] grid-rows-[minmax(0,1fr)] p-0 max-[1360px]:grid-cols-[236px_minmax(0,1fr)_280px] max-[1180px]:grid-cols-1 max-[1180px]:grid-rows-none max-[1180px]:auto-rows-[minmax(260px,auto)]"
    >
      <div class="min-w-0 min-h-0 h-full">
        <StructurePanel
          :dsl="dsl"
          :global-dsl="globalDsl"
          :selected-section-id="selectedSectionId"
          :selected-block-id="selectedBlockId"
          :expanded-section-ids="expandedSectionIds"
          :section-definitions="sectionDefinitions"
          @add-section="handleAddSection"
          @select-section="handleSelectSection"
          @select-block="handleSelectBlock"
          @toggle-section="handleToggleSection"
          @duplicate-section="handleDuplicateSection"
          @remove-section="handleRemoveSection"
          @reorder-sections="handleReorderSections"
          @add-block="handleAddBlock"
          @remove-block="handleRemoveBlock"
          @toggle-block-disabled="handleToggleBlockDisabled"
          @reorder-blocks="handleReorderBlocks"
          @add-global-section="handleAddGlobalSection"
          @toggle-section-disabled="handleToggleSectionDisabled"
          @reorder-global-sections="handleReorderGlobalSections"
        />
      </div>

      <div class="min-w-0 min-h-0 h-full">
        <PreviewCanvas
          :dsl="dsl"
          :global-dsl="globalDsl"
          :page-type="pageType"
          :page-id="pageId"
          :template-id="templateId"
          :website-url="websiteUrl"
          :device="viewMode"
          :selected-section-id="selectedSectionId"
          :selected-block-id="selectedBlockId"
          @focus-section="handleSelectSection"
          @focus-block="handleSelectBlock"
          @preview-ready="handlePreviewReady"
        />
      </div>

      <div class="min-w-0 min-h-0 h-full">
        <ConfigPanel
          :section="selectedSection"
          :block="selectedBlock"
          @update-settings="handleUpdateSettings"
          @update-section="handleUpdateSection"
          @update-block="handleUpdateBlock"
        />
      </div>
    </div>
  </div>
</template>

<script>
import StructurePanel from './components/StructurePanel.vue'
import PreviewCanvas from './components/PreviewCanvas.vue'
import ConfigPanel from './components/ConfigPanel.vue'

const { getSectionTypes, getSectionDefinition } = require('./registry')

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value))
}

export default {
  name: 'SpWebDecoration',
  components: {
    StructurePanel,
    PreviewCanvas,
    ConfigPanel
  },
  props: {
    initialDsl: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    pageType: {
      type: String,
      default: 'home'
    },
    scene: {
      type: String,
      default: '1001'
    },
    templateId: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    websiteUrl: {
      type: String,
      default: () => (process.env.VUE_APP_WEBSITE || '') + '?preview=true&designMode=1'
    }
  },
  data() {
    return {
      viewMode: 'desktop',
      historyPast: [],
      historyFuture: [],
      isRestoringHistory: false
    }
  },
  computed: {
    dsl() {
      return this.$store.state.decoration.dsl
    },
    globalDsl() {
      return this.$store.state.decoration.globalDsl
    },
    pageId() {
      return this.$store.state.decoration.pageId
    },
    selectedSectionId() {
      return this.$store.state.decoration.selectedSectionId
    },
    selectedBlockId() {
      return this.$store.state.decoration.selectedBlockId
    },
    expandedSectionIds() {
      return this.$store.state.decoration.expandedSectionIds
    },
    isSaving() {
      return this.$store.state.decoration.isSaving
    },
    editingScope() {
      return this.$store.state.decoration.editingScope
    },
    selectedSection() {
      return this.selectedSectionId ? this.$store.getters['decoration/currentSection'] : null
    },
    selectedBlock() {
      return this.selectedBlockId ? this.$store.getters['decoration/currentBlock'] : null
    },
    sectionDefinitions() {
      return getSectionTypes().map((type) => getSectionDefinition(type))
    },
    titleText() {
      return this.title || this.$t('30ac5b9e.6741a0')
    },
    canUndo() {
      return this.historyPast.length > 1
    },
    canRedo() {
      return this.historyFuture.length > 0
    }
  },
  watch: {
    initialDsl: {
      immediate: true,
      handler(value) {
        if (!value) return
        this.$store.commit('decoration/initializeEditor', {
          pageType: this.pageType,
          pageId: this.templateId,
          dsl: cloneValue(value.dsl || value),
          globalDsl: cloneValue(value.globalDsl)
        })
        this.resetHistory()
      }
    }
  },
  beforeDestroy() {
    this.$store.commit('decoration/resetState')
  },
  methods: {
    snapshotState() {
      return {
        dsl: cloneValue(this.dsl),
        globalDsl: cloneValue(this.globalDsl),
        selectedSectionId: this.selectedSectionId,
        selectedBlockId: this.selectedBlockId
      }
    },
    resetHistory() {
      this.historyPast = [this.snapshotState()]
      this.historyFuture = []
    },
    recordHistory() {
      if (this.isRestoringHistory) return
      const snapshot = this.snapshotState()
      const previousSnapshot = this.historyPast[this.historyPast.length - 1]
      if (JSON.stringify(previousSnapshot) === JSON.stringify(snapshot)) return
      this.historyPast = [...this.historyPast, snapshot]
      this.historyFuture = []
    },
    restoreSnapshot(snapshot) {
      this.isRestoringHistory = true
      this.$store.commit('decoration/setDsl', cloneValue(snapshot.dsl))
      this.$store.commit('decoration/setGlobalDsl', cloneValue(snapshot.globalDsl))
      if (snapshot.selectedBlockId) {
        this.$store.commit('decoration/selectBlock', {
          sectionId: snapshot.selectedSectionId,
          blockId: snapshot.selectedBlockId
        })
      } else {
        this.$store.commit('decoration/selectSection', snapshot.selectedSectionId)
      }
      this.isRestoringHistory = false
    },
    handleAddSection(payload) {
      const type = typeof payload === 'string' ? payload : payload.type
      const index =
        typeof payload === 'object' && payload !== null && typeof payload.index === 'number'
          ? payload.index
          : undefined
      this.$store.commit('decoration/addSection', { type, index })
      this.recordHistory()
    },
    handleSelectSection(sectionId) {
      this.$store.commit('decoration/selectSection', sectionId)
    },
    handleSelectBlock(payload) {
      this.$store.commit('decoration/selectBlock', payload)
    },
    handleToggleSection(sectionId) {
      this.$store.commit('decoration/toggleSectionExpanded', sectionId)
    },
    handleDuplicateSection(sectionId) {
      this.$store.commit('decoration/duplicateSection', sectionId)
      this.recordHistory()
    },
    handleRemoveSection(sectionId) {
      this.$store.commit('decoration/removeSection', sectionId)
      this.recordHistory()
    },
    handleReorderSections(nextOrder) {
      this.$store.commit('decoration/replaceSectionOrder', nextOrder)
      this.recordHistory()
    },
    handleAddBlock({ sectionId, blockType, index }) {
      this.$store.commit('decoration/addBlock', { sectionId, blockType, index })
      this.recordHistory()
    },
    handleAddGlobalSection(payload) {
      if (typeof payload === 'string') {
        this.$store.commit('decoration/addGlobalSection', payload)
      } else if (payload && typeof payload === 'object') {
        this.$store.commit('decoration/addGlobalSection', payload)
      }
      this.recordHistory()
    },
    handleToggleSectionDisabled(sectionId) {
      const section = this.globalDsl.sections?.[sectionId] || this.dsl.sections?.[sectionId] || null
      if (!section) return
      this.$store.commit('decoration/setSectionDisabled', {
        sectionId,
        disabled: !section.disabled
      })
      this.recordHistory()
    },
    handleReorderGlobalSections(nextOrder) {
      this.$store.commit('decoration/setGlobalOrder', nextOrder)
      this.recordHistory()
    },
    handleRemoveBlock(payload) {
      this.$store.commit('decoration/removeBlock', payload)
      this.recordHistory()
    },
    handleToggleBlockDisabled(payload) {
      this.$store.commit('decoration/toggleBlockDisabled', payload)
      this.recordHistory()
    },
    handleReorderBlocks(payload) {
      this.$store.commit('decoration/replaceBlockOrder', payload)
      this.recordHistory()
    },
    handleUpdateSettings(patch) {
      this.$store.commit('decoration/updateSelectedSectionSettings', patch)
      this.recordHistory()
    },
    handleUpdateSection(nextSection) {
      this.$store.commit('decoration/replaceSelectedSection', cloneValue(nextSection))
      this.recordHistory()
    },
    handleUpdateBlock(patch) {
      this.$store.commit('decoration/updateSelectedBlockSettings', patch)
      this.recordHistory()
    },
    handlePreviewReady(value) {
      this.$store.commit('decoration/setPreviewReady', value)
    },
    handleUndo() {
      if (!this.canUndo) return
      const currentSnapshot = this.historyPast[this.historyPast.length - 1]
      const previousSnapshot = this.historyPast[this.historyPast.length - 2]
      this.historyPast = this.historyPast.slice(0, -1)
      this.historyFuture = [currentSnapshot, ...this.historyFuture]
      this.restoreSnapshot(previousSnapshot)
    },
    handleRedo() {
      if (!this.canRedo) return
      const [nextSnapshot, ...rest] = this.historyFuture
      this.historyFuture = rest
      this.historyPast = [...this.historyPast, nextSnapshot]
      this.restoreSnapshot(nextSnapshot)
    },
    handleSave() {
      this.$emit('save', {
        dsl: cloneValue(this.dsl),
        globalDsl: cloneValue(this.globalDsl),
        editingScope: this.editingScope
      })
    }
  }
}
</script>
