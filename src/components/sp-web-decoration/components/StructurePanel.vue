<template>
  <div class="decoration-editor-panel structure-panel">
    <div class="decoration-editor-panel__header">
      <div class="decoration-editor-panel__title">
        {{ $t('decorationeditor.structureTitle') }}
      </div>
    </div>

    <div class="decoration-editor-panel__body structure-panel__body">
      <div class="structure-tree">
        <div class="structure-group">
          <div class="structure-tree__group">
            <div
              :class="[
                'structure-tree__item',
                { active: selectedSectionId === 'header' && !selectedBlockId }
              ]"
              @click="$emit('select-section', 'header')"
            >
              <button
                type="button"
                class="structure-tree__toggle"
                @click.stop="$emit('toggle-section', 'header')"
              >
                <i :class="isExpanded('header') ? 'el-icon-arrow-down' : 'el-icon-arrow-right'" />
              </button>
              <div class="structure-tree__copy">
                <div class="structure-tree__title">
                  {{ $t('decorationeditor.globalHeader') }}
                </div>
              </div>
            </div>

            <draggable
              v-if="isExpanded('header') && headerBlockOrder.length"
              v-model="localBlockOrders.header"
              handle=".structure-tree__block-drag"
              class="structure-tree__blocks"
              @change="handleBlockOrderChange('header')"
            >
              <div
                v-for="blockId in headerBlockOrder"
                :key="blockId"
                :class="[
                  'structure-tree__block',
                  { active: selectedSectionId === 'header' && selectedBlockId === blockId }
                ]"
                @click="$emit('select-block', { sectionId: 'header', blockId })"
              >
                <div class="structure-tree__block-drag">
                  <i class="el-icon-rank" />
                </div>
                <div class="structure-tree__copy">
                  <div class="structure-tree__title">
                    {{ getBlockLabel(headerSection, blockId) }}
                  </div>
                </div>
                <button
                  type="button"
                  class="structure-tree__action danger"
                  @click.stop="$emit('remove-block', { sectionId: 'header', blockId })"
                >
                  <i class="el-icon-delete" />
                </button>
              </div>
            </draggable>

            <div v-if="isExpanded('header')">
              <div class="structure-tree__insert-anchor">
                <button
                  v-if="headerBlockPickerItems.length"
                  type="button"
                  class="structure-tree__adder"
                  @click="toggleInsertMenu('block', 'header')"
                >
                  <i class="el-icon-plus" />
                  <span>{{ $t('decorationeditor.addBlock') }}</span>
                </button>

                <div v-if="isInsertMenuOpen('block', 'header')" class="structure-tree__insert-menu">
                  <button
                    v-for="item in headerBlockPickerItems"
                    :key="item.key"
                    type="button"
                    class="structure-tree__insert-item"
                    @click="selectBlockType('header', item.type)"
                  >
                    {{ $t(item.titleKey) }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="structure-group">
          <div class="decoration-editor-list-header">
            <span>{{ $t('decorationeditor.pageSections') }}</span>
          </div>

          <draggable
            v-model="localOrder"
            handle=".structure-tree__drag"
            class="structure-tree__sections-draggable"
            @change="handleOrderChange"
          >
            <div
              v-for="(sectionId, idx) in localOrder"
              :key="sectionId"
              class="structure-tree__page-section-wrap"
            >
              <div class="structure-tree__section-insert">
                <div
                  class="structure-tree__section-insert-line"
                  :class="{
                    'structure-tree__section-insert-line--menu-open': isInsertMenuOpen(
                      'section',
                      '',
                      idx
                    )
                  }"
                  @click="toggleInsertMenu('section', '', idx)"
                >
                  <button
                    type="button"
                    class="structure-tree__section-insert-btn"
                    @click.stop="toggleInsertMenu('section', '', idx)"
                  >
                    <i class="el-icon-plus" />
                    <span>{{ $t('decorationeditor.addSection') }}</span>
                  </button>
                </div>
                <div
                  v-if="isInsertMenuOpen('section', '', idx)"
                  class="structure-tree__insert-menu structure-tree__insert-menu--section-gap"
                >
                  <button
                    v-for="item in sectionPickerItems"
                    :key="item.key"
                    type="button"
                    class="structure-tree__insert-item"
                    @click="selectSectionType(item.type)"
                  >
                    <i :class="item.icon" />
                    <span>{{ $t(item.titleKey) }}</span>
                  </button>
                </div>
              </div>

              <div class="structure-tree__group">
              <div
                :class="[
                  'structure-tree__item',
                  { active: sectionId === selectedSectionId && !selectedBlockId }
                ]"
                @click="$emit('select-section', sectionId)"
              >
                <button
                  type="button"
                  class="structure-tree__toggle"
                  @click.stop="$emit('toggle-section', sectionId)"
                >
                  <i
                    :class="isExpanded(sectionId) ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"
                  />
                </button>
                <div class="structure-tree__drag">
                  <i class="el-icon-rank" />
                </div>
                <div class="structure-tree__copy">
                  <div class="structure-tree__title">
                    {{ getSectionLabel(sectionId) }}
                  </div>
                </div>
                <div class="structure-tree__actions">
                  <button
                    type="button"
                    class="structure-tree__action"
                    @click.stop="$emit('duplicate-section', sectionId)"
                  >
                    <i class="el-icon-document-copy" />
                  </button>
                  <button
                    type="button"
                    class="structure-tree__action danger"
                    @click.stop="$emit('remove-section', sectionId)"
                  >
                    <i class="el-icon-delete" />
                  </button>
                </div>
              </div>

              <draggable
                v-if="isExpanded(sectionId) && getBlockOrder(sectionId).length"
                v-model="localBlockOrders[sectionId]"
                handle=".structure-tree__block-drag"
                class="structure-tree__blocks"
                @change="handleBlockOrderChange(sectionId)"
              >
                <div
                  v-for="blockId in getBlockOrder(sectionId)"
                  :key="blockId"
                  :class="[
                    'structure-tree__block',
                    { active: sectionId === selectedSectionId && selectedBlockId === blockId }
                  ]"
                  @click="$emit('select-block', { sectionId, blockId })"
                >
                  <div class="structure-tree__block-drag">
                    <i class="el-icon-rank" />
                  </div>
                  <div class="structure-tree__copy">
                    <div class="structure-tree__title">
                      {{ getBlockLabel(dsl.sections[sectionId], blockId) }}
                    </div>
                  </div>
                  <button
                    type="button"
                    class="structure-tree__action danger"
                    @click.stop="$emit('remove-block', { sectionId, blockId })"
                  >
                    <i class="el-icon-delete" />
                  </button>
                </div>
              </draggable>

              <div v-if="isExpanded(sectionId)">
                <div class="structure-tree__insert-anchor structure-tree__insert-anchor--nested">
                  <button
                    v-if="getBlockPickerItems(getSectionType(sectionId)).length"
                    type="button"
                    class="structure-tree__adder structure-tree__adder--nested"
                    @click="toggleInsertMenu('block', sectionId)"
                  >
                    <i class="el-icon-plus" />
                    <span>{{ $t('decorationeditor.addBlock') }}</span>
                  </button>

                  <div
                    v-if="isInsertMenuOpen('block', sectionId)"
                    class="structure-tree__insert-menu structure-tree__insert-menu--nested"
                  >
                    <button
                      v-for="item in getBlockPickerItems(getSectionType(sectionId))"
                      :key="item.key"
                      type="button"
                      class="structure-tree__insert-item"
                      @click="selectBlockType(sectionId, item.type)"
                    >
                      {{ $t(item.titleKey) }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </draggable>

          <div v-if="!localOrder.length" class="structure-tree__section-insert structure-tree__section-insert--empty">
            <div
              class="structure-tree__section-insert-line"
              :class="{
                'structure-tree__section-insert-line--menu-open': isInsertMenuOpen('section', '', 0)
              }"
              @click="toggleInsertMenu('section', '', 0)"
            >
              <button
                type="button"
                class="structure-tree__section-insert-btn"
                @click.stop="toggleInsertMenu('section', '', 0)"
              >
                <i class="el-icon-plus" />
                <span>{{ $t('decorationeditor.addSection') }}</span>
              </button>
            </div>
            <div
              v-if="isInsertMenuOpen('section', '', 0)"
              class="structure-tree__insert-menu structure-tree__insert-menu--section-gap"
            >
              <button
                v-for="item in sectionPickerItems"
                :key="item.key"
                type="button"
                class="structure-tree__insert-item"
                @click="selectSectionType(item.type)"
              >
                <i :class="item.icon" />
                <span>{{ $t(item.titleKey) }}</span>
              </button>
            </div>
          </div>

          <div v-if="localOrder.length" class="structure-tree__section-insert structure-tree__section-insert--tail">
            <div
              class="structure-tree__section-insert-line"
              :class="{
                'structure-tree__section-insert-line--menu-open': isInsertMenuOpen(
                  'section',
                  '',
                  localOrder.length
                )
              }"
              @click="toggleInsertMenu('section', '', localOrder.length)"
            >
              <button
                type="button"
                class="structure-tree__section-insert-btn"
                @click.stop="toggleInsertMenu('section', '', localOrder.length)"
              >
                <i class="el-icon-plus" />
                <span>{{ $t('decorationeditor.addSection') }}</span>
              </button>
            </div>
            <div
              v-if="isInsertMenuOpen('section', '', localOrder.length)"
              class="structure-tree__insert-menu structure-tree__insert-menu--section-gap"
            >
              <button
                v-for="item in sectionPickerItems"
                :key="item.key"
                type="button"
                class="structure-tree__insert-item"
                @click="selectSectionType(item.type)"
              >
                <i :class="item.icon" />
                <span>{{ $t(item.titleKey) }}</span>
              </button>
            </div>
          </div>

          <div v-if="!localOrder.length" class="decoration-editor-empty">
            {{ $t('decorationeditor.emptyStructure') }}
          </div>
        </div>

        <div class="structure-group">
          <div class="structure-tree__group">
            <div
              :class="[
                'structure-tree__item',
                { active: selectedSectionId === 'footer' && !selectedBlockId }
              ]"
              @click="$emit('select-section', 'footer')"
            >
              <button
                type="button"
                class="structure-tree__toggle"
                @click.stop="$emit('toggle-section', 'footer')"
              >
                <i :class="isExpanded('footer') ? 'el-icon-arrow-down' : 'el-icon-arrow-right'" />
              </button>
              <div class="structure-tree__copy">
                <div class="structure-tree__title">
                  {{ $t('decorationeditor.globalFooter') }}
                </div>
              </div>
            </div>

            <draggable
              v-if="isExpanded('footer') && footerBlockOrder.length"
              v-model="localBlockOrders.footer"
              handle=".structure-tree__block-drag"
              class="structure-tree__blocks"
              @change="handleBlockOrderChange('footer')"
            >
              <div
                v-for="blockId in footerBlockOrder"
                :key="blockId"
                :class="[
                  'structure-tree__block',
                  { active: selectedSectionId === 'footer' && selectedBlockId === blockId }
                ]"
                @click="$emit('select-block', { sectionId: 'footer', blockId })"
              >
                <div class="structure-tree__block-drag">
                  <i class="el-icon-rank" />
                </div>
                <div class="structure-tree__copy">
                  <div class="structure-tree__title">
                    {{ getBlockLabel(footerSection, blockId) }}
                  </div>
                </div>
                <button
                  type="button"
                  class="structure-tree__action danger"
                  @click.stop="$emit('remove-block', { sectionId: 'footer', blockId })"
                >
                  <i class="el-icon-delete" />
                </button>
              </div>
            </draggable>

            <div v-if="isExpanded('footer')">
              <div class="structure-tree__insert-anchor">
                <button
                  v-if="footerBlockPickerItems.length"
                  type="button"
                  class="structure-tree__adder"
                  @click="toggleInsertMenu('block', 'footer')"
                >
                  <i class="el-icon-plus" />
                  <span>{{ $t('decorationeditor.addBlock') }}</span>
                </button>

                <div v-if="isInsertMenuOpen('block', 'footer')" class="structure-tree__insert-menu">
                  <button
                    v-for="item in footerBlockPickerItems"
                    :key="item.key"
                    type="button"
                    class="structure-tree__insert-item"
                    @click="selectBlockType('footer', item.type)"
                  >
                    {{ $t(item.titleKey) }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

const { getBlockDefinition } = require('../registry')
const { createSectionPickerItems, createBlockPickerItems } = require('../utils/insertPicker')

export default {
  name: 'StructurePanel',
  components: {
    draggable
  },
  props: {
    dsl: {
      type: Object,
      required: true
    },
    globalDsl: {
      type: Object,
      default: () => ({})
    },
    sectionDefinitions: {
      type: Array,
      default: () => []
    },
    expandedSectionIds: {
      type: Array,
      default: () => []
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
      localOrder: [],
      localBlockOrders: {
        header: [],
        footer: []
      },
      openInsertMenu: {
        kind: '',
        sectionId: '',
        insertIndex: null
      }
    }
  },
  computed: {
    sectionPickerItems() {
      return createSectionPickerItems(this.sectionDefinitions)
    },
    headerSection() {
      return this.globalDsl.sections?.header || null
    },
    footerSection() {
      return this.globalDsl.sections?.footer || null
    },
    headerBlockOrder() {
      return this.localBlockOrders.header || []
    },
    footerBlockOrder() {
      return this.localBlockOrders.footer || []
    },
    headerBlockPickerItems() {
      return createBlockPickerItems('header')
    },
    footerBlockPickerItems() {
      return createBlockPickerItems('footer')
    }
  },
  watch: {
    'dsl.order': {
      immediate: true,
      deep: true,
      handler(value) {
        this.localOrder = Array.isArray(value) ? value.slice() : []
      }
    },
    dsl: {
      immediate: true,
      deep: true,
      handler() {
        this.syncBlockOrders()
      }
    },
    globalDsl: {
      immediate: true,
      deep: true,
      handler() {
        this.syncBlockOrders()
      }
    }
  },
  methods: {
    syncBlockOrders() {
      const nextBlockOrders = {}
      ;['header', 'footer'].forEach((sectionId) => {
        nextBlockOrders[sectionId] = this.globalDsl.sections?.[sectionId]?.blockOrder?.slice() || []
      })
      Object.keys(this.dsl.sections || {}).forEach((sectionId) => {
        nextBlockOrders[sectionId] = this.dsl.sections[sectionId].blockOrder?.slice() || []
      })
      this.localBlockOrders = nextBlockOrders
    },
    isExpanded(sectionId) {
      return this.expandedSectionIds.includes(sectionId)
    },
    isInsertMenuOpen(kind, sectionId = '', insertIndex = null) {
      if (this.openInsertMenu.kind !== kind) return false
      if (kind === 'block') {
        return this.openInsertMenu.sectionId === sectionId
      }
      if (kind === 'section') {
        return this.openInsertMenu.insertIndex === insertIndex
      }
      return false
    },
    toggleInsertMenu(kind, sectionId = '', insertIndex = undefined) {
      if (kind === 'block') {
        if (this.isInsertMenuOpen('block', sectionId)) {
          this.openInsertMenu = { kind: '', sectionId: '', insertIndex: null }
          return
        }
        this.openInsertMenu = { kind: 'block', sectionId, insertIndex: null }
        return
      }
      if (kind === 'section') {
        const idx = typeof insertIndex === 'number' ? insertIndex : this.localOrder.length
        if (this.isInsertMenuOpen('section', '', idx)) {
          this.openInsertMenu = { kind: '', sectionId: '', insertIndex: null }
          return
        }
        this.openInsertMenu = { kind: 'section', sectionId: '', insertIndex: idx }
      }
    },
    closeInsertMenu() {
      this.openInsertMenu = { kind: '', sectionId: '', insertIndex: null }
    },
    selectSectionType(type) {
      const idx = this.openInsertMenu.insertIndex
      this.$emit('add-section', {
        type,
        index: typeof idx === 'number' ? idx : undefined
      })
      this.closeInsertMenu()
    },
    selectBlockType(sectionId, blockType) {
      this.$emit('add-block', { sectionId, blockType })
      this.closeInsertMenu()
    },
    getSectionLabel(sectionId) {
      const section = this.dsl.sections[sectionId]
      if (!section) return ''
      return section.settings?.title || this.$t(section.titleKey || 'decorationeditor.pageSections')
    },
    getSectionType(sectionId) {
      return this.dsl.sections[sectionId]?.type || ''
    },
    getBlockPickerItems(sectionType) {
      return createBlockPickerItems(sectionType)
    },
    getBlockOrder(sectionId) {
      return this.localBlockOrders[sectionId] || []
    },
    getBlockLabel(section, blockId) {
      const block = section?.blocks?.[blockId]
      if (!block) return ''
      const definition = getBlockDefinition(section.type, block.type)
      return (
        block.settings?.label ||
        block.settings?.title ||
        this.$t(definition?.titleKey || 'decorationeditor.block.item')
      )
    },
    handleOrderChange() {
      this.$emit('reorder-sections', this.localOrder.slice())
    },
    handleBlockOrderChange(sectionId) {
      this.$emit('reorder-blocks', {
        sectionId,
        blockOrder: this.getBlockOrder(sectionId).slice()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.structure-panel {
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--editor-border);
  background: #fff;
}

.structure-panel__body {
  height: 100%;
  overflow: hidden;
  padding: 10px 12px 16px;
}

.structure-tree {
  height: 100%;
  overflow: auto;
  padding-right: 4px;
}

.structure-group + .structure-group {
  margin-top: 14px;
}

.structure-tree__sections-draggable {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.structure-tree__page-section-wrap {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.structure-tree__section-insert {
  position: relative;
  margin: 4px 0 2px;
}

.structure-tree__section-insert--empty {
  margin-bottom: 8px;
}

.structure-tree__section-insert--tail {
  margin-top: 2px;
  margin-bottom: 4px;
}

.structure-tree__section-insert-line {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  padding: 2px 0;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s ease;

  &::before {
    content: '';
    position: absolute;
    left: 10px;
    right: 10px;
    height: 0;
    border-top: 1px dashed rgba(37, 99, 235, 0.35);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s ease, border-color 0.15s ease;
  }

  &:hover,
  &:focus-within,
  &--menu-open {
    background: rgba(37, 99, 235, 0.06);

    &::before {
      opacity: 1;
      border-top-color: rgba(37, 99, 235, 0.55);
    }

    .structure-tree__section-insert-btn {
      opacity: 1;
      transform: scale(1);
      pointer-events: auto;
    }
  }
}

.structure-tree__section-insert-btn {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border: 0;
  border-radius: 999px;
  background: #2563eb;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.35);
  opacity: 0;
  transform: scale(0.96);
  pointer-events: none;
  transition: opacity 0.15s ease, transform 0.15s ease;

  i {
    font-size: 12px;
    font-weight: 700;
  }

  &:hover {
    background: #1d4ed8;
  }
}

.structure-tree__insert-menu--section-gap {
  left: 50%;
  transform: translateX(-50%);
  min-width: 200px;
}

.structure-tree__group + .structure-tree__group {
  margin-top: 6px;
}

.structure-tree__item,
.structure-tree__block,
.structure-tree__adder {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  transition: color 0.18s ease, background-color 0.18s ease;
}

.structure-tree__item,
.structure-tree__block {
  cursor: pointer;

  &.active {
    background: rgba(37, 99, 235, 0.1);
  }

  &:hover {
    background: rgba(24, 34, 47, 0.04);
  }
}

.structure-tree__block,
.structure-tree__adder--nested {
  margin-top: 4px;
  margin-left: 24px;
}

.structure-tree__block {
  color: var(--text-sub);
}

.structure-tree__adder {
  margin-top: 6px;
  justify-content: flex-start;
  color: var(--brand);
  cursor: pointer;
  font-size: 12px;

  i {
    font-size: 12px;
    font-weight: 700;
  }
}

.structure-tree__insert-anchor {
  position: relative;
}

.structure-tree__insert-anchor--nested {
  margin-left: 24px;
}

.structure-tree__insert-menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 4;
  min-width: 160px;
  padding: 6px;
  border: 1px solid rgba(17, 24, 39, 0.08);
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.14);
}

.structure-tree__insert-menu--nested {
  left: 0;
}

.structure-tree__insert-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--text-main);
  cursor: pointer;
  text-align: left;
  font-size: 12px;

  &:hover {
    background: var(--brand-soft);
    color: var(--brand);
  }
}

.structure-tree__toggle,
.structure-tree__drag,
.structure-tree__block-drag {
  color: var(--text-sub);
}

.structure-tree__toggle {
  width: 18px;
  height: 18px;
  border: 0;
  background: transparent;
  cursor: pointer;
  flex: 0 0 auto;
  padding: 0;
}

.structure-tree__drag,
.structure-tree__block-drag {
  cursor: move;
  font-size: 12px;
}

.structure-tree__copy {
  flex: 1;
  min-width: 0;
}

.structure-tree__title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-main);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.structure-tree__actions {
  display: flex;
  align-items: center;
  gap: 2px;
  opacity: 0;
  transition: opacity 0.18s ease;
}

.structure-tree__item:hover .structure-tree__actions,
.structure-tree__block:hover .structure-tree__actions,
.structure-tree__block:hover .structure-tree__action {
  opacity: 1;
}

.structure-tree__action {
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--text-sub);
  cursor: pointer;
  opacity: 0.78;

  &.danger:hover {
    color: #d03050;
    background: rgba(208, 48, 80, 0.08);
  }

  &:hover {
    color: var(--brand);
    background: rgba(37, 99, 235, 0.08);
  }
}

.decoration-editor-list-header {
  margin-bottom: 8px;
  padding: 0 10px;
  color: #7c8798;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
</style>
