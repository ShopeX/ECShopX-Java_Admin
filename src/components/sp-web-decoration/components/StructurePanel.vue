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
          <div class="space-y-2">
            <template v-if="announcementSection">
              <div
                :class="[
                  'group flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2 py-[7px] transition-colors duration-150 hover:bg-[rgba(24,34,47,0.04)]',
                  {
                    'bg-[rgba(37,99,235,0.1)]':
                      selectedSectionId === 'announcement-bar' && !selectedBlockId
                  }
                ]"
                @click="$emit('select-section', 'announcement-bar')"
              >
                <button
                  type="button"
                  class="flex h-[18px] w-[18px] shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-[#6b7785]"
                  @click.stop="$emit('toggle-section', 'announcement-bar')"
                >
                  <ChevronDown
                    v-if="isExpanded('announcement-bar')"
                    :size="14"
                    :stroke-width="2"
                  />
                  <ChevronRight v-else :size="14" :stroke-width="2" />
                </button>
                <div class="min-w-0 flex-1 flex items-center">
                  <div
                    class="inline-flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-[#18222f]"
                  >
                    <span
                      class="relative inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center"
                    >
                      <GalleryVertical
                        :size="14"
                        class="shrink-0 text-[#475467] opacity-100 transition-opacity duration-150 group-hover:pointer-events-none group-hover:opacity-0"
                        :stroke-width="1.5"
                      />
                      <span
                        class="pointer-events-none absolute inset-0 inline-flex items-center justify-center text-[#6b7785] opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                        aria-hidden="true"
                      >
                        <GripVertical :size="14" :stroke-width="1.5" />
                      </span>
                    </span>
                    {{ getSectionDisplayLabel('announcement-bar') }}
                  </div>
                </div>
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
                    'group mt-0.5 flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent py-[7px] pl-[50px] pr-2 text-[#6b7785] transition-colors duration-150 hover:bg-[rgba(24,34,47,0.04)]',
                    {
                      'bg-[rgba(37,99,235,0.1)]':
                        selectedSectionId === 'announcement-bar' && selectedBlockId === blockId
                    }
                  ]"
                  @click="$emit('select-block', { sectionId: 'announcement-bar', blockId })"
                >
                  <div class="min-w-0 flex-1 flex items-center">
                    <div
                      class="inline-flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-[#18222f]"
                    >
                      <span
                        class="relative inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center"
                      >
                        <Diamond
                          :size="16"
                          class="shrink-0 text-[#475467] opacity-100 transition-opacity duration-150 group-hover:pointer-events-none group-hover:opacity-0"
                          :stroke-width="2"
                        />
                        <span
                          data-drag-handle="block"
                          class="pointer-events-none absolute inset-0 inline-flex cursor-move items-center justify-center text-[#6b7785] opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100"
                        >
                          <GripVertical :size="14" :stroke-width="2" />
                        </span>
                      </span>
                      {{ getBlockLabel(announcementSection, blockId) }}
                    </div>
                  </div>
                </div>
              </draggable>

              <div v-if="isExpanded('announcement-bar')" class="relative pl-[52px]">
                <button
                  v-if="announcementBlockPickerItems.length"
                  type="button"
                  class="mt-2 flex w-full cursor-pointer items-center justify-start gap-2 rounded-lg border-0 bg-transparent py-[7px] pl-0 pr-2 text-sm font-semibold text-[#2563eb] transition-colors duration-150"
                  @click="toggleInsertMenu('block', 'announcement-bar')"
                >
                  <CirclePlus :size="14" class="shrink-0 text-[#2563eb]" :stroke-width="2.5" />
                  <span>{{ $t('54e3d97e.fc318c') }}</span>
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
                'group flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2 py-[7px] transition-colors duration-150 hover:bg-[rgba(24,34,47,0.04)]',
                { 'bg-[rgba(37,99,235,0.1)]': selectedSectionId === 'header' && !selectedBlockId }
              ]"
              @click="$emit('select-section', 'header')"
            >
              <button
                type="button"
                class="flex h-[18px] w-[18px] shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-[#6b7785]"
                @click.stop="$emit('toggle-section', 'header')"
              >
                <ChevronDown v-if="isExpanded('header')" :size="14" :stroke-width="2" />
                <ChevronRight v-else :size="14" :stroke-width="2" />
              </button>
              <div class="min-w-0 flex-1 flex items-center">
                <div
                  class="inline-flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-[#18222f]"
                >
                  <span
                    class="relative inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center"
                  >
                    <GalleryVertical
                      :size="16"
                      class="shrink-0 text-[#475467] opacity-100 transition-opacity duration-150 group-hover:pointer-events-none group-hover:opacity-0"
                      :stroke-width="2"
                    />
                    <span
                      class="pointer-events-none absolute inset-0 inline-flex items-center justify-center text-[#6b7785] opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                      aria-hidden="true"
                    >
                      <GripVertical :size="14" :stroke-width="2" />
                    </span>
                  </span>
                  {{ $t('54e3d97e.917f14') }}
                </div>
              </div>
              <button
                type="button"
                class="flex h-[18px] w-[18px] shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-[#6b7785]"
                @click.stop="$emit('toggle-section-disabled', 'header')"
              >
                <EyeOff v-if="isSectionDisabled('header')" :size="18" :stroke-width="2" />
                <Eye v-else :size="18" :stroke-width="2" />
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
                  'group mt-0.5 flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent py-[7px] pl-[50px] pr-2 text-[#6b7785] transition-colors duration-150 hover:bg-[rgba(24,34,47,0.04)]',
                  {
                    'bg-[rgba(37,99,235,0.1)]':
                      selectedSectionId === 'header' && selectedBlockId === blockId
                  }
                ]"
                @click="$emit('select-block', { sectionId: 'header', blockId })"
              >
                <div class="min-w-0 flex-1 flex items-center">
                  <div
                    class="inline-flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-[#18222f]"
                  >
                    <span
                      class="relative inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center"
                    >
                      <Diamond
                        :size="16"
                        class="shrink-0 text-[#475467] opacity-100 transition-opacity duration-150 group-hover:pointer-events-none group-hover:opacity-0"
                        :stroke-width="2"
                      />
                      <span
                        data-drag-handle="block"
                        class="pointer-events-none absolute inset-0 inline-flex cursor-move items-center justify-center text-[#6b7785] opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100"
                      >
                        <GripVertical :size="14" :stroke-width="2" />
                      </span>
                    </span>
                    {{ getBlockLabel(headerSection, blockId) }}
                  </div>
                </div>
              </div>
            </draggable>

            <div v-if="isExpanded('header')">
              <div class="relative pl-[52px]">
                <button
                  v-if="headerBlockPickerItems.length"
                  type="button"
                  class="mt-2 flex w-full cursor-pointer items-center justify-start gap-2 rounded-lg border-0 bg-transparent py-[7px] pl-0 pr-2 text-sm font-semibold text-[#2563eb] transition-colors duration-150"
                  @click="toggleInsertMenu('block', 'header')"
                >
                  <CirclePlus :size="14" class="shrink-0 text-[#2563eb]" :stroke-width="2.5" />
                  <span>{{ $t('54e3d97e.fc318c') }}</span>
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

            <div class="relative mt-1 px-2 pb-0.5 pl-[34px]">
              <button
                type="button"
                class="flex w-full cursor-pointer items-center justify-start gap-2 rounded-lg border-0 bg-transparent py-[7px] text-sm font-semibold text-[#2563eb] transition-colors duration-150"
                @click="toggleInsertMenu('section', 'header', localOrder.length)"
              >
                <CirclePlus :size="14" class="shrink-0 text-[#2563eb]" :stroke-width="2.5" />
                <span>{{ $t('54e3d97e.2e2d33') }}</span>
              </button>
              <div
                v-if="isInsertMenuOpen('section', 'header', localOrder.length)"
                class="absolute left-0 top-[calc(100%+6px)] z-[5] min-w-[160px] rounded-xl border border-[rgba(17,24,39,0.08)] bg-white p-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.14)]"
              >
                <button
                  v-for="item in sectionPickerItemsFor('header')"
                  :key="item.key"
                  type="button"
                  class="flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2.5 py-2 text-left text-xs text-[#18222f] hover:bg-[#e9f0ff] hover:text-[#2563eb]"
                  @click="selectSectionType(item.type)"
                >
                  <component
                    :is="sectionInsertIcon(item.type)"
                    :size="14"
                    class="shrink-0 text-[#475467]"
                    :stroke-width="2"
                  />
                  <span>{{ $t(item.titleKey) }}</span>
                </button>
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
                    'group flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2 py-[7px] transition-colors duration-150 hover:bg-[rgba(24,34,47,0.04)]',
                    {
                      'bg-[rgba(37,99,235,0.1)]':
                        sectionId === selectedSectionId && !selectedBlockId
                    }
                  ]"
                  @click="$emit('select-section', sectionId)"
                >
                  <button
                    type="button"
                    class="flex h-[18px] w-[18px] shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-[#6b7785]"
                    @click.stop="$emit('toggle-section', sectionId)"
                  >
                    <ChevronDown v-if="isExpanded(sectionId)" :size="14" :stroke-width="2" />
                    <ChevronRight v-else :size="14" :stroke-width="2" />
                  </button>
                  <div class="min-w-0 flex-1 flex items-center">
                    <div
                      class="inline-flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-[#18222f]"
                    >
                      <span
                        class="relative inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center"
                      >
                        <GalleryVertical
                          :size="16"
                          class="shrink-0 text-[#475467] opacity-100 transition-opacity duration-150 group-hover:pointer-events-none group-hover:opacity-0"
                          :stroke-width="2"
                        />
                        <span
                          data-drag-handle="section"
                          class="pointer-events-none absolute inset-0 inline-flex cursor-move items-center justify-center text-[#6b7785] opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100"
                        >
                          <GripVertical :size="14" :stroke-width="2" />
                        </span>
                      </span>
                      {{ getSectionLabel(sectionId) }}
                    </div>
                  </div>
                  <EyeOff
                    v-if="isSectionDisabled(sectionId)"
                    class="ml-1.5 shrink-0 text-[#98a2b3]"
                    :size="14"
                    :stroke-width="2"
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
                      'group mt-0.5 flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent py-[7px] pl-[50px] pr-2 text-[#6b7785] transition-colors duration-150 hover:bg-[rgba(24,34,47,0.04)]',
                      {
                        'bg-[rgba(37,99,235,0.1)]':
                          sectionId === selectedSectionId && selectedBlockId === blockId
                      }
                    ]"
                    @click="$emit('select-block', { sectionId, blockId })"
                  >
                    <div class="min-w-0 flex-1 flex items-center">
                      <div
                        class="inline-flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-[#18222f]"
                      >
                        <span
                          class="relative inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center"
                        >
                          <Diamond
                            :size="16"
                            class="shrink-0 text-[#475467] opacity-100 transition-opacity duration-150 group-hover:pointer-events-none group-hover:opacity-0"
                            :stroke-width="2"
                          />
                          <span
                            data-drag-handle="block"
                            class="pointer-events-none absolute inset-0 inline-flex cursor-move items-center justify-center text-[#6b7785] opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100"
                          >
                            <GripVertical :size="14" :stroke-width="2" />
                          </span>
                        </span>
                        {{ getBlockLabel(dsl.sections[sectionId], blockId) }}
                      </div>
                    </div>
                  </div>
                </draggable>

                <div v-if="isExpanded(sectionId)">
                  <div class="relative pl-[52px]">
                    <button
                      v-if="getBlockPickerItems(getSectionType(sectionId)).length"
                      type="button"
                      class="mt-0.5 flex w-full cursor-pointer items-center justify-start gap-2 rounded-lg border-0 bg-transparent py-[7px] pl-0 pr-2 text-sm font-semibold text-[#2563eb] transition-colors duration-150"
                      @click="toggleInsertMenu('block', sectionId)"
                    >
                      <CirclePlus :size="14" class="shrink-0 text-[#2563eb]" :stroke-width="2.5" />
                      <span>{{ $t('54e3d97e.fc318c') }}</span>
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

          <div v-if="localOrder.length" class="relative mt-1 px-2 pb-0.5 pl-[34px]">
            <button
              type="button"
              class="flex w-full cursor-pointer items-center justify-start gap-2 rounded-lg border-0 bg-transparent py-[7px] text-sm font-semibold text-[#2563eb] transition-colors duration-150"
              @click="toggleInsertMenu('section', 'template', localOrder.length)"
            >
              <CirclePlus :size="14" class="shrink-0 text-[#2563eb]" :stroke-width="2.5" />
              <span>{{ $t('54e3d97e.2e2d33') }}</span>
            </button>
            <div
              v-if="isInsertMenuOpen('section', 'template', localOrder.length)"
              class="absolute left-0 top-[calc(100%+6px)] z-[5] min-w-[160px] rounded-xl border border-[rgba(17,24,39,0.08)] bg-white p-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.14)]"
            >
              <button
                v-for="item in sectionPickerItemsFor('template')"
                :key="'tpl-end-' + item.key"
                type="button"
                class="flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2.5 py-2 text-left text-xs text-[#18222f] hover:bg-[#e9f0ff] hover:text-[#2563eb]"
                @click="selectSectionType(item.type)"
              >
                <component
                  :is="sectionInsertIcon(item.type)"
                  :size="14"
                  class="shrink-0 text-[#475467]"
                  :stroke-width="2"
                />
                <span>{{ $t(item.titleKey) }}</span>
              </button>
            </div>
          </div>

          <div
            v-if="!localOrder.length"
            class="flex min-h-[180px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-[#d7dde7] bg-[#fbfbfc] p-6 text-center text-[#6b7785]"
          >
            <span>{{ $t('54e3d97e.bdf5be') }}</span>
            <div class="relative w-full max-w-[240px]">
              <button
                type="button"
                class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-0 bg-transparent py-2 text-sm font-semibold text-[#2563eb] transition-colors duration-150"
                @click="toggleInsertMenu('section', 'template-empty', 0)"
              >
                <CirclePlus :size="14" class="shrink-0 text-[#2563eb]" :stroke-width="2.5" />
                <span>{{ $t('54e3d97e.2e2d33') }}</span>
              </button>
              <div
                v-if="isInsertMenuOpen('section', 'template-empty', 0)"
                class="absolute left-1/2 top-[calc(100%+6px)] z-[5] min-w-[160px] -translate-x-1/2 rounded-xl border border-[rgba(17,24,39,0.08)] bg-white p-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.14)]"
              >
                <button
                  v-for="item in sectionPickerItemsFor('template-empty')"
                  :key="'tpl-empty-' + item.key"
                  type="button"
                  class="flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2.5 py-2 text-left text-xs text-[#18222f] hover:bg-[#e9f0ff] hover:text-[#2563eb]"
                  @click="selectSectionType(item.type)"
                >
                  <component
                    :is="sectionInsertIcon(item.type)"
                    :size="14"
                    class="shrink-0 text-[#475467]"
                    :stroke-width="2"
                  />
                  <span>{{ $t(item.titleKey) }}</span>
                </button>
              </div>
            </div>
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
                'group flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2 py-[7px] transition-colors duration-150 hover:bg-[rgba(24,34,47,0.04)]',
                { 'bg-[rgba(37,99,235,0.1)]': selectedSectionId === 'footer' && !selectedBlockId }
              ]"
              @click="$emit('select-section', 'footer')"
            >
              <button
                type="button"
                class="flex h-[18px] w-[18px] shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-[#6b7785]"
                @click.stop="$emit('toggle-section', 'footer')"
              >
                <ChevronDown v-if="isExpanded('footer')" :size="14" :stroke-width="2" />
                <ChevronRight v-else :size="14" :stroke-width="2" />
              </button>
              <div class="min-w-0 flex-1 flex items-center">
                <div
                  class="inline-flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-[#18222f]"
                >
                  <span
                    class="relative inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center"
                  >
                    <GalleryVertical
                      :size="16"
                      class="shrink-0 text-[#475467] opacity-100 transition-opacity duration-150 group-hover:pointer-events-none group-hover:opacity-0"
                      :stroke-width="2"
                    />
                    <span
                      class="pointer-events-none absolute inset-0 inline-flex items-center justify-center text-[#6b7785] opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                      aria-hidden="true"
                    >
                      <GripVertical :size="14" :stroke-width="2" />
                    </span>
                  </span>
                  {{ $t('54e3d97e.4eb88f') }}
                </div>
              </div>
              <button
                type="button"
                class="flex h-[18px] w-[18px] shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-[#6b7785]"
                @click.stop="$emit('toggle-section-disabled', 'footer')"
              >
                <EyeOff v-if="isSectionDisabled('footer')" :size="18" :stroke-width="2" />
                <Eye v-else :size="18" :stroke-width="2" />
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
                  'group mt-0.5 flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent py-[7px] pl-[50px] pr-2 text-[#6b7785] transition-colors duration-150 hover:bg-[rgba(24,34,47,0.04)]',
                  {
                    'bg-[rgba(37,99,235,0.1)]':
                      selectedSectionId === 'footer' && selectedBlockId === blockId
                  }
                ]"
                @click="$emit('select-block', { sectionId: 'footer', blockId })"
              >
                <div class="min-w-0 flex-1 flex items-center">
                  <div
                    class="inline-flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-[#18222f]"
                  >
                    <span
                      class="relative inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center"
                    >
                      <Diamond
                        :size="16"
                        class="shrink-0 text-[#475467] opacity-100 transition-opacity duration-150 group-hover:pointer-events-none group-hover:opacity-0"
                        :stroke-width="2"
                      />
                      <span
                        data-drag-handle="block"
                        class="pointer-events-none absolute inset-0 inline-flex cursor-move items-center justify-center text-[#6b7785] opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100"
                      >
                        <GripVertical :size="14" :stroke-width="2" />
                      </span>
                    </span>
                    {{ getBlockLabel(footerSection, blockId) }}
                  </div>
                </div>
              </div>
            </draggable>

            <div v-if="isExpanded('footer')">
              <div class="relative pl-[52px]">
                <button
                  v-if="footerBlockPickerItems.length"
                  type="button"
                  class="mt-2 flex w-full cursor-pointer items-center justify-start gap-2 rounded-lg border-0 bg-transparent py-[7px] pr-2 text-sm font-semibold text-[#2563eb] transition-colors duration-150"
                  @click="toggleInsertMenu('block', 'footer')"
                >
                  <CirclePlus :size="14" class="shrink-0 text-[#2563eb]" :stroke-width="2.5" />
                  <span>{{ $t('54e3d97e.fc318c') }}</span>
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

            <div class="relative mt-1 px-2 pb-0.5 pl-[34px]">
              <button
                type="button"
                class="flex w-full cursor-pointer items-center justify-start gap-2 rounded-lg border-0 bg-transparent py-[7px] text-sm font-semibold text-[#2563eb] transition-colors duration-150"
                @click="toggleInsertMenu('section', 'footer', localOrder.length)"
              >
                <CirclePlus :size="14" class="shrink-0 text-[#2563eb]" :stroke-width="2.5" />
                <span>{{ $t('54e3d97e.2e2d33') }}</span>
              </button>
              <div
                v-if="isInsertMenuOpen('section', 'footer', localOrder.length)"
                class="absolute left-0 top-[calc(100%+6px)] z-[5] min-w-[160px] rounded-xl border border-[rgba(17,24,39,0.08)] bg-white p-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.14)]"
              >
                <button
                  v-for="item in sectionPickerItemsFor('footer')"
                  :key="'footer-add-' + item.key"
                  type="button"
                  class="flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2.5 py-2 text-left text-xs text-[#18222f] hover:bg-[#e9f0ff] hover:text-[#2563eb]"
                  @click="selectSectionType(item.type)"
                >
                  <component
                    :is="sectionInsertIcon(item.type)"
                    :size="14"
                    class="shrink-0 text-[#475467]"
                    :stroke-width="2"
                  />
                  <span>{{ $t(item.titleKey) }}</span>
                </button>
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
const {
  createSectionPickerItems,
  createSectionPickerItemsForTypes,
  createBlockPickerItems
} = require('../utils/insertPicker')
const { getStructureSectionInsertConfig } = require('../utils/structureInsertConfig')
const {
  getSectionInsertIconComponent: resolveSectionInsertIcon
} = require('../utils/decorationLucide')

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
    },
    /** 覆盖 utils/structureInsertConfig 默认策略（按 anchor 浅合并） */
    structureSectionInsertConfig: {
      type: Object,
      default: null
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
    structureInsertPolicy() {
      return getStructureSectionInsertConfig(this.structureSectionInsertConfig)
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
    sectionPickerItemsFor(anchor) {
      const cfg = this.structureInsertPolicy[anchor] || {}
      if (cfg.types == null) {
        return createSectionPickerItems(this.sectionDefinitions)
      }
      return createSectionPickerItemsForTypes(cfg.types)
    },
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
        return (
          this.openInsertMenu.sectionId === sectionId &&
          this.openInsertMenu.insertIndex === insertIndex
        )
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
        const anchor = sectionId || 'header'
        if (this.isInsertMenuOpen('section', anchor, idx)) {
          this.openInsertMenu = { kind: '', sectionId: '', insertIndex: null }
          return
        }
        this.openInsertMenu = { kind: 'section', sectionId: anchor, insertIndex: idx }
      }
    },
    closeInsertMenu() {
      this.openInsertMenu = { kind: '', sectionId: '', insertIndex: null }
    },
    sectionInsertIcon(type) {
      return resolveSectionInsertIcon(type)
    },
    selectSectionType(type) {
      const anchor = this.openInsertMenu.sectionId
      const idx = this.openInsertMenu.insertIndex
      const cfg = this.structureInsertPolicy[anchor] || { mutation: 'page' }
      if (cfg.mutation === 'global') {
        this.$emit('add-global-section', type)
      } else {
        this.$emit('add-section', {
          type,
          index: typeof idx === 'number' ? idx : undefined
        })
      }
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
