<template>
  <div class="decoration-editor-panel config-panel">
    <div class="decoration-editor-panel__header">
      <div class="decoration-editor-panel__title">
        {{ $t('decorationeditor.configTitle') }}
      </div>
      <div v-if="currentTitle" class="config-panel__section-name">
        {{ currentTitle }}
      </div>
    </div>

    <div class="decoration-editor-panel__body config-panel__body">
      <div v-if="!section" class="decoration-editor-empty">
        {{ $t('decorationeditor.emptySelection') }}
      </div>

      <component
        :is="currentPanel"
        v-else-if="currentPanel"
        :section="section"
        :block="block"
        :value="currentValue"
        @change="handleChange"
        @change-section="$emit('update-section', $event)"
      />
    </div>
  </div>
</template>

<script>
import CarouselPanel from '../panels/CarouselPanel.vue'
import ImageHotspotPanel from '../panels/ImageHotspotPanel.vue'
import ProductShelfPanel from '../panels/ProductShelfPanel.vue'
import HeaderPanel from '../panels/HeaderPanel.vue'
import FooterPanel from '../panels/FooterPanel.vue'
import ImageBlockPanel from '../panels/ImageBlockPanel.vue'
import HotspotBlockPanel from '../panels/HotspotBlockPanel.vue'
import NavItemBlockPanel from '../panels/NavItemBlockPanel.vue'
import FooterLinkBlockPanel from '../panels/FooterLinkBlockPanel.vue'

const { getBlockDefinition } = require('../registry')

const sectionPanelMap = {
  header: HeaderPanel,
  footer: FooterPanel,
  carousel: CarouselPanel,
  'image-hotspot': ImageHotspotPanel,
  'product-shelf': ProductShelfPanel
}

const blockPanelMap = {
  image: ImageBlockPanel,
  hotspot: HotspotBlockPanel,
  'nav-item': NavItemBlockPanel,
  'footer-link': FooterLinkBlockPanel
}

export default {
  name: 'ConfigPanel',
  components: {
    CarouselPanel,
    ImageHotspotPanel,
    ProductShelfPanel,
    HeaderPanel,
    FooterPanel,
    ImageBlockPanel,
    HotspotBlockPanel,
    NavItemBlockPanel,
    FooterLinkBlockPanel
  },
  props: {
    section: {
      type: Object,
      default: null
    },
    block: {
      type: Object,
      default: null
    }
  },
  computed: {
    currentPanel() {
      if (this.block) {
        return blockPanelMap[this.block.type] || null
      }
      return this.section ? sectionPanelMap[this.section.type] || null : null
    },
    currentValue() {
      if (this.block) return this.block.settings
      return this.section ? this.section.settings : null
    },
    currentTitle() {
      if (this.block && this.section) {
        const definition = getBlockDefinition(this.section.type, this.block.type)
        return (
          this.block.settings?.label ||
          this.$t(definition?.titleKey || 'decorationeditor.block.item')
        )
      }
      if (this.section) {
        return this.section.settings?.title || this.$t(this.section.titleKey)
      }
      return ''
    }
  },
  methods: {
    handleChange(payload) {
      if (this.block) {
        this.$emit('update-block', payload)
        return
      }
      this.$emit('update-settings', payload)
    }
  }
}
</script>

<style lang="scss" scoped>
.config-panel {
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--editor-border);
  background: #fff;
}

.config-panel__body {
  flex: 1;
  overflow: auto;
  padding: 12px 14px 18px;
}

.config-panel__section-name {
  font-size: 11px;
  color: var(--text-sub);
}
</style>
