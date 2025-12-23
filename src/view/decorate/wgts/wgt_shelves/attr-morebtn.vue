<template>
  <div class="attr-morebtn">
    <div class="attr-morebtn-item">
      <div class="attr-morebtn-item-label">展示按钮</div>
      <div class="attr-morebtn-item-value">
        <el-switch v-model="localValue.show" @change="handleChange" />
      </div>
    </div>
    <div class="attr-morebtn-item">
      <div class="attr-morebtn-item-label">文字颜色</div>
      <div class="attr-morebtn-item-value">
        <el-color-picker v-model="localValue.color" @change="handleChange" />
      </div>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
export default {
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      localValue: {
        show: true,
        color: ''
      }
    }
  },
  created() {
    this.localValue = cloneDeep(this.value)
  },
  methods: {
    handleChange() {
      this.$emit('input', this.localValue)
    }
  }
}
</script>

<style lang="scss" scoped>
.attr-morebtn {
  display: flex;
  gap: 10px;
  align-items: flex-start;

  &-item {
    display: flex;
    flex-direction: column;
    align-items: center;

    &-label {
      font-size: 10px;
      color: #606266;
      margin-bottom: 5px;
    }
  }
}
</style>
