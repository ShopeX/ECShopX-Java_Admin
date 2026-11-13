<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->
<template>
  <div class="flex flex-wrap items-center gap-2">
    <template v-if="!readonly && !selectOnly">
      <div v-if="showInput" class="w-[140px]">
        <el-input
          ref="addTagInput"
          v-model="value"
          :placeholder="$t('93ba5178.a11cc7')"
          size="small"
          maxlength="10"
          show-word-limit
          @change="changeInput"
          @keyup.enter.native="changeInput(value)"
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
        {{ $t('93ba5178.ed7823') }}
      </el-tag>
    </template>
    <el-tag
      v-for="(item, index) in list"
      :key="item.tag_id || index"
      :effect="noBackground ? (item.selected ? 'dark' : 'plain') : item.selected ? 'light' : 'plain'"
      :type="noBackground && item.selected ? 'primary' : undefined"
      :size="tagSize"
      :color="noBackground ? '' : item.tag_color"
      :style="noBackground ? undefined : { color: item.font_color }"
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
    },
    noBackground: {
      type: Boolean,
      default: false
    },
    /** 仅选择：不显示「+ 添加」，只能从已有标签中勾选 */
    selectOnly: {
      type: Boolean,
      default: false
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
      this.$nextTick(() => {
        const input = this.$refs.addTagInput
        if (input && typeof input.focus === 'function') input.focus()
      })
    },
    async changeInput(value) {
      if (!this.showInput) return
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
