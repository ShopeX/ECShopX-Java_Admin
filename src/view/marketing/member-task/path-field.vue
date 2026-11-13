<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="flex w-full items-center gap-2">
    <el-input
      class="member-task-path-field min-w-0 flex-1"
      :value="displayText"
      readonly
      :disabled="disabled"
      :placeholder="$t('236c47a0.d8077f')"
      @click.native="onClick"
    />
    <el-button
      v-if="value && !disabled"
      type="text"
      class="shrink-0 !px-0"
      @click="onClear"
    >
      {{ $t('67a8e492.288f0c') }}
    </el-button>
    <MemberTaskPathPickerDialog
      :visible.sync="visible"
      :path="value || ''"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import MemberTaskPathPickerDialog from './path-picker-dialog.vue'
import { memberTaskPathLabel } from './path-value'

export default {
  name: 'MemberTaskPathField',
  components: { MemberTaskPathPickerDialog },
  props: {
    value: {
      type: String,
      default: ''
    },
    disabled: Boolean
  },
  data() {
    return {
      visible: false
    }
  },
  computed: {
    displayText() {
      return memberTaskPathLabel(this.value, (key) => this.$t(key))
    }
  },
  methods: {
    onClick(event) {
      if (this.disabled) return
      const target = event && event.target
      if (target && target.closest && target.closest('button')) return
      this.visible = true
    },
    onClear() {
      this.$emit('input', '')
    },
    onConfirm(path) {
      this.$emit('input', path)
    }
  }
}
</script>

<style scoped lang="scss">
/* readonly 的手型在内部 input 上，工具类加不到该节点 */
.member-task-path-field ::v-deep .el-input__inner {
  cursor: pointer;
}

.member-task-path-field.is-disabled ::v-deep .el-input__inner {
  cursor: not-allowed;
}
</style>
