<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->
<template>
  <div class="flex flex-wrap items-center gap-2">
    <template v-if="!readonly">
      <div v-if="showInput" class="w-[140px]">
        <el-input
          v-model="value"
          :placeholder="$t('a2bf2d04.a11cc7')"
          size="small"
          maxlength="10"
          show-word-limit
          @change="changeInput"
        />
      </div>
      <el-tag
        v-else
        :size="tagSize"
        type="info"
        effect="plain"
        class="cursor-pointer"
        @click="addLabel"
      >
        {{ $t('a2bf2d04.ed7823') }}
      </el-tag>
    </template>
    <el-tag
      v-for="(item, index) in list"
      :key="item.tag_id || index"
      :effect="item.selected ? 'light' : 'plain'"
      :size="tagSize"
      class="cursor-pointer select-none"
      @click="selectLabel(item, index)"
    >
      {{ item.tag_name }}
    </el-tag>
  </div>
</template>

<script>
export default {
  name: 'CompTagList',
  props: {
    list: {
      type: Array
    },
    selectionBabel: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    tagSize: {
      type: String,
      default: 'medium'
    }
  },
  data() {
    return {
      showInput: false,
      value: ''
    }
  },
  methods: {
    addLabel() {
      this.value = ''
      this.showInput = true
    },
    async changeInput(value) {
      this.showInput = false
      this.$emit('add-tag', value)
    },
    selectLabel(item, index) {
      if (this.selectionBabel) {
        const newItem = {
          ...item,
          selected: !item.selected
        }
        this.$set(this.list, index, newItem)
        this.$emit('tag-select', newItem, index)
      }
    }
  }
}
</script>
