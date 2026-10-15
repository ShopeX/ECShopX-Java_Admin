<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="flex h-8 flex-wrap items-center gap-x-2">
    <span v-if="hasValue" class="text-[13px] text-[#303133]">
      {{ $t('67a8e492.271642', { unit: unit }) }}
    </span>
    <span v-else class="text-[13px] text-[#c0c4cc]">{{ emptyText }}</span>
    <el-button type="text" size="mini" :disabled="disabled" @click="$emit('pick')">
      {{ hasValue ? $t('67a8e492.5a0aa4') : pickText }}
    </el-button>
    <el-button
      v-if="hasValue && !disabled"
      type="text"
      size="mini"
      @click="$emit('input', null)"
    >
      {{ $t('67a8e492.288f0c') }}
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'PickerSingleField',
  props: {
    value: {
      type: [Object, String, Number],
      default: null
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
    }
  },
  computed: {
    hasValue() {
      const v = this.value
      return !(v === null || v === undefined || v === '')
    }
  }
}
</script>
