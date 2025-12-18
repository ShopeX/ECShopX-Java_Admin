<template>
  <div class="comps_style">
    <!-- 内边距设置 -->
    <div v-if="hasPaddingFields" class="comps_style-item">
      <div v-show="showLabel" class="im-tt">内边距</div>
      <el-row class="im-bd">
        <template v-for="field in paddingFields">
          <el-col
            v-if="field.show"
            :key="field.key"
            :span="10"
            class="im-bd-pd"
          >
            <p class="label">{{ field.label }}</p>
            <el-input-number
              v-model="form[field.key]"
              controls-position="right"
              size="mini"
              :min="0"
            />
          </el-col>
        </template>
      </el-row>
    </div>

    <!-- 组合内边距设置 -->
    <div v-if="hasCombinedPaddingFields" class="comps_style-item">
      <el-row class="im-bd">
        <template v-for="field in combinedPaddingFields">
          <el-col
            v-if="field.show"
            :key="field.key"
            :span="10"
            class="im-bd-pd"
          >
            <p class="label">{{ field.label }}</p>
            <el-input-number
              v-model="form[field.key]"
              controls-position="right"
              size="mini"
              :min="0"
            />
          </el-col>
        </template>
      </el-row>
    </div>

    <!-- 背景设置 -->
    <template v-if="showBgsetting">
      <div class="comps_style-item">
        <div class="im-tt">背景</div>
        <div class="im-bd el-color-picker-wrap">
          <el-radio-group v-model="form.bgType" @change="handleChange">
            <el-radio label="color">颜色背景</el-radio>
            <el-radio label="pic">图片背景</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div v-if="form.bgType === 'color'" class="comps_style-item">
        <div class="im-tt">背景色</div>
        <div class="im-bd el-color-picker-wrap">
          <el-color-picker v-model="form.bgColor" size="small" />
        </div>
      </div>
      <div v-if="form.bgType === 'pic'" class="comps_style-item">
        <div class="im-tt">背景图</div>
        <div class="im-bd el-color-picker-wrap">
          <SpImagePicker v-model="form.bgPic" size="small" class="video-link" text="背景图" />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'

const DEFAULT_FORM = {
  margined: 0,
  paddedt: 0,
  paddedb: 0,
  paddedl: 0,
  paddedr: 0,
  paddedtb: 0,
  paddedlr: 0,
  bgColor: '',
  bgPic: '',
  bgType: 'color'
}

export default {
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    uuid: {
      type: String,
      default: ''
    },
    showBgsetting: {
      type: Boolean,
      default: true
    },
    showTop: {
      type: Boolean,
      default: true
    },
    showBottom: {
      type: Boolean,
      default: true
    },
    showLeft: {
      type: Boolean,
      default: true
    },
    showRight: {
      type: Boolean,
      default: true
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    showTB: {
      type: Boolean,
      default: false
    },
    showLR: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: { ...DEFAULT_FORM }
    }
  },
  computed: {
    // 内边距字段配置
    paddingFields() {
      return [
        { key: 'paddedt', label: '上', show: this.showTop },
        { key: 'paddedb', label: '下', show: this.showBottom },
        { key: 'paddedl', label: '左', show: this.showLeft },
        { key: 'paddedr', label: '右', show: this.showRight }
      ]
    },
    // 组合内边距字段配置
    combinedPaddingFields() {
      return [
        { key: 'paddedtb', label: '上下', show: this.showTB },
        { key: 'paddedlr', label: '左右', show: this.showLR }
      ]
    },
    // 是否有内边距字段显示
    hasPaddingFields() {
      return this.showTop || this.showBottom || this.showLeft || this.showRight
    },
    // 是否有组合内边距字段显示
    hasCombinedPaddingFields() {
      return this.showTB || this.showLR
    }
  },
  watch: {
    uuid: {
      handler(newVal, oldVal) {
        // 只在 uuid 真正变化时重新初始化
        if (newVal !== oldVal && newVal) {
          this.initForm()
        }
      },
      immediate: false
    },
    form: {
      handler(val) {
        this.$emit('input', val)
      },
      deep: true
    }
  },
  created() {
    // 初始化表单数据，只在创建时同步一次
    this.initForm()
  },
  methods: {
    // 初始化表单数据
    initForm() {
      this.form = this.value && Object.keys(this.value).length > 0
        ? cloneDeep(this.value)
        : { ...DEFAULT_FORM }
    },
    // 背景类型改变处理
    handleChange() {
      this.$set(this.form, 'bgPic', '')
      this.$set(this.form, 'bgColor', '')
    }
  }
}
</script>

<style lang="scss" scoped>
.comps_style {
  &-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 0;
    }

    .im-tt {
      width: 50px;
      font-size: 12px;
      color: rgb(156, 156, 156);
      padding-top: 10px;
      flex-shrink: 0;
    }

    .im-bd {
      flex: 1;
      display: flex;
      flex-wrap: wrap;

      &-pd {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        margin-right: 10px;

        .label {
          font-size: 10px;
          padding-right: 5px;
          color: rgb(156, 156, 156);
          min-width: 28px;
          flex-shrink: 0;
        }

        .el-input-number {
          flex: 1;
          min-width: 80px;
        }
      }
    }

    .el-color-picker-wrap {
      display: flex;
      align-items: center;
    }
  }
}
</style>

<style lang="scss">
.comps_style {
  .el-input-number.is-controls-right .el-input__inner {
    padding-right: 35px;
    padding-left: 5px;
    text-align: left;
  }

  .el-form-item__content {
    line-height: normal;
  }
}
</style>
