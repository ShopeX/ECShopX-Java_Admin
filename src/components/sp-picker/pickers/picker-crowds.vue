<template>
  <div class="picker-crowds">
    <div class="max-h-[500px] overflow-y-auto pr-4 pl-4 pt-3">
      <div
        v-for="category in tagCategories"
        :key="category.group_id"
        class="mb-6 pb-4 border-b border-[#e4e7ed] last:border-b-0"
      >
        <div class="flex justify-between items-center mb-3">
          <span class="font-medium text-sm text-[#303133]">{{ category.group_name }}</span>
        </div>
        <CompTagList
          :list="getFormattedTags(category)"
          :selection-babel="true"
          :readonly="false"
          :select-only="true"
          @tag-select="(tag, index) => handleTagSelect(category, tag, index)"
        />
      </div>
      <div v-if="!loading && tagCategories.length === 0" class="text-gray-400 text-sm py-4">
        {{ emptyText }}
      </div>
      <div v-if="loading" class="text-gray-400 text-sm py-4">{{ loadingText }}</div>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import { i18n } from '@/i18n'
import BasePicker from './base'
import CompTagList from '@/views/members/components/CompTagList'

export default {
  name: 'PickerCrowds',
  extends: BasePicker,
  components: {
    CompTagList
  },
  config: {
    title: '394573fc.d2a769'
  },
  props: ['value'],
  computed: {
    emptyText() {
      return i18n.t('394573fc.f44b57')
    },
    loadingText() {
      return i18n.t('394573fc.26b5bd')
    }
  },
  data() {
    return {
      tagCategories: [],
      selectedTagMap: {},
      loading: false
    }
  },
  created() {
    this.initSelectedFromValue()
  },
  mounted() {
    this.loadTagCategories()
  },
  methods: {
    initSelectedFromValue() {
      this.selectedTagMap = {}
      const data = this.value && this.value.data ? cloneDeep(this.value.data) : []
      if (Array.isArray(data) && data.length > 0) {
        data.forEach((tag) => {
          const groupId = tag.group_id
          if (!this.selectedTagMap[groupId]) {
            this.$set(this.selectedTagMap, groupId, [])
          }
          this.selectedTagMap[groupId].push(tag)
        })
      }
    },
    async loadTagCategories() {
      this.loading = true
      try {
        const { list = [] } = await this.$api.member.getTagGroupList({
          page: 1,
          page_size: 100,
          country_code: 'zh-CN',
          with_system: 1
        })
        this.tagCategories = list
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    getFormattedTags(category) {
      let tags = category.tags || []
      const groupId = category.group_id
      if (typeof tags === 'string') {
        try {
          tags = JSON.parse(tags)
        } catch (e) {
          return []
        }
      }
      return (Array.isArray(tags) ? tags : []).map((tag) => {
        const selected = (this.selectedTagMap[groupId] || []).some(
          (t) => String(t.tag_id) === String(tag.tag_id)
        )
        return {
          selected,
          group_id: groupId,
          ...tag
        }
      })
    },
    handleTagSelect(category, tag) {
      const groupId = category.group_id
      if (!this.selectedTagMap[groupId]) {
        this.$set(this.selectedTagMap, groupId, [])
      }
      const list = this.selectedTagMap[groupId]
      const idx = list.findIndex((t) => String(t.tag_id) === String(tag.tag_id))
      if (tag.selected && idx === -1) {
        list.push({
          group_id: groupId,
          tag_id: tag.tag_id,
          tag_name: tag.tag_name
        })
      } else if (!tag.selected && idx > -1) {
        list.splice(idx, 1)
      }
      this.flushSelection()
    },
    flushSelection() {
      const all = []
      Object.keys(this.selectedTagMap).forEach((groupId) => {
        ;(this.selectedTagMap[groupId] || []).forEach((tag) => {
          all.push({ ...tag, group_id: groupId })
        })
      })
      this.updateVal(all)
    }
  }
}
</script>
