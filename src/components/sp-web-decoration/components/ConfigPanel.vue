<template>
  <div class="h-full flex min-h-0 flex-col border-l border-[#e6e9ef] bg-white">
    <div
      class="flex min-h-12 items-center justify-between gap-2.5 border-b border-[#e6e9ef] px-[14px] py-[10px]"
    >
      <div class="text-xs font-semibold text-[#18222f]">
        {{ $t('250dc970.6aab38') }}
      </div>
      <div v-if="currentTitle" class="text-[11px] text-[#6b7785]">
        {{ currentTitle }}
      </div>
    </div>

    <div class="flex-1 overflow-auto px-[14px] pb-[18px] pt-3">
      <div
        v-if="!section"
        class="flex min-h-[180px] items-center justify-center rounded-xl border border-dashed border-[#d7dde7] bg-[#fbfbfc] p-6 text-center text-[#6b7785]"
      >
        {{ $t('250dc970.b2fac9') }}
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
import AnnouncementBarPanel from '../panels/AnnouncementBarPanel.vue'
import ImageBlockPanel from '../panels/ImageBlockPanel.vue'
import VideoBlockPanel from '../panels/VideoBlockPanel.vue'
import HotspotBlockPanel from '../panels/HotspotBlockPanel.vue'
import NavItemBlockPanel from '../panels/NavItemBlockPanel.vue'
import FooterLinkBlockPanel from '../panels/FooterLinkBlockPanel.vue'
import AnnouncementBlockPanel from '../panels/AnnouncementBlockPanel.vue'

import { getTypedBlockDefinition as getBlockDefinition } from '../definitions/registry.js'

const sectionPanelMap = {
  'announcement-bar': AnnouncementBarPanel,
  header: HeaderPanel,
  footer: FooterPanel,
  'main-carousel': CarouselPanel,
  carousel: CarouselPanel,
  'image-hotspot': ImageHotspotPanel,
  'product-shelf': ProductShelfPanel
}

const blockPanelMap = {
  announcement: AnnouncementBlockPanel,
  image: ImageBlockPanel,
  video: VideoBlockPanel,
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
    AnnouncementBarPanel,
    ImageBlockPanel,
    VideoBlockPanel,
    HotspotBlockPanel,
    NavItemBlockPanel,
    FooterLinkBlockPanel,
    AnnouncementBlockPanel
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
        return this.block.settings?.label || this.$t(definition?.titleKey || '250dc970.7f56ad')
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
