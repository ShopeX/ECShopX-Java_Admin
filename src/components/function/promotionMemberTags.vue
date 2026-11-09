<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->
<template>
  <div>
    <el-radio-group v-model="mode" :disabled="disabled" @change="handleModeChange">
      <el-radio label="include">{{ $t('26b7f367.188e1b') }}</el-radio>
      <el-radio label="exclude">{{ $t('26b7f367.01ee79') }}</el-radio>
    </el-radio-group>
    <div class="mt-2">
      <el-button
        type="primary"
        size="small"
        :disabled="disabled"
        @click="dialogVisible = true"
      >
        {{ $t('394573fc.d2a769') }}
      </el-button>
    </div>
    <div v-if="tags.length" class="mt-2 flex flex-wrap gap-2">
      <el-tag
        v-for="(tag, index) in tags"
        :key="tag.tag_id || index"
        :closable="!disabled"
        type="primary"
        @close="handleRemove(index)"
      >
        {{ tag.tag_name }}
      </el-tag>
    </div>
    <CompTagsMore
      :title="$t('ff557c54.fb7b49')"
      :visible.sync="dialogVisible"
      :selected-tags="tags"
      :with-system="true"
      :select-only="true"
      @confirm="handleConfirm"
    />
  </div>
</template>

<script>
import CompTagsMore from '@/views/members/components/CompTagsMore.vue'

export default {
  name: 'PromotionMemberTags',
  components: { CompTagsMore },
  props: {
    /** include | exclude */
    memberTagMode: {
      type: String,
      default: 'include'
    },
    /** [{ tag_id, tag_name, group_id? }] */
    memberTags: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      mode: this.memberTagMode || 'include',
      tags: Array.isArray(this.memberTags) ? [...this.memberTags] : []
    }
  },
  watch: {
    memberTagMode(val) {
      this.mode = val || 'include'
    },
    memberTags(val) {
      this.tags = Array.isArray(val) ? [...val] : []
    }
  },
  methods: {
    emitChange() {
      this.$emit('update:memberTagMode', this.mode)
      this.$emit('update:memberTags', this.tags)
      this.$emit('change', {
        member_tag_mode: this.mode,
        member_tag_ids: this.tags.map((t) => t.tag_id),
        member_tags: this.tags
      })
    },
    handleModeChange() {
      this.tags = []
      this.emitChange()
    },
    handleRemove(index) {
      this.tags.splice(index, 1)
      this.emitChange()
    },
    handleConfirm(selected) {
      this.tags = (selected || []).map((tag) => ({
        tag_id: tag.tag_id,
        tag_name: tag.tag_name,
        group_id: tag.group_id
      }))
      this.emitChange()
    }
  }
}
</script>
