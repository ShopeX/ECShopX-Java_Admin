<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="flex h-8 flex-wrap items-center gap-x-2">
    <span v-if="value.length" class="text-[13px] text-[#303133]">
      {{ $t('67a8e492.f09198', { count: value.length, unit: unit }) }}
    </span>
    <span v-else class="text-[13px] text-[#c0c4cc]">{{ emptyText }}</span>
    <el-button
      v-if="showPickButton"
      type="text"
      size="mini"
      :disabled="disabled && !allowPickWhenDisabled"
      @click="$emit('pick')"
    >
      {{ value.length ? pickLabelWhenSelected : pickText }}
    </el-button>
    <el-button
      v-if="value.length && !disabled"
      type="text"
      size="mini"
      @click="$emit('input', [])"
    >
      {{ $t('67a8e492.288f0c') }}
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'PickerListField',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    disabled: Boolean,
    emptyText: {
      type: String,
      default: ''
    },
    pickText: {
      type: String,
      default: ''
    },
    unit: {
      type: String,
      default: ''
    },
    /** 只读时仍可点击查看已选列表 */
    allowPickWhenDisabled: Boolean,
    viewPickText: {
      type: String,
      default: ''
    }
  },
  computed: {
    showPickButton() {
      return !this.disabled || this.allowPickWhenDisabled
    },
    pickLabelWhenSelected() {
      if (this.disabled && this.allowPickWhenDisabled && this.viewPickText) {
        return this.viewPickText
      }
      return this.$t('67a8e492.5a0aa4')
    }
  }
}
</script>
