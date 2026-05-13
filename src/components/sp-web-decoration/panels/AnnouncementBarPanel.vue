<template>
  <el-form label-position="top" size="small" class="space-y-3">
    <div class="grid grid-cols-2 gap-3">
      <el-form-item :label="$t('b86bb5a2.387f71')">
        <el-switch :value="settings.full_width" @input="updateField('full_width', $event)" />
      </el-form-item>

      <el-form-item :label="$t('b86bb5a2.f8df05')">
        <el-switch :value="settings.auto_rotate" @input="updateField('auto_rotate', $event)" />
      </el-form-item>
    </div>

    <el-form-item v-if="settings.auto_rotate" :label="$t('b86bb5a2.c01f2f')">
      <el-input-number
        :value="settings.change_slides_speed"
        :min="1"
        :max="30"
        controls-position="right"
        @change="updateField('change_slides_speed', $event)"
      />
    </el-form-item>

    <el-form-item :label="$t('b86bb5a2.d18f30')">
      <el-radio-group :value="settings.color_mode" @input="updateField('color_mode', $event)">
        <el-radio-button label="light">{{ $t('b86bb5a2.48d0a0') }}</el-radio-button>
        <el-radio-button label="dark">{{ $t('b86bb5a2.41e8e8') }}</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <div class="grid grid-cols-2 gap-3">
      <el-form-item :label="$t('b86bb5a2.9de56a')">
        <el-switch
          :value="settings.enable_country_selector"
          @input="updateField('enable_country_selector', $event)"
        />
      </el-form-item>

      <el-form-item :label="$t('b86bb5a2.37dba1')">
        <el-switch
          :value="settings.enable_language_selector"
          @input="updateField('enable_language_selector', $event)"
        />
      </el-form-item>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <el-form-item :label="$t('b86bb5a2.925fac')">
        <el-switch
          :value="settings.show_line_separator"
          @input="updateField('show_line_separator', $event)"
        />
      </el-form-item>

      <el-form-item :label="$t('b86bb5a2.f33ffa')">
        <el-switch :value="settings.show_social" @input="updateField('show_social', $event)" />
      </el-form-item>
    </div>

    <el-form-item :label="$t('b86bb5a2.fd1ff1')">
      <div class="flex flex-col gap-2">
        <div
          v-for="(blockId, index) in blockOrder"
          :key="blockId"
          class="flex cursor-pointer items-center gap-3 rounded-[10px] border border-solid border-gray-200 px-3 py-2.5"
          @click="$emit('select-block', blockId)"
        >
          <div class="min-w-0 flex-1">
            <div class="text-xs font-semibold text-gray-900">
              {{ resolveBlockTitle(index) }}
            </div>
            <div
              class="mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-gray-500"
            >
              {{ resolveBlockMeta(blockId) }}
            </div>
          </div>

          <div class="inline-flex gap-1.5">
            <el-button
              circle
              size="mini"
              :disabled="index === 0"
              @click.stop="moveBlock(blockId, index - 1)"
            >
              <ChevronUp :size="14" class="text-[#606266]" :stroke-width="2" />
            </el-button>
            <el-button
              circle
              size="mini"
              :disabled="index === blockOrder.length - 1"
              @click.stop="moveBlock(blockId, index + 1)"
            >
              <ChevronDown :size="14" class="text-[#606266]" :stroke-width="2" />
            </el-button>
            <el-button circle size="mini" @click.stop="removeBlock(blockId)">
              <Trash2 :size="14" class="text-[#606266]" :stroke-width="2" />
            </el-button>
          </div>
        </div>

        <el-button plain class="!inline-flex !items-center !gap-1.5" @click="addAnnouncement">
          <Plus :size="14" :stroke-width="2.5" />
          {{ $t('b86bb5a2.fa86f1') }}
        </el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import { createTypedBlock as createDefaultBlock } from '../definitions/factory.js'
import {
  normalizeTypedSectionSettings,
  normalizeSection,
  addSectionBlock,
  removeSectionBlock,
  moveSectionBlock
} from '../utils/panelState.js'

export default {
  name: 'AnnouncementBarPanel',
  props: {
    section: {
      type: Object,
      default: null
    },
    value: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    settings() {
      return normalizeTypedSectionSettings('announcement-bar', this.value)
    },
    normalizedSection() {
      return normalizeSection(this.section)
    },
    blockOrder() {
      return this.normalizedSection?.blockOrder || []
    },
    blocks() {
      return this.normalizedSection?.blocks || {}
    }
  },
  methods: {
    updateField(field, fieldValue) {
      this.$emit('change', {
        [field]: fieldValue
      })
    },
    resolveBlockTitle(index) {
      return `${this.$t('b86bb5a2.fa86f1')} ${index + 1}`
    },
    resolveBlockMeta(blockId) {
      return this.blocks[blockId] && this.blocks[blockId].settings
        ? this.blocks[blockId].settings.text || '--'
        : '--'
    },
    addAnnouncement() {
      const result = addSectionBlock(
        this.normalizedSection,
        () => createDefaultBlock('announcement-bar', 'announcement'),
        { text: '' }
      )
      this.$emit('change-section', result.section)
      this.$emit('select-block', result.blockId)
    },
    removeBlock(blockId) {
      this.$emit('change-section', removeSectionBlock(this.normalizedSection, blockId))
    },
    moveBlock(blockId, targetIndex) {
      this.$emit('change-section', moveSectionBlock(this.normalizedSection, blockId, targetIndex))
    }
  }
}
</script>
