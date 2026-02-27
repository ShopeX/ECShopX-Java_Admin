<style lang="scss">
.picker-crowds {
  .picker-crowds-body {
    max-height: 500px;
    overflow-y: auto;
    padding-right: 10px;
    padding-left: 10px;
  }
  .picker-crowds-group {
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e4e7ed;
    &:last-child {
      border-bottom: 0;
    }
  }
  .picker-crowds-group-name {
    font-weight: 500;
    font-size: 14px;
    color: #303133;
    margin-bottom: 12px;
  }
  .picker-crowds-tags {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px 10px;
    line-height: 22px;
    .el-tag {
      cursor: pointer;
      margin: 0;
      &.is-selected {
        background-color: #409eff;
        border-color: #409eff;
        color: #fff;
      }
    }
  }
}
</style>
<template>
  <div class="picker-crowds">
    <div class="picker-crowds-body">
      <div
        v-for="category in tagCategories"
        :key="category.group_id"
        class="picker-crowds-group"
      >
        <div class="picker-crowds-group-name">{{ category.group_name }}</div>
        <div class="picker-crowds-tags">
          <el-tag
            v-for="(tag, index) in getFormattedTags(category)"
            :key="tag.tag_id"
            :effect="tag.selected ? 'light' : 'plain'"
            size="small"
            class="cursor-pointer"
            @click.native="handleTagSelect(category, tag, index)"
          >
            {{ tag.tag_name }}
          </el-tag>
        </div>
      </div>
      <div v-if="!loading && tagCategories.length === 0" class="text-gray-400 text-sm py-4">
        暂无标签组
      </div>
      <div v-if="loading" class="text-gray-400 text-sm py-4">
        加载中...
      </div>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import BasePicker from './base'

export default {
  name: 'PickerCrowds',
  extends: BasePicker,
  config: {
    title: '选择人群标签'
  },
  props: ['value'],
  data() {
    return {
      tagCategories: [],
      selectedTagMap: {}, // { group_id: [tag1, tag2, ...] }
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
      const data = (this.value && this.value.data) ? cloneDeep(this.value.data) : []
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
          country_code: 'zh-CN'
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
          ...tag,
          group_id: groupId,
          group_name: category.group_name,
          selected
        }
      })
    },
    handleTagSelect(category, tag, index) {
      const groupId = category.group_id
      if (!this.selectedTagMap[groupId]) {
        this.$set(this.selectedTagMap, groupId, [])
      }
      const list = this.selectedTagMap[groupId]
      const idx = list.findIndex((t) => String(t.tag_id) === String(tag.tag_id))
      if (tag.selected) {
        if (idx > -1) list.splice(idx, 1)
      } else {
        if (idx === -1) {
          list.push({
            group_id: groupId,
            tag_id: tag.tag_id,
            tag_name: tag.tag_name,
            tag_color: tag.tag_color,
            font_color: tag.font_color
          })
        }
      }
      this.flushSelection()
    },
    flushSelection() {
      const all = []
      Object.keys(this.selectedTagMap).forEach((groupId) => {
        (this.selectedTagMap[groupId] || []).forEach((tag) => {
          all.push({ ...tag, group_id: groupId })
        })
      })
      this.updateVal(all)
    }
  }
}
</script>
