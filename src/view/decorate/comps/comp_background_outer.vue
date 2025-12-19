<template>
  <div class="comp-background-outer">
    <div class="background-options">
      <div class="option-item">
        <span class="option-label">背景色</span>
        <div class="color-picker">
          <el-color-picker v-model="localValue.color" size="small" @change="handleChange" />
        </div>
      </div>
      <div class="option-item">
        <span class="option-label">背景图</span>
        <div class="image-picker">
          <sp-image-picker v-model="localValue.image" size="small" @onChange="handleChange" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 默认值配置
const DEFAULT_VALUE = {
  color: '',
  image: ''
}

export default {
  name: 'AttrBackgroundOuter',
  props: {
    value: {
      type: Object,
      default: () => ({ ...DEFAULT_VALUE })
    },
    uuid: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      localValue: this.normalizeValue(this.value)
    }
  },
  watch: {
    // 优化：监听 value 对象变化，使用浅层比较避免深度监听性能问题
    value: {
      handler(newVal) {
        // 只在值真正变化时更新，避免循环更新
        if (this.isValueChanged(newVal, this.localValue)) {
          this.updateLocalValue(newVal)
        }
      },
      immediate: true,
      deep: false // 使用浅层监听，通过 isValueChanged 方法手动比较
    }
  },
  methods: {
    /**
     * 规范化值，确保所有必需字段存在
     * @param {Object} val - 输入值
     * @returns {Object} 规范化后的值
     */
    normalizeValue(val) {
      if (!val || typeof val !== 'object') {
        return { ...DEFAULT_VALUE }
      }
      return {
        color: val.color || DEFAULT_VALUE.color,
        image: val.image || DEFAULT_VALUE.image
      }
    },
    /**
     * 更新本地值
     * @param {Object} newVal - 新值
     */
    updateLocalValue(newVal) {
      const normalized = this.normalizeValue(newVal)
      // 只更新变化的字段，避免不必要的响应式更新
      Object.keys(normalized).forEach(key => {
        if (this.localValue[key] !== normalized[key]) {
          this.$set(this.localValue, key, normalized[key])
        }
      })
    },
    /**
     * 检查值是否发生变化
     * @param {Object} newVal - 新值
     * @param {Object} oldVal - 旧值
     * @returns {Boolean} 是否变化
     */
    isValueChanged(newVal, oldVal) {
      if (!newVal || !oldVal) return true
      return newVal.color !== oldVal.color || newVal.image !== oldVal.image
    },
    /**
     * 处理值变化，触发事件
     */
    handleChange() {
      // 创建新对象引用，确保父组件能检测到变化
      const emitValue = { ...this.localValue }
      this.$emit('input', emitValue)
      this.$emit('change', emitValue)
    }
  }
}
</script>

<style lang="scss" scoped>
.comp-background-outer {
  margin-bottom: 15px;

  .background-options {
    display: flex;

    .option-item {
      margin-right: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;

      .option-label {
        font-size: 10px;
        color: #606266;
        margin-bottom: 10px;
      }

      .color-picker {
      }
    }
  }
}
</style>

<style lang="scss">
.comp-background-outer {
  .sp-image-picker {
    .image-item {
      margin: 0px !important;
    }
  }
}
</style>

