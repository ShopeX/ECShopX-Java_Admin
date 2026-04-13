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
          <div class="decoration-editor-list-header">
            <span>{{ $t('decorationeditor.globalHeader') }}</span>
          </div>
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
                  {{ $t('decorationeditor.section.header') }}
                </div>
                <div class="structure-tree__meta">header</div>
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
                  <div class="structure-tree__meta">
                    {{ getBlockType(headerSection, blockId) }}
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
            @change="handleOrderChange"
          >
            <div v-for="sectionId in localOrder" :key="sectionId" class="structure-tree__group">
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
                  <div class="structure-tree__meta">
                    {{ getSectionType(sectionId) }}
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
                    <div class="structure-tree__meta">
                      {{ getBlockType(dsl.sections[sectionId], blockId) }}
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
          </draggable>

          <div class="structure-tree__insert-anchor">
            <button
              type="button"
              class="structure-tree__adder"
              @click="toggleInsertMenu('section')"
            >
              <i class="el-icon-plus" />
              <span>{{ $t('decorationeditor.addSection') }}</span>
            </button>

            <div v-if="isInsertMenuOpen('section')" class="structure-tree__insert-menu">
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
          <div class="decoration-editor-list-header">
            <span>{{ $t('decorationeditor.globalFooter') }}</span>
          </div>
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
                  {{ $t('decorationeditor.section.footer') }}
                </div>
                <div class="structure-tree__meta">footer</div>
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
                  <div class="structure-tree__meta">
                    {{ getBlockType(footerSection, blockId) }}
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
        sectionId: ''
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
    isInsertMenuOpen(kind, sectionId = '') {
      return this.openInsertMenu.kind === kind && this.openInsertMenu.sectionId === sectionId
    },
    toggleInsertMenu(kind, sectionId = '') {
      if (this.isInsertMenuOpen(kind, sectionId)) {
        this.openInsertMenu = { kind: '', sectionId: '' }
        return
      }
      this.openInsertMenu = { kind, sectionId }
    },
    closeInsertMenu() {
      this.openInsertMenu = { kind: '', sectionId: '' }
    },
    selectSectionType(type) {
      this.$emit('add-section', type)
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
    getBlockType(section, blockId) {
      return section?.blocks?.[blockId]?.type || ''
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

.structure-tree__meta {
  margin-top: 1px;
  font-size: 11px;
  color: var(--text-sub);
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
