<template>
  <div class="h-full flex min-h-0 flex-col border-r border-[#e6e9ef] bg-white">
    <div
      class="flex min-h-12 items-center justify-between gap-2.5 border-b border-[#e6e9ef] px-[14px] py-[10px]"
    >
      <div class="text-xs font-semibold text-[#18222f]">
        {{ $t('54e3d97e.768f6f') }}
      </div>
    </div>

    <div class="h-full overflow-hidden px-3 pb-4 pt-2.5">
      <div class="h-full overflow-auto pr-1">
        <div>
          <div
            class="mb-2 px-2 text-[11px] font-semibold leading-4 tracking-[0.06em] text-[#7c8798]"
          >
            <span>{{ $t('54e3d97e.917f14') }}</span>
          </div>
          <div class="space-y-1.5">
            <template v-if="announcementSection">
              <div
                :class="[
                  'flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2 py-[7px] transition-colors duration-150 hover:bg-[rgba(24,34,47,0.04)]',
                  {
                    'bg-[rgba(37,99,235,0.1)]':
                      selectedSectionId === 'announcement-bar' && !selectedBlockId
                  }
                ]"
                @click="$emit('select-section', 'announcement-bar')"
              >
                <button
                  type="button"
                  class="h-[18px] w-[18px] shrink-0 cursor-pointer border-0 bg-transparent p-0 text-[#6b7785]"
                  @click.stop="$emit('toggle-section', 'announcement-bar')"
                >
                  <i
                    :class="
                      isExpanded('announcement-bar') ? 'el-icon-arrow-down' : 'el-icon-arrow-right'
                    "
                  />
                </button>
                <div class="min-w-0 flex-1">
                  <div
                    class="inline-flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-[#18222f]"
                  >
                    <i class="el-icon-menu text-sm text-[#475467]" />
                    {{ getSectionDisplayLabel('announcement-bar') }}
                  </div>
                </div>
                <button
                  type="button"
                  class="h-[18px] w-[18px] shrink-0 cursor-pointer border-0 bg-transparent p-0 text-[#6b7785]"
                  @click.stop="$emit('toggle-section-disabled', 'announcement-bar')"
                >
                  <i
                    :class="isSectionDisabled('announcement-bar') ? 'el-icon-view' : 'el-icon-view'"
                  />
                </button>
              </div>

              <draggable
                v-if="isExpanded('announcement-bar') && getBlockOrder('announcement-bar').length"
                v-model="localBlockOrders['announcement-bar']"
                handle="[data-drag-handle='block']"
                @change="handleBlockOrderChange('announcement-bar')"
              >
                <div
                  v-for="blockId in getBlockOrder('announcement-bar')"
                  :key="blockId"
                  :class="[
                    'mt-0.5 ml-6 flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2 py-[7px] text-[#6b7785] transition-colors duration-150 hover:bg-[rgba(24,34,47,0.04)]',
                    {
                      'bg-[rgba(37,99,235,0.1)]':
                        selectedSectionId === 'announcement-bar' && selectedBlockId === blockId
                    }
                  ]"
                  @click="$emit('select-block', { sectionId: 'announcement-bar', blockId })"
                >
                  <i
                    data-drag-handle="block"
                    class="el-icon-rank cursor-move text-xs text-[#6b7785]"
                  />
                  <div class="min-w-0 flex-1">
                    <div
                      class="inline-flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-[#18222f]"
                    >
                      <i class="el-icon-document text-sm text-[#475467]" />
                      {{ getBlockLabel(announcementSection, blockId) }}
                    </div>
                  </div>
                </div>
              </draggable>

              <div v-if="isExpanded('announcement-bar')" class="relative">
                <button
                  v-if="announcementBlockPickerItems.length"
                  type="button"
                  class="mt-2 flex w-full cursor-pointer items-center justify-start gap-2 rounded-lg border-0 bg-transparent px-2 py-[7px] text-sm font-semibold text-[#2563eb] transition-colors duration-150"
                  @click="toggleInsertMenu('block', 'announcement-bar')"
                >
                  <i class="el-icon-plus text-sm font-bold" />
                  <span>{{ $t('54e3d97e.2e2d33') }}</span>
                </button>
                <div
                  v-if="isInsertMenuOpen('block', 'announcement-bar')"
                  class="absolute left-0 top-[calc(100%+6px)] z-[4] min-w-[160px] rounded-xl border border-[rgba(17,24,39,0.08)] bg-white p-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.14)]"
                >
                  <button
                    v-for="item in announcementBlockPickerItems"
                    :key="item.key"
                    type="button"
                    class="flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2.5 py-2 text-left text-xs text-[#18222f] hover:bg-[#e9f0ff] hover:text-[#2563eb]"
                    @click="selectBlockType('announcement-bar', item.type)"
                  >
                    {{ $t(item.titleKey) }}
                  </button>
                </div>
              </div>
            </template>

            <div
              :class="[
                'flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2 py-[7px] transition-colors duration-150 hover:bg-[rgba(24,34,47,0.04)]',
                { 'bg-[rgba(37,99,235,0.1)]': selectedSectionId === 'header' && !selectedBlockId }
              ]"
              @click="$emit('select-section', 'header')"
            >
              <button
                type="button"
                class="h-[18px] w-[18px] shrink-0 cursor-pointer border-0 bg-transparent p-0 text-[#6b7785]"
                @click.stop="$emit('toggle-section', 'header')"
              >
                <i :class="isExpanded('header') ? 'el-icon-arrow-down' : 'el-icon-arrow-right'" />
              </button>
              <div class="min-w-0 flex-1">
                <div
                  class="inline-flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-[#18222f]"
                >
                  <i class="el-icon-menu text-sm text-[#475467]" />
                  {{ $t('54e3d97e.917f14') }}
                </div>
              </div>
              <button
                type="button"
                class="h-[18px] w-[18px] shrink-0 cursor-pointer border-0 bg-transparent p-0 text-[#6b7785]"
                @click.stop="$emit('toggle-section-disabled', 'header')"
              >
                <i :class="isSectionDisabled('header') ? 'el-icon-view' : 'el-icon-view'" />
              </button>
            </div>

            <draggable
              v-if="isExpanded('header') && headerBlockOrder.length"
              v-model="localBlockOrders.header"
              handle="[data-drag-handle='block']"
              @change="handleBlockOrderChange('header')"
            >
              <div
                v-for="blockId in headerBlockOrder"
                :key="blockId"
                :class="[
                  'mt-0.5 ml-6 flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2 py-[7px] text-[#6b7785] transition-colors duration-150 hover:bg-[rgba(24,34,47,0.04)]',
                  {
                    'bg-[rgba(37,99,235,0.1)]':
                      selectedSectionId === 'header' && selectedBlockId === blockId
                  }
                ]"
                @click="$emit('select-block', { sectionId: 'header', blockId })"
              >
                <i
                  data-drag-handle="block"
                  class="el-icon-rank cursor-move text-xs text-[#6b7785]"
                />
                <div class="min-w-0 flex-1">
                  <div
                    class="inline-flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-[#18222f]"
                  >
                    <i class="el-icon-document text-sm text-[#475467]" />
                    {{ getBlockLabel(headerSection, blockId) }}
                  </div>
                </div>
              </div>
            </draggable>

            <div v-if="isExpanded('header')">
              <div class="relative">
                <button
                  v-if="!announcementSection"
                  type="button"
                  class="mt-2 flex w-full cursor-pointer items-center justify-start gap-2 rounded-lg border-0 bg-transparent px-2 py-[7px] text-sm font-semibold text-[#2563eb] transition-colors duration-150"
                  @click="$emit('add-global-section', 'announcement-bar')"
                >
                  <i class="el-icon-plus text-sm font-bold" />
                  <span>{{ $t('54e3d97e.2e2d33') }}</span>
                </button>
                <button
                  v-if="headerBlockPickerItems.length"
                  type="button"
                  class="mt-2 flex w-full cursor-pointer items-center justify-start gap-2 rounded-lg border-0 bg-transparent px-2 py-[7px] text-sm font-semibold text-[#2563eb] transition-colors duration-150"
                  @click="toggleInsertMenu('block', 'header')"
                >
                  <i class="el-icon-plus text-sm font-bold" />
                  <span>{{ $t('54e3d97e.2e2d33') }}</span>
                </button>

                <div
                  v-if="isInsertMenuOpen('block', 'header')"
                  class="absolute left-0 top-[calc(100%+6px)] z-[4] min-w-[160px] rounded-xl border border-[rgba(17,24,39,0.08)] bg-white p-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.14)]"
                >
                  <button
                    v-for="item in headerBlockPickerItems"
                    :key="item.key"
                    type="button"
                    class="flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2.5 py-2 text-left text-xs text-[#18222f] hover:bg-[#e9f0ff] hover:text-[#2563eb]"
                    @click="selectBlockType('header', item.type)"
                  >
                    {{ $t(item.titleKey) }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-3.5 border-t border-[#eef1f5] pt-3.5">
          <div
            class="mb-2 px-2 text-[11px] font-semibold leading-4 tracking-[0.06em] text-[#7c8798]"
          >
            <span>{{ $t('54e3d97e.cdb7d0') }}</span>
          </div>

          <draggable
            v-model="localOrder"
            handle="[data-drag-handle='section']"
            class="flex flex-col gap-0"
            @change="handleOrderChange"
          >
            <div v-for="sectionId in localOrder" :key="sectionId" class="flex flex-col gap-0">
              <div class="space-y-1.5">
                <div
                  :class="[
                    'flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2 py-[7px] transition-colors duration-150 hover:bg-[rgba(24,34,47,0.04)]',
                    {
                      'bg-[rgba(37,99,235,0.1)]':
                        sectionId === selectedSectionId && !selectedBlockId
                    }
                  ]"
                  @click="$emit('select-section', sectionId)"
                >
                  <button
                    type="button"
                    class="h-[18px] w-[18px] shrink-0 cursor-pointer border-0 bg-transparent p-0 text-[#6b7785]"
                    @click.stop="$emit('toggle-section', sectionId)"
                  >
                    <i
                      :class="isExpanded(sectionId) ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"
                    />
                  </button>
                  <i
                    data-drag-handle="section"
                    class="el-icon-rank cursor-move text-xs text-[#6b7785]"
                  />
                  <div class="min-w-0 flex-1">
                    <div
                      class="inline-flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-[#18222f]"
                    >
                      <i class="el-icon-menu text-sm text-[#475467]" />
                      {{ getSectionLabel(sectionId) }}
                    </div>
                  </div>
                  <i
                    v-if="isSectionDisabled(sectionId)"
                    class="el-icon-view ml-1.5 text-sm text-[#98a2b3]"
                  />
                </div>

                <draggable
                  v-if="isExpanded(sectionId) && getBlockOrder(sectionId).length"
                  v-model="localBlockOrders[sectionId]"
                  handle="[data-drag-handle='block']"
                  @change="handleBlockOrderChange(sectionId)"
                >
                  <div
                    v-for="blockId in getBlockOrder(sectionId)"
                    :key="blockId"
                    :class="[
                      'mt-0.5 ml-6 flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2 py-[7px] text-[#6b7785] transition-colors duration-150 hover:bg-[rgba(24,34,47,0.04)]',
                      {
                        'bg-[rgba(37,99,235,0.1)]':
                          sectionId === selectedSectionId && selectedBlockId === blockId
                      }
                    ]"
                    @click="$emit('select-block', { sectionId, blockId })"
                  >
                    <i
                      data-drag-handle="block"
                      class="el-icon-rank cursor-move text-xs text-[#6b7785]"
                    />
                    <div class="min-w-0 flex-1">
                      <div
                        class="inline-flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-[#18222f]"
                      >
                        <i class="el-icon-document text-sm text-[#475467]" />
                        {{ getBlockLabel(dsl.sections[sectionId], blockId) }}
                      </div>
                    </div>
                  </div>
                </draggable>

                <div v-if="isExpanded(sectionId)">
                  <div class="relative ml-6">
                    <button
                      v-if="getBlockPickerItems(getSectionType(sectionId)).length"
                      type="button"
                      class="mt-0.5 ml-6 flex w-full cursor-pointer items-center justify-start gap-2 rounded-lg border-0 bg-transparent px-2 py-[7px] text-sm font-semibold text-[#2563eb] transition-colors duration-150"
                      @click="toggleInsertMenu('block', sectionId)"
                    >
                      <i class="el-icon-plus text-sm font-bold" />
                      <span>{{ $t('54e3d97e.2e2d33') }}</span>
                    </button>

                    <div
                      v-if="isInsertMenuOpen('block', sectionId)"
                      class="absolute left-0 top-[calc(100%+6px)] z-[4] min-w-[160px] rounded-xl border border-[rgba(17,24,39,0.08)] bg-white p-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.14)]"
                    >
                      <button
                        v-for="item in getBlockPickerItems(getSectionType(sectionId))"
                        :key="item.key"
                        type="button"
                        class="flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2.5 py-2 text-left text-xs text-[#18222f] hover:bg-[#e9f0ff] hover:text-[#2563eb]"
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

          <div class="relative">
            <button
              type="button"
              class="mt-2 flex w-full cursor-pointer items-center justify-start gap-2 rounded-lg border-0 bg-transparent px-2 py-[7px] text-sm font-semibold text-[#2563eb] transition-colors duration-150"
              @click="toggleInsertMenu('section', '', localOrder.length)"
            >
              <i class="el-icon-plus text-sm font-bold" />
              <span>{{ $t('54e3d97e.2e2d33') }}</span>
            </button>
            <div
              v-if="isInsertMenuOpen('section', '', localOrder.length)"
              class="absolute left-0 top-[calc(100%+6px)] z-[4] min-w-[160px] rounded-xl border border-[rgba(17,24,39,0.08)] bg-white p-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.14)]"
            >
              <button
                v-for="item in sectionPickerItems"
                :key="item.key"
                type="button"
                class="flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2.5 py-2 text-left text-xs text-[#18222f] hover:bg-[#e9f0ff] hover:text-[#2563eb]"
                @click="selectSectionType(item.type)"
              >
                <i :class="item.icon" />
                <span>{{ $t(item.titleKey) }}</span>
              </button>
            </div>
          </div>

          <div
            v-if="!localOrder.length"
            class="flex min-h-[180px] items-center justify-center rounded-xl border border-dashed border-[#d7dde7] bg-[#fbfbfc] p-6 text-center text-[#6b7785]"
          >
            {{ $t('54e3d97e.bdf5be') }}
          </div>
        </div>

        <div class="mt-3.5 border-t border-[#eef1f5] pt-3.5">
          <div
            class="mb-2 px-2 text-[11px] font-semibold leading-4 tracking-[0.06em] text-[#7c8798]"
          >
            <span>{{ $t('54e3d97e.4eb88f') }}</span>
          </div>
          <div class="space-y-1.5">
            <div
              :class="[
                'flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2 py-[7px] transition-colors duration-150 hover:bg-[rgba(24,34,47,0.04)]',
                { 'bg-[rgba(37,99,235,0.1)]': selectedSectionId === 'footer' && !selectedBlockId }
              ]"
              @click="$emit('select-section', 'footer')"
            >
              <button
                type="button"
                class="h-[18px] w-[18px] shrink-0 cursor-pointer border-0 bg-transparent p-0 text-[#6b7785]"
                @click.stop="$emit('toggle-section', 'footer')"
              >
                <i :class="isExpanded('footer') ? 'el-icon-arrow-down' : 'el-icon-arrow-right'" />
              </button>
              <div class="min-w-0 flex-1">
                <div
                  class="inline-flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-[#18222f]"
                >
                  <i class="el-icon-menu text-sm text-[#475467]" />
                  {{ $t('54e3d97e.4eb88f') }}
                </div>
              </div>
              <button
                type="button"
                class="h-[18px] w-[18px] shrink-0 cursor-pointer border-0 bg-transparent p-0 text-[#6b7785]"
                @click.stop="$emit('toggle-section-disabled', 'footer')"
              >
                <i :class="isSectionDisabled('footer') ? 'el-icon-view' : 'el-icon-view'" />
              </button>
            </div>

            <draggable
              v-if="isExpanded('footer') && footerBlockOrder.length"
              v-model="localBlockOrders.footer"
              handle="[data-drag-handle='block']"
              @change="handleBlockOrderChange('footer')"
            >
              <div
                v-for="blockId in footerBlockOrder"
                :key="blockId"
                :class="[
                  'mt-0.5 ml-6 flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2 py-[7px] text-[#6b7785] transition-colors duration-150 hover:bg-[rgba(24,34,47,0.04)]',
                  {
                    'bg-[rgba(37,99,235,0.1)]':
                      selectedSectionId === 'footer' && selectedBlockId === blockId
                  }
                ]"
                @click="$emit('select-block', { sectionId: 'footer', blockId })"
              >
                <i
                  data-drag-handle="block"
                  class="el-icon-rank cursor-move text-xs text-[#6b7785]"
                />
                <div class="min-w-0 flex-1">
                  <div
                    class="inline-flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-[#18222f]"
                  >
                    <i class="el-icon-document text-sm text-[#475467]" />
                    {{ getBlockLabel(footerSection, blockId) }}
                  </div>
                </div>
              </div>
            </draggable>

            <div v-if="isExpanded('footer')">
              <div class="relative">
                <button
                  v-if="footerBlockPickerItems.length"
                  type="button"
                  class="mt-2 flex w-full cursor-pointer items-center justify-start gap-2 rounded-lg border-0 bg-transparent px-2 py-[7px] text-sm font-semibold text-[#2563eb] transition-colors duration-150"
                  @click="toggleInsertMenu('block', 'footer')"
                >
                  <i class="el-icon-plus text-sm font-bold" />
                  <span>{{ $t('54e3d97e.2e2d33') }}</span>
                </button>

                <div
                  v-if="isInsertMenuOpen('block', 'footer')"
                  class="absolute left-0 top-[calc(100%+6px)] z-[4] min-w-[160px] rounded-xl border border-[rgba(17,24,39,0.08)] bg-white p-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.14)]"
                >
                  <button
                    v-for="item in footerBlockPickerItems"
                    :key="item.key"
                    type="button"
                    class="flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2.5 py-2 text-left text-xs text-[#18222f] hover:bg-[#e9f0ff] hover:text-[#2563eb]"
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
    announcementSection() {
      return this.globalDsl.sections?.['announcement-bar'] || null
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
    announcementBlockPickerItems() {
      return createBlockPickerItems('announcement-bar')
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
      Object.keys(this.globalDsl.sections || {}).forEach((sectionId) => {
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
      return this.getSectionDisplayLabel(sectionId)
    },
    getSectionType(sectionId) {
      return this.getSection(sectionId)?.type || ''
    },
    isSectionDisabled(sectionId) {
      return Boolean(this.getSection(sectionId)?.disabled)
    },
    getSection(sectionId) {
      return this.globalDsl.sections?.[sectionId] || this.dsl.sections?.[sectionId] || null
    },
    getSectionDisplayLabel(sectionId) {
      const section = this.getSection(sectionId)
      if (!section) return ''
      return section.settings?.title || this.$t(section.titleKey || '54e3d97e.cdb7d0')
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
        this.$t(definition?.titleKey || '54e3d97e.7f56ad')
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
